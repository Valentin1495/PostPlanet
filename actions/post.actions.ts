'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { countFollowers, readUser } from './user.actions';
import { countPostReplies } from './reply.action';
import { Post } from '@/lib/types';

function mapPost(row: {
  id: string;
  text: string | null;
  image: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
}): Post {
  return {
    id: row.id,
    text: row.text,
    image: row.image,
    authorId: row.author_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function readAllPosts(limit: number, page: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapPost);
}

export async function readPosts({
  userId,
  limit,
  page,
}: {
  userId: string;
  limit: number;
  page: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapPost);
}

export async function readPost(postId: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data ? mapPost(data) : null;
}

export async function createPost({
  text,
  image,
  authorId,
}: {
  text: string;
  image: string | null;
  authorId: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .insert({ text, image, author_id: authorId })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/', 'layout');
  return mapPost(data);
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('posts').delete().eq('id', postId);

  if (error) throw new Error(error.message);

  revalidatePath('/', 'layout');
}

export async function readPostInfo({
  id,
  authorId,
  currentUserId,
}: {
  id: string;
  authorId: string;
  currentUserId: string;
}) {
  const author = await readUser(authorId);
  const likesCount = await countPostLikes(id);
  const hasLiked = await checkHasLiked(id, currentUserId);
  const replyCount = await countPostReplies(id);
  const followers = await countFollowers(authorId);

  return { author, hasLiked, replyCount, followers, likesCount };
}

export async function countPosts(userId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', userId);

  if (error) throw new Error(error.message);

  return count ?? 0;
}

export async function readFollowingPosts({
  followingIds,
  limit,
  page,
}: {
  followingIds: string[];
  limit: number;
  page: number;
}) {
  if (followingIds.length === 0) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .in('author_id', followingIds)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapPost);
}

export async function readLikedPosts({
  userId,
  limit,
  page,
}: {
  userId: string;
  limit: number;
  page: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('likes')
    .select('post:posts(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) throw new Error(error.message);

  return (data ?? [])
    .map((row: any) => row.post)
    .filter(Boolean)
    .map(mapPost);
}

export async function checkHasLiked(postId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('likes')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return false;
  }

  return Boolean(data);
}

export async function countPostLikes(postId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
}

export async function likePost(postId: string, userId: string) {
  const supabase = await createClient();
  const post = await readPost(postId);
  if (!post) throw new Error('Post not found');

  const { error } = await supabase
    .from('likes')
    .insert({ post_id: postId, user_id: userId });

  if (error) throw new Error(error.message);

  if (post.authorId !== userId) {
    const { error: activityError } = await supabase.from('activities').insert({
      type: 'like',
      post_id: postId,
      text: post.text,
      giver_id: userId,
      receiver_id: post.authorId,
    });

    if (activityError) console.error(activityError);
  }

  revalidatePath('/', 'layout');
}

export async function unlikePost(postId: string, userId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  revalidatePath('/', 'layout');
}

export async function searchPosts({
  q,
  limit,
  page,
}: {
  q: string;
  limit: number;
  page: number;
}) {
  let query = q?.trim() ?? '';
  query = query.replace(/\s+/g, ' ');

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .ilike('text', `%${query}%`)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapPost);
}

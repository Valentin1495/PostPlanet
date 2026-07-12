'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { readPost } from './post.actions';
import { readUser } from './user.actions';
import { Reply, ReplyWithPost } from '@/lib/types';

function mapReply(row: {
  id: string;
  text: string | null;
  image: string | null;
  post_id: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}): Reply {
  return {
    id: row.id,
    text: row.text,
    image: row.image,
    postId: row.post_id,
    authorId: row.author_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function replyToPost(
  prevState: { message: string },
  formData: FormData
) {
  const image = (formData.get('fileUrl') as string) || null;
  let text = formData.get('text') as string;
  text = text.trim();
  const userId = formData.get('userId') as string;
  const postId = formData.get('postId') as string;

  if (!text && !image) {
    return { message: "There's nothing to reply 😢" };
  }

  const post = await readPost(postId);
  if (!post) return { message: 'Failed to reply 😢' };

  const supabase = await createClient();

  const { error } = await supabase.from('replies').insert({
    text,
    image,
    post_id: postId,
    author_id: userId,
  });

  if (error) {
    console.error(error);
    return { message: 'Failed to reply 😢' };
  }

  if (post.authorId !== userId) {
    const { error: activityError } = await supabase.from('activities').insert({
      type: 'reply',
      giver_id: userId,
      receiver_id: post.authorId,
      post_id: postId,
      text: post.text,
    });

    if (activityError) console.error(activityError);
  }

  revalidatePath('/', 'layout');

  return { message: 'Success' };
}

export async function readPostReplies(postId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('replies')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapReply);
}

export async function readReplies({
  postId,
  limit,
  page,
}: {
  postId: string;
  limit: number;
  page: number;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('replies')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) throw new Error(error.message);

  return (data ?? []).map(mapReply);
}

export async function deleteReply(replyId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('replies').delete().eq('id', replyId);

  if (error) throw new Error(error.message);

  revalidatePath('/', 'layout');
}

export async function countPostReplies(postId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('replies')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
}

export async function countUserReplies(userId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('replies')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', userId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
}

export async function readRepliesWithPost({
  userId,
  limit,
  page,
}: {
  userId: string;
  limit: number;
  page: number;
}): Promise<ReplyWithPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('replies')
    .select('*, post:posts(*), author:users(*)')
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) throw new Error(error.message);

  return (data ?? [])
    .filter((row: any) => row.post && row.author)
    .map((row: any) => ({
      ...mapReply(row),
      post: {
        id: row.post.id,
        text: row.post.text,
        image: row.post.image,
        authorId: row.post.author_id,
        createdAt: row.post.created_at,
        updatedAt: row.post.updated_at,
      },
      author: {
        id: row.author.id,
        username: row.author.username,
        name: row.author.name,
        bio: row.author.bio,
        profileImage: row.author.profile_image,
        createdAt: row.author.created_at,
        updatedAt: row.author.updated_at,
      },
    }));
}

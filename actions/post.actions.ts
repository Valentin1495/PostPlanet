'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Post, User } from '@prisma/client';
import { countFollowers, readUser } from './user.actions';
import { countPostReplies } from './reply.action';

export async function readAllPosts(limit: number, page: number) {
  try {
    const posts = await db.post.findMany({
      take: limit,
      skip: page * limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  } catch (error: any) {
    throw new Error(error);
  }
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
  try {
    const posts = await db.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: limit * page,
    });

    return posts;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function readAllUserPosts(userId: string) {
  try {
    const allUserPosts = await db.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return allUserPosts;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function readPost(postId: string) {
  try {
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    return post;
  } catch (error: any) {
    throw new Error(error);
  }
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
  const author = (await readUser(authorId)) as User;
  const post = await readPost(id);
  const likesCount = post?.likedIds.length;
  const hasLiked = await checkHasLiked(id, currentUserId);
  const replyCount = await countPostReplies(id);
  const followers = await countFollowers(authorId);

  return { author, hasLiked, replyCount, followers, likesCount };
}

export async function countPosts(userId: string) {
  try {
    const postCount = await db.post.count({
      where: {
        authorId: userId,
      },
    });

    return postCount;
  } catch (error: any) {
    throw new Error(error);
  }
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
  const postPromises = followingIds.map(async (userId) => {
    const promise = await readAllUserPosts(userId);

    return promise;
  });

  const postArrays = await Promise.all(postPromises);
  const posts = postArrays.flat();
  posts.sort((a, b) => b!.createdAt.getTime() - a!.createdAt.getTime());

  const startIndex = page * limit;
  const paginatedPosts = posts.slice(startIndex, startIndex + limit);

  return paginatedPosts;
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
  try {
    const likedPosts = await db.post.findMany({
      where: {
        likedIds: {
          has: userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: limit * page,
    });

    return likedPosts;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function checkHasLiked(postId: string, userId: string) {
  const post = await readPost(postId);
  const hasLiked = post?.likedIds.includes(userId);

  return hasLiked;
}

export async function likePost(postId: string, userId: string) {
  const { likedIds, authorId, text } = (await readPost(postId)) as Post;

  likedIds.push(userId);

  try {
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        likedIds,
      },
    });

    revalidatePath('/', 'layout');
  } catch (error: any) {
    throw new Error(error);
  }

  try {
    await db.activity.create({
      data: {
        type: 'like',
        postId,
        text,
        giverId: userId,
        receiverId: authorId,
      },
    });
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function unlikePost(postId: string, userId: string) {
  const post = await readPost(postId);
  const newLikedIds = post?.likedIds.filter((id) => id !== userId);

  try {
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        likedIds: newLikedIds,
      },
    });

    revalidatePath('/', 'layout');
  } catch (error: any) {
    throw new Error(error);
  }
}

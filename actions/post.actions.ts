'use server';

import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { readCurrentUser } from './user.actions';
import { User } from '@prisma/client';
import { readRepliesWithPost } from './reply.action';

export async function createPost(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const image = formData.get('fileUrl') as string;
  let text = formData.get('text') as string;
  text = text.trim();

  if (!text && !image)
    return {
      message: "There's nothing to post 😢",
    };

  const user = await currentUser();
  const id = user?.id;

  try {
    await db.post.create({
      data: {
        text,
        image,
        author: {
          connect: {
            id,
          },
        },
      },
    });

    revalidatePath('/home');

    return {
      message: '',
    };
  } catch (error) {
    return {
      message: 'Failed to post 😢',
    };
  }
}

export async function readAllPosts() {
  try {
    const posts = await db.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function readPosts(userId: string) {
  try {
    const posts = await db.post.findMany({
      where: {
        authorId: userId,
      },
    });

    return posts;
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

export async function readFollowingPosts() {
  const user = (await readCurrentUser()) as User;
  const followingIds = user.followingIds;

  const postPromises = followingIds.map(async (id) => {
    const promise = await readPosts(id);
    return promise;
  });

  const postArrays = await Promise.all(postPromises);
  const posts = postArrays.flat();
  posts.sort((a, b) => b!.createdAt.getTime() - a!.createdAt.getTime());

  return posts;
}

export async function readLikedPosts(userId: string) {
  try {
    const likedPosts = await db.post.findMany({
      where: {
        likedIds: {
          has: userId,
        },
      },
    });

    return likedPosts;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function checkHasLiked(postId: string) {
  const post = await readPost(postId);
  const user = await currentUser();

  const hasLiked = post?.likedIds.includes(user!.id);

  return hasLiked;
}

export async function likePost(postId: string) {
  const post = await readPost(postId);
  const user = await currentUser();
  const likedIds = post?.likedIds;
  likedIds?.push(user!.id);

  try {
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        likedIds,
      },
    });

    revalidatePath('/home');
    revalidatePath('/post');
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function unlikePost(postId: string) {
  const post = await readPost(postId);
  const user = await currentUser();
  const newLikedIds = post?.likedIds.filter((id) => id !== user?.id);

  try {
    await db.post.update({
      where: {
        id: postId,
      },
      data: {
        likedIds: newLikedIds,
      },
    });

    revalidatePath('/home');
    revalidatePath('/post');
  } catch (error: any) {
    throw new Error(error);
  }
}

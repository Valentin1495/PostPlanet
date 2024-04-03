'use server';

import db from '@/lib/db';
import { uploadImage } from '@/lib/upload-image';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { readCurrentUser, readUser } from './user.actions';
import { Post, User } from '@prisma/client';

export async function createPost(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  const imageToPost = formData.get('imageToPost') as File;
  const user = await currentUser();
  const id = user?.id;
  let result;

  if (imageToPost.size) {
    result = await uploadImage(imageToPost);
  }

  if (result?.message) {
    return result;
  }

  let text = formData.get('text') as string;
  text = text.trim();
  const image = result?.imageUrl;

  if (!text && !imageToPost.size)
    return {
      message: "There's nothing to post. 😢",
    };

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

    revalidatePath('/home/for-you');

    return {
      message: 'Posted! 🥳',
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'Failed to post. 😢',
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
  } catch (error) {
    console.error(error);
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
  } catch (error) {
    console.error(error);
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

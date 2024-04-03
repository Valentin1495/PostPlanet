'use server';

import db from '@/lib/db';
import { uploadImage } from '@/lib/upload-image';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

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
    const posts = await db.post.findMany();

    return posts;
  } catch (error) {
    console.error(error);
  }
}

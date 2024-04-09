'use server';

import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function replyToPost(
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
      message: "There's nothing to reply 😢",
    };

  const user = await currentUser();
  const id = user?.id;
  const postId = formData.get('postId') as string;
  const isForDialog = formData.get('isForDialog') as string;
  let redirectUrl = '';

  try {
    await db.reply.create({
      data: {
        text,
        image,
        author: {
          connect: {
            id,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });

    revalidatePath('/post');
    revalidatePath('/home');
    redirectUrl = `/post/${postId}`;

    return {
      message: '',
    };
  } catch (error: any) {
    return {
      message: 'Failed to reply 😢',
    };
  } finally {
    if (redirectUrl && isForDialog === 'true') redirect(redirectUrl);
  }
}

export async function readReplies(postId: string) {
  try {
    const replies = await db.reply.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return replies;
  } catch (error: any) {
    throw new Error(error);
  }
}

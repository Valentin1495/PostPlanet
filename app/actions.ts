'use server';

import db from '@/lib/db';
import { utapi } from '@/lib/uploadthing';
import { currentUser } from '@clerk/nextjs';
import { z } from 'zod';

export async function uploadImage(image: File) {
  try {
    const response = await utapi.uploadFiles(image);
    return { imageUrl: response.data?.url };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to upload image.' };
  }
}

export async function createUser(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  let username = formData.get('username') as string;
  username = username.trim();
  let bio = formData.get('bio') as string;
  bio = bio.trim();
  let name = formData.get('name') as string;
  name = name.trim();

  const image = formData.get('profileImage') as File;
  const result = await uploadImage(image);
  if (result.message) {
    return result;
  }
  const profileImage = result.imageUrl;
  const user = await currentUser();
  const id = user?.id;

  const schema = z.object({
    id: z.string().min(1, { message: 'Id must contain at least 1 character.' }),
    username: z
      .string()
      .trim()
      .min(1, { message: 'Username must contain at least 1 character.' }),
    bio: z.string().trim().optional(),
    name: z
      .string()
      .trim()
      .min(1, { message: 'Name must contain at least 1 character.' }),
    profileImage: z.string().min(1, {
      message: 'Profile image must contain at least 1 character.',
    }),
  });

  const parse = schema.safeParse({
    id,
    username,
    bio,
    name,
    profileImage,
  });

  if (!parse.success) {
    let message = '';
    parse.error.issues.map((issue) => {
      message += issue.message + '\n';
    });
    return {
      message,
    };
  }

  const data = parse.data;
  const userList = await db.user.findMany();
  const sameUserList = userList.filter((el) => el.username === data.username);
  if (sameUserList[0]) {
    return {
      message: 'That username has been taken.',
    };
  }

  try {
    await db.user.create({
      data: {
        id: data.id,
        username: data.username,
        name: data.name,
        bio: data.bio,
        profileImage: data.profileImage,
      },
    });

    return {
      message: 'Onboarded.',
    };
  } catch (error) {
    console.error(error);
    return {
      message: 'Onboarding failed.',
    };
  }
}

export async function getUser() {
  const user = await currentUser();

  try {
    const currentUser = await db.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    return currentUser;
  } catch (error) {
    console.error(error);
  }
}

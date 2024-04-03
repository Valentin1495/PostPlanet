'use server';

import db from '@/lib/db';
import { uploadImage } from '@/lib/upload-image';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({
  id: z.string().min(1, { message: 'Id must contain at least 1 character.' }),
  username: z
    .string()
    .trim()
    .min(1, { message: 'Username must contain at least 1 character.' }),
  bio: z.string(),
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name must contain at least 1 character.' }),
  profileImage: z.string().min(1, {
    message: 'Profile image url must contain at least 1 character.',
  }),
});

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
      message: 'That username has been taken.\nPlease choose another.',
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

export async function readCurrentUser() {
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

export async function readUser(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function countFollowers(userId: string) {
  try {
    const followers = await db.user.count({
      where: {
        followingIds: {
          has: userId,
        },
      },
    });

    return followers;
  } catch (error) {
    console.error(error);
  }
}

export async function checkFollow(userId: string) {
  const user = await readCurrentUser();
  const isFollowing = user?.followingIds.includes(userId);

  return isFollowing;
}

export async function follow(userId: string) {
  const user = await readCurrentUser();
  const id = user?.id;
  const followingIds = user?.followingIds;
  followingIds?.push(userId);

  try {
    await db.user.update({
      where: {
        id,
      },
      data: {
        followingIds,
      },
    });

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        hasActivity: true,
      },
    });

    revalidatePath('/home/for-you');
  } catch (error) {
    console.error(error);
  }
}

export async function unfollow(userId: string) {
  const user = await readCurrentUser();
  const id = user?.id;
  const followingIds = user?.followingIds;
  const newFollowingIds = followingIds?.filter((name) => name !== userId);

  try {
    await db.user.update({
      where: {
        id,
      },
      data: {
        followingIds: newFollowingIds,
      },
    });

    revalidatePath('/home/for-you');
  } catch (error) {
    console.error(error);
  }
}

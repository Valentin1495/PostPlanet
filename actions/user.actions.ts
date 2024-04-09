'use server';

import db from '@/lib/db';
import { currentUser } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { faker } from '@faker-js/faker';

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
  const profileImage = formData.get('fileUrl') as string;

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
    return {
      message: 'Onboarding failed 😢',
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
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function readUser(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function readRandomUsers() {
  const currentUser = await readCurrentUser();

  try {
    const randomUsers = await db.user.findMany();
    const nonFollowers = randomUsers.filter(
      (user) =>
        !currentUser?.followingIds.includes(user.id) &&
        user.id !== currentUser?.id
    );

    return nonFollowers.slice(-10);
  } catch (error: any) {
    throw new Error(error);
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
        followers: {
          increment: 1,
        },
        hasActivity: true,
      },
    });

    revalidatePath('/home');
    revalidatePath('/post');
  } catch (error: any) {
    throw new Error(error);
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

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        followers: {
          decrement: 1,
        },
      },
    });

    revalidatePath('/home');
    revalidatePath('/post');
  } catch (error: any) {
    throw new Error(error);
  }
}

async function generateUniqueUsername(baseUsername: string) {
  let uniqueUsername = baseUsername;
  let userExists = await db.user.findUnique({
    where: {
      username: uniqueUsername,
    },
  });
  let attempt = 0;

  while (userExists) {
    attempt++;
    uniqueUsername = `${baseUsername}${attempt}`;
    userExists = await db.user.findUnique({
      where: {
        username: uniqueUsername,
      },
    });
  }

  return uniqueUsername;
}

export async function createRandomUsers(userCount: number) {
  for (let i = 0; i < userCount; i++) {
    const sex = faker.person.sexType();
    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const baseUsername = faker.internet.userName();
    const username = await generateUniqueUsername(baseUsername);
    const userData = {
      id: faker.string.uuid(),
      profileImage: faker.image.avatar(),
      name: fullName,
      username,
      bio: faker.lorem.sentence(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      followingIds: [
        'user_2ZiTE2jqizA7RLyq1QOdw2eiGHu',
        'user_2edjx2T39LOpGHfvjxesMuFKcFR',
        'user_2edfm2kvCrndEhpy4fpCqDJg8sy',
        'user_2ZiXhKpFc36P3SSE5rZm98JKRMf',
        'user_2eGnPfeYXw69sgZScKvyrOWixhX',
      ],
      hasActivity: false,
      followers: 0,
    };

    try {
      await db.user.create({
        data: userData,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

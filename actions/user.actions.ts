'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';

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
  if (username.includes(' ')) {
    username = username.replace(/ /g, '');
  }

  let bio = formData.get('bio') as string;
  bio = bio.trim();

  let name = formData.get('name') as string;
  name = name.trim();
  name = name.replace(/\s+/g, ' ');

  const profileImage = formData.get('fileUrl') as string;
  const userId = formData.get('userId') as string;

  const parse = schema.safeParse({
    id: userId,
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

export async function readFollowingUsers(userId: string) {
  const { followingIds } = (await readUser(userId)) as User;

  const promises = followingIds.reverse().map(async (id) => await readUser(id));
  const followingUsers = await Promise.all(promises);

  return followingUsers;
}

export async function readFollowers(userId: string) {
  try {
    const followers = await db.user.findMany({
      where: {
        followingIds: {
          has: userId,
        },
      },
    });

    return followers;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function readRandomUsers(loggedInUser: User) {
  const { followingIds, id } = loggedInUser;

  try {
    const randomUsers = await db.user.findMany();
    const nonFollowers = randomUsers.filter(
      (user) => !followingIds.includes(user.id) && user.id !== id
    );

    const promises = nonFollowers.slice(-5).map(async (user) => {
      const followers = await countFollowers(user.id);
      return { ...user, followers };
    });

    const usersWithFollowers = await Promise.all(promises);
    return usersWithFollowers;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function follow(
  userId: string,
  currentUserId: string,
  followingIds: string[]
) {
  followingIds.push(userId);

  try {
    await db.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        followingIds,
      },
    });

    await db.activity.create({
      data: {
        giverId: currentUserId,
        receiverId: userId,
        type: 'follow',
      },
    });

    revalidatePath('/');
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function unfollow(
  userId: string,
  currentUserId: string,
  followingIds: string[]
) {
  const newFollowingIds = followingIds.filter((id) => id !== userId);

  try {
    await db.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        followingIds: newFollowingIds,
      },
    });

    revalidatePath('/');
  } catch (error: any) {
    throw new Error(error);
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
      hasActivity: false,
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

export async function readUserId(username: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        username,
      },
    });

    return user?.id;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function searchPeople(q: string) {
  let query = q;
  if (query?.includes(' ')) {
    query = query.replace(/ /g, '');
  }

  try {
    const people = db.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });

    return people;
  } catch (error: any) {
    throw new Error(error);
  }
}

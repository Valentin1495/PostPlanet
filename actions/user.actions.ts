'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { faker } from '@faker-js/faker';
import { User } from '@prisma/client';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { auth, currentUser } from '@clerk/nextjs/server';
import {
  generateRandomColor,
  generateRandomUsername,
  leaveSingleSpace,
  removeAllSpaces,
} from '@/lib/utils';

const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

export async function login() {
  const imageUrl = generateRandomColor();
  const fullName = generateRandomUsername();
  const user = { id: uuidv4(), imageUrl, fullName };

  // Create the session
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set('session', session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/');
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

export async function fetchUserId(): Promise<string> {
  let userId;
  const authentication = auth();
  userId = authentication.userId;

  if (!userId) {
    const session = await getSession();

    if (!session) {
      redirect('/');
    }
    userId = session.user.id;
  }

  return userId;
}

export async function fetchCurrentUser() {
  const session = await getSession();

  if (session) {
    return session.user;
  } else {
    const user = await currentUser();
    return user;
  }
}

export async function createUser(prevState: any, formData: FormData) {
  let username = formData.get('username') as string;
  username = removeAllSpaces(username);

  let bio = formData.get('bio') as string;
  bio = bio.trim();

  let name = formData.get('name') as string;
  name = leaveSingleSpace(name);

  let profileImage = formData.get('fileUrl') as string | null;

  if (!profileImage) {
    profileImage = formData.get('image') as string;
  }

  const id = await fetchUserId();
  const userList = await db.user.findMany();
  const sameUserList = userList.filter((el) => el.username === username);

  if (sameUserList[0]) {
    return {
      message: 'That username has been taken. Please choose another.',
    };
  }

  try {
    await db.user.create({
      data: { id, username, name, bio, profileImage },
    });

    return {
      message: 'Success',
    };
  } catch (error) {
    console.error(error);

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

export async function readRandomUsers(user: User) {
  const { followingIds, id } = user;

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

    revalidatePath('/', 'layout');
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

    revalidatePath('/', 'layout');
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

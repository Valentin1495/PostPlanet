'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  generateRandomColor,
  generateRandomUsername,
  leaveSingleSpace,
  removeAllSpaces,
} from '@/lib/utils';
import { User } from '@/lib/types';

function mapUser(row: {
  id: string;
  username: string;
  name: string;
  bio: string | null;
  profile_image: string;
  created_at: string;
  updated_at: string;
}): User {
  return {
    id: row.id,
    username: row.username,
    name: row.name,
    bio: row.bio,
    profileImage: row.profile_image,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function fetchCurrentAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function fetchUserId(): Promise<string | null> {
  const user = await fetchCurrentAuthUser();
  return user?.id ?? null;
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function createUser(prevState: any, formData: FormData) {
  let username = formData.get('username') as string;
  username = removeAllSpaces(username);

  let bio = (formData.get('bio') as string) ?? '';
  bio = bio.trim();

  let name = formData.get('name') as string;
  name = leaveSingleSpace(name);

  const profileImage = formData.get('fileUrl') as string | null;

  if (!profileImage) {
    return { message: 'Please upload a profile picture.' };
  }

  const authUser = await fetchCurrentAuthUser();
  if (!authUser) {
    return { message: 'You must be signed in to onboard.' };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .ilike('username', username)
    .maybeSingle();

  if (existing) {
    return {
      message: 'That username has been taken. Please choose another.',
    };
  }

  const { error } = await supabase.from('users').insert({
    id: authUser.id,
    username,
    name,
    bio,
    profile_image: profileImage,
  });

  if (error) {
    console.error(error);
    return { message: 'Onboarding failed 😢' };
  }

  return { message: 'Success' };
}

export async function createGuestUser(authUserId: string): Promise<User> {
  const supabase = await createClient();

  let username = generateRandomUsername();

  // Extremely unlikely, but guard against the random suffix colliding.
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .ilike('username', username)
      .maybeSingle();

    if (!existing) break;
    username = generateRandomUsername();
  }

  const { data, error } = await supabase
    .from('users')
    .insert({
      id: authUserId,
      username,
      name: 'Guest',
      bio: "I'm just here to look around 👀",
      profile_image: generateRandomColor(),
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return mapUser(data);
}

export async function readUser(userId: string | null): Promise<User | null> {
  if (!userId) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data ? mapUser(data) : null;
}

export async function readUserId(username: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error(error);
    return null;
  }

  return data?.id ?? null;
}

export async function readFollowingUsers({
  userId,
  limit,
  page,
}: {
  userId: string;
  limit: number;
  page: number;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('follows')
    .select('following:users!follows_following_id_fkey(*)')
    .eq('follower_id', userId)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? [])
    .map((row: any) => row.following)
    .filter(Boolean)
    .map(mapUser);
}

export async function readFollowers({
  userId,
  limit,
  page,
}: {
  userId: string;
  limit: number;
  page: number;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('follows')
    .select('follower:users!follows_follower_id_fkey(*)')
    .eq('following_id', userId)
    .order('created_at', { ascending: false })
    .range(page * limit, page * limit + limit - 1);

  if (error) {
    console.error(error);
    return [];
  }

  return (data ?? []).map((row: any) => row.follower).filter(Boolean).map(mapUser);
}

export async function readRandomUsers(currentUserId: string) {
  const supabase = await createClient();

  const { data: followingRows } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', currentUserId);

  const followingIds = new Set((followingRows ?? []).map((r) => r.following_id));

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .neq('id', currentUserId)
    .limit(20);

  if (error) {
    console.error(error);
    return [];
  }

  const nonFollowers = (users ?? []).filter((u) => !followingIds.has(u.id));

  const candidates = nonFollowers.slice(-5);
  const withFollowers = await Promise.all(
    candidates.map(async (u) => ({
      ...mapUser(u),
      followers: await countFollowers(u.id),
    }))
  );

  return withFollowers;
}

export async function countFollowers(userId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
}

export async function countFollowing(userId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
}

export async function isFollowing(followerId: string, followingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return false;
  }

  return Boolean(data);
}

export async function follow(followerId: string, followingId: string) {
  if (!followerId || !followingId || followerId === followingId) return;

  const supabase = await createClient();

  const { data: existingFollow, error: existingFollowError } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();

  if (existingFollowError) {
    throw new Error(existingFollowError.message);
  }

  if (existingFollow) {
    revalidatePath('/', 'layout');
    return;
  }

  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId });

  if (error) {
    if (error.code === '23505') {
      revalidatePath('/', 'layout');
      return;
    }

    throw new Error(error.message);
  }

  const { error: activityError } = await supabase.from('activities').insert({
    type: 'follow',
    giver_id: followerId,
    receiver_id: followingId,
  });

  if (activityError) {
    console.error(activityError);
  }

  revalidatePath('/', 'layout');
}

export async function unfollow(followerId: string, followingId: string) {
  if (!followerId || !followingId || followerId === followingId) return;

  const supabase = await createClient();

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/', 'layout');
}

import { isFollowing } from '@/lib/api';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userFollowing = searchParams.get('userFollowing');
  const userFollowed = searchParams.get('userFollowed');

  if (!userFollowed || !userFollowing) return;

  const isFollowingUser = await isFollowing(userFollowing, userFollowed);

  return Response.json({ isFollowingUser });
}

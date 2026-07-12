import { isFollowing } from '@/actions/user.actions';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userFollowing = searchParams.get('userFollowing');
  const userFollowed = searchParams.get('userFollowed');

  if (!userFollowed || !userFollowing) {
    return Response.json({ isFollowingUser: false });
  }

  const isFollowingUser = await isFollowing(userFollowing, userFollowed);

  return Response.json({ isFollowingUser });
}

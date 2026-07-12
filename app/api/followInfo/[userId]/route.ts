import { countFollowers, countFollowing, isFollowing } from '@/actions/user.actions';
import { type NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const currentUserId = request.nextUrl.searchParams.get('currentUserId');

  const [followersCount, followingCount, isFollowingUser] = await Promise.all([
    countFollowers(userId),
    countFollowing(userId),
    currentUserId ? isFollowing(currentUserId, userId) : Promise.resolve(false),
  ]);

  return Response.json({ followersCount, followingCount, isFollowingUser });
}

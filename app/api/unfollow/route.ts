import { unfollow } from '@/lib/api';

export async function POST(request: Request) {
  const { userId, currentUserId, followingIds } = await request.json();
  const unfollowedUser = await unfollow({
    userId,
    currentUserId,
    followingIds,
  });

  return Response.json({ unfollowedUser });
}

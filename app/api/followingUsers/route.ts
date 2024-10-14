import { getFollowingUsers } from '@/lib/api';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const followingIds = searchParams.get('followingIds');
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');

  if (followingIds === null || limit === null || page === null) return;

  const followingUsers = await getFollowingUsers({
    followingIds: JSON.parse(followingIds),
    limit: parseInt(limit),
    page: parseInt(page),
  });

  return Response.json({ result: followingUsers });
}

import { readFollowingPosts } from '@/actions/post.actions';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const followingIds = searchParams.get('followingIds');
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');

  if (limit === null || page === null || followingIds === null) return;

  const followingPosts = await readFollowingPosts({
    followingIds: JSON.parse(followingIds),
    limit: parseInt(limit),
    page: parseInt(page),
  });

  return Response.json({ result: followingPosts });
}

import { readFollowingPostsByUser } from '@/actions/post.actions';
import { fetchUserId } from '@/actions/user.actions';
import { type NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noStoreHeaders = { 'Cache-Control': 'no-store' };

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');
  const userId = await fetchUserId();

  if (limit === null || page === null || userId === null) {
    return Response.json({ result: [] }, { headers: noStoreHeaders });
  }

  const followingPosts = await readFollowingPostsByUser({
    userId,
    limit: parseInt(limit),
    page: parseInt(page),
  });

  return Response.json({ result: followingPosts }, { headers: noStoreHeaders });
}

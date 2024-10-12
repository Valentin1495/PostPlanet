import { getRepliesWithPost } from '@/lib/api';
import { type NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');

  if (limit === null || page === null) return;

  const repliesWithPost = await getRepliesWithPost({
    userId,
    limit: parseInt(limit),
    page: parseInt(page),
  });

  return Response.json({ result: repliesWithPost });
}

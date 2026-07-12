import { readRepliesWithPost } from '@/actions/reply.action';
import { type NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');

  if (limit === null || page === null) return Response.json({ result: [] });

  const repliesWithPost = await readRepliesWithPost({
    userId,
    limit: parseInt(limit),
    page: parseInt(page),
  });

  return Response.json({ result: repliesWithPost });
}

import { readReplies } from '@/actions/reply.action';
import { type NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');

  if (limit === null || page === null) return Response.json({ result: [] });

  const replies = await readReplies({
    postId,
    limit: parseInt(limit),
    page: parseInt(page),
  });

  return Response.json({ result: replies });
}

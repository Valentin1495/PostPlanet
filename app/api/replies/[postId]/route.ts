import { getReplies } from '@/lib/api';
import { type NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const postId = params.postId;
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');

  if (limit === null || page === null) return;

  const replies = await getReplies({
    postId,
    limit: parseInt(limit),
    page: parseInt(page),
  });

  return Response.json({ result: replies });
}

import { getPostInfo } from '@/lib/api';
import { type NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const postId = params.postId;
  const searchParams = request.nextUrl.searchParams;
  const authorId = searchParams.get('authorId');
  const currentUserId = searchParams.get('currentUserId');

  if (authorId === null || currentUserId === null) return;

  const postInfo = await getPostInfo({ id: postId, authorId, currentUserId });
  return Response.json({ postInfo });
}

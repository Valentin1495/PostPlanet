import { readPostInfo } from '@/actions/post.actions';
import { type NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const authorId = searchParams.get('authorId');
  const currentUserId = searchParams.get('currentUserId');

  if (authorId === null || currentUserId === null) {
    return Response.json({ postInfo: null });
  }

  const postInfo = await readPostInfo({
    id: postId,
    authorId,
    currentUserId,
  });

  return Response.json({ postInfo });
}

import { countPostReplies } from '@/actions/reply.action';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  const repliesCount = await countPostReplies(postId);

  return Response.json({ repliesCount });
}

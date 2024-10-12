import { countReplies } from '@/lib/api';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const postId = params.postId;
  const repliesCount = await countReplies(postId);

  return Response.json({ repliesCount });
}

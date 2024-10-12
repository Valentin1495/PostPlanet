import { countFollowing } from '@/lib/api';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const followingCount = await countFollowing(userId);

  return Response.json({ followingCount });
}

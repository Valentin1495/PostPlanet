import { countFollowers } from '@/lib/api';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const followersCount = await countFollowers(userId);

  return Response.json({ followersCount });
}

import { countFollowing } from '@/actions/user.actions';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const followingCount = await countFollowing(userId);

  return Response.json({ followingCount });
}

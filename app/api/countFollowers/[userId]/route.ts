import { countFollowers } from '@/actions/user.actions';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const followersCount = await countFollowers(userId);

  return Response.json({ followersCount });
}

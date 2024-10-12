import { getUser } from '@/lib/api';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const user = await getUser(userId);

  return Response.json({ user });
}

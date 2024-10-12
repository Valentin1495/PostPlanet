import { getUserId } from '@/lib/api';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  const userId = await getUserId(username);

  return Response.json({ userId });
}

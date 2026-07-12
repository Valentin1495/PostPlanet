import { readUserId } from '@/actions/user.actions';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const userId = await readUserId(username);

  return Response.json({ userId });
}

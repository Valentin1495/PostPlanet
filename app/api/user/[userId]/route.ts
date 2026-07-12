import { readUser } from '@/actions/user.actions';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const user = await readUser(userId);

  return Response.json({ user });
}

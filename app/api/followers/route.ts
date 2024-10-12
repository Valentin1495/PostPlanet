import { countFollowers } from '@/actions/user.actions';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');

  if (userId === null) return;

  const followers = await countFollowers(userId);

  return Response.json({ followers });
}

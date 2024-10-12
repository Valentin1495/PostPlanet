import { getFollowers } from '@/lib/api';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const limit = searchParams.get('limit');
  const page = searchParams.get('page');

  if (userId === null || limit === null || page === null) return;

  const followers = await getFollowers({
    userId,
    limit: parseInt(limit),
    page: parseInt(page),
  });

  return Response.json({ result: followers });
}

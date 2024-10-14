import { follow } from '@/lib/api';

export async function POST(request: Request) {
  const { userId, currentUserId, followingIds } = await request.json();
  const data = await follow({ userId, currentUserId, followingIds });

  return Response.json({ data });
}

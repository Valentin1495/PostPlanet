import { follow } from '@/lib/api';

export async function POST(request: Request) {
  const { userId, currentUserId, followingIds } = await request.json();
  const result = await follow({ userId, currentUserId, followingIds });

  return Response.json(result);
}

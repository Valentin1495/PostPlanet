import { unlikePost } from '@/actions/post.actions';

export async function POST(request: Request) {
  const { postId, userId } = await request.json();

  await unlikePost(postId, userId);

  return Response.json({ data: 'Success' });
}

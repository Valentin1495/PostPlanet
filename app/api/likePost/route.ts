import { likePost } from '@/actions/post.actions';

export async function POST(request: Request) {
  const { postId, userId } = await request.json();

  await likePost(postId, userId);

  return Response.json({ data: 'Success' });
}

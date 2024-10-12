import { likePost } from '@/actions/post.actions';

export async function POST(request: Request) {
  const res = await request.json();
  const { postId, userId } = res;

  await likePost(postId, userId);

  return Response.json({ data: 'Success' });
}

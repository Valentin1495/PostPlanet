import { unlikePost } from '@/actions/post.actions';

export async function POST(request: Request) {
  const res = await request.json();
  const { postId, userId } = res;

  await unlikePost(postId, userId);

  return Response.json({ data: 'Success' });
}

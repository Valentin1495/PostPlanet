import { deletePost } from '@/actions/post.actions';

export async function DELETE(request: Request) {
  const { postId } = await request.json();
  await deletePost(postId);

  return Response.json({ success: true });
}

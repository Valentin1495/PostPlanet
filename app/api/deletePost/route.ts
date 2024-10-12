import { deletePost } from '@/lib/api';

export async function DELETE(request: Request) {
  const { postId } = await request.json();
  const deletedPost = await deletePost(postId);

  return Response.json({ deletedPost });
}

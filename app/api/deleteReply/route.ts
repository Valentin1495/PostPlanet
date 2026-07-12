import { deleteReply } from '@/actions/reply.action';

export async function DELETE(request: Request) {
  const { replyId } = await request.json();
  await deleteReply(replyId);

  return Response.json({ success: true });
}

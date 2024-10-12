import { deleteReply } from '@/lib/api';

export async function DELETE(request: Request) {
  const { replyId } = await request.json();
  const reply = await deleteReply(replyId);

  return Response.json({ replyDeleted: reply });
}

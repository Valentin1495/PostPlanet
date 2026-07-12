import { replyToPost } from '@/actions/reply.action';

export async function POST(request: Request) {
  const formData = await request.formData();
  const result = await replyToPost({ message: '' }, formData);

  return Response.json({ data: result.message });
}

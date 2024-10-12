import { replyToPost } from '@/lib/api';

export async function POST(request: Request) {
  const formData = await request.formData();

  let text = formData.get('text') as string;
  text = text.trim();
  const fileUrl = formData.get('fileUrl') as string;
  const userId = formData.get('userId') as string;
  const postId = formData.get('postId') as string;

  await replyToPost({ text, image: fileUrl, postId, userId });

  return Response.json({ data: 'Success' });
}

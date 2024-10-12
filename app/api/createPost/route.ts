import { createPost } from '@/lib/api';

export async function POST(request: Request) {
  const formData = await request.formData();

  let text = formData.get('text') as string;
  text = text.trim();
  const fileUrl = formData.get('fileUrl') as string;
  const authorId = formData.get('authorId') as string;

  const newPost = await createPost({ text, image: fileUrl, authorId });

  return Response.json({ newPost });
}

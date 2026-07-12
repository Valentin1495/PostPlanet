import { createClient } from '@/lib/supabase/client';
import { FileType } from '@/lib/types';

export async function uploadImage(
  file: File,
  userId: string
): Promise<FileType> {
  const supabase = createClient();
  const extension = file.name.split('.').pop();
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from('images')
    .upload(path, file, { contentType: file.type });

  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from('images').getPublicUrl(path);

  return { url: publicUrl, name: file.name };
}

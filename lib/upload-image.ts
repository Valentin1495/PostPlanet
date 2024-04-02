import { utapi } from '@/lib/uploadthing';

export async function uploadImage(image: File) {
  try {
    const response = await utapi.uploadFiles(image);
    return { imageUrl: response.data?.url };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to upload image.' };
  }
}

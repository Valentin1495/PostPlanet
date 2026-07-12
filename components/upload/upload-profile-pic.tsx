'use client';

import { FileType } from '@/lib/types';
import { uploadImage } from '@/hooks/use-upload-image';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';

type UploadProfilePicProps = {
  userId: string;
  handleFile: Dispatch<SetStateAction<FileType | null>>;
  handleMouseEnter: Dispatch<SetStateAction<boolean>>;
};

export default function UploadProfilePic({
  userId,
  handleFile,
  handleMouseEnter,
}: UploadProfilePicProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadImage(file, userId);
      handleFile(uploaded);
      handleMouseEnter(false);
    } catch (error: any) {
      alert(`ERROR! ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <button
      type='button'
      onClick={() => inputRef.current?.click()}
      disabled={isUploading}
      className={cn(
        'size-32 rounded-full border-2 border-primary flex flex-col items-center justify-center gap-1 mx-auto text-sm font-semibold text-primary',
        isUploading && 'opacity-50 cursor-not-allowed'
      )}
    >
      <ImagePlus size={28} />
      {isUploading ? 'Uploading...' : 'Upload'}
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        onChange={handleChange}
      />
    </button>
  );
}

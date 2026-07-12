'use client';

import { FileType } from '@/lib/types';
import { uploadImage } from '@/hooks/use-upload-image';
import {
  Dispatch,
  SetStateAction,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

type UploadPostPicProps = {
  userId: string;
  handleFile: Dispatch<SetStateAction<FileType | null>>;
  onUploadingChange?: (isUploading: boolean) => void;
};

export type UploadPostPicHandle = {
  open: () => void;
};

const UploadPostPic = forwardRef<UploadPostPicHandle, UploadPostPicProps>(
  function UploadPostPic({ userId, handleFile, onUploadingChange }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => inputRef.current?.click(),
    }));

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      onUploadingChange?.(true);
      try {
        const uploaded = await uploadImage(file, userId);
        handleFile(uploaded);
      } catch (error: any) {
        alert(`ERROR! ${error.message}`);
      } finally {
        setIsUploading(false);
        onUploadingChange?.(false);
        e.target.value = '';
      }
    };

    return (
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        className='hidden'
        disabled={isUploading}
        onChange={handleChange}
      />
    );
  }
);

export default UploadPostPic;

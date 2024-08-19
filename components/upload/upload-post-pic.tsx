import { FileType } from '@/lib/types';
import { UploadDropzone } from '@/lib/uploadthing';
import { Dispatch, SetStateAction } from 'react';

type UploadPostPicProps = {
  handleFile: Dispatch<SetStateAction<FileType | null>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function UploadPostPic({
  handleFile,
  setIsOpen,
}: UploadPostPicProps) {
  return (
    <UploadDropzone
      appearance={{
        label: 'text-primary hover:text-primary/80',
        button({ isUploading }) {
          return `${isUploading ? 'button-uploading' : 'bg-primary'}`;
        },
      }}
      endpoint='imageUploader'
      onClientUploadComplete={(res) => {
        const { url, name } = res[0];
        handleFile({ url, name });
        setIsOpen(false);
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}

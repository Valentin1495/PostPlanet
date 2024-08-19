import { FileType } from '@/lib/types';
import { UploadDropzone } from '@/lib/uploadthing';
import { Dispatch, SetStateAction } from 'react';

type UploadProfilePicProps = {
  handleFile: Dispatch<SetStateAction<FileType | null>>;
  handleMouseEnter: Dispatch<SetStateAction<boolean>>;
};

export default function UploadProfilePic({
  handleFile,
  handleMouseEnter,
}: UploadProfilePicProps) {
  return (
    <UploadDropzone
      appearance={{
        container:
          'size-32 rounded-full p-0 border-2 border-primary cursor-pointer mx-auto space-y-0',
        label: 'hidden',
        allowedContent: 'hidden',
        button({ isUploading }) {
          return `text-sm w-[100px] h-9 rounded-full font-semibold ${
            isUploading ? 'button-uploading' : 'bg-primary'
          }`;
        },
        uploadIcon: 'text-primary size-11 -mt-3',
      }}
      endpoint='imageUploader'
      onClientUploadComplete={(res) => {
        const { url, name } = res[0];
        handleFile({ url, name });
        handleMouseEnter(false);
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
}

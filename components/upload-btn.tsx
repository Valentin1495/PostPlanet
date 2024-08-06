import { UploadButton } from '@/lib/uploadthing';
import { ImagePlus } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

type UploadBtnProps = {
  setFileUrl: Dispatch<SetStateAction<string>>;
};

export default function UploadBtn({ setFileUrl }: UploadBtnProps) {
  return (
    <UploadButton
      appearance={{
        allowedContent: 'hidden',
        button:
          'bg-secondary ut-uploading:text-primary hover:bg-secondary/80 focus-within:ring-primary font-semibold after:bg-primary/10',
      }}
      content={{
        button({ isUploading }) {
          if (!isUploading)
            return <ImagePlus size={18} className='text-primary' />;
        },
      }}
      endpoint='imageUploader'
      onClientUploadComplete={(res) => setFileUrl(res[0].url)}
      onUploadError={(error: Error) => toast(error.message)}
    />
  );
}

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';

type AvatarPictureProps = {
  src: string;
  alt: string;
  className: string;
};

export function AvatarPicture({ src, alt, className }: AvatarPictureProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt={alt} className='object-cover' />
      <AvatarFallback className='bg-primary/25'>
        <Skeleton className='rounded-full' />
      </AvatarFallback>
    </Avatar>
  );
}

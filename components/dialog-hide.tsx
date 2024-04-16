import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export default function DialogHide({ isForPost }: { isForPost?: boolean }) {
  return (
    <DialogPrimitive.Close
      className={cn(
        'rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
        !isForPost && 'absolute right-4 top-4'
      )}
    >
      <X className='h-5 w-5' />
      <span className='sr-only'>Close</span>
    </DialogPrimitive.Close>
  );
}

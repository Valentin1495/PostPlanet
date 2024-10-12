'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ReactNode, useState } from 'react';
import PostForm from './post-form';
import DialogHide from './dialog-hide';
import { cn } from '@/lib/utils';

type PostDialogProps = {
  children: ReactNode;
  profileImage: string;
  userId: string;
  icon?: boolean;
};

export default function PostDialog({
  children,
  profileImage,
  userId,
  icon,
}: PostDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          'rounded-full darker bg-primary',
          icon
            ? 'p-2.5 inline xl:hidden'
            : 'hidden xl:inline-flex w-full h-12 text-background justify-center items-center font-semibold'
        )}
      >
        {children}
      </DialogTrigger>
      <DialogContent className='p-4'>
        <section className='flex justify-end'>
          <DialogHide isForPost />
        </section>
        <PostForm
          isForDialog
          isForPost
          profileImage={profileImage}
          userId={userId}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { MouseEvent, ReactNode, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import DeleteButton from './delete-button';
import { useRouter } from 'next/navigation';
import { deletePost } from '@/actions/post.actions';
import { deleteReply } from '@/actions/reply.action';

type DeleteDialogProps = {
  children: ReactNode;
  handleClick: (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  postId: string;
  forReply?: boolean;
};

export default function DeleteDialog({
  children,
  handleClick,
  postId,
  forReply,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={handleClick}>{children}</DialogTrigger>
      <DialogContent className='w-72'>
        <DialogTitle className='text-xl'>
          Delete {forReply ? 'reply' : 'post'}?
        </DialogTitle>
        <DialogDescription className='text-muted-foreground'>
          This can’t be undone and it will be removed from your profile, the
          timeline of any accounts that follow you, and from search results.
        </DialogDescription>
        <form
          action={() => {
            if (forReply) {
              deleteReply(postId).then(() => setOpen(false));
            } else {
              deletePost(postId).then(() => setOpen(false));
              router.push('/home');
            }
          }}
        >
          <DeleteButton />
        </form>
        <DialogClose className='text-sm font-bold rounded-full w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 transition-colors'>
          Cancel
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

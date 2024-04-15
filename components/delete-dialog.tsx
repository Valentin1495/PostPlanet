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

type DeleteDialogProps = {
  children: ReactNode;
  handleClick: (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  postId: string;
  username?: string;
  deletePost: (postId: string) => Promise<void>;
};

export default function DeleteDialog({
  children,
  handleClick,
  postId,
  username,
  deletePost,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={handleClick}>{children}</DialogTrigger>
      <DialogContent className='w-72'>
        <DialogTitle>Delete post?</DialogTitle>
        <DialogDescription>
          This can’t be undone and it will be removed from your profile, the
          timeline of any accounts that follow you, and from search results.
        </DialogDescription>
        <form
          action={() => {
            deletePost(postId).then(() => setOpen(false));
            username && router.push(`/${username}/posts`);
          }}
        >
          <DeleteButton />
        </form>
        <DialogClose className='rounded-full w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 transition-colors'>
          Cancel
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

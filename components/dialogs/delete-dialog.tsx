'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui/dialog';
import DeleteButton from '../delete-button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useDeletePost } from '@/hooks/use-delete-post';
import { useDeleteReply } from '@/hooks/use-delete-reply';
import { useDialog } from '@/hooks/use-dialog';

export default function DeleteDialog() {
  const { dialogs, closeDialog } = useDialog();
  const router = useRouter();
  const { data } = useDialog();
  const forReply = data.deleteReply?.forReply;
  const deletePostMutation = useDeletePost({
    closePostDialog: () => closeDialog('deletePost'),
    router,
    postId: data.deletePost?.postId,
  });

  const deleteReplyMutation = useDeleteReply({
    closeReplyDialog: () => closeDialog('deleteReply'),
    replyId: data.deleteReply?.replyId,
    postId: data.deleteReply?.postId,
  });

  useEffect(() => {
    if (deletePostMutation.isError) {
      toast.error(deletePostMutation.error.message);
    }

    if (deleteReplyMutation.isError) {
      toast.error(deleteReplyMutation.error.message);
    }
  }, [deletePostMutation, deleteReplyMutation]);

  return (
    <Dialog
      open={forReply ? dialogs.deleteReply : dialogs.deletePost}
      onOpenChange={
        forReply
          ? () => closeDialog('deleteReply')
          : () => closeDialog('deletePost')
      }
    >
      <DialogContent className='w-72'>
        <DialogTitle className='text-xl'>
          Delete {forReply ? 'reply' : 'post'}?
        </DialogTitle>
        <DialogDescription className='text-muted-foreground'>
          This can’t be undone and it will be removed from your profile, the
          timeline of any accounts that follow you, and from search results.
        </DialogDescription>
        {/* <form
        action={() => {
          if (forReply) {
            deleteReply(postId).then(() => setOpen(false));
          } else {
            deletePost(postId).then(() => setOpen(false));
            router.push('/home');
          }
        }}
        >
        </form> */}

        <DeleteButton
          isPending={
            deletePostMutation.isPending || deleteReplyMutation.isPending
          }
          remove={() => {
            if (forReply) {
              deleteReplyMutation.mutate();
            } else {
              deletePostMutation.mutate();
            }
          }}
        />
        <DialogClose className='text-sm font-bold rounded-full w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 transition-colors'>
          Cancel
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

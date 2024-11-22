'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useDialog } from '@/hooks/use-dialog';
import PostForm from '../post-form';
import DialogHide from '../dialog-hide';

export default function PostDialog() {
  const { closeDialog, dialogs, data } = useDialog();

  return (
    <Dialog
      open={dialogs.createPost}
      onOpenChange={() => closeDialog('createPost')}
    >
      <DialogContent className='p-4'>
        <section className='flex justify-end'>
          <DialogHide isForPost />
        </section>
        <PostForm
          isForDialog
          isForPost
          profileImage={data.createPost?.profileImage}
          userId={data.createPost?.userId}
          closeCreateDialog={() => closeDialog('createPost')}
          closeReplyDialog={() => closeDialog('replyToPost')}
        />
      </DialogContent>
    </Dialog>
  );
}

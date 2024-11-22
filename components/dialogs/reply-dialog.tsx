'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import PostForm from '../post-form';
import DialogHide from '../dialog-hide';
import { Skeleton } from '../ui/skeleton';
import { useDialog } from '@/hooks/use-dialog';

export default function ReplyDialog() {
  const { data, closeDialog, dialogs } = useDialog();

  return (
    <Dialog
      open={dialogs.replyToPost}
      onOpenChange={() => closeDialog('replyToPost')}
    >
      <DialogContent className='flex flex-col'>
        <div className='flex gap-2'>
          <div>
            <Avatar className='w-10 h-10'>
              <AvatarImage
                src={data.replyToPost?.authorProfilePic}
                alt='profile picture'
              />
              <AvatarFallback className='bg-primary/10'>
                <Skeleton className='rounded-full' />
              </AvatarFallback>
            </Avatar>

            <section className='w-[1.5px] bg-primary/25 h-full mx-auto'></section>
          </div>

          <div className='flex flex-col'>
            <div className='flex text-sm gap-1.5 items-center'>
              <h2 className='font-bold truncate max-w-32 xl:max-w-52'>
                {data.replyToPost?.name}
              </h2>
              <h2 className='text-muted-foreground mb-0.5 truncate max-w-32 xl:max-w-52'>
                @{data.replyToPost?.username}
              </h2>
              <span className='text-muted-foreground mb-0.5'>·</span>
              <span className='text-muted-foreground mb-0.5 min-w-fit'>
                {data.replyToPost?.createdAt}
              </span>
            </div>
            <p>{data.replyToPost?.text}</p>
          </div>
        </div>

        <PostForm
          isForDialog
          isForReply
          postId={data.replyToPost?.postId}
          profileImage={data.replyToPost?.myProfilePic}
          username={data.replyToPost?.username}
          userId={data.replyToPost?.currentUserId}
          closeCreateDialog={() => closeDialog('createPost')}
          closeReplyDialog={() => closeDialog('replyToPost')}
        />

        <DialogHide />
      </DialogContent>
    </Dialog>
  );
}

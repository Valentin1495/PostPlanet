'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MouseEvent, ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import PostForm from './post-form';
import DialogHide from './dialog-hide';

type ReplyDialogProps = {
  children: ReactNode;
  handleClick: (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  postId: string;
  username: string;
  name: string;
  text: string | null;
  createdAt: string;
  profileImage: string;
  myProfilePic?: string;
  userId: string;
};

export default function ReplyDialog({
  children,
  handleClick,
  postId,
  username,
  name,
  text,
  createdAt,
  profileImage,
  myProfilePic,
  userId,
}: ReplyDialogProps) {
  return (
    <Dialog>
      <DialogTrigger onClick={handleClick}>{children}</DialogTrigger>
      <DialogContent className='flex flex-col'>
        <div className='flex gap-2'>
          <div>
            <Avatar className='w-10 h-10'>
              <AvatarImage src={profileImage} alt='profile picture' />
              <AvatarFallback className='bg-primary/10'>
                <Skeleton className='rounded-full' />
              </AvatarFallback>
            </Avatar>

            <section className='w-[1.5px] bg-primary/25 h-full mx-auto'></section>
          </div>

          <div className='flex flex-col'>
            <div className='flex text-sm gap-1.5 items-center'>
              <h2 className='font-bold truncate max-w-32 xl:max-w-52'>
                {name}
              </h2>
              <h2 className='text-muted-foreground mb-0.5 truncate max-w-32 xl:max-w-52'>
                @{username}
              </h2>
              <span className='text-muted-foreground mb-0.5'>·</span>
              <span className='text-muted-foreground mb-0.5 min-w-fit'>
                {createdAt}
              </span>
            </div>
            <p>{text}</p>
          </div>
        </div>

        <PostForm
          isForDialog
          postId={postId}
          profileImage={myProfilePic}
          username={username}
          userId={userId}
        />

        <DialogHide />
      </DialogContent>
    </Dialog>
  );
}

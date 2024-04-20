'use client';

import TextareaAutosize from 'react-textarea-autosize';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { X } from 'lucide-react';
import { createPost } from '@/actions/post.actions';
import { Input } from './ui/input';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { replyToPost } from '@/actions/reply.action';
import UploadBtn from './upload-btn';

const initialState = {
  message: '',
};

type PostFormPorps = {
  profileImage?: string;
  username?: string;
  isForPost?: boolean;
  postId?: string;
  isForDialog?: boolean;
  isForReply?: boolean;
  userId: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

export default function PostForm({
  profileImage,
  username,
  postId,
  isForPost,
  isForDialog,
  isForReply,
  userId,
  setOpen,
}: PostFormPorps) {
  const [text, setText] = useState('');
  const [mounted, setMounted] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [state, postAction] = useFormState(
    isForReply ? replyToPost : createPost,
    initialState
  );
  const { message } = state;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (message === 'Success') {
      setText('');
      setFileUrl('');
      setOpen && setOpen(false);
    } else if (message) {
      toast(message);
    }
  }, [message, setOpen]);

  return (
    <form
      action={postAction}
      className={cn(
        'space-y-2',
        !isForDialog && 'border-b',
        isForPost && 'p-3',
        isForReply && !isForDialog && 'pb-3 pt-1.5 px-3'
      )}
    >
      <section className='flex gap-2'>
        {isForDialog ? (
          <Avatar className='w-10 h-10'>
            <AvatarImage src={profileImage} alt='profile picture' />
            <AvatarFallback className='bg-primary/10'>
              <Skeleton className='rounded-full' />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Link href={`/${username}/posts`}>
            <Avatar className='w-10 h-10 darker'>
              <AvatarImage src={profileImage} alt='profile picture' />
              <AvatarFallback className='bg-primary/10'>
                <Skeleton className='rounded-full' />
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
        {mounted && (
          <TextareaAutosize
            className='resize-none w-full outline-none my-auto text-xl hide-scrollbar'
            minRows={isForDialog ? 3 : 1}
            placeholder={
              isForReply ? 'Post your reply...' : 'What is happening?!'
            }
            autoFocus
            id='text'
            name='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}
      </section>
      {fileUrl && (
        <section className='relative ml-10 aspect-video rounded-xl overflow-hidden'>
          <Image
            src={fileUrl}
            alt='image to post'
            fill
            className='object-cover'
          />
          <article
            onClick={() => setFileUrl('')}
            className='absolute top-2 right-2 bg-black p-1 rounded-full hover:opacity-70 cursor-pointer transition'
          >
            <X color='white' size={20} />
          </article>
        </section>
      )}
      <div className='justify-end flex items-center gap-2'>
        <UploadBtn setFileUrl={setFileUrl} />
        <Input className='hidden' name='fileUrl' value={fileUrl} readOnly />
        {!isForPost && (
          <Input className='hidden' name='postId' value={postId} readOnly />
        )}
        {isForDialog && (
          <Input
            className='hidden'
            name='isForDialog'
            value={String(isForDialog)}
            readOnly
          />
        )}
        <Input className='hidden' name='userId' value={userId} readOnly />
        <SubmitButton text={text} file={fileUrl} isForReply={isForReply} />
      </div>
    </form>
  );
}

type SubmitButtonProps = {
  text: string;
  file: string;
  isForReply?: boolean;
};

function SubmitButton({ text, file, isForReply }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      className='rounded-full h-8 w-[66px] text-base font-semibold'
      disabled={(!text.trim() && !file) || pending}
    >
      {isForReply ? (
        pending ? (
          <span className='pending'>
            <span></span>
            <span></span>
            <span></span>
          </span>
        ) : (
          'Reply'
        )
      ) : pending ? (
        <span className='pending'>
          <span></span>
          <span></span>
          <span></span>
        </span>
      ) : (
        'Post'
      )}
    </Button>
  );
}

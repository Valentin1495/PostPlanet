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
import { Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { replyToPost } from '@/actions/reply.action';
import UploadPostPic from './upload/upload-post-pic';
import { FileType } from '@/lib/types';

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
  const [file, setFile] = useState<FileType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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
      setFile(null);
      if (!setOpen) return;
      setOpen(false);
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
          profileImage?.includes('#') ? (
            <section
              style={{
                backgroundColor: profileImage,
              }}
              className='rounded-full size-10'
            />
          ) : (
            <Avatar className='size-10'>
              <AvatarImage src={profileImage} alt='profile picture' />
              <AvatarFallback className='bg-primary/10'>
                <Skeleton className='rounded-full' />
              </AvatarFallback>
            </Avatar>
          )
        ) : (
          <Link href={`/${username}/posts`}>
            {profileImage?.includes('#') ? (
              <section
                style={{
                  backgroundColor: profileImage,
                }}
                className='rounded-full size-10 darker'
              />
            ) : (
              <Avatar className='size-10 darker'>
                <AvatarImage src={profileImage} alt='profile picture' />
                <AvatarFallback className='bg-primary/10'>
                  <Skeleton className='rounded-full' />
                </AvatarFallback>
              </Avatar>
            )}
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

      {file && (
        <section className='relative ml-10 aspect-video rounded-xl overflow-hidden'>
          <Image
            src={file.url}
            alt='image to post'
            fill
            className='object-cover'
          />
          <span
            onClick={() => setFile(null)}
            className='absolute top-2 right-2 bg-black p-1 rounded-full hover:opacity-70 cursor-pointer transition'
          >
            <X color='white' size={20} />
          </span>

          <Input
            className='hidden'
            name='fileUrl'
            value={file?.url}
            readOnly
            type='hidden'
          />
        </section>
      )}

      <div className='justify-end flex items-center gap-2'>
        <button
          type='button'
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          className='size-8 rounded-full hover:bg-primary/20 transition-colors center'
        >
          <ImageIcon size='18' className='text-primary' />
        </button>

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

        <Input
          className='hidden'
          name='userId'
          value={userId}
          readOnly
          type='hidden'
        />

        <SubmitButton text={text} fileUrl={file?.url} isForReply={isForReply} />
      </div>
      {isOpen && <UploadPostPic handleFile={setFile} setIsOpen={setIsOpen} />}
    </form>
  );
}

type SubmitButtonProps = {
  text: string;
  fileUrl?: string;
  isForReply?: boolean;
};

function SubmitButton({ text, fileUrl, isForReply }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      className='rounded-full h-8 w-[66px] text-base font-semibold'
      disabled={(!text.trim() && !fileUrl) || pending}
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

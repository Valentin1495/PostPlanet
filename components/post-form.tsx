'use client';

import TextareaAutosize from 'react-textarea-autosize';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { Input } from './ui/input';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import UploadPostPic from './upload/upload-post-pic';
import { FileType } from '@/lib/types';
import { useCreatePost } from '@/hooks/use-create-post';
import { useReplyToPost } from '@/hooks/use-reply-to-post';

type PostFormPorps = {
  profileImage?: string;
  username?: string;
  isForPost?: boolean;
  postId?: string;
  isForDialog?: boolean;
  isForReply?: boolean;
  userId: string;
  closeCreateDialog?: () => void;
  closeReplyDialog?: () => void;
};

export default function PostForm({
  profileImage,
  username,
  postId,
  userId,
  isForPost,
  isForDialog,
  isForReply,
  closeCreateDialog,
  closeReplyDialog,
}: PostFormPorps) {
  const [text, setText] = useState('');
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<FileType | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const createPostFormData = new FormData();
  createPostFormData.append('text', text);

  if (file) {
    createPostFormData.append('fileUrl', file.url);
  }
  createPostFormData.append('authorId', userId);
  const createPostMutation = useCreatePost({
    setText,
    textAreaRef,
    formData: createPostFormData,
    userId,
    closeCreateDialog,
    setFile,
  });

  const replyToPostFormData = new FormData();
  replyToPostFormData.append('text', text);
  replyToPostFormData.append('userId', userId);

  if (postId) {
    replyToPostFormData.append('postId', postId);
  }

  if (file) {
    replyToPostFormData.append('fileUrl', file.url);
  }

  const replyToPostMutation = useReplyToPost({
    formData: replyToPostFormData,
    postId,
    userId,
    isForDialog,
    closeReplyDialog,
    setText,
    setFile,
    textAreaRef,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isForPost) {
          createPostMutation.mutate();
        } else {
          replyToPostMutation.mutate();
        }
      }}
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
            ref={textAreaRef}
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
        <section className='relative w-full min-h-96 rounded-xl overflow-hidden'>
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

        <SubmitButton
          text={text}
          isPending={
            createPostMutation.isPending || replyToPostMutation.isPending
          }
          fileUrl={file?.url}
          isForReply={isForReply}
        />
      </div>
      {isOpen && <UploadPostPic handleFile={setFile} setIsOpen={setIsOpen} />}
    </form>
  );
}

type SubmitButtonProps = {
  text: string;
  isPending: boolean;
  fileUrl?: string;
  isForReply?: boolean;
};

function SubmitButton({
  text,
  isPending,
  fileUrl,
  isForReply,
}: SubmitButtonProps) {
  return (
    <Button
      className='rounded-full h-8 w-[66px] text-base font-semibold'
      disabled={(!text.trim() && !fileUrl) || isPending}
    >
      {isForReply ? (
        isPending ? (
          <span className='pending'>
            <span></span>
            <span></span>
            <span></span>
          </span>
        ) : (
          'Reply'
        )
      ) : isPending ? (
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

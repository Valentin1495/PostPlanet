'use client';

import TextareaAutosize from 'react-textarea-autosize';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { ImagePlus, X } from 'lucide-react';
import { createPost } from '@/actions/post.actions';
import { Input } from './ui/input';
import Image from 'next/image';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { replyToPost } from '@/actions/reply.action';
import { UploadButton } from '@/lib/uploadthing';
import UploadBtn from './upload-btn';

const initialState = {
  message: '',
};

type PostFormPorps = {
  profileImage?: string;
  username?: string;
  isForPost: boolean;
  postId?: string;
};

export default function PostForm({
  profileImage,
  username,
  isForPost,
  postId,
}: PostFormPorps) {
  const [text, setText] = useState('');
  const [mounted, setMounted] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [state, formAction] = useFormState(
    isForPost ? createPost : replyToPost,
    initialState
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (state.message) {
      toast(state.message);
    } else {
      setText('');
      setFileUrl('');
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className={cn(
        'border-b space-y-2',
        isForPost ? 'p-3' : 'pb-3 pt-1.5 px-3'
      )}
    >
      <section className='flex gap-2'>
        <Link href={`/${username}`}>
          <Avatar className='w-10 h-10 darker'>
            <AvatarImage src={profileImage} alt='profile picture' />
            <AvatarFallback className='bg-primary/10'>
              <Skeleton className='rounded-full' />
            </AvatarFallback>
          </Avatar>
        </Link>
        {mounted && (
          <TextareaAutosize
            className='resize-none w-full outline-none my-auto text-lg hide-scrollbar'
            minRows={1}
            placeholder={
              isForPost ? 'What is happening?!' : 'Post your reply...'
            }
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
        <Input className='hidden' name='fileUrl' value={fileUrl} />
        {!isForPost && (
          <Input className='hidden' name='postId' value={postId} readOnly />
        )}
        <SubmitButton text={text} file={fileUrl} isForPost={isForPost} />
      </div>
    </form>
  );
}

type SubmitButtonProps = {
  text: string;
  file: string;
  isForPost: boolean;
};

function SubmitButton({ text, file, isForPost }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      className='rounded-full h-8'
      disabled={(!text.trim() && !file) || pending}
    >
      {isForPost
        ? pending
          ? 'Posting...'
          : 'Post'
        : pending
        ? 'Replying...'
        : 'Reply'}
    </Button>
  );
}

'use client';

import TextareaAutosize from 'react-textarea-autosize';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PostForm({
  profilePic,
}: {
  profilePic: string | undefined;
}) {
  const [text, setText] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <form className='border-b-2 border-b-secondary p-3'>
      <section className='flex gap-2'>
        <Link href='/profile'>
          <Avatar className='w-10 h-10 darker'>
            <AvatarImage src={profilePic} alt='profile picture' />
            <AvatarFallback className='bg-primary/10'>
              <Skeleton className='rounded-full' />
            </AvatarFallback>
          </Avatar>
        </Link>
        {mounted && (
          <TextareaAutosize
            className='resize-none w-full outline-none my-auto'
            minRows={1}
            placeholder='What is happening?!'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}
      </section>
      <div className='text-right mt-2'>
        <Button className='rounded-full h-8' disabled={!text.trim()}>
          Post
        </Button>
      </div>
    </form>
  );
}

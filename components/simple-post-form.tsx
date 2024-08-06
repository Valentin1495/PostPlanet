'use client';

import { cn } from '@/lib/utils';
import { CircleUserRound, ImagePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import SignUpDialog from './sign-up-dialog';

export default function SimplePostForm() {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className='border-b p-3'>
      {mounted && (
        <div className='flex gap-2'>
          <CircleUserRound size={40} />
          <TextareaAutosize
            className='resize-none w-full outline-none my-auto text-xl hide-scrollbar'
            minRows={1}
            placeholder='What is happening?!'
            autoFocus
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </div>
      )}

      <div className='flex justify-end items-center gap-2'>
        <SignUpDialog>
          <div className='cursor-pointer bg-secondary hover:bg-secondary/80 focus-within:ring-primary font-semibold after:bg-primary/10 rounded-full p-3'>
            <ImagePlus
              size={18}
              className='bg-secondary hover:bg-secondary/80 focus-within:ring-primary font-semibold after:bg-primary/10 text-primary'
            />
          </div>
        </SignUpDialog>
        <SignUpDialog>
          <div
            className={cn(
              'rounded-full h-8 w-[66px] font-semibold transition-colors bg-primary text-primary-foreground hover:bg-primary/90 text-center leading-8 cursor-pointer',
              !text && 'opacity-50'
            )}
          >
            Post
          </div>
        </SignUpDialog>
      </div>
    </div>
  );
}

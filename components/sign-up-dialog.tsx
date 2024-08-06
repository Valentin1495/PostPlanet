'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ReactNode } from 'react';
import DialogHide from './dialog-hide';
import Image from 'next/image';
import { SignUpButton } from '@clerk/nextjs';

type SignInDialogProps = { children: ReactNode };

export default function SignUpDialog({ children }: SignInDialogProps) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='p-4'>
        <section className='flex justify-end'>
          <DialogHide />
        </section>
        <div className='flex flex-col items-center gap-5'>
          <Image src='/logo.svg' alt='logo' width={100} height={100} />

          <SignUpButton>
            <span className='bg-primary font-bold text-lg rounded-full h-11 px-8 leading-[44px] cursor-pointer text-primary-foreground hover:bg-primary/90 transition-colors'>
              Sign up now
            </span>
          </SignUpButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

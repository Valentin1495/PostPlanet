'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

type SearchTabsProps = {
  f: string;
  q: string;
};

export default function SearchTabs({ f, q }: SearchTabsProps) {
  const isUserTab = f === 'user';

  return (
    <div className='flex h-12'>
      <Link
        className={cn(
          'relative border-b w-1/2 text-center hover:bg-secondary transition-colors duration-300',
          !isUserTab ? 'font-bold' : 'font-medium'
        )}
        href={`?q=${q}`}
      >
        <span className='text-sm absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
          Posts
        </span>
        {!isUserTab && (
          <div className='h-1 w-10 bg-primary absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full'></div>
        )}
      </Link>
      <Link
        className={cn(
          'relative border-b w-1/2 text-center hover:bg-secondary transition-colors duration-300',
          isUserTab ? 'font-bold' : 'font-medium'
        )}
        href={`?q=${q}&f=user`}
      >
        <span className='text-sm absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
          People
        </span>
        {isUserTab && (
          <div className='h-1 w-12 bg-primary absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full'></div>
        )}
      </Link>
    </div>
  );
}

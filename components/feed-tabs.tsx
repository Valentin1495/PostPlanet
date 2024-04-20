'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

type FeedTabsProps = {
  f: string;
};

export default function FeedTabs({ f }: FeedTabsProps) {
  const isFollowingTab = f === 'following';

  return (
    <div className='flex h-12 sticky top-0 z-10 backdrop-blur-md'>
      <Link
        className={cn(
          'relative w-1/2 text-center hover:bg-secondary transition-colors duration-300',
          !isFollowingTab ? 'font-bold' : 'font-medium'
        )}
        href='/home'
      >
        <span className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
          For You
        </span>
        {!isFollowingTab && (
          <div className='h-1 w-16 bg-primary absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full'></div>
        )}
      </Link>
      <Link
        className={cn(
          'relative w-1/2 text-center hover:bg-secondary transition-colors duration-300',
          isFollowingTab ? 'font-bold' : 'font-medium'
        )}
        href='/home?f=following'
      >
        <span className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
          Following
        </span>
        {isFollowingTab && (
          <div className='h-1 w-20 bg-primary absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full'></div>
        )}
      </Link>
    </div>
  );
}

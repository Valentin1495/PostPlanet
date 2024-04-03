'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FeedTab() {
  const pathname = usePathname();
  const forYouPath = '/home/for-you';
  const forYouActive = pathname === forYouPath;
  const followingPath = '/home/following';
  const followingActive = pathname === followingPath;

  return (
    <div className='flex h-12'>
      <Link
        className={cn(
          'relative border-b-2 w-1/2 text-center hover:bg-secondary transition-colors duration-300',
          forYouActive ? 'font-bold' : 'font-medium'
        )}
        href={forYouPath}
      >
        <span className='text-xs absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
          For you
        </span>
        {forYouActive && (
          <div className='h-1 w-12 bg-primary absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full'></div>
        )}
      </Link>
      <Link
        className={cn(
          'relative border-b-2 w-1/2 text-center hover:bg-secondary transition-colors duration-300',
          followingActive ? 'font-bold' : 'font-medium'
        )}
        href={followingPath}
      >
        <span className='text-xs absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
          Following
        </span>
        {followingActive && (
          <div className='h-1 w-14 bg-primary absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full'></div>
        )}
      </Link>
    </div>
  );
}

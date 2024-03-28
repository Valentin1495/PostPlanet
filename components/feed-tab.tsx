import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function FeedTab({ feed }: { feed: string }) {
  return (
    <div className='flex h-12'>
      <Link
        className={cn(
          'relative border-b-2 w-1/2 text-center hover:bg-secondary transition-colors duration-300',
          feed === 'for-you' ? 'font-bold' : 'font-medium'
        )}
        href='?feed=for-you'
      >
        <span className='text-xs absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
          For you
        </span>
        {feed === 'for-you' && (
          <div className='h-1 w-12 bg-primary absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full'></div>
        )}
      </Link>
      <Link
        className={cn(
          'relative border-b-2 w-1/2 text-center hover:bg-secondary transition-colors duration-300',
          feed === 'following' ? 'font-bold' : 'font-medium'
        )}
        href='?feed=following'
      >
        <span className='text-xs absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'>
          Following
        </span>
        {feed === 'following' && (
          <div className='h-1 w-14 bg-primary absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full'></div>
        )}
      </Link>
    </div>
  );
}

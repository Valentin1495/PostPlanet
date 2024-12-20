'use client';

import { scrollToTop } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type HeaderProps = {
  postCount?: number;
  name?: string;
  isPostPage?: boolean;
  isActivitiesPage?: boolean;
  isHomePage?: boolean;
};

export default function Header({
  postCount,
  name,
  isPostPage,
  isActivitiesPage,
  isHomePage,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header
      onClick={scrollToTop}
      className='flex items-center gap-3 sticky top-0 px-3 py-1.5 cursor-pointer backdrop-blur-md z-10'
    >
      {!isHomePage && (
        <button
          className='hover:bg-secondary transition rounded-full p-1.5'
          onClick={() => router.back()}
        >
          <ChevronLeft />
        </button>
      )}
      <section>
        {isPostPage ? (
          <h1 className='text-xl font-semibold'>Post</h1>
        ) : isHomePage ? (
          <h1 className='text-xl font-semibold'>For You</h1>
        ) : isActivitiesPage ? (
          <h1 className='text-xl font-semibold'>Activities</h1>
        ) : (
          <>
            <h1 className='text-xl font-semibold'>{name}</h1>
            <h3 className='text-sm text-muted-foreground'>
              {postCount} {postCount === 1 ? 'post' : 'posts'}
            </h3>
          </>
        )}
      </section>
    </header>
  );
}

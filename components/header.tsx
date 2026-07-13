'use client';

import { scrollToTop } from '@/lib/utils';

type HeaderProps = {
  postCount?: number;
  name?: string;
  isPostPage?: boolean;
  isActivitiesPage?: boolean;
  isFollowListPage?: boolean;
};

export default function Header({
  postCount,
  name,
  isPostPage,
  isActivitiesPage,
  isFollowListPage,
}: HeaderProps) {
  return (
    <header
      onClick={scrollToTop}
      className='flex items-center gap-3 sticky top-0 px-3 py-1.5 cursor-pointer backdrop-blur-md z-10'
    >
      <section>
        {isPostPage ? (
          <h1 className='text-xl font-semibold'>Post</h1>
        ) : isActivitiesPage ? (
          <h1 className='text-xl font-semibold'>Activities</h1>
        ) : isFollowListPage ? (
          <h1 className='text-xl font-semibold'>{name}</h1>
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

'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useFollowList, FollowListTab } from '@/hooks/use-follow-list';
import FollowListUser from './follow-list-user';
import { User } from '@/lib/types';

type FollowListViewProps = {
  username: string;
  userId: string;
  currentUserId: string;
  currentUser?: User | null;
  tab: FollowListTab;
};

export default function FollowListView({
  username,
  userId,
  currentUserId,
  currentUser,
  tab,
}: FollowListViewProps) {
  const { data, error, isFetchingNextPage, ref, status } = useFollowList(
    userId,
    tab
  );
  const hasResults = data?.pages.some((page) => page.length > 0);

  return (
    <div>
      <div className='flex border-b'>
        {(['followers', 'following'] as FollowListTab[]).map((t) => (
          <Link
            key={t}
            href={`/${username}/${t}`}
            className={cn(
              'relative flex-1 py-3 text-center font-medium hover:bg-secondary transition-colors capitalize',
              tab === t && 'font-bold'
            )}
          >
            {t}
            {tab === t && (
              <div className='h-1 w-14 bg-primary absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full' />
            )}
          </Link>
        ))}
      </div>

      {status === 'pending' ? (
        <div className='text-center mt-3'>
          <span className='loading'></span>
        </div>
      ) : status === 'error' ? (
        <p className='text-destructive text-center mt-10'>
          Error: {error!.message}
        </p>
      ) : !hasResults ? (
        <p className='text-center mt-10 text-muted-foreground'>
          {tab === 'followers'
            ? 'No followers yet.'
            : 'Not following anyone yet.'}
        </p>
      ) : (
        data!.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((user: User) => (
              <FollowListUser
                key={user.id}
                {...user}
                currentUserId={currentUserId}
                currentUser={currentUser}
              />
            ))}
          </Fragment>
        ))
      )}

      {isFetchingNextPage && (
        <div className='text-center mt-3'>
          <span className='loading'></span>
        </div>
      )}

      <div ref={ref} className='h-20' />
    </div>
  );
}

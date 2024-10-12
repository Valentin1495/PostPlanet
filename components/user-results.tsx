'use client';

import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import SearchBar from './search-bar';
import SearchTabs from './search-tabs';
import { Fragment } from 'react';
import { User } from '@prisma/client';
import SingleUser from './single-user';

type UserResultsProps = {
  q?: string;
  f: string;
};

const LIMIT = 20;

export default function UserResults({ q, f }: UserResultsProps) {
  const { data, error, isFetchingNextPage, ref, status } = useInfiniteScroll(
    ['userResults', q as string],
    `/api/searchPeople?q=${q}&limit=${LIMIT}`
  );
  const hasResults = data?.pages[0].length;

  return (
    <main className='min-h-screen'>
      <div className='bg-background z-10 sticky top-0 pt-5'>
        <SearchBar />
        <SearchTabs q={q as string} f={f} />
      </div>

      {status === 'pending' ? (
        <div className='text-center'>
          <span className='loading mt-3'></span>
        </div>
      ) : status === 'error' ? (
        <p className='text-destructive text-center'>Error: {error!.message}</p>
      ) : !hasResults ? (
        <p className='text-lg text-center mt-10'>No results.</p>
      ) : (
        data!.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((user: User) => (
              <SingleUser key={user.id} {...user} />
            ))}
          </Fragment>
        ))
      )}

      {isFetchingNextPage && (
        <div className='text-center'>
          <span className='loading mt-3'></span>
        </div>
      )}

      <div ref={ref} className='h-40' />
    </main>
  );
}

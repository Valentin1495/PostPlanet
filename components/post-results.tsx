'use client';

import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import SearchBar from './search-bar';
import SearchTabs from './search-tabs';
import { Fragment } from 'react';
import { Post as PostType } from '@prisma/client';
import Post from './post';

type PostResultsProps = {
  q?: string;
  f?: string;
  myUserId: string;
  myProfileImage: string;
};

const LIMIT = 10;

export default function PostResults({
  q,
  f,
  myUserId,
  myProfileImage,
}: PostResultsProps) {
  const { data, error, isFetchingNextPage, ref, status } = useInfiniteScroll(
    ['postResults', q as string],
    `/api/searchPosts?q=${q}&limit=${LIMIT}`
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
            {page.map((post: PostType) => (
              <Post
                key={post.id}
                {...post}
                currentUserId={myUserId}
                myProfilePic={myProfileImage}
              />
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

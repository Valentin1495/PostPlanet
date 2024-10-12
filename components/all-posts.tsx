'use client';

import { Fragment } from 'react';
import Post from './post';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Post as PostType } from '@prisma/client';

type AllPostsProps = {
  currentUserId: string;
  myProfileImage: string;
};

const LIMIT = 10;

export default function AllPosts({
  currentUserId,
  myProfileImage,
}: AllPostsProps) {
  const { data, error, isFetchingNextPage, ref, status } = useInfiniteScroll(
    ['allPosts'],
    `/api/posts?limit=${LIMIT}`
  );

  return (
    <div>
      {status === 'pending' ? (
        <div className='text-center'>
          <span className='loading mt-3'></span>
        </div>
      ) : status === 'error' ? (
        <p className='text-destructive text-center mt-10'>
          Error: {error!.message}
        </p>
      ) : (
        data!.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((post: PostType) => (
              <Post
                {...post}
                key={post.id}
                currentUserId={currentUserId}
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
    </div>
  );
}

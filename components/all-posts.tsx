'use client';

import { Fragment } from 'react';
import Post from './post';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Post as PostType, User } from '@/lib/types';

type AllPostsProps = {
  currentUser: User;
};

const LIMIT = 10;

export default function AllPosts({ currentUser }: AllPostsProps) {
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
                currentUserId={currentUser.id}
                currentUser={currentUser}
                myProfilePic={currentUser.profileImage}
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

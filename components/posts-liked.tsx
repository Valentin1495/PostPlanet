'use client';

import { Fragment } from 'react';
import Post from './post';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Post as PostType } from '@prisma/client';

type PostsLikedProps = {
  userId: string;
  currentUserId: string;
  myProfilePic: string;
  isProfilePage: boolean;
};

const LIMIT = 10;

export default function PostsLiked({
  userId,
  currentUserId,
  myProfilePic,
  isProfilePage,
}: PostsLikedProps) {
  const { data, error, isFetchingNextPage, ref, status } = useInfiniteScroll(
    ['postsLiked', userId],
    `/api/postsLiked?userId=${userId}&limit=${LIMIT}`
  );

  const hasPostsLiked = data?.pages[0].length;

  return (
    <div>
      {status === 'pending' ? (
        <div className='text-center'>
          <span className='loading mt-3'></span>
        </div>
      ) : status === 'error' ? (
        <span className='text-destructive text-center mt-10'>
          Error: {error!.message}
        </span>
      ) : hasPostsLiked ? (
        data.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((post: PostType) => (
              <Post
                {...post}
                key={post.id}
                currentUserId={currentUserId}
                myProfilePic={myProfilePic}
                isProfilePage={isProfilePage}
              />
            ))}
          </Fragment>
        ))
      ) : (
        <p className='text-center mt-10'>No posts you liked.</p>
      )}

      <div ref={ref} className='h-40' />

      {isFetchingNextPage && (
        <div className='text-center'>
          <span className='loading mt-3'></span>
        </div>
      )}
    </div>
  );
}

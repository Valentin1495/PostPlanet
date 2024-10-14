'use client';

import Post from './post';
import { Fragment } from 'react';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Post as PostType } from '@prisma/client';

type UserPostsProps = {
  userId: string;
  currentUserId: string;
  profileImage: string;
};

const LIMIT = 10;

export default function UserPosts({
  userId,
  currentUserId,
  profileImage,
}: UserPostsProps) {
  const { data, error, isFetchingNextPage, ref, status } = useInfiniteScroll(
    ['userPosts', userId],
    `/api/userPosts?userId=${userId}&limit=${LIMIT}`
  );

  const hasPosts = data?.pages[0].length;

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
      ) : hasPosts ? (
        data.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((post: PostType) => (
              <Post
                {...post}
                key={post.id}
                currentUserId={currentUserId}
                myProfilePic={profileImage}
                isProfilePage
              />
            ))}
          </Fragment>
        ))
      ) : (
        <p className='text-center mt-10'>No posts.</p>
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

'use client';

import { groupRepliesByPost } from '@/lib/utils';
import Post from './post';
import Reply from './reply';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Fragment } from 'react';

type RepliesByPostProps = {
  userId: string;
  profileImage: string;
  currentUserId: string;
};

const LIMIT = 10;

export default function RepliesByPost({
  userId,
  profileImage,
  currentUserId,
}: RepliesByPostProps) {
  const { data, error, isFetchingNextPage, ref, status } = useInfiniteScroll(
    ['repliesWithPost', userId],
    `/api/repliesWithPost/${userId}?limit=${LIMIT}`
  );

  const hasReplies = data?.pages[0].length;

  return (
    <div>
      {status === 'pending' ? (
        <div className='text-center'>
          <span className='loading mt-3'></span>
        </div>
      ) : status === 'error' ? (
        <p className='text-destructive text-center'>Error: {error!.message}</p>
      ) : !hasReplies ? (
        <p className='min-h-screen text-center mt-10'>No replies.</p>
      ) : (
        data!.pages.map((page, i) => {
          const repliesByPostId = groupRepliesByPost(page);

          return (
            <Fragment key={i}>
              {repliesByPostId.map(({ post, replies }) => (
                <Fragment key={post.id}>
                  <Post
                    {...post}
                    currentUserId={currentUserId}
                    myProfilePic={profileImage}
                    isProfilePage
                  />
                  {replies.map((reply, i) => {
                    return (
                      <Reply
                        key={reply.id}
                        {...reply}
                        currentUserId={currentUserId}
                        isLast={replies.length === i + 1}
                      />
                    );
                  })}
                </Fragment>
              ))}
            </Fragment>
          );
        })
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

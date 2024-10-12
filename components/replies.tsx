'use client';

import Reply from './reply';
import { Reply as SingleReply } from '@prisma/client';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Fragment } from 'react';

type RepliesProps = {
  postId: string;
  currentUserId: string;
};

const LIMIT = 10;

export default function Replies({ postId, currentUserId }: RepliesProps) {
  const { data, isFetchingNextPage, status, error, ref } = useInfiniteScroll(
    ['replies', postId],
    `/api/replies/${postId}?limit=${LIMIT}`
  );

  const hasReplies = data?.pages[0].length;

  return (
    <div>
      {status === 'pending' ? (
        <div className='text-center'>
          <span className='loading mt-3'></span>
        </div>
      ) : status === 'error' ? (
        <p className='text-destructive text-center mt-3'>
          Error: {error!.message}
        </p>
      ) : hasReplies ? (
        data.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((reply: SingleReply) => (
              <Reply key={reply.id} {...reply} currentUserId={currentUserId} />
            ))}
          </Fragment>
        ))
      ) : null}

      <div ref={ref} className='h-40' />

      {isFetchingNextPage && (
        <div className='text-center'>
          <span className='loading mt-3'></span>
        </div>
      )}
    </div>
  );
}

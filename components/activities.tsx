'use client';

import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Activity } from '@prisma/client';
import { Fragment } from 'react';
import SingleActivity from './single-activity';

type ActivitiesProps = {
  userId: string;
};

const LIMIT = 10;

export default function Activities({ userId }: ActivitiesProps) {
  const { data, error, isFetchingNextPage, ref, status } = useInfiniteScroll(
    ['activities', userId],
    `/api/activities?userId=${userId}&limit=${LIMIT}`
  );
  const hasActivities = data?.pages[0].length;

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
      ) : hasActivities ? (
        data.pages.map((page, i) => (
          <Fragment key={i}>
            {page.map((activity: Activity) => (
              <SingleActivity {...activity} key={activity.id} />
            ))}
          </Fragment>
        ))
      ) : (
        <p className='text-center mt-10'>No activities.</p>
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

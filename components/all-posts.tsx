'use client';

import { useMemo, useState } from 'react';
import { Fragment } from 'react';
import { useMutationState } from '@tanstack/react-query';
import Post from './post';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { Post as PostType, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import PostForm from './post-form';

type AllPostsProps = {
  currentUser: User;
};

type HomeFeedTab = 'for-you' | 'following';

const LIMIT = 10;

function FeedPosts({
  apiUrl,
  currentUser,
  emptyMessage,
  queryKey,
  refetchOnMount,
}: {
  apiUrl: string;
  currentUser: User;
  emptyMessage: string;
  queryKey: string[];
  refetchOnMount?: 'always' | boolean;
}) {
  const { data, error, isFetchingNextPage, ref, status } = useInfiniteScroll(
    queryKey,
    apiUrl,
    { refetchOnMount }
  );
  const hasPosts = data?.pages.some((page) => page.length > 0);

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
      ) : !hasPosts ? (
        <p className='text-center mt-10 text-muted-foreground'>
          {emptyMessage}
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

export default function AllPosts({ currentUser }: AllPostsProps) {
  const [activeTab, setActiveTab] = useState<HomeFeedTab>('for-you');
  const [followingFeedVersion, setFollowingFeedVersion] = useState(0);
  const followMutationStates = useMutationState({
    filters: { mutationKey: ['follow'] },
    select: (mutation) => ({
      status: mutation.state.status,
      submittedAt: mutation.state.submittedAt,
    }),
  });
  const unfollowMutationStates = useMutationState({
    filters: { mutationKey: ['unfollow'] },
    select: (mutation) => ({
      status: mutation.state.status,
      submittedAt: mutation.state.submittedAt,
    }),
  });
  const latestFollowChangeVersion = useMemo(() => {
    const latest = [...followMutationStates, ...unfollowMutationStates].reduce(
      (latestMutation, mutation) =>
        mutation.submittedAt > latestMutation.submittedAt
          ? mutation
          : latestMutation,
      { status: 'idle', submittedAt: 0 }
    );

    return `${latest.submittedAt}:${latest.status}`;
  }, [followMutationStates, unfollowMutationStates]);
  const tabs: { label: string; value: HomeFeedTab }[] = [
    { label: 'For You', value: 'for-you' },
    { label: 'Following', value: 'following' },
  ];

  const handleTabClick = (tab: HomeFeedTab) => {
    if (tab === 'following') {
      setFollowingFeedVersion((version) => version + 1);
    }

    setActiveTab(tab);
  };

  return (
    <div>
      <div className='sticky top-0 z-10 flex h-12 border-b backdrop-blur-md'>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type='button'
              onClick={() => handleTabClick(tab.value)}
              className={cn(
                'relative flex-1 text-center hover:bg-secondary transition-colors duration-300',
                isActive ? 'font-bold' : 'font-medium text-muted-foreground'
              )}
            >
              {tab.label}
              {isActive && (
                <div className='h-1 w-14 bg-primary absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full' />
              )}
            </button>
          );
        })}
      </div>

      {activeTab === 'for-you' && (
        <PostForm
          isForPost
          profileImage={currentUser.profileImage}
          username={currentUser.username}
          userId={currentUser.id}
        />
      )}

      {activeTab === 'for-you' ? (
        <FeedPosts
          key='for-you'
          apiUrl={`/api/posts?limit=${LIMIT}`}
          currentUser={currentUser}
          emptyMessage='No posts yet.'
          queryKey={['allPosts']}
        />
      ) : (
        <FeedPosts
          key='following'
          apiUrl={`/api/followingPosts?limit=${LIMIT}&refresh=${followingFeedVersion}-${latestFollowChangeVersion}`}
          currentUser={currentUser}
          emptyMessage='Posts from people you follow will appear here.'
          queryKey={[
            'followingPosts',
            currentUser.id,
            String(followingFeedVersion),
            latestFollowChangeVersion,
          ]}
          refetchOnMount='always'
        />
      )}
    </div>
  );
}

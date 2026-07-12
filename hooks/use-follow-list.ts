import { useInfiniteScroll } from './use-infinite-scroll';

export type FollowListTab = 'followers' | 'following';

const LIMIT = 20;

export const useFollowList = (userId: string, tab: FollowListTab) => {
  const apiUrl =
    tab === 'followers'
      ? `/api/followers?userId=${userId}&limit=${LIMIT}`
      : `/api/followingUsers?userId=${userId}&limit=${LIMIT}`;

  return useInfiniteScroll([tab, userId], apiUrl);
};

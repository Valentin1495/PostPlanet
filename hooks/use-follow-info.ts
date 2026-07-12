import { queryOptions, useQuery } from '@tanstack/react-query';

export type FollowInfo = {
  followersCount: number;
  followingCount: number;
  isFollowingUser: boolean;
};

export const useFollowInfoOptions = ({
  userId,
  currentUserId,
  enabled = true,
}: {
  userId: string;
  currentUserId: string;
  enabled?: boolean;
}) => {
  const followInfoOptions = queryOptions({
    queryKey: ['followInfo', userId, currentUserId],
    enabled,
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/followInfo/${userId}?currentUserId=${currentUserId}`,
        { signal }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch follow info');
      }

      return (await response.json()) as FollowInfo;
    },
  });

  return { followInfoOptions };
};

export const useFollowInfo = (
  followInfoOptions: ReturnType<typeof useFollowInfoOptions>['followInfoOptions']
) => {
  return useQuery(followInfoOptions);
};

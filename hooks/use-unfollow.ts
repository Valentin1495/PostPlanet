import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  applyFollowCacheUpdate,
  broadcastFollowCacheInvalidation,
  broadcastFollowCacheUpdate,
  cancelFollowCaches,
  FollowMutationVariables,
  invalidateFollowCaches,
  restoreFollowCaches,
  snapshotFollowCaches,
} from './use-follow-cache-sync';

export const useUnfollow = (followInfoOptions: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['unfollow'],
    mutationFn: async ({ userId, currentUserId }: FollowMutationVariables) => {
      const response = await fetch('/api/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentUserId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? 'Failed to unfollow the user');
      }

      return response.json();
    },
    onMutate: async (variables) => {
      await cancelFollowCaches(queryClient, variables);
      await queryClient.cancelQueries(followInfoOptions);

      const previousFollowCaches = snapshotFollowCaches(queryClient, variables);

      applyFollowCacheUpdate(queryClient, variables, 'unfollow');
      broadcastFollowCacheUpdate(variables, 'unfollow');

      return { previousFollowCaches };
    },
    onError: (_params1, _params2, context) => {
      restoreFollowCaches(queryClient, context?.previousFollowCaches);
      broadcastFollowCacheInvalidation(_params2);
    },
    onSettled: (_data, _error, variables) => {
      invalidateFollowCaches(queryClient, variables);
      broadcastFollowCacheInvalidation(variables);
    },
  });
};

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

export const useFollow = (followInfoOptions: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['follow'],
    mutationFn: async ({ userId, currentUserId }: FollowMutationVariables) => {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, currentUserId }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? 'Failed to follow the user');
      }

      return response.json();
    },
    onMutate: async (variables) => {
      await cancelFollowCaches(queryClient, variables);
      await queryClient.cancelQueries(followInfoOptions);

      const previousFollowCaches = snapshotFollowCaches(queryClient, variables);

      applyFollowCacheUpdate(queryClient, variables, 'follow');
      broadcastFollowCacheUpdate(variables, 'follow');

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

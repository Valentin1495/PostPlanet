import { PostInfo } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useLikePost = (userId: string, postInfoOptions: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      userId,
    }: {
      postId: string;
      userId: string;
    }) => {
      const response = await fetch('/api/likePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          userId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to like the post');
      }
      return response.json();
    },
    // When mutate is called:
    onMutate: async () => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(postInfoOptions);

      // Snapshot the previous value
      const previousPostInfo = queryClient.getQueryData(
        postInfoOptions.queryKey
      );

      // Optimistically update to the new value
      queryClient.setQueryData(
        postInfoOptions.queryKey,
        (old: PostInfo | undefined) => {
          if (!old) return;

          return {
            ...old,
            hasLiked: true,
            likesCount: old.likesCount! + 1,
          };
        }
      );

      // Return a context object with the snapshotted value
      return { previousPostInfo };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_params1, _params2, context) => {
      if (context?.previousPostInfo) {
        queryClient.setQueryData(
          postInfoOptions.queryKey,
          context.previousPostInfo
        );
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postInfoOptions.queryKey });
      queryClient.invalidateQueries({ queryKey: ['postsLiked', userId] });
    },
  });
};

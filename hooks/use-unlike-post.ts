import { PostInfo } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUnlikePost = (userId: string, postInfoOptions: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      userId,
    }: {
      postId: string;
      userId: string;
    }) => {
      const response = await fetch('/api/unlikePost', {
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
        throw new Error('Failed to unlike the post');
      }
      return response.json();
    },
    onMutate: async () => {
      await queryClient.cancelQueries(postInfoOptions);

      const previousPostInfo = queryClient.getQueryData(
        postInfoOptions.queryKey
      );

      queryClient.setQueryData(
        postInfoOptions.queryKey,
        (old: PostInfo | undefined) => {
          if (!old) return;

          return {
            ...old,
            hasLiked: false,
            likesCount: old.likesCount! - 1,
          };
        }
      );

      return { previousPostInfo };
    },
    onError: (_params1, _params2, context) => {
      if (context?.previousPostInfo) {
        queryClient.setQueryData(
          postInfoOptions.queryKey,
          context.previousPostInfo
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postInfoOptions.queryKey });
      queryClient.invalidateQueries({ queryKey: ['postsLiked', userId] });
    },
  });
};

import { QueryClient, useMutation } from '@tanstack/react-query';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Dispatch, SetStateAction } from 'react';

export const useDeletePost = ({
  queryClient,
  setOpen,
  router,
  postId,
}: {
  postId: string;
  queryClient: QueryClient;
  setOpen: Dispatch<SetStateAction<boolean>>;
  router: AppRouterInstance;
}) => {
  return useMutation({
    mutationFn: async () =>
      await fetch('/api/deletePost', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      setOpen(false);
      router.push('/home');
    },
  });
};

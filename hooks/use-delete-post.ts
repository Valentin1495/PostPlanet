import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export const useDeletePost = ({
  closePostDialog,
  router,
  postId,
}: {
  postId: string;
  closePostDialog: () => void;
  router: AppRouterInstance;
}) => {
  const queryClient = useQueryClient();

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
    },
    onSuccess: () => {
      router.push('/home');

      closePostDialog();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export const useDeletePost = ({
  setOpen,
  router,
  postId,
}: {
  postId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
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
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

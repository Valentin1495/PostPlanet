import { QueryClient, useMutation } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';

export const useDeleteReply = ({
  queryClient,
  setOpen,
  replyId,
  postId,
}: {
  postId: string;
  queryClient: QueryClient;
  setOpen: Dispatch<SetStateAction<boolean>>;
  replyId?: string;
}) => {
  return useMutation({
    mutationFn: async () =>
      await fetch('/api/deleteReply', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ replyId }),
      }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['replies', postId] });
      queryClient.invalidateQueries({ queryKey: ['repliesCount', postId] });
      setOpen(false);
    },
  });
};

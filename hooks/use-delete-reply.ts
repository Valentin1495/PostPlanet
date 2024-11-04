import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export const useDeleteReply = ({
  setOpen,
  replyId,
  postId,
}: {
  postId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  replyId?: string;
}) => {
  const queryClient = useQueryClient();

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
    },
    onSuccess: () => {
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteReply = ({
  closeReplyDialog,
  replyId,
  postId,
}: {
  postId: string;
  closeReplyDialog: () => void;
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
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['replies', postId] });
      queryClient.invalidateQueries({ queryKey: ['repliesCount', postId] });

      closeReplyDialog();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

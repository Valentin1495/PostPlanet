import { FileType } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { toast } from 'sonner';

type ParamsType = {
  formData: FormData;
  postId?: string;
  userId: string;
  isForDialog?: boolean;
  closeReplyDialog?: () => void;
  setText: Dispatch<SetStateAction<string>>;
  setFile: Dispatch<SetStateAction<FileType | null>>;
  textAreaRef: RefObject<HTMLTextAreaElement>;
};

export const useReplyToPost = ({
  formData,
  postId,
  userId,
  isForDialog,
  closeReplyDialog,
  setText,
  setFile,
  textAreaRef,
}: ParamsType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/replyToPost`, {
        method: 'POST',
        body: formData,
      });
      const { data } = await response.json();

      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['replies', postId] });
      queryClient.refetchQueries({ queryKey: ['replies', postId] });
      queryClient.invalidateQueries({ queryKey: ['repliesCount', postId] });
      queryClient.invalidateQueries({ queryKey: ['activities', userId] });
      queryClient.refetchQueries({ queryKey: ['activities', userId] });

      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['replies', postId] });
      queryClient.refetchQueries({ queryKey: ['replies', postId] });
      queryClient.invalidateQueries({ queryKey: ['repliesCount', postId] });
      queryClient.invalidateQueries({ queryKey: ['activities', userId] });
      queryClient.refetchQueries({ queryKey: ['activities', userId] });

      setText('');
      setFile(null);
      if (isForDialog && closeReplyDialog) {
        closeReplyDialog();
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

import { FileType } from '@/lib/types';
import { QueryClient, useMutation } from '@tanstack/react-query';
import { Dispatch, RefObject, SetStateAction } from 'react';

type ParamsType = {
  queryClient: QueryClient;
  formData: FormData;
  postId?: string;
  isForDialog?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  setText: Dispatch<SetStateAction<string>>;
  setFile: Dispatch<SetStateAction<FileType | null>>;
  textAreaRef: RefObject<HTMLTextAreaElement>;
};
export const useReplyToPost = ({
  queryClient,
  formData,
  postId,
  isForDialog,
  setOpen,
  setText,
  setFile,
  textAreaRef,
}: ParamsType) => {
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
      queryClient.invalidateQueries({ queryKey: ['repliesCount', postId] });
      if (isForDialog) {
        if (setOpen) {
          setOpen(false);
        }
      }
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }

      setText('');
      setFile(null);
    },
  });
};

import { FileType } from '@/lib/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { toast } from 'sonner';

type ParamsType = {
  setText: Dispatch<SetStateAction<string>>;
  setFile: Dispatch<SetStateAction<FileType | null>>;
  textAreaRef: RefObject<HTMLTextAreaElement>;
  formData: FormData;
  userId: string;
  closeCreateDialog?: () => void;
};

export const useCreatePost = ({
  setText,
  setFile,
  textAreaRef,
  formData,
  userId,
  closeCreateDialog,
}: ParamsType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/createPost`, {
        method: 'POST',
        body: formData,
      });
      const { newPost } = await response.json();

      return newPost;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts', userId] });

      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    },
    onSuccess: () => {
      setText('');
      setFile(null);
      if (closeCreateDialog) {
        closeCreateDialog();
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

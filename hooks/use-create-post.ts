import { QueryClient, useMutation } from '@tanstack/react-query';
import { Dispatch, RefObject, SetStateAction } from 'react';

type ParamsType = {
  queryClient: QueryClient;
  setText: Dispatch<SetStateAction<string>>;
  textAreaRef: RefObject<HTMLTextAreaElement>;
  formData: FormData;
  userId: string;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

export const useCreatePost = ({
  queryClient,
  setText,
  textAreaRef,
  formData,
  userId,
  setOpen,
}: ParamsType) => {
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
      setText('');
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
      if (setOpen) {
        setOpen(false);
      }
    },
  });
};

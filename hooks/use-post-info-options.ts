import { PostInfo } from '@/lib/types';
import { queryOptions, UseQueryOptions } from '@tanstack/react-query';

export const usePostInfoOptions = ({
  postId,
  authorId,
  currentUserId,
}: {
  postId: string;
  authorId: string;
  currentUserId: string;
}) => {
  const postInfoOptions = queryOptions({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await fetch(
        `/api/postInfo/${postId}?authorId=${authorId}&currentUserId=${currentUserId}`
      );
      const { postInfo } = await response.json();
      return postInfo as PostInfo;
    },
  });

  return { postInfoOptions };
};

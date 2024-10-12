import { PostInfo } from '@/lib/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useOptimisticLike = (postInfoOptions: any) => {
  const { data, isPending } = useQuery<PostInfo>(postInfoOptions);
  const queryClient = useQueryClient();
  const postInfo = queryClient.getQueryData(
    postInfoOptions.queryKey
  ) as PostInfo;

  const hasLiked = postInfo?.hasLiked || data?.hasLiked;
  const likesCount = postInfo?.likesCount || data?.likesCount;

  return { hasLiked, likesCount, isPending };
};

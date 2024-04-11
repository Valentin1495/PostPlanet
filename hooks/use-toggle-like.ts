import { likePost, unlikePost } from '@/actions/post.actions';
import { startTransition, useOptimistic } from 'react';

export function useToggleLike(
  likes: number,
  postId: string,
  userId: string,
  hasLiked?: boolean
) {
  const [optimisticLikes, updateOptimisticLikes] = useOptimistic(
    likes,
    (state, amount) => state! + Number(amount)
  );
  const [optimisticHasLiked, updateOptimisticHasLiked] = useOptimistic(
    hasLiked,
    (state, _) => !state
  );

  const toggleLike = async () => {
    if (optimisticHasLiked) {
      startTransition(() => {
        updateOptimisticLikes(-1);
        updateOptimisticHasLiked(false);
      });
      await unlikePost(postId, userId);
    } else {
      startTransition(() => {
        updateOptimisticLikes(1);
        updateOptimisticHasLiked(true);
      });
      await likePost(postId, userId);
    }
  };

  return {
    optimisticLikes,
    optimisticHasLiked,
    toggleLike,
  };
}

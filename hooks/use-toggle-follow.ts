import { follow, unfollow } from '@/actions/user.actions';
import { startTransition, useOptimistic, useState } from 'react';

export function useToggleFollow(
  followers: number,
  userId: string,
  currentUserId: string,
  followingIds: string[]
) {
  const isFollowing = followingIds.includes(userId);
  const [optimisticFollowers, updateOptimisticFollowers] = useOptimistic(
    followers,
    (state, amount) => state! + Number(amount)
  );
  const [optimisticFollow, updateOptimisticFollow] = useOptimistic(
    isFollowing,
    (state, _) => !state
  );
  const [btnText, setBtnText] = useState<string>('Following');

  const toggleFollow = async () => {
    if (optimisticFollow) {
      setBtnText('Follow');
      startTransition(() => {
        updateOptimisticFollowers(-1);
        updateOptimisticFollow(false);
      });
      await unfollow(userId, currentUserId, followingIds);
    } else {
      setBtnText('Unfollow');
      startTransition(() => {
        updateOptimisticFollowers(1);
        updateOptimisticFollow(true);
      });
      await follow(userId, currentUserId, followingIds);
    }
  };

  const handleMouseOver = () => setBtnText('Unfollow');

  const handleMouseOut = () => setBtnText('Following');

  return {
    optimisticFollowers,
    optimisticFollow,
    btnText,
    toggleFollow,
    handleMouseOver,
    handleMouseOut,
  };
}

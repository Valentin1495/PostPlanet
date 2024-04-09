import { follow, unfollow } from '@/actions/user.actions';
import { startTransition, useOptimistic, useState } from 'react';

export function useToggleFollow(
  followers: number,
  userId: string,
  isFollowing?: boolean
) {
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
      await unfollow(userId);
    } else {
      setBtnText('Unfollow');
      startTransition(() => {
        updateOptimisticFollowers(1);
        updateOptimisticFollow(true);
      });
      await follow(userId);
    }
  };

  const handleMouseOver = () => {
    setBtnText('Unfollow');
  };
  const handleMouseOut = () => {
    setBtnText('Following');
  };

  return {
    optimisticFollowers,
    optimisticFollow,
    btnText,
    toggleFollow,
    handleMouseOver,
    handleMouseOut,
  };
}

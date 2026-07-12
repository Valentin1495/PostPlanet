'use client';

import { Button } from './ui/button';
import { useFollowInfoOptions } from '@/hooks/use-follow-info';
import { useFollow } from '@/hooks/use-follow';
import { useUnfollow } from '@/hooks/use-unfollow';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { User } from '@/lib/types';

type FollowButtonProps = {
  userId: string;
  currentUserId: string;
  user?: User;
  currentUser?: User | null;
  className?: string;
};

export default function FollowButton({
  userId,
  currentUserId,
  user,
  currentUser,
  className,
}: FollowButtonProps) {
  const { followInfoOptions } = useFollowInfoOptions({
    userId,
    currentUserId,
  });
  const { data, isPending } = useQuery(followInfoOptions);
  const followMutation = useFollow(followInfoOptions);
  const unfollowMutation = useUnfollow(followInfoOptions);

  const isFollowingUser = data?.isFollowingUser ?? false;
  const isMutating = followMutation.isPending || unfollowMutation.isPending;

  const toggleFollow = () => {
    const variables = { userId, currentUserId, user, currentUser };

    if (isFollowingUser) {
      unfollowMutation.mutate(variables);
    } else {
      followMutation.mutate(variables);
    }
  };

  return (
    <Button
      variant={isFollowingUser ? 'outline' : 'default'}
      className={cn('rounded-full font-semibold', className)}
      disabled={isPending || isMutating}
      onClick={toggleFollow}
    >
      {isFollowingUser ? 'Following' : 'Follow'}
    </Button>
  );
}

'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import Link from 'next/link';
import { follow, unfollow } from '@/actions/user.actions';
import { useOptimistic, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import ToggleFollowButton from './toggle-follow-button';

type ProfileImageProps = {
  profileImage: string;
  name: string;
  username: string;
  bio: string | null;
  followingIds: string[];
  // followers?: number;
  // isFollowing?: boolean;
  // userId: string;
  isCurrentUser: boolean;
  btnText: string;
  handleMouseOver: () => void;
  handleMouseOut: () => void;
  optimisticFollow?: boolean;
  optimisticFollowers: number;
  toggleFollow: () => Promise<void>;
};

export default function ProfileImage({
  profileImage,
  name,
  username,
  bio,
  followingIds,
  // followers,
  // isFollowing,
  // userId,
  isCurrentUser,
  btnText,
  handleMouseOver,
  handleMouseOut,
  optimisticFollow,
  optimisticFollowers,
  toggleFollow,
}: ProfileImageProps) {
  // const [btnText, setBtnText] = useState<string>('Following');
  // const [optimisticFollowers, updateOptimisticFollowers] = useOptimistic(
  //   followers,
  //   (state, amount) => state! + Number(amount)
  // );
  // const [optimisticFollow, updateOptimisticFollow] = useOptimistic(
  //   isFollowing,
  //   (state, newFollowingState) => !state
  // );

  // const toggleFollow = async () => {
  //   if (optimisticFollow) {
  //     updateOptimisticFollowers(-1);
  //     updateOptimisticFollow(false);
  //     await unfollow(userId);
  //   } else {
  //     updateOptimisticFollowers(1);
  //     updateOptimisticFollow(true);
  //     await follow(userId);
  //   }
  // };

  // const handleMouseEnter = () => {
  //   setBtnText('Unfollow');
  // };
  // const handleMouseLeave = () => {
  //   setBtnText('Following');
  // };

  return (
    <HoverCard>
      <div onClick={(e) => e.stopPropagation()} className='cursor-default'>
        <HoverCardTrigger href={`/${username}`}>
          <Avatar className='w-10 h-10 darker'>
            <AvatarImage src={profileImage} alt='profile picture' />
            <AvatarFallback className='bg-primary/10'>
              <Skeleton className='rounded-full' />
            </AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent className='space-y-2'>
          <section className='flex justify-between'>
            <Link href={`/${username}`}>
              <Avatar className='w-16 h-16 darker'>
                <AvatarImage src={profileImage} alt='profile picture' />
                <AvatarFallback className='bg-primary/10'>
                  <Skeleton className='rounded-full' />
                </AvatarFallback>
              </Avatar>
            </Link>
            {!isCurrentUser && (
              <ToggleFollowButton
                btnText={btnText}
                handleMouseOver={handleMouseOver}
                handleMouseOut={handleMouseOut}
                optimisticFollow={optimisticFollow}
                toggleFollow={toggleFollow}
              />
            )}
          </section>

          <section>
            <Link
              href={`/${username}`}
              className='text-sm block w-fit font-bold hover:underline'
            >
              {name}
            </Link>
            <Link
              href={`/${username}`}
              className='text-sm block w-fit text-muted-foreground'
            >
              @{username}
            </Link>
            <p className='text-sm my-2'>{bio}</p>
            <section className='text-sm space-x-5'>
              <span>
                <span className='font-bold'>{followingIds.length}</span>{' '}
                following
              </span>
              <span>
                <span className='font-bold'>{optimisticFollowers}</span>{' '}
                followers
              </span>
            </section>
          </section>
        </HoverCardContent>
      </div>
    </HoverCard>
  );
}

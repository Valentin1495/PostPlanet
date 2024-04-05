'use client';

import ProfileImage from './profile-image';
import { useUser } from '@clerk/nextjs';
import ToggleFollowButton from './toggle-follow-button';
import { useRouter } from 'next/navigation';
import { useOptimistic, useState } from 'react';
import { follow, unfollow } from '@/actions/user.actions';
import { useToggleFollow } from '@/hooks/use-toggle-follow';

type RandomUserProps = {
  profileImage: string;
  username: string;
  name: string;
  id: string;
  bio: string | null;
  followingIds: string[];
  followers: number;
} & {
  isFollowing?: boolean;
};

export default function RandomUser({
  profileImage,
  username,
  name,
  id,
  bio,
  followingIds,
  followers,
  isFollowing,
}: RandomUserProps) {
  const { user } = useUser();
  const isCurrentUser = user?.id === id;
  const router = useRouter();
  const {
    btnText,
    handleMouseOut,
    handleMouseOver,
    optimisticFollow,
    optimisticFollowers,
    toggleFollow,
  } = useToggleFollow(followers, id, isFollowing);

  return (
    <div
      onClick={() => router.push(`/${username}`)}
      className='flex items-center gap-2 hover:bg-primary/5 p-3 last:rounded-b-md transition cursor-pointer'
    >
      <ProfileImage
        profileImage={profileImage}
        username={username}
        name={name}
        bio={bio}
        followingIds={followingIds}
        isCurrentUser={isCurrentUser}
        btnText={btnText}
        handleMouseOver={handleMouseOver}
        handleMouseOut={handleMouseOut}
        optimisticFollowers={optimisticFollowers}
        optimisticFollow={optimisticFollow}
        toggleFollow={toggleFollow}
      />

      <section className='text-xs mr-auto'>
        <h2 className='font-semibold truncate max-w-28'>{name}</h2>
        <h3 className='truncate max-w-28'>@{username}</h3>
      </section>

      {!isCurrentUser && (
        <ToggleFollowButton
          btnText={btnText}
          handleMouseOver={handleMouseOver}
          handleMouseOut={handleMouseOut}
          toggleFollow={toggleFollow}
          optimisticFollow={optimisticFollow}
        />
      )}
    </div>
  );
}

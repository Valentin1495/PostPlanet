'use client';

import ProfileImage from './profile-image';
import ToggleFollowButton from './toggle-follow-button';
import { useRouter } from 'next/navigation';
import { useToggleFollow } from '@/hooks/use-toggle-follow';
import Link from 'next/link';

type RandomUserProps = {
  profileImage: string;
  username: string;
  name: string;
  id: string;
  bio: string | null;
  myFollowingIds: string[];
  userFollowingIds: string[];
  currentUserId: string;
  followers: number;
};

export default function RandomUser({
  profileImage,
  username,
  name,
  id,
  bio,
  myFollowingIds,
  userFollowingIds,
  currentUserId,
  followers,
}: RandomUserProps) {
  const isCurrentUser = currentUserId === id;
  const router = useRouter();

  const {
    btnText,
    handleMouseOut,
    handleMouseOver,
    optimisticFollow,
    optimisticFollowers,
    toggleFollow,
  } = useToggleFollow(followers, id, currentUserId, myFollowingIds);

  return (
    <div
      onClick={() => router.push(`/${username}/posts`)}
      className='flex items-center gap-2 hover:bg-primary/5 p-3 last:rounded-b-lg transition cursor-pointer'
    >
      <ProfileImage
        randomUser
        profileImage={profileImage}
        username={username}
        name={name}
        bio={bio}
        followingIds={userFollowingIds}
        isCurrentUser={isCurrentUser}
        btnText={btnText}
        handleMouseOver={handleMouseOver}
        handleMouseOut={handleMouseOut}
        optimisticFollowers={optimisticFollowers}
        optimisticFollow={optimisticFollow}
        toggleFollow={toggleFollow}
      />

      <section className='mr-auto flex flex-col'>
        <Link
          href={`/${username}/posts`}
          className='font-semibold hover:underline truncate lg:max-w-28 xl:max-w-44'
        >
          {name}
        </Link>
        <Link
          href={`/${username}/posts`}
          className='truncate text-sm lg:max-w-28 xl:max-w-44'
        >
          @{username}
        </Link>
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

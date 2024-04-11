'use client';

import ProfileImage from './profile-image';
import ToggleFollowButton from './toggle-follow-button';
import { useRouter } from 'next/navigation';
import { useToggleFollow } from '@/hooks/use-toggle-follow';

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
  const isFollowing = myFollowingIds.includes(id);

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
      className='flex items-center gap-2 hover:bg-slate-300 p-3 last:rounded-b-md transition cursor-pointer'
    >
      <ProfileImage
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
        isFollowing={isFollowing}
      />

      <section className='text-xs mr-auto'>
        <h2 className='font-semibold truncate max-w-20 xl:max-w-28'>{name}</h2>
        <h3 className='truncate max-w-20 xl:max-w-28'>@{username}</h3>
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

'use client';

import { useToggleFollow } from '@/hooks/use-toggle-follow';
import ProfileImage from './profile-image';
import { SingleUserProps } from './single-user';
import ToggleFollowButton from './toggle-follow-button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ClientUserProps = SingleUserProps & {
  followers: number;
};

export default function ClientUser({
  username,
  name,
  bio,
  profileImage,
  followingIds,
  id,
  followers,
  currentUserId,
  myFollowingIds,
}: ClientUserProps) {
  const isCurrentUser = id === currentUserId;
  const {
    btnText,
    handleMouseOut,
    handleMouseOver,
    optimisticFollow,
    optimisticFollowers,
    toggleFollow,
  } = useToggleFollow(followers, id, currentUserId, myFollowingIds);
  const router = useRouter();

  return (
    <div
      className='flex gap-2'
      onClick={() => router.push(`/${username}/posts`)}
    >
      <ProfileImage
        bio={bio}
        followingIds={followingIds}
        name={name}
        username={username}
        profileImage={profileImage}
        btnText={btnText}
        handleMouseOver={handleMouseOver}
        handleMouseOut={handleMouseOut}
        optimisticFollowers={optimisticFollowers}
        optimisticFollow={optimisticFollow}
        toggleFollow={toggleFollow}
        isCurrentUser={isCurrentUser}
        followingPage
      />
      <div className='space-y-1.5 w-full'>
        <div className='flex justify-between'>
          <section className='flex flex-col text-sm'>
            <Link
              href={`/${username}/posts`}
              onClick={(e) => e.stopPropagation()}
              className='font-semibold'
            >
              {name}
            </Link>
            <Link
              href={`/${username}/posts`}
              onClick={(e) => e.stopPropagation()}
              className='text-muted-foreground'
            >
              @{username}
            </Link>
          </section>
          {!isCurrentUser && (
            <ToggleFollowButton
              btnText={btnText}
              handleMouseOut={handleMouseOut}
              handleMouseOver={handleMouseOver}
              optimisticFollow={optimisticFollow}
              toggleFollow={toggleFollow}
            />
          )}
        </div>
        {bio && <p>{bio}</p>}
      </div>
    </div>
  );
}

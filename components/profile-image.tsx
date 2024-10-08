'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import Link from 'next/link';
import ToggleFollowButton from './toggle-follow-button';

type ProfileImageProps = {
  followingPage?: boolean;
  profileImage: string;
  name: string;
  username: string;
  bio: string | null;
  followingIds: string[];
  isCurrentUser?: boolean;
  btnText: string;
  handleMouseOver: () => void;
  handleMouseOut: () => void;
  optimisticFollow?: boolean;
  optimisticFollowers: number;
  toggleFollow: () => Promise<void>;
  randomUser?: boolean;
};

export default function ProfileImage({
  followingPage,
  profileImage,
  name,
  username,
  bio,
  followingIds,
  isCurrentUser,
  btnText,
  handleMouseOver,
  handleMouseOut,
  optimisticFollow,
  optimisticFollowers,
  toggleFollow,
  randomUser,
}: ProfileImageProps) {
  return (
    <HoverCard>
      <div className='max-w-fit'>
        <HoverCardTrigger href={`/${username}/posts`}>
          {profileImage.includes('#') ? (
            <section
              style={{
                backgroundColor: profileImage,
              }}
              className='rounded-full size-10 darker'
            />
          ) : (
            <Avatar className='size-10 darker'>
              <AvatarImage src={profileImage} alt='profile picture' />
              <AvatarFallback className='bg-primary/10'>
                <Skeleton className='rounded-full' />
              </AvatarFallback>
            </Avatar>
          )}
        </HoverCardTrigger>
        <HoverCardContent
          className='space-y-2 cursor-default'
          onClick={(e) => e.stopPropagation()}
        >
          <section className='flex justify-between'>
            <Link href={`/${username}/posts`}>
              {profileImage.includes('#') ? (
                <section
                  style={{
                    backgroundColor: profileImage,
                  }}
                  className='rounded-full size-16 darker'
                />
              ) : (
                <Avatar className='size-16 darker'>
                  <AvatarImage src={profileImage} alt='profile picture' />
                  <AvatarFallback className='bg-primary/10'>
                    <Skeleton className='rounded-full' />
                  </AvatarFallback>
                </Avatar>
              )}
            </Link>
            {!isCurrentUser && !followingPage && !randomUser && (
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
              href={`/${username}/posts`}
              className='block w-fit font-bold hover:underline'
            >
              {name}
            </Link>
            <Link
              href={`/${username}/posts`}
              className='text-sm block w-fit text-muted-foreground'
            >
              @{username}
            </Link>
            <p className='my-2'>{bio}</p>
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

'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import Link from 'next/link';
import FollowButton from './follow-button';
import { User } from '@/lib/types';
import { useFollowInfoOptions } from '@/hooks/use-follow-info';
import { useQuery } from '@tanstack/react-query';

type ProfileImageProps = {
  profileImage?: string;
  name?: string;
  username?: string;
  bio?: string | null;
  isCurrentUser?: boolean;
  randomUser?: boolean;
  userId?: string;
  user?: User | null;
  currentUserId?: string;
  currentUser?: User | null;
};

export default function ProfileImage({
  profileImage,
  name,
  username,
  bio,
  userId,
  user,
  currentUserId,
  currentUser,
}: ProfileImageProps) {
  const canFollow = Boolean(userId && currentUserId && userId !== currentUserId);
  const canFetchFollowInfo = Boolean(userId && currentUserId);
  const { followInfoOptions } = useFollowInfoOptions({
    userId: userId ?? '',
    currentUserId: currentUserId ?? '',
    enabled: canFetchFollowInfo,
  });
  const { data: followInfo } = useQuery(followInfoOptions);

  return (
    <HoverCard>
      <div className='max-w-fit'>
        <HoverCardTrigger href={`/${username}/posts`}>
          {profileImage?.includes('#') ? (
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
          <section className='flex justify-between items-start'>
            <Link href={`/${username}/posts`}>
              {profileImage?.includes('#') ? (
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

            {canFollow && (
              <FollowButton
                userId={userId!}
                currentUserId={currentUserId!}
                user={user ?? undefined}
                currentUser={currentUser}
                className='h-9 px-4 text-sm'
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

            {username && (
              <section className='flex items-center gap-4 text-sm'>
                <Link
                  href={`/${username}/following`}
                  className='hover:underline'
                >
                  {followInfo && (
                    <>
                      <span className='font-semibold text-foreground'>
                        {followInfo.followingCount}
                      </span>{' '}
                    </>
                  )}
                  <span className='text-muted-foreground'>Following</span>
                </Link>
                <Link
                  href={`/${username}/followers`}
                  className='hover:underline'
                >
                  {followInfo && (
                    <>
                      <span className='font-semibold text-foreground'>
                        {followInfo.followersCount}
                      </span>{' '}
                    </>
                  )}
                  <span className='text-muted-foreground'>Followers</span>
                </Link>
              </section>
            )}
          </section>
        </HoverCardContent>
      </div>
    </HoverCard>
  );
}

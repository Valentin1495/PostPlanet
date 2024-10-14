'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import Link from 'next/link';

type ProfileImageProps = {
  profileImage?: string;
  name?: string;
  username?: string;
  bio?: string | null;
  isCurrentUser?: boolean;
  randomUser?: boolean;
};

export default function ProfileImage({
  profileImage,
  name,
  username,
  bio,
}: ProfileImageProps) {
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
          <section className='flex justify-between'>
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
          </section>
        </HoverCardContent>
      </div>
    </HoverCard>
  );
}

'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Button } from './ui/button';
import Link from 'next/link';
import { follow, unfollow } from '@/actions/user.actions';
import { useState } from 'react';

type ProfileImageProps = {
  profileImage: string;
  name: string;
  username: string;
  bio: string | null;
  followingIds: string[];
  followers?: number;
  isFollowing?: boolean;
};

export default function ProfileImage({
  profileImage,
  name,
  username,
  bio,
  followingIds,
  followers,
  isFollowing,
}: ProfileImageProps) {
  const [btnText, setBtnText] = useState<string>('Following');
  const toggleFollow = async () => {
    if (isFollowing) {
      await unfollow(username);
    } else {
      await follow(username);
    }
  };

  const handleMouseEnter = () => {
    setBtnText('Unfollow');
  };
  const handleMouseLeave = () => {
    setBtnText('Following');
  };

  return (
    <HoverCard>
      <div>
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
            {isFollowing ? (
              <Button
                variant='secondary'
                size='sm'
                className='rounded-full hover:bg-destructive/10 hover:text-destructive'
                onClick={toggleFollow}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {btnText}
              </Button>
            ) : (
              <Button
                variant='default'
                size='sm'
                className='rounded-full'
                onClick={toggleFollow}
              >
                Follow
              </Button>
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
                <span className='font-bold'>{followers}</span> followers
              </span>
            </section>
          </section>
        </HoverCardContent>
      </div>
    </HoverCard>
  );
}

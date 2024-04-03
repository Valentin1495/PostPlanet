'use client';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Button } from './ui/button';
import Link from 'next/link';

type ProfileImageProps = {
  profileImage: string;
  name: string;
  username: string;
  bio: string | null;
  followingIds: string[];
};

export default function ProfileImage({
  profileImage,
  name,
  username,
  bio,
  followingIds,
}: ProfileImageProps) {
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
              <Avatar className='w-10 h-10 darker'>
                <AvatarImage src={profileImage} alt='profile picture' />
                <AvatarFallback className='bg-primary/10'>
                  <Skeleton className='rounded-full' />
                </AvatarFallback>
              </Avatar>
            </Link>
            <Button variant='secondary' size='sm' className='rounded-full'>
              Follow
            </Button>
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
                <span className='font-bold'>{10}</span> following
              </span>
              <span>
                <span className='font-bold'>{10}</span> followers
              </span>
            </section>
          </section>
        </HoverCardContent>
      </div>
    </HoverCard>
  );
}

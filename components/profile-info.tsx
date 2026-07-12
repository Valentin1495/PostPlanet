'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import FollowButton from './follow-button';
import { useFollowInfoOptions } from '@/hooks/use-follow-info';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/lib/types';

type ProfileInfoProps = {
  id: string;
  profileImage: string;
  name: string;
  username: string;
  createdAt: Date;
  currentUserId: string;
  user: User;
  currentUser?: User | null;
};

export default function ProfileInfo({
  id,
  profileImage,
  name,
  username,
  createdAt,
  currentUserId,
  user,
  currentUser,
}: ProfileInfoProps) {
  const timestamp = format(createdAt, 'MMMM yyyy');
  const isMyProfile = currentUserId === id;

  const { followInfoOptions } = useFollowInfoOptions({
    userId: id,
    currentUserId,
  });
  const { data: followInfo } = useQuery(followInfoOptions);

  return (
    <div className='flex flex-col items-center p-3 gap-4'>
      {profileImage.includes('#') ? (
        <section
          className='size-32 rounded-full'
          style={{
            backgroundColor: profileImage,
          }}
        />
      ) : (
        <Link
          href={profileImage}
          target='_blank'
          className='mx-auto inline-block'
        >
          <Avatar className='size-32 darker'>
            <AvatarImage src={profileImage} alt='profile picture' />
            <AvatarFallback className='bg-primary/10'>
              <Skeleton className='rounded-full' />
            </AvatarFallback>
          </Avatar>
        </Link>
      )}

      <section className='text-center'>
        <h1 className='font-bold text-xl'>{name}</h1>
        <h2 className='text-muted-foreground'>@{username}</h2>
      </section>

      <section className='flex items-center text-muted-foreground text-sm gap-1.5'>
        <CalendarDays size={16} />
        Joined {timestamp}
      </section>

      <section className='flex items-center gap-4 text-sm'>
        <Link href={`/${username}/following`} className='hover:underline'>
          <span className='font-semibold text-foreground'>
            {followInfo?.followingCount ?? 0}
          </span>{' '}
          <span className='text-muted-foreground'>Following</span>
        </Link>
        <Link href={`/${username}/followers`} className='hover:underline'>
          <span className='font-semibold text-foreground'>
            {followInfo?.followersCount ?? 0}
          </span>{' '}
          <span className='text-muted-foreground'>Followers</span>
        </Link>
      </section>

      {!isMyProfile && currentUserId && (
        <FollowButton
          userId={id}
          currentUserId={currentUserId}
          user={user}
          currentUser={currentUser}
          className='w-32'
        />
      )}
    </div>
  );
}

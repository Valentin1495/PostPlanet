'use client';

import { PostProps } from './post';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import ProfileImage from './profile-image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { useRouter } from 'next/navigation';
import { useOptimistic, useState } from 'react';
import { follow, unfollow } from '@/actions/user.actions';
import { useToggleFollow } from '@/hooks/use-toggle-follow';

type ClientPostProps = PostProps & {
  username: string;
  name: string;
  profileImage: string;
  followers: number;
  isMyPost: boolean;
  isFollowing?: boolean;
  bio: string | null;
  followingIds: string[];
};

export default function ClientPost({
  id,
  username,
  name,
  profileImage,
  followers,
  isMyPost,
  isFollowing,
  text,
  image,
  createdAt,
  authorId,
  bio,
  followingIds,
}: ClientPostProps) {
  const router = useRouter();
  const {
    btnText,
    handleMouseOut,
    handleMouseOver,
    optimisticFollow,
    optimisticFollowers,
    toggleFollow,
  } = useToggleFollow(followers, authorId, isFollowing);

  return (
    <div
      className='border-b-2 border-secondary p-3 flex gap-2 hover:bg-secondary transition cursor-pointer'
      onClick={() => router.push(`/${id}`)}
    >
      {isMyPost ? (
        <Link href={`/${username}`}>
          <Avatar className='w-10 h-10 darker'>
            <AvatarImage src={profileImage} alt='profile picture' />
            <AvatarFallback className='bg-primary/10'>
              <Skeleton className='rounded-full' />
            </AvatarFallback>
          </Avatar>
        </Link>
      ) : (
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
          isCurrentUser={isMyPost}
        />
      )}
      <div className='w-full'>
        <section className='flex text-sm gap-1.5 items-center'>
          <Link
            href={`/${username}`}
            className='font-bold hover:underline'
            onClick={(e) => e.stopPropagation()}
          >
            {name}
          </Link>
          <Link
            href={`/${username}`}
            className='text-muted-foreground mb-0.5'
            onClick={(e) => e.stopPropagation()}
          >
            @{username}
          </Link>
          <span className='text-muted-foreground mb-0.5'>·</span>
          <span className='text-muted-foreground mb-0.5'>
            {formatDate(createdAt)}
          </span>
        </section>
        <section className='space-y-2'>
          <p className='text-sm'>{text}</p>
          {image && (
            <article className='relative aspect-video rounded-xl overflow-hidden'>
              <Image src={image} alt='image' fill />
            </article>
          )}
        </section>
        <section></section>
      </div>
    </div>
  );
}

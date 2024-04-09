'use client';

import { useToggleFollow } from '@/hooks/use-toggle-follow';
import ProfileImage from './profile-image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';

type ClientReplyProps = {
  isFollowing: boolean;
  isCurrentUser: boolean;
  id: string;
  username: string;
  name: string;
  bio: string | null;
  profileImage: string;
  followingIds: string[];
  followers: number;
  createdAt: string;
  text: string | null;
  image: string | null;
};

export default function ClientReply({
  isCurrentUser,
  isFollowing,
  id: authorId,
  username,
  name,
  bio,
  profileImage,
  followingIds,
  followers,
  createdAt,
  text,
  image,
}: ClientReplyProps) {
  const {
    btnText,
    handleMouseOut,
    handleMouseOver,
    optimisticFollow,
    optimisticFollowers,
    toggleFollow,
  } = useToggleFollow(followers, authorId, isFollowing);

  return (
    <div className='p-3 flex gap-2 border-b'>
      {isCurrentUser ? (
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
          btnText={btnText}
          followingIds={followingIds}
          handleMouseOut={handleMouseOut}
          handleMouseOver={handleMouseOver}
          isCurrentUser={isCurrentUser}
          name={name}
          optimisticFollowers={optimisticFollowers}
          profileImage={profileImage}
          toggleFollow={toggleFollow}
          username={username}
          optimisticFollow={optimisticFollow}
        />
      )}
      <div className='w-full'>
        <section className='flex text-sm gap-1.5 items-center'>
          <Link
            href={`/${username}`}
            className='font-bold hover:underline truncate max-w-32 xl:max-w-52'
          >
            {name}
          </Link>
          <Link
            href={`/${username}`}
            className='text-muted-foreground mb-0.5 truncate max-w-32 xl:max-w-52'
          >
            @{username}
          </Link>
          <span className='text-muted-foreground mb-0.5'>·</span>
          <span className='text-muted-foreground mb-0.5 min-w-fit'>
            {createdAt}
          </span>
        </section>

        <section className='space-y-2'>
          <p className='text-sm'>{text}</p>
          {image && (
            <article className='relative aspect-video rounded-xl overflow-hidden'>
              <Image src={image} alt='image' fill className='object-cover' />
            </article>
          )}
        </section>
      </div>
    </div>
  );
}

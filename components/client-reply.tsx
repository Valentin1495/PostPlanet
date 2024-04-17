'use client';

import { useToggleFollow } from '@/hooks/use-toggle-follow';
import ProfileImage from './profile-image';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type ClientReplyProps = {
  isCurrentUser: boolean;
  id: string;
  username: string;
  name: string;
  bio: string | null;
  profileImage: string;
  myFollowingIds: string[];
  authorFollowingIds: string[];
  currentUserId: string;
  followers: number;
  createdAt: string;
  text: string | null;
  image: string | null;
  isLast?: boolean;
};

export default function ClientReply({
  isCurrentUser,
  id: authorId,
  username,
  name,
  bio,
  profileImage,
  myFollowingIds,
  authorFollowingIds,
  currentUserId,
  followers,
  createdAt,
  text,
  image,
  isLast,
}: ClientReplyProps) {
  const {
    btnText,
    handleMouseOut,
    handleMouseOver,
    optimisticFollow,
    optimisticFollowers,
    toggleFollow,
  } = useToggleFollow(followers, authorId, currentUserId, myFollowingIds);
  const pathname = usePathname();
  const isProfileReplies = pathname.includes('/with-replies');

  return (
    <div className='p-3 flex gap-2 last:border-b'>
      <div>
        <ProfileImage
          bio={bio}
          btnText={btnText}
          followingIds={authorFollowingIds}
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
        {isProfileReplies && !isLast && (
          <div className='w-[2px] mx-auto h-full bg-primary/25'></div>
        )}
      </div>

      <div className='w-full'>
        <section className='flex gap-1.5 items-center'>
          <Link
            href={`/${username}/posts`}
            className='font-bold hover:underline truncate max-w-32 xl:max-w-52'
          >
            {name}
          </Link>
          <Link
            href={`/${username}/posts`}
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
          <p>{text}</p>
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

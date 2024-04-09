'use client';

import ProfileImage from './profile-image';
import { useToggleFollow } from '@/hooks/use-toggle-follow';
import Link from 'next/link';
import { cn, getDetailedDate } from '@/lib/utils';
import { ChatBubble, FilledHeart, Heart } from '@/lib/icons';
import { useToggleLike } from '@/hooks/use-toggle-like';
import Image from 'next/image';

type SinglePostProps = {
  id: string;
  text: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: Date;
  likedIds: string[];
  authorId: string;
  username: string;
  name: string;
  bio: string | null;
  profileImage: string;
  followingIds: string[];
  followers: number;
  isFollowing: boolean;
  isMyPost: boolean;
  hasLiked: boolean;
  replyCount: number;
};

export default function SinglePost({
  id,
  text,
  image,
  createdAt,
  likedIds,
  authorId,
  username,
  name,
  bio,
  profileImage,
  followingIds,
  followers,
  isFollowing,
  isMyPost,
  hasLiked,
  replyCount,
}: SinglePostProps) {
  const {
    btnText,
    handleMouseOut,
    handleMouseOver,
    optimisticFollow,
    optimisticFollowers,
    toggleFollow,
  } = useToggleFollow(followers, authorId, isFollowing);

  const likes = likedIds.length;
  const { optimisticHasLiked, optimisticLikes, toggleLike } = useToggleLike(
    likes,
    id,
    hasLiked
  );

  return (
    <div>
      <div className='p-3'>
        <div className='flex items-center gap-2'>
          <ProfileImage
            profileImage={profileImage}
            name={name}
            username={username}
            bio={bio}
            followingIds={followingIds}
            isCurrentUser={isMyPost}
            btnText={btnText}
            handleMouseOver={handleMouseOver}
            handleMouseOut={handleMouseOut}
            optimisticFollow={optimisticFollow}
            optimisticFollowers={optimisticFollowers}
            toggleFollow={toggleFollow}
          />
          <section className='text-sm flex flex-col'>
            <Link href={`/${username}`} className='font-bold hover:underline'>
              {name}
            </Link>
            <Link href={`/${username}`} className='text-muted-foreground'>
              @{username}
            </Link>
          </section>
        </div>

        <p className='mt-3 text-sm'>{text}</p>

        {image && (
          <section className='relative aspect-video overflow-hidden rounded-xl my-3.5'>
            <Image src={image} alt='image' fill className='object-cover' />
          </section>
        )}

        <span className='text-sm text-muted-foreground'>{createdAt}</span>

        <section className='-ml-2 flex items-center gap-14 border-y-[0.5px] mt-3.5 py-1.5'>
          <section className='flex items-center -space-x-1 group w-fit cursor-pointer'>
            <section className='rounded-full p-2 group-hover:bg-primary/5 transition'>
              <ChatBubble chatBubbleProps='w-6 h-6 text-slate-400 group-hover:text-primary transition' />
            </section>
            <span className='text-sm font-medium text-slate-400 group-hover:text-primary transition'>
              {replyCount}
            </span>
          </section>

          <section
            className='flex items-center -space-x-1 group w-fit cursor-pointer'
            onClick={toggleLike}
          >
            <section className='rounded-full p-2 group-hover:bg-rose-500/5 transition'>
              {optimisticHasLiked ? (
                <FilledHeart filledHeartProps='w-6 h-6 text-rose-500' />
              ) : (
                <Heart heartProps='w-6 h-6 text-slate-400 group-hover:text-rose-500 transition' />
              )}
            </section>
            <span
              className={cn(
                optimisticHasLiked
                  ? 'text-rose-500'
                  : 'group-hover:text-rose-500 transition',
                'text-sm font-medium'
              )}
            >
              {optimisticLikes ? optimisticLikes : null}
            </span>
          </section>
        </section>
      </div>
    </div>
  );
}

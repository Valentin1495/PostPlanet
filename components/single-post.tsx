'use client';

import ProfileImage from './profile-image';
import { useToggleFollow } from '@/hooks/use-toggle-follow';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToggleLike } from '@/hooks/use-toggle-like';
import Image from 'next/image';
import ChatBubble from './icons/chat-bubble';
import FilledHeart from './icons/filled-heart';
import Heart from './icons/heart';
import DeleteDialog from './delete-dialog';
import { Trash2 } from 'lucide-react';

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
  myFollowingIds: string[];
  authorFollowingIds: string[];
  currentUserId: string;
  followers: number;
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
  myFollowingIds,
  authorFollowingIds,
  currentUserId,
  followers,
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
  } = useToggleFollow(followers, authorId, currentUserId, myFollowingIds);

  const likes = likedIds.length;
  const { optimisticHasLiked, optimisticLikes, toggleLike } = useToggleLike(
    likes,
    id,
    currentUserId,
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
            followingIds={authorFollowingIds}
            isCurrentUser={isMyPost}
            btnText={btnText}
            handleMouseOver={handleMouseOver}
            handleMouseOut={handleMouseOut}
            optimisticFollow={optimisticFollow}
            optimisticFollowers={optimisticFollowers}
            toggleFollow={toggleFollow}
          />
          <section className='text-sm flex flex-col'>
            <Link
              href={`/${username}/posts`}
              className='font-bold hover:underline'
            >
              {name}
            </Link>
            <Link href={`/${username}/posts`} className='text-muted-foreground'>
              @{username}
            </Link>
          </section>
        </div>

        <p className='mt-3'>{text}</p>

        {image && (
          <section className='relative aspect-video overflow-hidden rounded-xl my-3.5'>
            <Image src={image} alt='image' fill className='object-cover' />
          </section>
        )}

        <span className='text-sm text-muted-foreground'>{createdAt}</span>

        <section className='relative -ml-2 flex items-center gap-14 border-y mt-3.5 py-1.5 h-12'>
          <section className='flex items-center -space-x-1 group w-fit cursor-pointer absolute top-1/2 -translate-y-1/2 left-0'>
            <section className='rounded-full p-2 group-hover:bg-primary/5 transition'>
              <ChatBubble chatBubbleProps='w-6 h-6 text-slate-400 group-hover:text-primary transition' />
            </section>
            <span className='text-sm font-medium text-slate-400 group-hover:text-primary transition'>
              {replyCount ? replyCount : null}
            </span>
          </section>

          <section
            className='flex items-center -space-x-1 group w-fit cursor-pointer absolute top-1/2 -translate-y-1/2 left-1/4'
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

          <DeleteDialog handleClick={(e) => e.stopPropagation()} postId={id}>
            <section className='flex items-center -space-x-1 group w-fit absolute top-1/2 -translate-y-1/2 right-0'>
              {isMyPost && (
                <section className='rounded-full p-2 group-hover:bg-destructive/5 transition'>
                  <Trash2 className='w-6 h-6 text-slate-400 group-hover:text-destructive transition' />
                </section>
              )}
            </section>
          </DeleteDialog>
        </section>
      </div>
    </div>
  );
}

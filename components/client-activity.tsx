'use client';

import { useToggleFollow } from '@/hooks/use-toggle-follow';
import ProfileImage from './profile-image';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import FilledHeart from './icons/filled-heart';
import FilledChatBubble from './icons/filled-chat-bubble';

type ClientActivityProps = {
  type: string;
  giverId: string;
  postId: string | null;
  receiverId: string;
  giverFollowers: number;
  username: string;
  name: string;
  bio: string | null;
  profileImage: string;
  myFollowingIds: string[];
  giverFollowingIds: string[];
  text: string | null;
};

export default function ClientActivity({
  type,
  giverId,
  postId,
  receiverId,
  username,
  name,
  bio,
  profileImage,
  myFollowingIds,
  giverFollowingIds,
  giverFollowers,
  text,
}: ClientActivityProps) {
  const {
    btnText,
    handleMouseOut,
    handleMouseOver,
    optimisticFollow,
    optimisticFollowers,
    toggleFollow,
  } = useToggleFollow(giverFollowers, giverId, receiverId, myFollowingIds);
  const follow = type === 'follow';
  const like = type === 'like';
  const router = useRouter();
  const url = follow ? `/${username}/following` : `/post/${postId}`;
  const isGiverReceiver = giverId === receiverId;

  return (
    <div
      className='p-3 cursor-pointer hover:bg-secondary/50 transition'
      onClick={() => router.push(url)}
    >
      <div className='flex gap-1.5 items-start'>
        {follow ? (
          <User fill='rgb(22 163 74)' strokeWidth={0} size={40} />
        ) : like ? (
          <section>
            <FilledHeart filledHeartProps='w-10 h-10 text-rose-700' />
          </section>
        ) : (
          <section>
            <FilledChatBubble filledChatBubbleProps='w-10 h-10 text-primary' />
          </section>
        )}
        <section className='space-y-3'>
          <ProfileImage
            bio={bio}
            followingIds={giverFollowingIds}
            name={name}
            username={username}
            profileImage={profileImage}
            btnText={btnText}
            handleMouseOver={handleMouseOver}
            handleMouseOut={handleMouseOut}
            optimisticFollowers={optimisticFollowers}
            optimisticFollow={optimisticFollow}
            toggleFollow={toggleFollow}
            isCurrentUser={isGiverReceiver}
          />

          <p>
            <span className='font-semibold'>{name}</span>{' '}
            <span className='text-muted-foreground'>
              {' '}
              {follow
                ? 'followed you'
                : like
                ? 'liked your post'
                : 'replied to you post'}
            </span>
          </p>

          {text && <p className='text-muted-foreground'>{text}</p>}
        </section>
      </div>
    </div>
  );
}

'use client';

import { Activity, User as UserType } from '@prisma/client';
import { useRouter } from 'next/navigation';

import FilledHeart from './icons/filled-heart';
import FilledChatBubble from './icons/filled-chat-bubble';
import ProfileImage from './profile-image';
import { useQuery } from '@tanstack/react-query';

type SingleActivityProps = Activity;
export default function SingleActivity({
  type,
  giverId,
  postId,
  text,
  receiverId,
}: SingleActivityProps) {
  const {
    data: giver,
    isPending,
    isError,
    error,
  } = useQuery<UserType>({
    queryKey: ['user', giverId],
    queryFn: async () => {
      const response = await fetch(`/api/user/${giverId}`);
      const { user } = await response.json();

      return user;
    },
  });

  const router = useRouter();
  const like = type === 'like';
  const url = `/post/${postId}`;
  const isGiverReceiver = giverId === receiverId;

  if (isPending) return null;
  if (isError)
    return (
      <p className='text-destructive text-center mt-3'>
        Error: {error.message}
      </p>
    );

  const { bio, name, username, profileImage } = giver;
  return (
    <div
      className='p-3 cursor-pointer hover:bg-secondary/50 transition'
      onClick={() => router.push(url)}
    >
      <div className='flex gap-1.5 items-start'>
        {like ? (
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
            name={name}
            username={username}
            profileImage={profileImage}
            isCurrentUser={isGiverReceiver}
          />

          <p>
            <span className='font-semibold'>{name}</span>{' '}
            <span className='text-muted-foreground'>
              {' '}
              {like ? 'liked your post' : 'replied to your post'}
            </span>
          </p>

          {text && <p className='text-muted-foreground'>{text}</p>}
        </section>
      </div>
    </div>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import { getSimpleDate } from '@/lib/utils';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import ProfileImage from './profile-image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ChatBubble from '@/components/icons/chat-bubble';
import FilledHeart from '@/components/icons/filled-heart';
import Heart from '@/components/icons/heart';
import ReplyDialog from './reply-dialog';
import { Trash2 } from 'lucide-react';
import DeleteDialog from './delete-dialog';
import { usePostInfoOptions } from '@/hooks/use-post-info-options';
import { useLikePost } from '@/hooks/use-like-post';
import { useUnlikePost } from '@/hooks/use-unlike-post';
import { useOptimisticLike } from '@/hooks/use-optimistic-like';
import { Post as PostType } from '@prisma/client';
import { Skeleton } from './ui/skeleton';

export type PostProps = PostType & {
  currentUserId: string;
  myProfilePic?: string;
  isProfilePage?: boolean;
};

export default function Post({
  id,
  text,
  image,
  createdAt,
  authorId,
  currentUserId,
  myProfilePic,
}: PostProps) {
  const { postInfoOptions } = usePostInfoOptions({
    postId: id,
    authorId,
    currentUserId,
  });
  const { data, isPending, isError, error } = useQuery(postInfoOptions);
  const likeMutation = useLikePost(currentUserId, postInfoOptions);
  const unlikeMutation = useUnlikePost(currentUserId, postInfoOptions);
  const { hasLiked, likesCount } = useOptimisticLike(postInfoOptions);
  const toggleLike = () => {
    if (hasLiked) {
      unlikeMutation.mutate({ postId: id, userId: currentUserId });
    } else {
      likeMutation.mutate({ postId: id, userId: currentUserId });
    }
  };

  const isMyPost = authorId === currentUserId;
  const timestamp = getSimpleDate(createdAt);
  const router = useRouter();
  const pathname = usePathname();
  const isProfileReplies = pathname.includes('/with-replies');

  if (isPending) {
    return <Skeleton className='w-full h-96 mb-1' />;
  }

  if (isError) {
    return (
      <p className='text-destructive text-center mt-10'>
        Error: {error.message}
      </p>
    );
  }

  const { author, replyCount } = data;
  const { bio, name, username, profileImage } = author;

  return (
    <div
      className='px-3 pt-3 pb-0.5 flex gap-2 hover:bg-secondary/50 transition cursor-pointer'
      onClick={() => router.push(`/post/${id}`)}
    >
      <div>
        <ProfileImage
          bio={bio}
          name={name}
          username={username}
          profileImage={profileImage}
          isCurrentUser={isMyPost}
        />
        {isProfileReplies && (
          <div className='w-[2px] mx-auto h-full bg-primary/25'></div>
        )}
      </div>

      <div className='w-full'>
        <section className='flex gap-1.5 items-center'>
          <Link
            href={`/${username}/posts`}
            className='font-bold hover:underline truncate max-w-32 xl:max-w-52'
            onClick={(e) => e.stopPropagation()}
          >
            {name}
          </Link>
          <Link
            href={`/${username}/posts`}
            className='text-muted-foreground mb-0.5 truncate max-w-32 xl:max-w-52'
            onClick={(e) => e.stopPropagation()}
          >
            @{username}
          </Link>
          <span className='text-muted-foreground mb-0.5'>·</span>
          <span className='text-muted-foreground mb-0.5 min-w-fit'>
            {timestamp}
          </span>
        </section>

        <section className='space-y-2'>
          <p>{text}</p>
          {image && (
            <article className='relative w-full min-h-96 rounded-xl overflow-hidden'>
              <Image
                src={image}
                alt='image'
                fill
                className='object-cover'
                priority
              />
            </article>
          )}
        </section>

        <section className='-ml-2 relative h-10'>
          <ReplyDialog
            handleClick={(e) => e.stopPropagation()}
            postId={id}
            name={name}
            username={username}
            userId={currentUserId}
            profileImage={profileImage}
            createdAt={timestamp}
            text={text}
            myProfilePic={myProfilePic}
          >
            <section className='flex items-center -space-x-1 group w-fit absolute top-1/2 -translate-y-1/2'>
              <section className='rounded-full p-2 group-hover:bg-primary/5 transition'>
                <ChatBubble chatBubbleProps='w-[18px] h-[18px] text-slate-400 group-hover:text-primary transition' />
              </section>
              <span className='text-sm font-medium group-hover:text-primary transition'>
                {replyCount ? replyCount : null}
              </span>
            </section>
          </ReplyDialog>

          <button
            className='flex items-center -space-x-1 group w-fit absolute top-1/2 -translate-y-1/2 left-1/4'
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
          >
            <section className='rounded-full p-2 group-hover:bg-rose-700/10 transition'>
              {hasLiked ? (
                <FilledHeart filledHeartProps='w-[18px] h-[18px] text-rose-700' />
              ) : (
                <Heart heartProps='w-[18px] h-[18px] text-slate-400 group-hover:text-rose-700 transition' />
              )}
            </section>
            <span
              className={cn(
                hasLiked
                  ? 'text-rose-700'
                  : 'group-hover:text-rose-700 transition',
                'text-sm font-medium'
              )}
            >
              {likesCount ? likesCount : null}
            </span>
          </button>

          {isMyPost && (
            <DeleteDialog handleClick={(e) => e.stopPropagation()} postId={id}>
              <section className='flex items-center -space-x-1 group w-fit absolute top-1/2 -translate-y-1/2 right-0'>
                <section className='rounded-full p-2 group-hover:bg-destructive/5 transition'>
                  <Trash2 className='w-[18px] h-[18px] text-slate-400 group-hover:text-destructive transition' />
                </section>
              </section>
            </DeleteDialog>
          )}
        </section>
      </div>
    </div>
  );
}

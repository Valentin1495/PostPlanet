'use client';

import ProfileImage from './profile-image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import ChatBubble from './icons/chat-bubble';
import FilledHeart from './icons/filled-heart';
import Heart from './icons/heart';
import DeleteDialog from './dialogs/delete-dialog';
import { Trash2 } from 'lucide-react';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { usePostInfoOptions } from '@/hooks/use-post-info-options';
import { useOptimisticLike } from '@/hooks/use-optimistic-like';
import { useLikePost } from '@/hooks/use-like-post';
import { useUnlikePost } from '@/hooks/use-unlike-post';
import { Skeleton } from './ui/skeleton';
import { useDialog } from '@/hooks/use-dialog';

type SinglePostProps = {
  id: string;
  text: string | null;
  image: string | null;
  createdAt: string;
  simpleCreatedAt: string;
  likedIds: string[];
  authorId: string;
  username: string;
  name: string;
  bio: string | null;
  profileImage: string;
  currentUserId: string;
  isMyPost: boolean;
  hasLiked: boolean;
  myProfilePic: string;
};

export default function SinglePost({
  id,
  text,
  image,
  simpleCreatedAt,
  createdAt,
  authorId,
  username,
  name,
  bio,
  profileImage,
  currentUserId,
  isMyPost,
  myProfilePic,
}: SinglePostProps) {
  const repliesOptions = queryOptions({
    queryKey: ['repliesCount', id],
    queryFn: async () => {
      const response = await fetch(`/api/countReplies/${id}`);
      const { repliesCount } = await response.json();
      return repliesCount as number;
    },
  });

  const { postInfoOptions } = usePostInfoOptions({
    postId: id,
    authorId,
    currentUserId,
  });
  const likeMutation = useLikePost(currentUserId, postInfoOptions);
  const unlikeMutation = useUnlikePost(currentUserId, postInfoOptions);
  const {
    hasLiked,
    likesCount,
    isPending: isLoading,
  } = useOptimisticLike(postInfoOptions);
  const toggleLike = () => {
    if (hasLiked) {
      unlikeMutation.mutate({ postId: id, userId: currentUserId });
    } else {
      likeMutation.mutate({ postId: id, userId: currentUserId });
    }
  };

  const { data: repliesCount, isPending } = useQuery(repliesOptions);
  const { openDialog } = useDialog();
  return (
    <div>
      <div className='p-3'>
        <div className='flex items-center gap-2'>
          <ProfileImage
            profileImage={profileImage}
            name={name}
            username={username}
            bio={bio}
            isCurrentUser={isMyPost}
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
          <section className='relative w-full min-h-96 overflow-hidden rounded-xl my-3.5'>
            <Image src={image} alt='image' fill className='object-cover' />
          </section>
        )}

        <span className='text-sm text-muted-foreground'>{createdAt}</span>

        <section className='relative -ml-2 flex items-center gap-14 border-y mt-3.5 py-1.5 h-12'>
          {isPending ? (
            <Skeleton className='w-12 h-10 ml-3' />
          ) : (
            // <ReplyDialog
            //   handleClick={(e) => e.stopPropagation()}
            //   postId={id}
            //   name={name}
            //   username={username}
            //   userId={currentUserId}
            //   profileImage={profileImage}
            //   createdAt={simpleCreatedAt}
            //   text={text}
            //   myProfilePic={myProfilePic}
            //   >
            //   </ReplyDialog>
            <section
              onClick={(e) => {
                e.stopPropagation();
                openDialog('replyToPost', {
                  postId: id,
                  name,
                  username,
                  currentUserId,
                  authorProfilePic: profileImage,
                  text,
                  createdAt: simpleCreatedAt,
                  myProfilePic,
                });
              }}
              className='flex items-center -space-x-1 group w-fit absolute top-1/2 -translate-y-1/2 cursor-pointer'
            >
              <section className='rounded-full p-2 group-hover:bg-primary/5 transition'>
                <ChatBubble chatBubbleProps='w-6 h-6 text-slate-400 group-hover:text-primary transition' />
              </section>
              <span className='text-sm font-medium group-hover:text-primary transition'>
                {repliesCount ? repliesCount : null}
              </span>
            </section>
          )}
          {isLoading ? (
            <Skeleton className='w-12 h-10 absolute left-1/4' />
          ) : (
            <section
              className='flex items-center -space-x-1 group w-fit cursor-pointer absolute top-1/2 -translate-y-1/2 left-1/4'
              onClick={toggleLike}
            >
              <section className='rounded-full p-2 group-hover:bg-rose-700/10 transition'>
                {hasLiked ? (
                  <FilledHeart filledHeartProps='w-6 h-6 text-rose-700' />
                ) : (
                  <Heart heartProps='w-6 h-6 text-slate-400 group-hover:text-rose-700 transition' />
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
            </section>
          )}

          {/* <DeleteDialog handleClick={(e) => e.stopPropagation()} postId={id}>
            </DeleteDialog> */}
          <section
            onClick={(e) => {
              e.stopPropagation();
              openDialog('deletePost', {
                postId: id,
              });
            }}
            className='flex items-center -space-x-1 group w-fit absolute top-1/2 -translate-y-1/2 right-0 cursor-pointer'
          >
            {isMyPost && (
              <section className='rounded-full p-2 group-hover:bg-destructive/5 transition'>
                <Trash2 className='w-6 h-6 text-slate-400 group-hover:text-destructive transition' />
              </section>
            )}
          </section>
        </section>
      </div>
    </div>
  );
}

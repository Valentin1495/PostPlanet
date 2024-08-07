'use client';

import { PostProps } from './post';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import ProfileImage from './profile-image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useToggleFollow } from '@/hooks/use-toggle-follow';
import { useToggleLike } from '@/hooks/use-toggle-like';
import ChatBubble from '@/components/icons/chat-bubble';
import FilledHeart from '@/components/icons/filled-heart';
import Heart from '@/components/icons/heart';
import ReplyDialog from './reply-dialog';
import { Trash2 } from 'lucide-react';
import DeleteDialog from './delete-dialog';

export type ClientPostProps = Omit<PostProps, 'createdAt'> & {
  username: string;
  name: string;
  profileImage: string;
  followers: number;
  isMyPost: boolean;
  bio: string | null;
  myFollowingIds: string[];
  authorFollowingIds: string[];
  currentUserId: string;
  likedIds: string[];
  hasLiked?: boolean;
  replyCount: number;
  createdAt: string;
  myProfilePic?: string;
};

export default function ClientPost({
  text,
  id,
  image,
  createdAt,
  authorId,
  likedIds,
  username,
  name,
  profileImage,
  followers,
  isMyPost,
  bio,
  myFollowingIds,
  authorFollowingIds,
  currentUserId,
  hasLiked,
  replyCount,
  myProfilePic,
}: ClientPostProps) {
  const router = useRouter();
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
  const pathname = usePathname();
  const isProfileReplies = pathname.includes('/with-replies');

  return (
    <div
      className='px-3 pt-3 pb-0.5 flex gap-2 hover:bg-secondary/50 transition cursor-pointer'
      onClick={() => router.push(`/post/${id}`)}
    >
      <div>
        <ProfileImage
          bio={bio}
          followingIds={authorFollowingIds}
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
            {createdAt}
          </span>
        </section>

        <section className='space-y-2'>
          <p>{text}</p>
          {image && (
            <article className='relative aspect-video rounded-xl overflow-hidden'>
              <Image src={image} alt='image' fill />
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
            createdAt={createdAt}
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

          <section
            className='flex items-center -space-x-1 group w-fit absolute top-1/2 -translate-y-1/2 left-1/4'
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
          >
            <section className='rounded-full p-2 group-hover:bg-rose-700/10 transition'>
              {optimisticHasLiked ? (
                <FilledHeart filledHeartProps='w-[18px] h-[18px] text-rose-700' />
              ) : (
                <Heart heartProps='w-[18px] h-[18px] text-slate-400 group-hover:text-rose-700 transition' />
              )}
            </section>
            <span
              className={cn(
                optimisticHasLiked
                  ? 'text-rose-700'
                  : 'group-hover:text-rose-700 transition',
                'text-sm font-medium'
              )}
            >
              {optimisticLikes ? optimisticLikes : null}
            </span>
          </section>

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

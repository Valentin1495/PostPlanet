'use client';

import { PostProps } from './post';
import Image from 'next/image';
import { cn, formatDate } from '@/lib/utils';
import ProfileImage from './profile-image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import { useRouter } from 'next/navigation';
import { useToggleFollow } from '@/hooks/use-toggle-follow';
import { useToggleLike } from '@/hooks/use-toggle-like';
import { FilledHeart, Heart } from '@/lib/icons';

type ClientPostProps = PostProps & {
  username: string;
  name: string;
  profileImage: string;
  followers: number;
  isMyPost: boolean;
  isFollowing?: boolean;
  bio: string | null;
  followingIds: string[];
  likedIds: string[];
  hasLiked?: boolean;
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
  likedIds,
  hasLiked,
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
  const likes = likedIds.length;
  const { optimisticHasLiked, optimisticLikes, toggleLike } = useToggleLike(
    likes,
    id,
    hasLiked
  );

  return (
    <div
      className='border-b-2 border-secondary px-3 pt-3 pb-0.5 flex gap-2 hover:bg-secondary transition cursor-pointer'
      onClick={() => router.push(`/post/${id}`)}
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
            className='font-bold hover:underline truncate max-w-32 xl:max-w-52'
            onClick={(e) => e.stopPropagation()}
          >
            {name}
          </Link>
          <Link
            href={`/${username}`}
            className='text-muted-foreground mb-0.5 truncate max-w-32 xl:max-w-52'
            onClick={(e) => e.stopPropagation()}
          >
            @{username}
          </Link>
          <span className='text-muted-foreground mb-0.5'>·</span>
          <span className='text-muted-foreground mb-0.5 min-w-fit'>
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

        <section className='-ml-2'>
          <section
            className='flex items-center -space-x-1 group w-fit'
            onClick={(e) => {
              e.stopPropagation();
              toggleLike();
            }}
          >
            <section
              className={cn(
                'rounded-full p-2 group-hover:bg-rose-500/5 transition'
              )}
            >
              {optimisticHasLiked ? (
                <FilledHeart FilledHeartProps='w-[18px] h-[18px] text-rose-500' />
              ) : (
                <Heart HeartProps='w-[18px] h-[18px] group-hover:text-rose-500 transition' />
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
              {optimisticLikes}
            </span>
          </section>
        </section>
      </div>
    </div>
  );
}

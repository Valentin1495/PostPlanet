import Image from 'next/image';
import { checkFollow, countFollowers, readUser } from '@/actions/user.actions';
import { User } from '@prisma/client';
import { formatDate } from '@/lib/utils';
import ProfileImage from './profile-image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';

type PostProps = {
  id: string;
  text: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  likedIds: string[];
  authorId: string;
  currentUserId?: string;
};

export default async function Post({
  id,
  text,
  image,
  createdAt,
  updatedAt,
  likedIds,
  authorId,
  currentUserId,
}: PostProps) {
  const author = (await readUser(authorId)) as User;
  const { username, name, profileImage } = author;
  const followers = await countFollowers(username);
  const isMyPost = authorId === currentUserId;
  const isFollowing = await checkFollow(username);

  return (
    <div className='border-b-2 border-secondary p-3 flex gap-2'>
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
          {...author}
          followers={followers}
          isFollowing={isFollowing}
        />
      )}
      <div className='w-full'>
        <section className='flex text-sm gap-1.5 items-center'>
          <Link href={`/${username}`} className='font-bold hover:underline'>
            {name}
          </Link>
          <Link href={`/${username}`} className='text-muted-foreground mb-0.5'>
            @{username}
          </Link>
          <span className='text-muted-foreground mb-0.5'>·</span>
          <span className='text-muted-foreground mb-0.5'>
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
        <section></section>
      </div>
    </div>
  );
}

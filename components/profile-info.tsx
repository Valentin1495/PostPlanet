import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';

type ProfileInfoProps = {
  profileImage: string;
  name: string;
  username: string;
  createdAt: Date;
  followingIds: string[];
  followers: number;
};

export default function ProfileInfo({
  profileImage,
  name,
  username,
  createdAt,
  followers,
  followingIds,
}: ProfileInfoProps) {
  const timestamp = format(createdAt, 'MMMM yyyy');
  const following = followingIds.length;

  return (
    <div className='flex flex-col items-center p-3 gap-4'>
      <Link
        href={profileImage}
        target='_blank'
        className='mx-auto inline-block'
      >
        <Avatar className='w-32 h-32 darker'>
          <AvatarImage src={profileImage} alt='profile picture' />
          <AvatarFallback className='bg-primary/10'>
            <Skeleton className='rounded-full' />
          </AvatarFallback>
        </Avatar>
      </Link>

      <section className='text-center'>
        <h1 className='font-bold text-lg'>{name}</h1>
        <h2 className='text-muted-foreground text-sm'>@{username}</h2>
      </section>

      <section className='flex items-center text-muted-foreground text-sm gap-1.5'>
        <CalendarDays size={16} />
        Joined {timestamp}
      </section>

      <section className='text-sm space-x-5'>
        <Link
          href={`/${username}/following`}
          className='text-muted-foreground hover:underline'
        >
          <span className='font-semibold text-foreground'>{following}</span>{' '}
          Following
        </Link>
        <Link
          href={`/${username}/followers`}
          className='text-muted-foreground hover:underline'
        >
          <span className='font-semibold text-foreground'>{followers}</span>{' '}
          Followers
        </Link>
      </section>
    </div>
  );
}

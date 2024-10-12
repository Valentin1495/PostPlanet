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
};

export default function ProfileInfo({
  profileImage,
  name,
  username,
  createdAt,
}: ProfileInfoProps) {
  const timestamp = format(createdAt, 'MMMM yyyy');

  return (
    <div className='flex flex-col items-center p-3 gap-4'>
      {profileImage.includes('#') ? (
        <section
          className='size-32 rounded-full'
          style={{
            backgroundColor: profileImage,
          }}
        />
      ) : (
        <Link
          href={profileImage}
          target='_blank'
          className='mx-auto inline-block'
        >
          <Avatar className='size-32 darker'>
            <AvatarImage src={profileImage} alt='profile picture' />
            <AvatarFallback className='bg-primary/10'>
              <Skeleton className='rounded-full' />
            </AvatarFallback>
          </Avatar>
        </Link>
      )}

      <section className='text-center'>
        <h1 className='font-bold text-xl'>{name}</h1>
        <h2 className='text-muted-foreground'>@{username}</h2>
      </section>

      <section className='flex items-center text-muted-foreground text-sm gap-1.5'>
        <CalendarDays size={16} />
        Joined {timestamp}
      </section>
    </div>
  );
}

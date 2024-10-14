'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileImage from './profile-image';

export type SingleUserProps = {
  username: string;
  name: string;
  bio: string | null;
  profileImage: string;
};

export default function SingleUser({
  username,
  name,
  bio,
  profileImage,
}: SingleUserProps) {
  const router = useRouter();

  return (
    <div className='px-4 py-2 hover:bg-secondary/50 transition cursor-pointer'>
      <div
        className='flex gap-2'
        onClick={() => router.push(`/${username}/posts`)}
      >
        <ProfileImage
          bio={bio}
          name={name}
          username={username}
          profileImage={profileImage}
        />

        <div className='space-y-1.5 w-full'>
          <div className='flex justify-between'>
            <section className='flex flex-col text-sm'>
              <Link
                href={`/${username}/posts`}
                onClick={(e) => e.stopPropagation()}
                className='font-semibold hover:underline'
              >
                {name}
              </Link>
              <Link
                href={`/${username}/posts`}
                onClick={(e) => e.stopPropagation()}
                className='text-muted-foreground'
              >
                @{username}
              </Link>
            </section>
          </div>
          {bio && <p>{bio}</p>}
        </div>
      </div>
    </div>
  );
}

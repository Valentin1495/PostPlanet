'use client';

import ProfileImage from './profile-image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type RandomUserProps = {
  profileImage: string;
  username: string;
  name: string;
  id: string;
  bio: string | null;

  currentUserId: string;
};

export default function RandomUser({
  profileImage,
  username,
  name,
  id,
  bio,
  currentUserId,
}: RandomUserProps) {
  const isCurrentUser = currentUserId === id;
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/${username}/posts`)}
      className='flex items-center gap-2 hover:bg-primary/5 p-3 last:rounded-b-lg transition cursor-pointer'
    >
      <ProfileImage
        randomUser
        profileImage={profileImage}
        username={username}
        name={name}
        bio={bio}
        isCurrentUser={isCurrentUser}
      />

      <section className='mr-auto flex flex-col'>
        <Link
          href={`/${username}/posts`}
          className='font-semibold hover:underline truncate lg:max-w-28 xl:max-w-44'
        >
          {name}
        </Link>
        <Link
          href={`/${username}/posts`}
          className='truncate text-sm lg:max-w-28 xl:max-w-44'
        >
          @{username}
        </Link>
      </section>
    </div>
  );
}

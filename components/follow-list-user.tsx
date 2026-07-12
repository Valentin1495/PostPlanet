'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProfileImage from './profile-image';
import FollowButton from './follow-button';
import { User } from '@/lib/types';

type FollowListUserProps = User & {
  currentUserId: string;
  currentUser?: User | null;
  onNavigate?: () => void;
};

export default function FollowListUser({
  id,
  username,
  name,
  bio,
  profileImage,
  createdAt,
  updatedAt,
  currentUserId,
  currentUser,
  onNavigate,
}: FollowListUserProps) {
  const router = useRouter();
  const isMyProfile = currentUserId === id;
  const user = { id, username, name, bio, profileImage, createdAt, updatedAt };

  const goToProfile = () => {
    onNavigate?.();
    router.push(`/${username}/posts`);
  };

  return (
    <div className='px-4 py-2 hover:bg-secondary/50 transition cursor-pointer'>
      <div className='flex gap-2'>
        <div onClick={goToProfile} className='flex gap-2 flex-1 min-w-0'>
          <ProfileImage
            bio={bio}
            name={name}
            username={username}
            profileImage={profileImage}
          />

          <div className='space-y-1.5 w-full min-w-0'>
            <section className='flex flex-col text-sm'>
              <Link
                href={`/${username}/posts`}
                onClick={(e) => e.stopPropagation()}
                className='font-semibold hover:underline truncate'
              >
                {name}
              </Link>
              <Link
                href={`/${username}/posts`}
                onClick={(e) => e.stopPropagation()}
                className='text-muted-foreground truncate'
              >
                @{username}
              </Link>
            </section>
            {bio && <p className='truncate'>{bio}</p>}
          </div>
        </div>

        {!isMyProfile && currentUserId && (
          <div onClick={(e) => e.stopPropagation()} className='shrink-0'>
            <FollowButton
              userId={id}
              currentUserId={currentUserId}
              user={user}
              currentUser={currentUser}
              className='h-9 px-4 text-sm'
            />
          </div>
        )}
      </div>
    </div>
  );
}

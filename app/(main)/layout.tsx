import type { Metadata } from 'next';
import '@/app/globals.css';
import LeftSidebar from '@/components/left-sidebar';
import RightSidebar from '@/components/right-sidebar';
import { fetchUserId, readUser } from '@/actions/user.actions';
import { User } from '@prisma/client';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Home / PostPlanet',
  description:
    'Connect, share, and engage on our dynamic social media platform, where users can effortlessly post content, interact through likes and comments, and stay updated with friends and trends.',
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = await fetchUserId();

  if (!userId) {
    redirect('/');
  }

  const { username, profileImage } = (await readUser(userId)) as User;

  return (
    <div className='flex items-start max-w-3xl lg:max-w-6xl xl:max-w-7xl mx-auto lg:pr-8 xl:px-5'>
      <LeftSidebar
        username={username}
        userId={userId}
        profileImage={profileImage}
      />
      <div className='w-full border-l sm:border-r'>{children}</div>
      <RightSidebar userId={userId} />
    </div>
  );
}

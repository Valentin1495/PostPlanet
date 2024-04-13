import type { Metadata } from 'next';
import '@/app/globals.css';
import { countPosts } from '@/actions/post.actions';
import { countFollowers, readUser, readUserId } from '@/actions/user.actions';
import { User } from '@prisma/client';
import Header from '@/components/header';
import ProfileInfo from '@/components/profile-info';
import ProfileTabs from '@/components/profile-tabs';
import { profileTabItems } from '@/constants';

export const metadata: Metadata = {
  title: 'PostPlanet',
  description:
    'A vibrant social media platform designed for quick, engaging conversations, allowing users to share updates, follow trends, and connect with a global community in real-time',
};

export default async function ProfileLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    username: string;
  };
}>) {
  const userId = (await readUserId(params.username)) as string;
  const user = (await readUser(userId)) as User;
  const followers = await countFollowers(userId);
  const postCount = await countPosts(userId);

  return (
    <div>
      <Header postCount={postCount} name={user.name} isPostPage={false} />
      <ProfileInfo {...user} followers={followers} />
      <ProfileTabs username={user.username} tabItems={profileTabItems} />
      {children}
    </div>
  );
}

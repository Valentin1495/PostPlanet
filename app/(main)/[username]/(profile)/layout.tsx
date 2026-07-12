import '@/app/globals.css';
import { countPosts } from '@/actions/post.actions';
import { fetchUserId, readUser, readUserId } from '@/actions/user.actions';
import Header from '@/components/header';
import ProfileInfo from '@/components/profile-info';
import ProfileTabs from '@/components/profile-tabs';
import { profileTabItems } from '@/constants';
import { notFound } from 'next/navigation';

export default async function ProfileLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    username: string;
  }>;
}>) {
  const { username } = await params;
  const userId = await readUserId(username);
  if (!userId) notFound();

  const user = await readUser(userId);
  if (!user) notFound();

  const postCount = await countPosts(userId);
  const currentUserId = await fetchUserId();
  const currentUser =
    currentUserId === userId ? user : await readUser(currentUserId);

  return (
    <div>
      <Header postCount={postCount} name={user.name} isPostPage={false} />
      <ProfileInfo
        {...user}
        user={user}
        createdAt={new Date(user.createdAt)}
        currentUserId={currentUserId ?? ''}
        currentUser={currentUser}
      />
      <ProfileTabs username={user.username} tabItems={profileTabItems} />
      {children}
    </div>
  );
}

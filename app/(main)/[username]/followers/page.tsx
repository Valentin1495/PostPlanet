import { fetchUserId, readUser, readUserId } from '@/actions/user.actions';
import Header from '@/components/header';
import FollowListView from '@/components/follow-list-view';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type ProfileFollowersProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProfileFollowersProps): Promise<Metadata> {
  const { username } = await params;
  const userId = await readUserId(username);
  const user = await readUser(userId);

  return {
    title: `People following ${user?.name ?? username} (@${username}) / PostPlanet `,
  };
}

export default async function ProfileFollowers({
  params,
}: ProfileFollowersProps) {
  const { username } = await params;
  const userId = await readUserId(username);
  if (!userId) notFound();

  const user = await readUser(userId);
  if (!user) notFound();

  const currentUserId = await fetchUserId();
  const currentUser =
    currentUserId === userId ? user : await readUser(currentUserId);

  return (
    <main className='min-h-screen'>
      <Header name={user.name} isFollowListPage />
      <FollowListView
        username={username}
        userId={userId}
        currentUserId={currentUserId ?? ''}
        currentUser={currentUser}
        tab='followers'
      />
    </main>
  );
}

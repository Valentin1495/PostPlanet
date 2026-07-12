import { fetchUserId, readUser, readUserId } from '@/actions/user.actions';
import { Metadata } from 'next';
import UserPosts from '@/components/user-posts';
import { notFound } from 'next/navigation';

type ProfilePostsProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProfilePostsProps): Promise<Metadata> {
  const { username } = await params;
  const userId = await readUserId(username);
  const user = await readUser(userId);

  return {
    title: `${user?.name ?? username} (@${username}) / PostPlanet `,
  };
}

export default async function ProfilePosts({ params }: ProfilePostsProps) {
  const { username } = await params;
  const userId = await readUserId(username);
  if (!userId) notFound();

  const currentUserId = await fetchUserId();
  const user = await readUser(userId);
  if (!user) notFound();

  return (
    <main className='min-h-screen'>
      <UserPosts
        userId={userId}
        currentUserId={currentUserId ?? ''}
        profileImage={user.profileImage}
      />
    </main>
  );
}

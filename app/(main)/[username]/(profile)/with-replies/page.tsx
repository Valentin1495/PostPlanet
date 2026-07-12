import { fetchUserId, readUser, readUserId } from '@/actions/user.actions';
import RepliesByPost from '@/components/replies-by-post';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type ProfileRepliesProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProfileRepliesProps): Promise<Metadata> {
  const { username } = await params;
  const userId = await readUserId(username);
  const user = await readUser(userId);

  return {
    title: `Posts with replies by ${user?.name ?? username} (@${username}) / PostPlanet `,
  };
}

export default async function ProfileReplies({ params }: ProfileRepliesProps) {
  const { username } = await params;
  const userId = await readUserId(username);
  if (!userId) notFound();

  const user = await readUser(userId);
  if (!user) notFound();

  const currentUserId = await fetchUserId();

  return (
    <main className='min-h-screen'>
      <RepliesByPost
        currentUserId={currentUserId ?? ''}
        userId={userId}
        profileImage={user.profileImage}
      />
    </main>
  );
}

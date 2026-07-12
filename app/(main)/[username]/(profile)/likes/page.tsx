import { fetchUserId, readUser, readUserId } from '@/actions/user.actions';
import PostsLiked from '@/components/posts-liked';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type ProfileLikesProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProfileLikesProps): Promise<Metadata> {
  const { username } = await params;
  const userId = await readUserId(username);
  const user = await readUser(userId);

  return {
    title: `Posts liked by ${user?.name ?? username} (@${username}) / PostPlanet `,
  };
}

export default async function ProfileLikes({ params }: ProfileLikesProps) {
  const { username } = await params;
  const userId = await readUserId(username);
  if (!userId) notFound();

  const user = await readUser(userId);
  if (!user) notFound();

  const currentUserId = await fetchUserId();

  return (
    <main className='min-h-screen'>
      <PostsLiked
        userId={userId}
        currentUserId={currentUserId ?? ''}
        isProfilePage
        myProfilePic={user.profileImage}
      />
    </main>
  );
}

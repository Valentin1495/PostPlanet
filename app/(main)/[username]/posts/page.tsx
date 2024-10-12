import { fetchUserId, readUser, readUserId } from '@/actions/user.actions';
import { User } from '@prisma/client';
import { Metadata } from 'next';
import UserPosts from '@/components/user-posts';

type ProfilePostsProps = {
  params: {
    username: string;
  };
};

export async function generateMetadata({
  params,
}: ProfilePostsProps): Promise<Metadata> {
  const { username } = params;
  const userId = (await readUserId(username)) as string;
  const { name } = (await readUser(userId)) as User;

  return {
    title: `${name} (@${username}) / PostPlanet `,
  };
}

export default async function ProfilePosts({ params }: ProfilePostsProps) {
  const userId = (await readUserId(params.username)) as string;
  const currentUserId = await fetchUserId();
  const { profileImage, followingIds } = (await readUser(userId)) as User;

  return (
    <main className='min-h-screen'>
      <UserPosts
        userId={userId}
        currentUserId={currentUserId}
        profileImage={profileImage}
        followingIds={followingIds}
      />
    </main>
  );
}

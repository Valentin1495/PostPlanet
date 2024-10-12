import { fetchUserId, readUser, readUserId } from '@/actions/user.actions';
import PostsLiked from '@/components/posts-liked';
import { User } from '@prisma/client';
import { Metadata } from 'next';

type ProfileLikesProps = {
  params: {
    username: string;
  };
};

export async function generateMetadata({
  params,
}: ProfileLikesProps): Promise<Metadata> {
  const { username } = params;
  const userId = (await readUserId(username)) as string;
  const { name } = (await readUser(userId)) as User;

  return {
    title: `Posts liked by ${name} (@${username}) / PostPlanet `,
  };
}

export default async function ProfileLikes({ params }: ProfileLikesProps) {
  const userId = (await readUserId(params.username)) as string;
  const { profileImage, followingIds } = (await readUser(userId)) as User;
  const currentUserId = await fetchUserId();

  return (
    <main className='min-h-screen'>
      <PostsLiked
        userId={userId}
        currentUserId={currentUserId}
        isProfilePage
        myProfilePic={profileImage}
        myFollowingIds={followingIds}
      />
    </main>
  );
}

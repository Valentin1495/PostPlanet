import { readLikedPosts } from '@/actions/post.actions';
import { readUser, readUserId } from '@/actions/user.actions';
import Post from '@/components/post';
import { Post as SinglePost, User } from '@prisma/client';
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
  const { id, profileImage, followingIds } = (await readUser(userId)) as User;
  const likedPosts = (await readLikedPosts(userId)) as SinglePost[];

  if (!likedPosts.length)
    return <p className='min-h-screen text-center mt-10'>No Likes.</p>;
  return (
    <main className='min-h-screen'>
      {likedPosts.map((post) => (
        <Post
          {...post}
          key={post.id}
          currentUserId={id}
          myProfilePic={profileImage}
          myFollowingIds={followingIds}
          isProfilePage
        />
      ))}
    </main>
  );
}

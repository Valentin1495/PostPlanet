import { readPosts } from '@/actions/post.actions';
import { fetchUserId, readUser, readUserId } from '@/actions/user.actions';
import { User } from '@prisma/client';
import Post from '@/components/post';
import { Metadata } from 'next';

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
  const posts = await readPosts(userId);

  if (!posts.length)
    return <p className='min-h-screen text-center mt-10'>No posts.</p>;
  return (
    <main className='min-h-screen'>
      {posts.map((post) => (
        <Post
          {...post}
          key={post.id}
          currentUserId={currentUserId}
          myProfilePic={profileImage}
          myFollowingIds={followingIds}
          isProfilePage
        />
      ))}
    </main>
  );
}

import { readPosts } from '@/actions/post.actions';
import { readUser, readUserId } from '@/actions/user.actions';
import { User } from '@prisma/client';
import Post from '@/components/post';

type ProfilePostsProps = {
  params: {
    username: string;
  };
};

export default async function ProfilePosts({ params }: ProfilePostsProps) {
  const userId = (await readUserId(params.username)) as string;
  const { id, profileImage, followingIds } = (await readUser(userId)) as User;
  const posts = await readPosts(userId);

  if (!posts.length)
    return <p className='min-h-screen text-center mt-10'>No posts.</p>;
  return (
    <main className='min-h-screen'>
      {posts.map((post) => (
        <Post
          {...post}
          key={post.id}
          currentUserId={id}
          myProfilePic={profileImage}
          myFollowingIds={followingIds}
        />
      ))}
    </main>
  );
}

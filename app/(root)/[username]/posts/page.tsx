import { readPosts } from '@/actions/post.actions';
import { readCurrentUser, readUserId } from '@/actions/user.actions';
import { User } from '@prisma/client';
import Post from '@/components/post';

type ProfilePostsProps = {
  params: {
    username: string;
  };
};

export default async function ProfilePosts({ params }: ProfilePostsProps) {
  const { id, profileImage } = (await readCurrentUser()) as User;
  const userId = (await readUserId(params.username)) as string;
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
        />
      ))}
    </main>
  );
}

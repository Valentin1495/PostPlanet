import { readLikedPosts } from '@/actions/post.actions';
import { readCurrentUser, readUserId } from '@/actions/user.actions';
import Post from '@/components/post';
import { Post as SinglePost, User } from '@prisma/client';

type ProfileLikesProps = {
  params: {
    username: string;
  };
};

export default async function ProfileLikes({ params }: ProfileLikesProps) {
  const userId = (await readUserId(params.username)) as string;
  const { id, profileImage } = (await readCurrentUser()) as User;
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
        />
      ))}
    </main>
  );
}

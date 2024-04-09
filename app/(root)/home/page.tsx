import { readCurrentUser } from '@/actions/user.actions';
import { redirect } from 'next/navigation';
import { readAllPosts } from '@/actions/post.actions';
import FeedTab from '@/components/feed-tab';
import Post from '@/components/post';
import PostForm from '@/components/post-form';
import { Post as SinglePost, User } from '@prisma/client';

export default async function Home() {
  const onboardedUser = (await readCurrentUser()) as User;
  const { profileImage, id: onboardedUserId, username } = onboardedUser;
  const allPosts = (await readAllPosts()) as SinglePost[];

  if (!onboardedUser) {
    redirect('/onboarding');
  }

  return (
    <main className='min-h-screen'>
      <FeedTab />
      <PostForm isForPost profileImage={profileImage} username={username} />
      {allPosts.map((post) => (
        <Post
          {...post}
          key={post.id}
          currentUserId={onboardedUserId}
          myProfilePic={profileImage}
        />
      ))}
      <p className='text-center py-10'>No more posts.</p>
    </main>
  );
}

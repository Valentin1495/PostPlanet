import { readCurrentUser } from '@/actions/user.actions';
import { redirect } from 'next/navigation';
import { readAllPosts } from '@/actions/post.actions';
import Tabs from '@/components/tabs';
import Post from '@/components/post';
import PostForm from '@/components/post-form';
import { Post as SinglePost, User } from '@prisma/client';
import { feedTabItems } from '@/constants';

export default async function Home() {
  const onboardedUser = (await readCurrentUser()) as User;
  const { profileImage, id: onboardedUserId, username } = onboardedUser;
  const allPosts = (await readAllPosts()) as SinglePost[];

  if (!onboardedUser) {
    redirect('/onboarding');
  }

  return (
    <main className='min-h-screen'>
      <Tabs tabItems={feedTabItems} />
      <PostForm isForPost profileImage={profileImage} username={username} />
      {allPosts.map((post) => (
        <Post
          {...post}
          key={post.id}
          currentUserId={onboardedUserId}
          myProfilePic={profileImage}
        />
      ))}
    </main>
  );
}

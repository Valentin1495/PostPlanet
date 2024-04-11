import { redirect } from 'next/navigation';
import { readAllPosts } from '@/actions/post.actions';
import Tabs from '@/components/tabs';
import Post from '@/components/post';
import PostForm from '@/components/post-form';
import { Post as SinglePost, User } from '@prisma/client';
import { feedTabItems } from '@/constants';
import { currentUser } from '@clerk/nextjs';
import { readUser } from '@/actions/user.actions';
import { User as U } from '@clerk/nextjs/server';

export default async function Home() {
  const user = (await currentUser()) as U;
  const {
    profileImage,
    id: onboardedUserId,
    username,
    followingIds,
  } = (await readUser(user.id)) as User;
  const allPosts = (await readAllPosts()) as SinglePost[];

  if (!onboardedUserId) {
    redirect('/onboarding');
  }

  return (
    <main className='min-h-screen'>
      <Tabs tabItems={feedTabItems} />
      <PostForm
        isForPost
        profileImage={profileImage}
        username={username}
        userId={onboardedUserId}
      />
      {allPosts.map((post) => (
        <Post
          {...post}
          key={post.id}
          currentUserId={onboardedUserId}
          myProfilePic={profileImage}
          myFollowingIds={followingIds}
        />
      ))}
    </main>
  );
}

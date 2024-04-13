import { redirect } from 'next/navigation';
import { readAllPosts, readFollowingPosts } from '@/actions/post.actions';
import Post from '@/components/post';
import PostForm from '@/components/post-form';
import { Post as SinglePost, User } from '@prisma/client';
import { currentUser } from '@clerk/nextjs';
import { readUser } from '@/actions/user.actions';
import { User as U } from '@clerk/nextjs/server';
import FeedTabs from '@/components/feed-tabs';

type HomeProps = {
  searchParams: {
    f: string;
  };
};

export default async function Home({ searchParams }: HomeProps) {
  const user = (await currentUser()) as U;
  const {
    profileImage,
    id: onboardedUserId,
    username,
    followingIds,
  } = (await readUser(user.id)) as User;
  let posts;

  if (!onboardedUserId) {
    redirect('/onboarding');
  }

  const { f } = searchParams;
  if (f === 'following') {
    posts = (await readFollowingPosts(followingIds)) as SinglePost[];
  } else {
    posts = (await readAllPosts()) as SinglePost[];
  }

  return (
    <main className='min-h-screen'>
      <FeedTabs f={f} />
      <PostForm
        isForPost
        profileImage={profileImage}
        username={username}
        userId={onboardedUserId}
      />
      {posts.length ? (
        posts.map((post) => (
          <Post
            {...post}
            key={post.id}
            currentUserId={onboardedUserId}
            myProfilePic={profileImage}
            myFollowingIds={followingIds}
          />
        ))
      ) : (
        <p className='text-center py-10'>No posts.</p>
      )}
    </main>
  );
}

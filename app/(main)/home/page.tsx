import { redirect } from 'next/navigation';
import { readAllPosts, readFollowingPosts } from '@/actions/post.actions';
import Post from '@/components/post';
import PostForm from '@/components/post-form';
import { Post as SinglePost, User } from '@prisma/client';
import { fetchUserId, readUser } from '@/actions/user.actions';
import FeedTabs from '@/components/feed-tabs';

type HomeProps = {
  searchParams: {
    f: string;
  };
};

export default async function Home({ searchParams }: HomeProps) {
  const userId = await fetchUserId();

  if (!userId) {
    redirect('/onboarding');
  }

  const { profileImage, id, username, followingIds } = (await readUser(
    userId
  )) as User;
  let posts;

  const { f } = searchParams;

  if (f === 'following') {
    posts = (await readFollowingPosts(followingIds)) as SinglePost[];
  } else {
    posts = (await readAllPosts()) as SinglePost[];
  }

  return (
    <main className='min-h-screen w-full'>
      <FeedTabs f={f} />
      <PostForm
        isForPost
        profileImage={profileImage}
        username={username}
        userId={id}
      />
      {posts.length ? (
        posts.map((post) => (
          <Post
            {...post}
            key={post.id}
            currentUserId={id}
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

import { redirect } from 'next/navigation';
import { readAllPosts, readFollowingPosts } from '@/actions/post.actions';
import Post from '@/components/post';
import PostForm from '@/components/post-form';
import { Post as SinglePost, User } from '@prisma/client';
import { readUser } from '@/actions/user.actions';
import FeedTabs from '@/components/feed-tabs';
import { auth } from '@clerk/nextjs';
import SimplePost from '@/components/simple-post';
import SimplePostForm from '@/components/simple-post-form';

type HomeProps = {
  searchParams: {
    f: string;
  };
};

export default async function Home({ searchParams }: HomeProps) {
  const { userId } = auth();

  if (userId) {
    const {
      profileImage,
      id: onboardedUserId,
      username,
      followingIds,
    } = (await readUser(userId)) as User;
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
      <main className='min-h-screen w-full'>
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
  } else {
    const posts = (await readAllPosts()) as SinglePost[];

    return (
      <main className='min-h-screen w-full'>
        <SimplePostForm />

        {posts.map((post) => (
          <SimplePost key={post.id} {...post} />
        ))}
      </main>
    );
  }
}

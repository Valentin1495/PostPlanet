import { readFollowingPosts } from '@/actions/post.actions';
import Tabs from '@/components/tabs';
import Post from '@/components/post';
import PostForm from '@/components/post-form';
import { Post as SinglePost, User } from '@prisma/client';
import { feedTabItems } from '@/constants';
import { readUser } from '@/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { User as U } from '@clerk/nextjs/server';

export default async function FollowingPosts() {
  const user = (await currentUser()) as U;
  const {
    profileImage,
    id: currentUserId,
    username,
    followingIds,
  } = (await readUser(user.id)) as User;
  const followingPosts = (await readFollowingPosts(
    followingIds
  )) as SinglePost[];

  return (
    <main className='min-h-screen'>
      <Tabs tabItems={feedTabItems} />
      <PostForm
        isForPost
        profileImage={profileImage}
        username={username}
        userId={currentUserId}
      />
      {followingPosts.length ? (
        followingPosts.map((post) => (
          <Post
            {...post}
            key={post.id}
            currentUserId={currentUserId}
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

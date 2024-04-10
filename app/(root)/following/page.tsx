import { readFollowingPosts } from '@/actions/post.actions';
import { readCurrentUser } from '@/actions/user.actions';
import Tabs from '@/components/tabs';
import Post from '@/components/post';
import PostForm from '@/components/post-form';
import { Post as SinglePost, User } from '@prisma/client';
import { feedTabItems } from '@/constants';

export default async function FollowingPosts() {
  const currentUser = (await readCurrentUser()) as User;
  const { profileImage, id: currentUserId, username } = currentUser;
  const followingPosts = (await readFollowingPosts()) as SinglePost[];

  return (
    <main className='min-h-screen'>
      <Tabs tabItems={feedTabItems} />
      <PostForm isForPost profileImage={profileImage} username={username} />
      {followingPosts.length ? (
        followingPosts.map((post) => (
          <Post {...post} key={post.id} currentUserId={currentUserId} />
        ))
      ) : (
        <p className='text-center py-10'>No posts.</p>
      )}
    </main>
  );
}

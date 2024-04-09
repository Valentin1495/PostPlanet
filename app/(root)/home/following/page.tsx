import { readFollowingPosts } from '@/actions/post.actions';
import { readCurrentUser } from '@/actions/user.actions';
import FeedTab from '@/components/feed-tab';
import Post from '@/components/post';
import PostForm from '@/components/post-form';
import { Post as SinglePost, User } from '@prisma/client';

export default async function FollowingPosts() {
  const currentUser = (await readCurrentUser()) as User;
  const { profileImage, id: currentUserId, username } = currentUser;
  const followingPosts = (await readFollowingPosts()) as SinglePost[];

  return (
    <main className='min-h-screen'>
      <FeedTab />
      <PostForm isForPost profileImage={profileImage} username={username} />
      {followingPosts.map((post) => (
        <Post {...post} key={post.id} currentUserId={currentUserId} />
      ))}
      <p className='text-center py-10'>No posts.</p>
    </main>
  );
}

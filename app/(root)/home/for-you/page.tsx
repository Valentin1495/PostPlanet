import { readAllPosts } from '@/actions/post.actions';
import { readCurrentUser } from '@/actions/user.actions';
import FeedTab from '@/components/feed-tab';
import Post from '@/components/post';
import PostForm from '@/components/post-form';
import { Post as SinglePost, User } from '@prisma/client';

export default async function ForYouPosts() {
  const currentUser = (await readCurrentUser()) as User;
  const { profileImage, id: currentUserId, username } = currentUser;
  const allPosts = (await readAllPosts()) as SinglePost[];

  return (
    <main className='min-h-screen'>
      <FeedTab />
      <PostForm profileImage={profileImage} username={username} />
      {allPosts.map((post) => (
        <Post {...post} key={post.id} currentUserId={currentUserId} />
      ))}
      <p className='text-center py-10'>No more posts.</p>
    </main>
  );
}

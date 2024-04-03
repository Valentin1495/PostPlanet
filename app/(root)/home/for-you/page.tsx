import { readAllPosts } from '@/actions/post.actions';
import { readCurrentUser } from '@/actions/user.actions';
import FeedTab from '@/components/feed-tab';
import Post from '@/components/post';
import PostForm from '@/components/post-form';

export default async function ForYouPosts() {
  const currentUser = await readCurrentUser();
  const profilePic = currentUser?.profileImage;
  const currentUserId = currentUser?.id;
  const username = currentUser?.username;
  const allPosts = await readAllPosts();

  return (
    <main className='min-h-screen'>
      <FeedTab />
      <PostForm profilePic={profilePic} username={username} />
      {allPosts?.map((post) => (
        <Post {...post} key={post.id} currentUserId={currentUserId} />
      ))}
      <p className='text-center py-10'>No more posts.</p>
    </main>
  );
}

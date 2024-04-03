import { readAllPosts } from '@/actions/post.actions';
import { readCurrentUser } from '@/actions/user.actions';
import FeedTab from '@/components/feed-tab';
import Post from '@/components/post';
import PostForm from '@/components/post-form';

export default async function ForYouPosts() {
  const onBoardedUser = await readCurrentUser();
  const profilePic = onBoardedUser?.profileImage;
  const allPosts = await readAllPosts();

  return (
    <main className='min-h-screen'>
      <FeedTab />
      <PostForm profilePic={profilePic} />
      {allPosts?.map((post) => (
        <Post {...post} key={post.id} />
      ))}
      <p className='text-center py-10'>No more posts.</p>
    </main>
  );
}

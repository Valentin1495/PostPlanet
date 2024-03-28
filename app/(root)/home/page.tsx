import FeedTab from '@/components/feed-tab';
import PostForm from '@/components/post-form';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

type SearchParams = {
  feed: string;
};

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { feed } = searchParams;
  const user = await currentUser();
  const profilePic = user?.imageUrl;

  if (!feed) redirect('/home?feed=for-you');

  return (
    <main className='min-h-screen'>
      <FeedTab feed={feed} />
      <PostForm profilePic={profilePic} />
    </main>
  );
}

import { getUser } from '@/app/actions';
import FeedTab from '@/components/feed-tab';
import PostForm from '@/components/post-form';
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
  const user = await getUser();
  const profilePic = user?.profileImage;

  if (!user) redirect('/onboarding');
  if (!feed) redirect('/home?feed=for-you');

  return (
    <main className='min-h-screen'>
      <FeedTab feed={feed} />
      <PostForm profilePic={profilePic} />
    </main>
  );
}

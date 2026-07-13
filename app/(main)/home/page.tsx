import { redirect } from 'next/navigation';
import { fetchUserId, readUser } from '@/actions/user.actions';
import AllPosts from '@/components/all-posts';

export default async function Home() {
  const userId = await fetchUserId();

  if (!userId) {
    redirect('/');
  }

  const user = await readUser(userId);

  if (!user) redirect('/onboarding');

  return (
    <main className='min-h-screen w-full'>
      <AllPosts currentUser={user} />
    </main>
  );
}

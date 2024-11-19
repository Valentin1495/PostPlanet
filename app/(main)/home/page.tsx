import { redirect } from 'next/navigation';
import PostForm from '@/components/post-form';
import { fetchUserId, readUser } from '@/actions/user.actions';
import AllPosts from '@/components/all-posts';
import Header from '@/components/header';

export default async function Home() {
  const userId = await fetchUserId();

  if (!userId) {
    redirect('/onboarding');
  }

  const user = await readUser(userId);

  if (!user) return;
  const { username, profileImage } = user;

  return (
    <main className='min-h-screen w-full'>
      <Header isHomePage />
      <PostForm
        isForPost
        profileImage={profileImage}
        username={username}
        userId={userId}
      />
      <AllPosts currentUserId={userId} myProfileImage={profileImage} />
    </main>
  );
}

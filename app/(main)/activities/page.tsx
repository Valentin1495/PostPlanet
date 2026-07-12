import Header from '@/components/header';
import { fetchUserId } from '@/actions/user.actions';
import type { Metadata } from 'next';
import Activities from '@/components/activities';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Activities / PostPlanet',
};

export default async function ActivitiesPage() {
  const userId = await fetchUserId();

  if (!userId) {
    redirect('/');
  }

  return (
    <main className='min-h-screen'>
      <Header isActivitiesPage />

      <Activities userId={userId} />
    </main>
  );
}

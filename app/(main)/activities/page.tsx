import Header from '@/components/header';
import { fetchUserId } from '@/actions/user.actions';
import type { Metadata } from 'next';
import Activities from '@/components/activities';

export const metadata: Metadata = {
  title: 'Activities / PostPlanet',
};

export default async function ActivitiesPage() {
  const userId = await fetchUserId();

  return (
    <main className='min-h-screen'>
      <Header isActivitiesPage />

      <Activities userId={userId} />
    </main>
  );
}

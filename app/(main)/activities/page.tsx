import { readActivities } from '@/actions/activity.action';
import Header from '@/components/header';
import { Activity, User } from '@prisma/client';
import SingleActivity from '@/components/single-activity';
import { fetchUserId, readUser } from '@/actions/user.actions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activities / PostPlanet',
};

export default async function Activities() {
  const userId = await fetchUserId();
  const { id, followingIds } = (await readUser(userId)) as User;
  const activities = (await readActivities(id)) as Activity[];

  return (
    <main className='min-h-screen'>
      <Header isActivitiesPage />

      {activities.length ? (
        activities.map((activity) => (
          <SingleActivity
            {...activity}
            key={activity.id}
            followingIds={followingIds}
          />
        ))
      ) : (
        <p className='min-h-screen text-center mt-10'>No activities.</p>
      )}
    </main>
  );
}

import OnboardingForm from '@/components/onboarding-form';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { User as U } from '@clerk/nextjs/server';
import { readUser } from '@/actions/user.actions';
import { User } from '@prisma/client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding / PostPlanet',
};

export default async function Onboarding() {
  const { id, imageUrl, firstName, lastName } = (await currentUser()) as U;
  const onboardedUser = (await readUser(id)) as User;

  if (onboardedUser) redirect('/home');
  return (
    <main className='flex items-center justify-center min-h-screen'>
      <OnboardingForm
        imageUrl={imageUrl}
        firstName={firstName}
        lastName={lastName}
        userId={id}
      />
    </main>
  );
}

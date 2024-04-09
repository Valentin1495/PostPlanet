import { readCurrentUser } from '@/actions/user.actions';
import OnboardingForm from '@/components/onboarding-form';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Onboarding() {
  const onboardedUser = await readCurrentUser();
  const user = await currentUser();
  const imageUrl = user?.imageUrl;
  const firstName = user?.firstName;
  const lastName = user?.lastName;

  if (onboardedUser) redirect('/home');
  return (
    <main className='flex items-center justify-center min-h-screen'>
      <OnboardingForm
        imageUrl={imageUrl}
        firstName={firstName}
        lastName={lastName}
      />
    </main>
  );
}

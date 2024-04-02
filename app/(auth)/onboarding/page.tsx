import { readUser } from '@/actions/user.actions';
import OnboardingForm from '@/components/onboarding-form';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Onboarding() {
  const user = await readUser();
  const userLoggedIn = await currentUser();
  const imageUrl = userLoggedIn?.imageUrl;
  const firstName = userLoggedIn?.firstName;
  const lastName = userLoggedIn?.lastName;

  if (user) redirect('/home?feed=for-you');
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

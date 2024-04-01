import { getUser } from '@/app/actions';
import OnboardingForm from '@/components/onboarding-form';
import { redirect } from 'next/navigation';

export default async function Onboarding() {
  const user = await getUser();

  if (user) redirect('/home?feed=for-you');
  return (
    <main className='flex items-center justify-center min-h-screen'>
      <OnboardingForm />
    </main>
  );
}

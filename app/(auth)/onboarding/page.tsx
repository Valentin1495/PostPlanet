import OnboardingForm from '@/components/onboarding-form';
import { redirect } from 'next/navigation';
import {
  createGuestUser,
  fetchCurrentAuthUser,
  readUser,
} from '@/actions/user.actions';
import { Metadata } from 'next';
import { removeAllSpaces } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Onboarding / PostPlanet',
};

export default async function Onboarding() {
  const user = await fetchCurrentAuthUser();

  if (!user) {
    redirect('/');
  }

  const onboardedUser = await readUser(user.id);

  if (onboardedUser) redirect('/home');

  // Guests are here to try the app, not fill out a profile form - spin up a
  // randomized profile for them and drop them straight into the feed.
  if (user.is_anonymous) {
    await createGuestUser(user.id);
    redirect('/home');
  }

  const defaultName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    '';

  const defaultUsername =
    (user.user_metadata?.user_name as string | undefined) ??
    (user.user_metadata?.preferred_username as string | undefined) ??
    removeAllSpaces((user.email ?? '').split('@')[0] ?? '');

  const defaultProfileImage =
    (user.user_metadata?.avatar_url as string | undefined) ??
    (user.user_metadata?.picture as string | undefined) ??
    '';

  return (
    <main className='flex items-center justify-center min-h-screen'>
      <OnboardingForm
        userId={user.id}
        defaultName={defaultName}
        defaultUsername={defaultUsername}
        defaultProfileImage={defaultProfileImage}
      />
    </main>
  );
}

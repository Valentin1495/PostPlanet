import { redirect } from 'next/navigation';
import Image from 'next/image';
import { fetchCurrentAuthUser } from '@/actions/user.actions';
import LoginForm from '@/components/login-form';

export default async function Auth() {
  const user = await fetchCurrentAuthUser();

  if (user) {
    redirect('/onboarding');
  }

  return (
    <main className='center flex-col gap-3 min-h-screen'>
      <div className='flex items-center gap-3 mb-10'>
        <Image src='/logo.svg' alt='logo' width={60} height={60} />
        <h1 className='text-primary font-bold text-2xl'>PostPlanet</h1>
      </div>
      <LoginForm />
    </main>
  );
}

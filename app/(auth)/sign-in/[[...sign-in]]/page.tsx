import { SignIn } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in / PostPlanet',
};

export default function SignInPage() {
  return (
    <main className='flex justify-center items-center min-h-screen'>
      <SignIn />
    </main>
  );
}

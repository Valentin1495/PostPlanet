import { SignUp } from '@clerk/nextjs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign up / PostPlanet',
};

export default function SignUpPage() {
  return (
    <main className='flex justify-center items-center min-h-screen'>
      <SignUp />
    </main>
  );
}

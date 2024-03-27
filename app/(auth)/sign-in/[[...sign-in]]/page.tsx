import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className='flex justify-center items-center min-h-screen'>
      <SignIn />
    </main>
  );
}

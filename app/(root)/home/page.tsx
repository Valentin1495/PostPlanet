import { readUser } from '@/actions/user.actions';
import { redirect } from 'next/navigation';

export default async function Home() {
  const onBoardedUser = await readUser();

  if (!onBoardedUser) {
    redirect('/onboarding');
  } else {
    redirect('/home/for-you');
  }
}

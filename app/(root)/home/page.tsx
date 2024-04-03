import { readCurrentUser } from '@/actions/user.actions';
import { redirect } from 'next/navigation';

export default async function Home() {
  const onBoardedUser = await readCurrentUser();

  if (!onBoardedUser) {
    redirect('/onboarding');
  } else {
    redirect('/home/for-you');
  }
}

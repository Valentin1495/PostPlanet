import { readRandomUsers } from '@/actions/user.actions';
import { User } from '@prisma/client';
import RandomUser from './random-user';

export default async function RightSidebar() {
  const randomUsers = (await readRandomUsers()) as User[];

  return (
    <div className='sticky top-0 w-1/3 hidden lg:block p-5'>
      <div className='bg-secondary rounded-lg'>
        <h1 className='font-bold p-3'>Who to follow</h1>
        <div className='space-y-2'>
          {randomUsers.map((user) => (
            <RandomUser key={user.id} {...user} />
          ))}
        </div>
      </div>
    </div>
  );
}

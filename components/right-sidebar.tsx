import { readRandomUsers, readUser } from '@/actions/user.actions';
import { User } from '@prisma/client';
import RandomUser from './random-user';
import { currentUser } from '@clerk/nextjs';
import { User as U } from '@clerk/nextjs/server';

export default async function RightSidebar() {
  const user = (await currentUser()) as U;
  const loggedInUser = (await readUser(user.id)) as User;
  const randomUsers = await readRandomUsers(loggedInUser);

  return (
    <div className='sticky top-0 w-1/3 hidden lg:block p-5'>
      <div className='bg-slate-200 rounded-lg'>
        <h1 className='font-bold p-3'>Who to follow</h1>
        <div className='space-y-2'>
          {randomUsers.map((user) => (
            <RandomUser
              key={user.id}
              {...user}
              currentUserId={loggedInUser.id}
              myFollowingIds={loggedInUser.followingIds}
              userFollowingIds={user.followingIds}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

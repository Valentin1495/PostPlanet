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
    <div className='flex-item3 sticky top-0 pl-8 pt-5 hidden md:block'>
      <div className='bg-secondary rounded-lg hidden lg:block'>
        <h1 className='font-bold text-xl p-3'>Who to follow</h1>
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

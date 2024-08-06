import {
  fetchRandomUsers,
  readRandomUsers,
  readUser,
} from '@/actions/user.actions';
import RandomUser from './random-user';
import { auth } from '@clerk/nextjs';
import FakeUser from './fake-user';

export default async function RightSidebar() {
  const { userId } = auth();

  if (userId) {
    const loggedInUser = await readUser(userId);

    if (!loggedInUser) {
      throw new Error('User not found');
    }
    const randomUsers = await readRandomUsers(loggedInUser);

    return (
      <div className='lg:w-[500px] xl:w-[750px] sticky top-0 pl-5 xl:pl-8 pt-5 hidden md:block'>
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
  } else {
    const randomUsers = await fetchRandomUsers();

    return (
      <div className='lg:w-[500px] xl:w-[750px] sticky top-0 pl-5 xl:pl-8 pt-5 hidden md:block'>
        <div className='bg-secondary rounded-lg hidden lg:block'>
          <h1 className='font-bold text-xl p-3'>Who to follow</h1>
          <div className='space-y-2'>
            {randomUsers.map((user) => (
              <FakeUser key={user.id} {...user} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

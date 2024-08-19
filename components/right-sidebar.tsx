import { readRandomUsers, readUser } from '@/actions/user.actions';
import { User } from '@prisma/client';
import RandomUser from './random-user';

type RightSidebarProps = {
  userId: string;
};

export default async function RightSidebar({ userId }: RightSidebarProps) {
  const onboardedUser = (await readUser(userId)) as User;
  const randomUsers = await readRandomUsers(onboardedUser);

  return (
    <div className='lg:w-[500px] xl:w-[750px] sticky top-0 pl-5 xl:pl-8 pt-5 hidden md:block'>
      <div className='bg-secondary rounded-lg hidden lg:block'>
        <h1 className='font-bold text-xl p-3'>Who to follow</h1>
        <div className='space-y-2'>
          {randomUsers.map((user) => (
            <RandomUser
              key={user.id}
              {...user}
              currentUserId={onboardedUser.id}
              myFollowingIds={onboardedUser.followingIds}
              userFollowingIds={user.followingIds}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

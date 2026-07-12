import { readRandomUsers } from '@/actions/user.actions';
import RandomUser from './random-user';

type RightSidebarProps = {
  userId: string;
};

export default async function RightSidebar({ userId }: RightSidebarProps) {
  const randomUsers = await readRandomUsers(userId);

  return (
    <div className='lg:w-[500px] xl:w-[750px] sticky top-0 pl-5 xl:pl-8 pt-5 hidden md:block'>
      <div className='bg-secondary rounded-lg hidden lg:block'>
        <h1 className='font-bold text-xl p-3'>You might like</h1>
        <div className='space-y-2'>
          {randomUsers.map((user) => (
            <RandomUser key={user.id} {...user} currentUserId={userId} />
          ))}
        </div>
      </div>
    </div>
  );
}

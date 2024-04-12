import {
  readFollowingUsers,
  readUser,
  readUserId,
} from '@/actions/user.actions';
import SingleUser from '@/components/single-user';
import { currentUser } from '@clerk/nextjs';
import { User } from '@prisma/client';
import { User as U } from '@clerk/nextjs/server';

type FollowingProps = {
  params: {
    username: string;
  };
};
export default async function Following({ params }: FollowingProps) {
  const { id } = (await currentUser()) as U;
  const { followingIds } = (await readUser(id)) as User;
  const userId = (await readUserId(params.username)) as string;
  const followingUsers = (await readFollowingUsers(userId)) as User[];

  if (!followingUsers.length)
    return (
      <p className='min-h-screen text-center mt-10'>No following users.</p>
    );
  return (
    <main className='min-h-screen'>
      {followingUsers.map((user) => (
        <SingleUser
          key={user.id}
          {...user}
          myFollowingIds={followingIds}
          currentUserId={id}
        />
      ))}
    </main>
  );
}

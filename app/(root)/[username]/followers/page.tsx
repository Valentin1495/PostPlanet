import {
  readFollowers,
  readFollowingUsers,
  readUser,
  readUserId,
} from '@/actions/user.actions';
import SingleUser from '@/components/single-user';
import { currentUser } from '@clerk/nextjs';
import { User } from '@prisma/client';
import { User as U } from '@clerk/nextjs/server';

type FollowersProps = {
  params: {
    username: string;
  };
};
export default async function Followers({ params }: FollowersProps) {
  const { id } = (await currentUser()) as U;
  const { followingIds: myFollowingIds } = (await readUser(id)) as User;
  const userId = (await readUserId(params.username)) as string;
  const followers = (await readFollowers(userId)) as User[];

  if (!followers.length)
    return <p className='min-h-screen text-center mt-10'>No followers.</p>;
  return (
    <main className='min-h-screen'>
      {followers.map((user) => (
        <SingleUser
          key={user.id}
          {...user}
          myFollowingIds={myFollowingIds}
          currentUserId={id}
        />
      ))}
    </main>
  );
}

import {
  readFollowingUsers,
  readUser,
  readUserId,
} from '@/actions/user.actions';
import SingleUser from '@/components/single-user';
import { currentUser } from '@clerk/nextjs';
import { User } from '@prisma/client';
import { User as U } from '@clerk/nextjs/server';
import { Metadata } from 'next';

type FollowingProps = {
  params: {
    username: string;
  };
};

export async function generateMetadata({
  params,
}: FollowingProps): Promise<Metadata> {
  const { username } = params;
  const userId = (await readUserId(username)) as string;
  const { name } = (await readUser(userId)) as User;

  return {
    title: `People followed by ${name} (@${username}) / PostPlanet `,
  };
}

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

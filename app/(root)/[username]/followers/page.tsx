import { readFollowers, readUser, readUserId } from '@/actions/user.actions';
import SingleUser from '@/components/single-user';
import { currentUser } from '@clerk/nextjs';
import { User } from '@prisma/client';
import { User as U } from '@clerk/nextjs/server';
import { Metadata } from 'next';

type FollowersProps = {
  params: {
    username: string;
  };
};

export async function generateMetadata({
  params,
}: FollowersProps): Promise<Metadata> {
  const { username } = params;
  const userId = (await readUserId(username)) as string;
  const { name } = (await readUser(userId)) as User;

  return {
    title: `${name} (@${username}) / PostPlanet `,
  };
}

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

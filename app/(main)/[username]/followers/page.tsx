import {
  fetchUserId,
  readFollowers,
  readUser,
  readUserId,
} from '@/actions/user.actions';
import SingleUser from '@/components/single-user';
import { User } from '@prisma/client';
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
    title: `People following ${name} (@${username}) / PostPlanet `,
  };
}

export default async function Followers({ params }: FollowersProps) {
  const currentUserId = await fetchUserId();
  const { followingIds: myFollowingIds } = (await readUser(
    currentUserId
  )) as User;
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
          currentUserId={currentUserId}
        />
      ))}
    </main>
  );
}

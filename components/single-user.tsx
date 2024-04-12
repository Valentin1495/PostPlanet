import { countFollowers, readUser } from '@/actions/user.actions';
import ClientUser from './client-user';

export type SingleUserProps = {
  id: string;
  currentUserId: string;
  username: string;
  name: string;
  bio: string | null;
  profileImage: string;
  followingIds: string[];
  myFollowingIds: string[];
};

export default async function SingleUser({
  username,
  name,
  bio,
  profileImage,
  followingIds,
  myFollowingIds,
  id,
  currentUserId,
}: SingleUserProps) {
  const followersCount = await countFollowers(id);

  return (
    <div className='px-4 py-2 hover:bg-secondary/50 transition cursor-pointer'>
      <ClientUser
        bio={bio}
        currentUserId={currentUserId}
        followers={followersCount}
        followingIds={followingIds}
        myFollowingIds={myFollowingIds}
        id={id}
        name={name}
        username={username}
        profileImage={profileImage}
      />
    </div>
  );
}

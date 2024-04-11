import { countFollowers, readUser } from '@/actions/user.actions';
import ClientActivity from './client-activity';
import { User } from '@prisma/client';

type SingleActivityProps = {
  postId: string | null;
  text: string | null;
  type: string;
  giverId: string;
  receiverId: string;
  followingIds: string[];
};

export default async function SingleActivity({
  type,
  giverId,
  postId,
  text,
  receiverId,
  followingIds,
}: SingleActivityProps) {
  const giver = (await readUser(giverId)) as User;
  const giverFollowers = await countFollowers(giverId);
  const isFollowing = followingIds.includes(giverId);

  return (
    <ClientActivity
      type={type}
      giverId={giverId}
      receiverId={receiverId}
      postId={postId}
      text={text}
      giverFollowers={giverFollowers}
      isFollowing={isFollowing}
      myFollowingIds={followingIds}
      giverFollowingIds={giver.followingIds}
      {...giver}
    />
  );
}

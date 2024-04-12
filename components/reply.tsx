import { User } from '@prisma/client';
import ClientReply from './client-reply';
import { countFollowers, readUser } from '@/actions/user.actions';
import { getSimpleDate } from '@/lib/utils';

type ReplyProps = {
  text: string | null;
  image: string | null;
  createdAt: Date;
  authorId: string;
  followingIds: string[];
  currentUserId: string;
  isLast?: boolean;
};

export default async function Reply({
  authorId,
  followingIds,
  currentUserId,
  createdAt,
  text,
  image,
  isLast,
}: ReplyProps) {
  const author = (await readUser(authorId)) as User;
  const followers = await countFollowers(authorId);
  const isCurrentUser = authorId === currentUserId;
  const simpleDate = getSimpleDate(createdAt);

  return (
    <ClientReply
      {...author}
      followers={followers}
      isCurrentUser={isCurrentUser}
      createdAt={simpleDate}
      text={text}
      image={image}
      isLast={isLast}
      currentUserId={currentUserId}
      myFollowingIds={followingIds}
      authorFollowingIds={author.followingIds}
    />
  );
}

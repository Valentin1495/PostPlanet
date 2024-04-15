import { countFollowers, readUser } from '@/actions/user.actions';
import { User } from '@prisma/client';
import ClientPost from './client-post';
import { checkHasLiked, deletePost } from '@/actions/post.actions';
import { countPostReplies } from '@/actions/reply.action';
import { getSimpleDate } from '@/lib/utils';

export type PostProps = {
  id: string;
  text: string | null;
  image: string | null;
  createdAt: Date;
  likedIds: string[];
  authorId: string;
  currentUserId: string;
  myProfilePic?: string;
  myFollowingIds: string[];
  isProfilePage?: boolean;
};

export default async function Post({
  id,
  text,
  image,
  createdAt,
  likedIds,
  authorId,
  currentUserId,
  myProfilePic,
  myFollowingIds,
  isProfilePage,
}: PostProps) {
  const author = (await readUser(authorId)) as User;
  const isMyPost = authorId === currentUserId;
  const hasLiked = await checkHasLiked(id, currentUserId);
  const replyCount = await countPostReplies(id);
  const followers = await countFollowers(authorId);
  const timestamp = getSimpleDate(createdAt);

  return (
    <ClientPost
      {...author}
      followers={followers}
      authorId={authorId}
      isMyPost={isMyPost}
      id={id}
      text={text}
      image={image}
      createdAt={timestamp}
      likedIds={likedIds}
      hasLiked={hasLiked}
      replyCount={replyCount}
      myProfilePic={myProfilePic}
      currentUserId={currentUserId}
      myFollowingIds={myFollowingIds}
      authorFollowingIds={author.followingIds}
      isProfilePage={isProfilePage}
      deletePost={deletePost}
    />
  );
}

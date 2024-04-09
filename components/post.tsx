import { checkFollow, readUser } from '@/actions/user.actions';
import { User } from '@prisma/client';
import ClientPost from './client-post';
import { checkHasLiked } from '@/actions/post.actions';
import { readReplies } from '@/actions/reply.action';

export type PostProps = {
  id: string;
  text: string | null;
  image: string | null;
  createdAt: Date;
  likedIds: string[];
  authorId: string;
  currentUserId?: string;
};

export default async function Post({
  id,
  text,
  image,
  createdAt,
  likedIds,
  authorId,
  currentUserId,
}: PostProps) {
  const author = (await readUser(authorId)) as User;
  const isMyPost = authorId === currentUserId;
  const isFollowing = await checkFollow(authorId);
  const hasLiked = await checkHasLiked(id);
  const replies = await readReplies(id);

  return (
    <ClientPost
      {...author}
      authorId={authorId}
      isMyPost={isMyPost}
      isFollowing={isFollowing}
      id={id}
      text={text}
      image={image}
      createdAt={createdAt}
      likedIds={likedIds}
      hasLiked={hasLiked}
      replyCount={replies.length}
    />
  );
}

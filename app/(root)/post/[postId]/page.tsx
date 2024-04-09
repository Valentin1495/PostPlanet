import { checkHasLiked, readPost } from '@/actions/post.actions';
import { readReplies } from '@/actions/reply.action';
import { readCurrentUser, readUser } from '@/actions/user.actions';
import Header from '@/components/header';
import PostForm from '@/components/post-form';
import Reply from '@/components/reply';
import SinglePost from '@/components/single-post';
import { getDetailedDate } from '@/lib/utils';
import { Post, Reply as SingleReply, User } from '@prisma/client';

type PostPageProps = {
  params: {
    postId: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const { postId } = params;
  const post = (await readPost(postId)) as Post;
  const author = (await readUser(post.authorId)) as User;
  const { followingIds, id, profileImage, username } =
    (await readCurrentUser()) as User;
  const isFollowing = followingIds.includes(author.id);
  const isMyPost = post.authorId === id;
  const hasLiked = (await checkHasLiked(postId)) as boolean;
  const replies = (await readReplies(postId)) as SingleReply[];
  const timestamp = getDetailedDate(post.createdAt);

  return (
    <main className='min-h-screen'>
      <Header />

      <SinglePost
        {...post}
        {...author}
        id={postId}
        authorId={post.authorId}
        isFollowing={isFollowing}
        isMyPost={isMyPost}
        hasLiked={hasLiked}
        replyCount={replies.length}
        createdAt={timestamp}
      />

      <PostForm
        isForReply
        profileImage={profileImage}
        username={username}
        postId={postId}
      />

      {replies.map((reply) => (
        <Reply
          key={reply.id}
          {...reply}
          followingIds={followingIds}
          currentUserId={id}
        />
      ))}
    </main>
  );
}

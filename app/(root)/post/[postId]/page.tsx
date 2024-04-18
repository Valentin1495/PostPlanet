import { checkHasLiked, readPost } from '@/actions/post.actions';
import { readPostReplies } from '@/actions/reply.action';
import { countFollowers, readUser } from '@/actions/user.actions';
import Header from '@/components/header';
import PostForm from '@/components/post-form';
import Reply from '@/components/reply';
import SinglePost from '@/components/single-post';
import { getDetailedDate, getSimpleDate } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs';
import { User as U } from '@clerk/nextjs/server';
import { Post, Reply as SingleReply, User } from '@prisma/client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PostPageProps = {
  params: {
    postId: string;
  };
};

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { postId } = params;
  const { text, authorId, image } = (await readPost(postId)) as Post;
  const { name } = (await readUser(authorId)) as User;

  if (!text)
    return {
      title: `${name} on PostPlanet: "${image}" / PostPlanet`,
    };
  return {
    title: `${name} on PostPlanet: "${text}" / PostPlanet`,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId } = params;
  const post = (await readPost(postId)) as Post;
  if (!post) {
    notFound();
  }

  const author = (await readUser(post.authorId)) as User;
  const user = (await currentUser()) as U;
  const { followingIds, id, profileImage, username } = (await readUser(
    user.id
  )) as User;
  const isMyPost = post.authorId === id;
  const hasLiked = (await checkHasLiked(postId, user.id)) as boolean;
  const replies = (await readPostReplies(postId)) as SingleReply[];
  const followers = await countFollowers(post.authorId);
  const timestamp = getDetailedDate(post.createdAt);
  const simpleTimestamp = getSimpleDate(post.createdAt);

  return (
    <main className='min-h-screen'>
      <Header isPostPage />

      <SinglePost
        {...post}
        {...author}
        id={postId}
        authorId={post.authorId}
        followers={followers}
        isMyPost={isMyPost}
        hasLiked={hasLiked}
        replyCount={replies.length}
        createdAt={timestamp}
        simpleCreatedAt={simpleTimestamp}
        currentUserId={id}
        myFollowingIds={followingIds}
        authorFollowingIds={author.followingIds}
        myProfilePic={profileImage}
      />

      <PostForm
        isForReply
        profileImage={profileImage}
        username={username}
        postId={postId}
        userId={user.id}
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

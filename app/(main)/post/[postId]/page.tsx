import { checkHasLiked, readPost } from '@/actions/post.actions';
import { fetchUserId, readUser } from '@/actions/user.actions';
import Header from '@/components/header';
import PostForm from '@/components/post-form';
import Replies from '@/components/replies';
import SinglePost from '@/components/single-post';
import { getDetailedDate, getSimpleDate } from '@/lib/utils';
import { Post, User } from '@prisma/client';
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
  const post = await readPost(postId);
  if (!post) {
    notFound();
  }

  const author = (await readUser(post.authorId)) as User;
  const userId = await fetchUserId();
  const { id, profileImage, username } = (await readUser(userId)) as User;
  const isMyPost = post.authorId === id;
  const hasLiked = (await checkHasLiked(postId, userId)) as boolean;

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
        isMyPost={isMyPost}
        hasLiked={hasLiked}
        createdAt={timestamp}
        simpleCreatedAt={simpleTimestamp}
        currentUserId={id}
        myProfilePic={profileImage}
      />

      <PostForm
        isForReply
        profileImage={profileImage}
        username={username}
        postId={postId}
        userId={userId}
      />

      <Replies currentUserId={id} postId={postId} />
    </main>
  );
}

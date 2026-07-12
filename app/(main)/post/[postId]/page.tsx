import { checkHasLiked, readPost } from '@/actions/post.actions';
import { fetchUserId, readUser } from '@/actions/user.actions';
import Header from '@/components/header';
import PostForm from '@/components/post-form';
import Replies from '@/components/replies';
import SinglePost from '@/components/single-post';
import { getDetailedDate, getSimpleDate } from '@/lib/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

type PostPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { postId } = await params;
  const post = await readPost(postId);
  if (!post) return { title: 'Post / PostPlanet' };

  const author = await readUser(post.authorId);
  const name = author?.name ?? '';

  if (!post.text)
    return {
      title: `${name} on PostPlanet: "${post.image}" / PostPlanet`,
    };
  return {
    title: `${name} on PostPlanet: "${post.text}" / PostPlanet`,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId } = await params;
  const post = await readPost(postId);
  if (!post) {
    notFound();
  }

  const author = await readUser(post.authorId);
  const userId = await fetchUserId();
  const currentUser = await readUser(userId);
  if (!author || !currentUser) {
    notFound();
  }

  const { id, profileImage, username } = currentUser;
  const isMyPost = post.authorId === id;
  const hasLiked = await checkHasLiked(postId, id);

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
        userId={id}
      />

      <Replies currentUserId={id} postId={postId} />
    </main>
  );
}

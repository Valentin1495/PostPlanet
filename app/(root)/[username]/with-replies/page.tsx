import { readRepliesWithPost } from '@/actions/reply.action';
import { readCurrentUser, readUserId } from '@/actions/user.actions';
import Post from '@/components/post';
import Reply from '@/components/reply';
import { groupRepliesByPost } from '@/lib/utils';
import { User } from '@prisma/client';

type ProfileRepliesProps = {
  params: {
    username: string;
  };
};

export default async function ProfileReplies({ params }: ProfileRepliesProps) {
  const { id, profileImage, followingIds } = (await readCurrentUser()) as User;
  const userId = (await readUserId(params.username)) as string;
  const repliesWithPost = await readRepliesWithPost(userId);
  const repliesByPostId = groupRepliesByPost(repliesWithPost);

  if (!repliesWithPost.length)
    return <p className='min-h-screen text-center mt-10'>No replies.</p>;
  return (
    <main className='min-h-screen'>
      {repliesByPostId.map(({ post, replies }) => {
        return (
          <div key={post.id}>
            <Post {...post} currentUserId={id} myProfilePic={profileImage} />
            {replies.map((reply, i) => {
              return (
                <Reply
                  key={reply.id}
                  {...reply}
                  followingIds={followingIds}
                  currentUserId={id}
                  isLast={replies.length === i + 1}
                />
              );
            })}
          </div>
        );
      })}
    </main>
  );
}

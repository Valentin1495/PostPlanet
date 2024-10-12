import { fetchUserId, readUser, readUserId } from '@/actions/user.actions';
import RepliesByPost from '@/components/replies-by-post';
import { User } from '@prisma/client';
import { Metadata } from 'next';

type ProfileRepliesProps = {
  params: {
    username: string;
  };
};

export async function generateMetadata({
  params,
}: ProfileRepliesProps): Promise<Metadata> {
  const { username } = params;
  const userId = (await readUserId(username)) as string;
  const { name } = (await readUser(userId)) as User;

  return {
    title: `Posts with replies by ${name} (@${username}) / PostPlanet `,
  };
}

export default async function ProfileReplies({ params }: ProfileRepliesProps) {
  const userId = (await readUserId(params.username)) as string;
  const { profileImage } = (await readUser(userId)) as User;
  const currentUserId = await fetchUserId();

  return (
    <main className='min-h-screen'>
      <RepliesByPost
        currentUserId={currentUserId}
        userId={userId}
        profileImage={profileImage}
      />
    </main>
  );
}

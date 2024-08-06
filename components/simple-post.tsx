import { countPostReplies } from '@/actions/reply.action';
import { readUser } from '@/actions/user.actions';
import { getSimpleDate } from '@/lib/utils';
import { User } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';
import Image from 'next/image';
import ChatBubble from './icons/chat-bubble';
import Heart from './icons/heart';
import SignUpDialog from './sign-up-dialog';

type SimplePostProps = {
  id: string;
  createdAt: Date;
  authorId: string;
  text: string | null;
  image: string | null;
  likedIds: string[];
};

export default async function SimplePost({
  id,
  createdAt,
  authorId,
  text,
  image,
  likedIds,
}: SimplePostProps) {
  const author = (await readUser(authorId)) as User;
  const replyCount = await countPostReplies(id);
  const timestamp = getSimpleDate(createdAt);
  const likes = likedIds.length;

  return (
    <div className='px-3 pt-3 pb-0.5 flex gap-2 hover:bg-secondary/50 transition'>
      <div>
        <Avatar className='w-10 h-10'>
          <AvatarImage src={author.profileImage} alt='profile picture' />
          <AvatarFallback className='bg-primary/10'>
            <Skeleton className='rounded-full' />
          </AvatarFallback>
        </Avatar>
      </div>

      <div className='w-full'>
        <section className='flex gap-1.5 items-center'>
          <span className='font-bold truncate max-w-32 xl:max-w-52'>
            {author.name}
          </span>
          <span className='text-muted-foreground mb-0.5 truncate max-w-32 xl:max-w-52'>
            @{author.username}
          </span>
          <span className='text-muted-foreground mb-0.5'>·</span>
          <span className='text-muted-foreground mb-0.5 min-w-fit'>
            {timestamp}
          </span>
        </section>

        <section className='space-y-2'>
          <p>{text}</p>
          {image && (
            <article className='relative aspect-video rounded-xl overflow-hidden'>
              <Image src={image} alt='image' fill />
            </article>
          )}
        </section>

        <section className='-ml-2 relative h-10'>
          <SignUpDialog>
            <section className='flex items-center -space-x-1 group w-fit absolute top-1/2 -translate-y-1/2'>
              <section className='rounded-full p-2 group-hover:bg-primary/5 transition'>
                <ChatBubble chatBubbleProps='w-[18px] h-[18px] text-slate-400 group-hover:text-primary transition' />
              </section>
              <span className='text-sm font-medium group-hover:text-primary transition'>
                {replyCount ? replyCount : null}
              </span>
            </section>
          </SignUpDialog>

          <SignUpDialog>
            <section className='flex items-center -space-x-1 group w-fit absolute top-1/2 -translate-y-1/2 left-1/4'>
              <section className='rounded-full p-2 group-hover:bg-rose-700/10 transition'>
                <Heart heartProps='w-[18px] h-[18px] text-slate-400 group-hover:text-rose-700 transition' />
              </section>
              <span className='group-hover:text-rose-700 transition text-sm font-medium'>
                {likes}
              </span>
            </section>
          </SignUpDialog>
        </section>
      </div>
    </div>
  );
}

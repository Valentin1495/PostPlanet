'use client';

import { Reply as ReplyType, User } from '@prisma/client';
import { cn, getSimpleDate } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import ProfileImage from './profile-image';
import Link from 'next/link';
import DeleteDialog from './dialogs/delete-dialog';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useDialog } from '@/hooks/use-dialog';

type ReplyProps = ReplyType & {
  currentUserId: string;
  isLast?: boolean;
};

export default function Reply({
  id,
  postId,
  authorId,
  currentUserId,
  createdAt,
  text,
  image,
  isLast,
}: ReplyProps) {
  const { data: author } = useQuery<User>({
    queryKey: ['user', authorId],
    queryFn: async () => {
      const response = await fetch(`/api/user/${authorId}`);
      const { user } = await response.json();

      return user;
    },
  });

  const isCurrentUser = authorId === currentUserId;
  const simpleDate = getSimpleDate(createdAt);
  const pathname = usePathname();
  const isProfileReplies = pathname.includes('/with-replies');
  const isMyReply = authorId === currentUserId;
  const { openDialog } = useDialog();

  return (
    <div
      className={cn('p-3 flex gap-2', isProfileReplies && isLast && 'border-b')}
    >
      <div>
        <ProfileImage
          bio={author?.bio}
          isCurrentUser={isCurrentUser}
          name={author?.name}
          profileImage={author?.profileImage}
          username={author?.username}
        />
        {isProfileReplies && !isLast && (
          <div className='w-[2px] mx-auto h-full bg-primary/25'></div>
        )}
      </div>

      <div className='w-full'>
        <section className='flex gap-1.5 items-center'>
          <Link
            href={`/${author?.username}/posts`}
            className='font-bold hover:underline truncate max-w-32 xl:max-w-52'
          >
            {author?.name}
          </Link>
          <Link
            href={`/${author?.username}/posts`}
            className='text-muted-foreground mb-0.5 truncate max-w-32 xl:max-w-52'
          >
            @{author?.username}
          </Link>
          <span className='text-muted-foreground mb-0.5'>·</span>
          <span className='text-muted-foreground mb-0.5 min-w-fit mr-auto'>
            {simpleDate}
          </span>

          {isMyReply && (
            // <DeleteDialog
            //   handleClick={(e) => e.stopPropagation()}
            //   postId={postId}
            //   replyId={id}
            //   forReply
            // >
            // </DeleteDialog>
            <section
              onClick={(e) => {
                e.stopPropagation();
                openDialog('deleteReply', {
                  postId,
                  replyId: id,
                  forReply: true,
                });
              }}
              className='hover:text-destructive text-slate-400 transition hover:bg-destructive/10 p-1.5 rounded-full cursor-pointer'
            >
              <Trash2 size={16} />
            </section>
          )}
        </section>

        <section className='space-y-2'>
          <p>{text}</p>
          {image && (
            <article className='relative w-full min-h-96 rounded-xl overflow-hidden'>
              <Image
                src={image}
                alt='reply image'
                fill
                priority
                className='object-cover'
              />
            </article>
          )}
        </section>
      </div>
    </div>
  );
}

import Image from 'next/image';

import { readUser } from '@/actions/user.actions';
import { User } from '@prisma/client';
import { formatDate } from '@/lib/utils';
import ProfileImage from './profile-image';
import Link from 'next/link';

type PostProps = {
  id: string;
  text: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  likedIds: string[];
  authorId: string;
};

export default async function Post({
  id,
  text,
  image,
  createdAt,
  updatedAt,
  likedIds,
  authorId,
}: PostProps) {
  const author = (await readUser(authorId)) as User;
  const { username, name, bio, profileImage, followingIds } = author;

  return (
    <div className='border-b-2 border-secondary p-3 flex gap-2'>
      <ProfileImage {...author} />
      <div className='w-full'>
        <section className='flex text-sm gap-1.5 items-center'>
          <Link href={`/${username}`} className='font-bold hover:underline'>
            {name}
          </Link>
          <Link href={`/${username}`} className='text-muted-foreground mb-0.5'>
            @{username}
          </Link>
          <span className='text-muted-foreground mb-0.5'>·</span>
          <span className='text-muted-foreground mb-0.5'>
            {formatDate(createdAt)}
          </span>
        </section>
        <section className='space-y-2'>
          <p className='text-sm'>{text}</p>
          {image && (
            <article className='relative aspect-video rounded-xl overflow-hidden'>
              <Image src={image} alt='image' fill />
            </article>
          )}
        </section>
        <section></section>
      </div>
    </div>
  );
}

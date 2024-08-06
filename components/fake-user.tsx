import SignUpDialog from './sign-up-dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';

type FakeUserProps = {
  username: string;
  name: string;
  profileImage: string;
};

export default function FakeUser({
  username,
  name,
  profileImage,
}: FakeUserProps) {
  return (
    <div className='flex items-center gap-2 p-3 last:rounded-b-lg'>
      <Avatar className='w-10 h-10'>
        <AvatarImage src={profileImage} alt='profile picture' />
        <AvatarFallback className='bg-primary/10'>
          <Skeleton className='rounded-full' />
        </AvatarFallback>
      </Avatar>

      <section className='mr-auto flex flex-col'>
        <span className='font-semibold truncate lg:max-w-28 xl:max-w-44'>
          {name}
        </span>
        <span className='truncate text-sm lg:max-w-28 xl:max-w-44'>
          @{username}
        </span>
      </section>

      <SignUpDialog>
        <span className='rounded-full text-white dark:text-black font-semibold bg-black hover:bg-black/75 dark:bg-white/75 h-9 inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 px-3'>
          Follow
        </span>
      </SignUpDialog>
    </div>
  );
}

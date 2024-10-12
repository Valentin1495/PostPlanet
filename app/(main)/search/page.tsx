import { fetchUserId, readUser } from '@/actions/user.actions';
import { User } from '@prisma/client';
import { Metadata } from 'next';
import SearchBar from '@/components/search-bar';
import UserResults from '@/components/user-results';
import PostResults from '@/components/post-results';

type SearchProps = {
  searchParams: {
    q?: string;
    f?: string;
  };
};

export async function generateMetadata({
  searchParams,
}: SearchProps): Promise<Metadata> {
  const { q } = searchParams;

  if (!q)
    return {
      title: 'Search / PostPlanet',
    };

  let query = q.trim();
  query = query.replace(/\s+/g, ' ');

  return {
    title: `${query} - Search / PostPlanet`,
  };
}

export default async function Search({ searchParams }: SearchProps) {
  const { q, f } = searchParams;
  const userId = await fetchUserId();
  const { id, profileImage } = (await readUser(userId)) as User;

  if (f === 'user') {
    return <UserResults q={q} f={f} />;
  }

  if (q) {
    return (
      <PostResults q={q} f={f} myProfileImage={profileImage} myUserId={id} />
    );
  }

  return (
    <main className='min-h-screen'>
      <div className='bg-background pt-5'>
        <SearchBar />
      </div>
    </main>
  );
}

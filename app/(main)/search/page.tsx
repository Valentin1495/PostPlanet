import { fetchUserId, readUser } from '@/actions/user.actions';
import { Metadata } from 'next';
import SearchBar from '@/components/search-bar';
import UserResults from '@/components/user-results';
import PostResults from '@/components/post-results';

type SearchProps = {
  searchParams: Promise<{
    q?: string;
    f?: string;
  }>;
};

export async function generateMetadata({
  searchParams,
}: SearchProps): Promise<Metadata> {
  const { q } = await searchParams;

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
  const { q, f } = await searchParams;
  const userId = await fetchUserId();
  const user = await readUser(userId);

  if (f === 'user') {
    return <UserResults q={q} f={f} currentUserId={userId ?? undefined} />;
  }

  if (q && user) {
    return (
      <PostResults q={q} f={f} myProfileImage={user.profileImage} myUserId={user.id} />
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

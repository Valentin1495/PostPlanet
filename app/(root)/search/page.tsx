import { readUser, searchPeople } from '@/actions/user.actions';
import SingleUser from '@/components/single-user';
import { currentUser } from '@clerk/nextjs';
import { Post as SinglePost, User } from '@prisma/client';
import { User as U } from '@clerk/nextjs/server';
import { searchPosts } from '@/actions/post.actions';
import Post from '@/components/post';
import SearchTabs from '@/components/search-tabs';
import { Metadata } from 'next';
import SearchBar from '@/components/search-bar';

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
  const { id } = (await currentUser()) as U;
  const {
    id: currentUserId,
    followingIds,
    profileImage,
  } = (await readUser(id)) as User;
  let searchResults;

  if (f === 'user') {
    searchResults = (await searchPeople(q as string)) as User[];

    return (
      <main className='min-h-screen'>
        <div className='bg-background z-10 sticky top-0 pt-5'>
          <SearchBar />
          <SearchTabs q={q as string} f={f} />
        </div>
        {searchResults.length ? (
          searchResults.map((user) => (
            <SingleUser
              key={user.id}
              {...user}
              currentUserId={currentUserId}
              myFollowingIds={followingIds}
            />
          ))
        ) : (
          <p className='text-center mt-10 text-lg'>No results.</p>
        )}
      </main>
    );
  }

  if (q) {
    searchResults = (await searchPosts(q)) as SinglePost[];

    return (
      <main className='min-h-screen'>
        <div className='bg-background z-10 sticky top-0 pt-5'>
          <SearchBar />
          <SearchTabs q={q} f={f} />
        </div>
        {searchResults.length ? (
          searchResults.map((post) => (
            <Post
              key={post.id}
              {...post}
              currentUserId={currentUserId}
              myProfilePic={profileImage}
              myFollowingIds={followingIds}
            />
          ))
        ) : (
          <p className='text-center mt-10 text-lg'>No results.</p>
        )}
      </main>
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

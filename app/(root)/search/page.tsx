import { readUser, searchPeople } from '@/actions/user.actions';
import SingleUser from '@/components/single-user';
import { currentUser } from '@clerk/nextjs';
import { Post as SinglePost, User } from '@prisma/client';
import { User as U } from '@clerk/nextjs/server';
import { searchPosts } from '@/actions/post.actions';
import Post from '@/components/post';
import SearchTabs from '@/components/search-tabs';

type SearchProps = {
  searchParams: {
    q: string;
    f: string;
  };
};

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
    searchResults = (await searchPeople(q)) as User[];

    return (
      <main>
        <SearchTabs q={q} f={f} />
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
      <main>
        <SearchTabs q={q} f={f} />
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

  return null;
}

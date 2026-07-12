-- PostPlanet initial schema
-- Users mirror auth.users (1:1), everything else is a normal relational
-- design (join tables for follows/likes instead of array fields).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  name text not null,
  bio text,
  profile_image text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index users_username_idx on public.users using btree (lower(username));

-- ---------------------------------------------------------------------------
-- posts
-- ---------------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  text text,
  image text,
  author_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_author_id_idx on public.posts (author_id);
create index posts_created_at_idx on public.posts (created_at desc);

-- ---------------------------------------------------------------------------
-- replies
-- ---------------------------------------------------------------------------
create table public.replies (
  id uuid primary key default gen_random_uuid(),
  text text,
  image text,
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index replies_post_id_idx on public.replies (post_id);
create index replies_author_id_idx on public.replies (author_id);

-- ---------------------------------------------------------------------------
-- likes (join table, replaces Post.likedIds array)
-- ---------------------------------------------------------------------------
create table public.likes (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create index likes_user_id_idx on public.likes (user_id);

-- ---------------------------------------------------------------------------
-- follows (join table, replaces User.followingIds array)
-- ---------------------------------------------------------------------------
create table public.follows (
  follower_id uuid not null references public.users (id) on delete cascade,
  following_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  constraint follows_no_self_follow check (follower_id <> following_id)
);

create index follows_following_id_idx on public.follows (following_id);

-- ---------------------------------------------------------------------------
-- activities (notifications: follow / like / reply)
-- ---------------------------------------------------------------------------
create table public.activities (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('follow', 'like', 'reply')),
  giver_id uuid not null references public.users (id) on delete cascade,
  receiver_id uuid not null references public.users (id) on delete cascade,
  post_id uuid references public.posts (id) on delete cascade,
  text text,
  created_at timestamptz not null default now()
);

create index activities_receiver_id_idx on public.activities (receiver_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

create trigger replies_set_updated_at
  before update on public.replies
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.replies enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;
alter table public.activities enable row level security;

-- users: profiles are public to read, only the owner can write their own row
create policy "users_select_all" on public.users
  for select using (true);

create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);

create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- posts: readable by anyone, only the author can write/delete
create policy "posts_select_all" on public.posts
  for select using (true);

create policy "posts_insert_own" on public.posts
  for insert with check (auth.uid() = author_id);

create policy "posts_update_own" on public.posts
  for update using (auth.uid() = author_id);

create policy "posts_delete_own" on public.posts
  for delete using (auth.uid() = author_id);

-- replies: readable by anyone, only the author can write/delete
create policy "replies_select_all" on public.replies
  for select using (true);

create policy "replies_insert_own" on public.replies
  for insert with check (auth.uid() = author_id);

create policy "replies_delete_own" on public.replies
  for delete using (auth.uid() = author_id);

-- likes: readable by anyone, only the liker can create/remove their own like
create policy "likes_select_all" on public.likes
  for select using (true);

create policy "likes_insert_own" on public.likes
  for insert with check (auth.uid() = user_id);

create policy "likes_delete_own" on public.likes
  for delete using (auth.uid() = user_id);

-- follows: readable by anyone, only the follower can create/remove their own follow
create policy "follows_select_all" on public.follows
  for select using (true);

create policy "follows_insert_own" on public.follows
  for insert with check (auth.uid() = follower_id);

create policy "follows_delete_own" on public.follows
  for delete using (auth.uid() = follower_id);

-- activities: only sender/recipient can see a notification, only the giver
-- (the person performing the like/reply/follow) can create one
create policy "activities_select_own" on public.activities
  for select using (auth.uid() = receiver_id or auth.uid() = giver_id);

create policy "activities_insert_own" on public.activities
  for insert with check (auth.uid() = giver_id);

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text not null,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_lowercase check (username = lower(username)),
  constraint profiles_username_length check (char_length(username) between 3 and 30)
);

create table if not exists public.tweets (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(user_id) on delete cascade,
  body text not null,
  parent_tweet_id uuid references public.tweets(id) on delete cascade,
  root_tweet_id uuid not null references public.tweets(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint tweets_body_length check (char_length(body) between 1 and 280),
  constraint tweets_body_not_blank check (char_length(btrim(body)) > 0),
  constraint tweets_parent_not_self check (parent_tweet_id is null or parent_tweet_id <> id)
);

create table if not exists public.follows (
  follower_id uuid not null references public.profiles(user_id) on delete cascade,
  followee_id uuid not null references public.profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followee_id),
  constraint follows_no_self_follow check (follower_id <> followee_id)
);

create index if not exists idx_tweets_author_created_at on public.tweets(author_id, created_at desc);
create index if not exists idx_tweets_parent_created_at on public.tweets(parent_tweet_id, created_at asc);
create index if not exists idx_tweets_root_created_at on public.tweets(root_tweet_id, created_at asc);
create index if not exists idx_follows_followee on public.follows(followee_id);
create index if not exists idx_follows_follower on public.follows(follower_id);

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_set_updated_at on public.profiles;
create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_profiles_updated_at();

create or replace function public.set_tweet_root_id()
returns trigger
language plpgsql
as $$
declare
  parent_root_id uuid;
begin
  if new.parent_tweet_id is null then
    new.root_tweet_id = new.id;
  else
    select root_tweet_id
      into parent_root_id
      from public.tweets
     where id = new.parent_tweet_id;

    if parent_root_id is null then
      raise exception 'parent tweet % does not exist or has no root', new.parent_tweet_id;
    end if;

    new.root_tweet_id = parent_root_id;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_tweets_set_root_id on public.tweets;
create trigger trg_tweets_set_root_id
before insert on public.tweets
for each row execute function public.set_tweet_root_id();

create or replace view public.mutual_friends as
select
  f1.follower_id as user_id,
  f1.followee_id as friend_id
from public.follows f1
join public.follows f2
  on f2.follower_id = f1.followee_id
 and f2.followee_id = f1.follower_id;

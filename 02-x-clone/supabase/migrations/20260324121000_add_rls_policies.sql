alter table public.profiles enable row level security;
alter table public.tweets enable row level security;
alter table public.follows enable row level security;

drop policy if exists "profiles_select_own_or_mutual" on public.profiles;
create policy "profiles_select_own_or_mutual"
on public.profiles
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
      from public.follows f1
      join public.follows f2
        on f2.follower_id = f1.followee_id
       and f2.followee_id = f1.follower_id
     where f1.follower_id = auth.uid()
       and f1.followee_id = profiles.user_id
  )
);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "tweets_select_authenticated" on public.tweets;
create policy "tweets_select_authenticated"
on public.tweets
for select
to authenticated
using (true);

drop policy if exists "tweets_insert_own" on public.tweets;
create policy "tweets_insert_own"
on public.tweets
for insert
to authenticated
with check (author_id = auth.uid());

drop policy if exists "tweets_delete_own" on public.tweets;
create policy "tweets_delete_own"
on public.tweets
for delete
to authenticated
using (author_id = auth.uid());

drop policy if exists "follows_select_authenticated" on public.follows;
create policy "follows_select_authenticated"
on public.follows
for select
to authenticated
using (true);

drop policy if exists "follows_insert_own" on public.follows;
create policy "follows_insert_own"
on public.follows
for insert
to authenticated
with check (follower_id = auth.uid());

drop policy if exists "follows_delete_own" on public.follows;
create policy "follows_delete_own"
on public.follows
for delete
to authenticated
using (follower_id = auth.uid());

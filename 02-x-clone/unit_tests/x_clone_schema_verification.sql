\echo 'X CLONE SCHEMA VERIFICATION'
\echo 'This script is read-safe: every test runs in a transaction and rolls back.'

\echo ''
\echo 'TEST 1: Alice can publish a tweet'
begin;
set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
insert into public.tweets (author_id, body, parent_tweet_id, root_tweet_id)
values (
  '11111111-1111-1111-1111-111111111111',
  'Alice publishes from verification script',
  null,
  '00000000-0000-0000-0000-000000000000'
)
returning id, author_id, parent_tweet_id, root_tweet_id;
rollback;

\echo ''
\echo 'TEST 2A: Bob can reply to Alice root tweet'
begin;
set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);
insert into public.tweets (author_id, body, parent_tweet_id, root_tweet_id)
values (
  '22222222-2222-2222-2222-222222222222',
  'Replying to Alice root tweet',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
  '00000000-0000-0000-0000-000000000000'
)
returning id, parent_tweet_id, root_tweet_id;
rollback;

\echo ''
\echo 'TEST 2B: Alice can create nested reply'
begin;
set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
insert into public.tweets (author_id, body, parent_tweet_id, root_tweet_id)
values (
  '11111111-1111-1111-1111-111111111111',
  'Nested reply to Bob',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
  '00000000-0000-0000-0000-000000000000'
)
returning id, parent_tweet_id, root_tweet_id;
rollback;

\echo ''
\echo 'TEST 3A: Alice can update own profile'
begin;
set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
update public.profiles
set bio = 'Alice updated her own bio in verification'
where user_id = '11111111-1111-1111-1111-111111111111'
returning user_id, bio;
rollback;

\echo ''
\echo 'TEST 3B: Bob cannot update Alice profile (expect UPDATE 0)'
begin;
set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);
update public.profiles
set bio = 'Bob trying to update Alice bio'
where user_id = '11111111-1111-1111-1111-111111111111'
returning user_id, bio;
rollback;

\echo ''
\echo 'TEST 4: Bob can follow and unfollow Carol'
begin;
set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', true);
insert into public.follows (follower_id, followee_id)
values ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333')
returning follower_id, followee_id;
delete from public.follows
where follower_id = '22222222-2222-2222-2222-222222222222'
  and followee_id = '33333333-3333-3333-3333-333333333333'
returning follower_id, followee_id;
rollback;

\echo ''
\echo 'TEST 5: Alice can see own profile and mutual friends only'
begin;
set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', true);
select user_id, username
from public.profiles
where user_id in (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
)
order by username;
rollback;

-- Seed users in Supabase Auth.
insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'alice@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Alice"}'::jsonb,
    now(),
    now()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'bob@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Bob"}'::jsonb,
    now(),
    now()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'carol@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"display_name":"Carol"}'::jsonb,
    now(),
    now()
  )
on conflict (id) do nothing;

insert into public.profiles (user_id, username, display_name, bio, avatar_url)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'alice',
    'Alice',
    'Building in public.',
    'https://example.com/alice.png'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'bob',
    'Bob',
    'I like backend work.',
    'https://example.com/bob.png'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'carol',
    'Carol',
    'Design systems and UX.',
    'https://example.com/carol.png'
  )
on conflict (user_id) do update
set
  username = excluded.username,
  display_name = excluded.display_name,
  bio = excluded.bio,
  avatar_url = excluded.avatar_url;

insert into public.follows (follower_id, followee_id)
values
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333')
on conflict do nothing;

insert into public.tweets (id, author_id, body, parent_tweet_id, root_tweet_id)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '11111111-1111-1111-1111-111111111111',
    'Hello X clone! This is my first tweet.',
    null,
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '22222222-2222-2222-2222-222222222222',
    'Nice to see you here, Alice.',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    '11111111-1111-1111-1111-111111111111',
    'Thanks Bob! Let us keep this thread going.',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1'
  )
on conflict (id) do nothing;

-- Simulate profile update behavior.
update public.profiles
set
  bio = 'Building in public. Now exploring threaded conversations.',
  avatar_url = 'https://example.com/alice-v2.png'
where user_id = '11111111-1111-1111-1111-111111111111';

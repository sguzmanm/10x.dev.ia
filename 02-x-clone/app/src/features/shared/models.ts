export interface Profile {
  userId: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
}

export interface Tweet {
  id: string;
  authorId: string;
  authorUsername: string;
  authorDisplayName: string;
  body: string;
  parentTweetId: string | null;
  rootTweetId: string;
  createdAt: string;
}

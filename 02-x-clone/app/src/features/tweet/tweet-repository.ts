import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseClient } from "../../lib/supabase-client";
import type { Database } from "../../lib/supabase-types";
import type { Tweet } from "../shared/models";

type TweetRow = Database["public"]["Tables"]["tweets"]["Row"] & {
  profiles: Pick<Database["public"]["Tables"]["profiles"]["Row"], "user_id" | "username" | "display_name"> | null;
};

function mapTweet(row: TweetRow): Tweet {
  return {
    id: row.id,
    authorId: row.author_id,
    authorUsername: row.profiles?.username ?? "@unknown",
    authorDisplayName: row.profiles?.display_name ?? "Unknown",
    body: row.body,
    parentTweetId: row.parent_tweet_id,
    rootTweetId: row.root_tweet_id,
    createdAt: row.created_at,
  };
}

export interface CreateTweetInput {
  authorId: string;
  body: string;
  parentTweetId?: string;
}

export async function listLatestTweets(client: SupabaseClient<Database> = supabaseClient): Promise<Tweet[]> {
  const { data, error } = await client
    .from("tweets")
    .select("id, author_id, body, parent_tweet_id, root_tweet_id, created_at, profiles!tweets_author_id_fkey(user_id, username, display_name)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapTweet(row as TweetRow));
}

export async function createTweet(
  input: CreateTweetInput,
  client: SupabaseClient<Database> = supabaseClient,
): Promise<Tweet> {
  const { data, error } = await client
    .from("tweets")
    .insert({
      author_id: input.authorId,
      body: input.body.trim(),
      parent_tweet_id: input.parentTweetId ?? null,
    })
    .select("id, author_id, body, parent_tweet_id, root_tweet_id, created_at, profiles!tweets_author_id_fkey(user_id, username, display_name)")
    .single();

  if (error) {
    throw error;
  }

  return mapTweet(data as TweetRow);
}

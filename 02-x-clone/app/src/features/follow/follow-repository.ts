import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseClient } from "../../lib/supabase-client";
import type { Database } from "../../lib/supabase-types";

type FollowRow = Database["public"]["Tables"]["follows"]["Row"];

export async function listFollowingIds(
  followerId: string,
  client: SupabaseClient<Database> = supabaseClient,
): Promise<string[]> {
  const { data, error } = await client.from("follows").select("followee_id").eq("follower_id", followerId);

  if (error) {
    throw error;
  }

  return (data as Pick<FollowRow, "followee_id">[] | null)?.map((row) => row.followee_id) ?? [];
}

export async function followUser(
  followerId: string,
  followeeId: string,
  client: SupabaseClient<Database> = supabaseClient,
): Promise<void> {
  const { error } = await client.from("follows").insert({
    follower_id: followerId,
    followee_id: followeeId,
  });

  if (error) {
    throw error;
  }
}

export async function unfollowUser(
  followerId: string,
  followeeId: string,
  client: SupabaseClient<Database> = supabaseClient,
): Promise<void> {
  const { error } = await client.from("follows").delete().eq("follower_id", followerId).eq("followee_id", followeeId);

  if (error) {
    throw error;
  }
}

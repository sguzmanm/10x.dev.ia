import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseClient } from "../../lib/supabase-client";
import type { Database } from "../../lib/supabase-types";
import type { Profile } from "../shared/models";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

function mapProfile(row: ProfileRow): Profile {
  return {
    userId: row.user_id,
    username: row.username,
    displayName: row.display_name,
    bio: row.bio,
    avatarUrl: row.avatar_url,
  };
}

export async function listVisibleProfiles(client: SupabaseClient<Database> = supabaseClient): Promise<Profile[]> {
  const { data, error } = await client
    .from("profiles")
    .select("user_id, username, display_name, bio, avatar_url")
    .order("username", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapProfile(row as ProfileRow));
}

export async function getProfileByUserId(
  userId: string,
  client: SupabaseClient<Database> = supabaseClient,
): Promise<Profile | null> {
  const { data, error } = await client
    .from("profiles")
    .select("user_id, username, display_name, bio, avatar_url")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProfile(data as ProfileRow) : null;
}

export async function getProfileByUsername(
  username: string,
  client: SupabaseClient<Database> = supabaseClient,
): Promise<Profile | null> {
  const { data, error } = await client
    .from("profiles")
    .select("user_id, username, display_name, bio, avatar_url")
    .eq("username", username)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProfile(data as ProfileRow) : null;
}

export async function updateDisplayName(
  userId: string,
  displayName: string,
  client: SupabaseClient<Database> = supabaseClient,
): Promise<Profile> {
  const { data, error } = await client
    .from("profiles")
    .update({ display_name: displayName })
    .eq("user_id", userId)
    .select("user_id, username, display_name, bio, avatar_url")
    .single();

  if (error) {
    throw error;
  }

  return mapProfile(data as ProfileRow);
}

import { createClient } from "@supabase/supabase-js";
import { env } from "./env";
import type { Database } from "./supabase-types";

export const supabaseClient = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

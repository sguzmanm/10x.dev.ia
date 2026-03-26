function readRequiredEnv(name: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY"): string {
  const value = import.meta.env[name];

  if (!value || value.trim().length === 0) {
    if (import.meta.env.MODE === "test") {
      if (name === "VITE_SUPABASE_URL") {
        return "http://127.0.0.1:54321";
      }

      return "test-anon-key";
    }

    throw new Error(`Missing required env variable: ${name}`);
  }

  return value;
}

export const env = {
  supabaseUrl: readRequiredEnv("VITE_SUPABASE_URL"),
  supabaseAnonKey: readRequiredEnv("VITE_SUPABASE_ANON_KEY"),
};

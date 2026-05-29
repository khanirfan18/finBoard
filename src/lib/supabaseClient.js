import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const authUnavailable = {
  data: null,
  error: {
    message:
      "Supabase authentication is not configured for this environment.",
  },
};

function createAuthFallbackClient() {
  console.warn(
    "Supabase env vars are missing; auth actions will be disabled in this preview."
  );

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
      signInWithPassword: async () => authUnavailable,
      signUp: async () => authUnavailable,
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => authUnavailable,
      updateUser: async () => authUnavailable,
    },
  };
}

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createAuthFallbackClient();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export let isConfigured = true;
export let configErrorMessage = null;

if (!supabaseUrl || !supabaseAnonKey) {
  isConfigured = false;
  const missing = [
    !supabaseUrl ? "VITE_SUPABASE_URL" : null,
    !supabaseAnonKey ? "VITE_SUPABASE_ANON_KEY" : null,
  ]
    .filter(Boolean)
    .join(", ");

  configErrorMessage = `Missing ${missing} environment variable(s). Please create a .env file in the project root.`;
} else if (!/^https?:\/\//i.test(supabaseUrl)) {
  isConfigured = false;
  configErrorMessage = "Invalid VITE_SUPABASE_URL. Use the full URL, for example: https://your-project-ref.supabase.co";
}

// Export a dummy client if not configured so the app doesn't crash on import
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : { 
      auth: { 
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      } 
    };

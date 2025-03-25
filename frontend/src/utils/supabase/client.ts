import { createClient } from '@supabase/supabase-js';

// Create a singleton instance to prevent multiple client instances
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export function createSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance;
  }
  
  // Create new instance if none exists
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'supabase.auth.token',
    }
  });
  
  return supabaseInstance;
}

import { createBrowserClient } from '@supabase/ssr';
import { Database } from './database.types';
import { getSupabaseEnv } from './env';

export function createClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseEnv();

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

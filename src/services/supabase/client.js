/**
 * File: client.js
 * Purpose: Initializes the Supabase client context.
 * Dependencies: @supabase/supabase-js
 * Notes: Uses environment variables. Throws if missing. Client is used by other supabase services.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let _supabase: SupabaseClient | null = null;

if (URL && KEY) {
  _supabase = createClient(URL, KEY, {
    realtime: { params: { eventsPerSecond: 10 } },
  });
} else {
  // Avoid throwing during module evaluation; consumer will handle missing client.
  // This commonly happens in dev when env vars are not set in .env.local.
  // Log a clear message to help debugging.
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase client not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment',
  );
}

export const supabase = _supabase;

export default supabase;

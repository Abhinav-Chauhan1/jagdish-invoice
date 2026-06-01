import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  'placeholder';

// Server-only client — realtime disabled so no WebSocket is opened in Node.js
export const supabaseServer = createClient(supabaseUrl, supabaseKey, {
  realtime: { timeout: 0 },
  global: { headers: { 'x-client-info': 'jagdish-invoice-server' } },
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

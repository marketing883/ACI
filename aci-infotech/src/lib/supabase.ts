import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client - uses placeholder during build if env vars not set
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export { supabase };

// Server-side client with service role for admin operations
export const getServiceSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(url, serviceKey);
};

// Server-only write/read client for API routes. Prefers the service-role
// key so writes and admin reads bypass Row Level Security; falls back to
// the anon client in dev/demo when the service key isn't set. Lead
// tables (contacts, playbook_leads, newsletter_subscribers) have RLS that
// denies anonymous SELECT, so the anon client returns empty on read and
// can be blocked on insert — every server route that touches them must
// use this, never the bare `supabase` client. NEVER import into a client
// component: it can carry the service-role key.
export const getServerClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && serviceKey) return createClient(url, serviceKey);
  return supabase;
};

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

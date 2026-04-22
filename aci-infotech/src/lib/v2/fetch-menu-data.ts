/**
 * Server-side fetchers that power the Resources and Company mega menus.
 *
 * Pattern mirrors fetch-home-data.ts: prefer service role key, fall
 * back to anon. Every function fails safe — returns null on any error
 * so the menu can render with a static fallback rather than crash.
 *
 * Case studies and blogs already have fetchers in fetch-home-data.ts;
 * this file adds the missing whitepaper fetcher. Playbooks are not a
 * CMS table — the menu sources them from the PLAYBOOKS constant.
 */

import { createClient } from '@supabase/supabase-js';

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;
  if (!key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface MenuWhitepaper {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
}

export async function fetchFeaturedWhitepaper(): Promise<MenuWhitepaper | null> {
  const supabase = getClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('whitepapers')
      .select('slug, title, excerpt, cover_image')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return {
      slug: (data.slug as string) ?? '',
      title: (data.title as string) ?? '',
      excerpt: (data.excerpt as string) ?? null,
      cover_image: (data.cover_image as string) ?? null,
    };
  } catch {
    return null;
  }
}

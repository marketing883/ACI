/**
 * Server-side fetchers that power the Resources and Company mega menus.
 *
 * Configuration errors fail loud: `getClient()` throws when Supabase
 * URL or keys are missing, matching the pattern in fetch-home-data.ts.
 * Runtime errors (network / query failures) are still caught per-call
 * and return null so a flaky backend doesn't break the menu.
 *
 * Case studies and blogs already have fetchers in fetch-home-data.ts;
 * this file adds the missing whitepaper fetcher. Playbooks are not a
 * CMS table — the menu sources them from the PLAYBOOKS constant.
 */

import { createClient } from '@supabase/supabase-js';

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      '[fetch-menu-data] NEXT_PUBLIC_SUPABASE_URL is missing. Set it in the env file this build is using (.env for prod, .env.staging for staging) and rebuild.',
    );
  }
  const key = serviceKey || anonKey;
  if (!key) {
    throw new Error(
      '[fetch-menu-data] No Supabase key available. Set SUPABASE_SERVICE_ROLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY in the env file this build is using and rebuild.',
    );
  }
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

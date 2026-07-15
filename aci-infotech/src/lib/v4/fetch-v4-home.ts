/**
 * Server-side data fetchers for the v4 homepage sections. Same
 * conventions as the v2 fetchers (`src/lib/v2/fetch-home-data.ts`):
 * published-only rows, newest first, service-role key when available
 * with the anon key as the local-dev fallback.
 *
 * Every fetcher degrades gracefully (null / empty) so the page can fall
 * back to its built-in editorial copy when credentials are missing or
 * the network is unavailable. Wrapped in React cache() so repeated
 * calls within one request dedupe.
 */

import { cache } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Latest published newsroom item for the featured slot. */
export interface V4News {
  title: string;
  excerpt: string | null;
  /** External announcement URL when the item has one, /news otherwise. */
  href: string;
  image: string | null;
}

export const getV4FeaturedNews = cache(async (): Promise<V4News | null> => {
  const sb = getClient();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('news')
      .select('title, excerpt, external_url, image_url, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    const r = data as Record<string, unknown>;
    if (!r.title) return null;
    return {
      title: r.title as string,
      excerpt: (r.excerpt as string) ?? null,
      href: (r.external_url as string) || '/news',
      image: (r.image_url as string) ?? null,
    };
  } catch {
    return null;
  }
});

/** Latest published blog posts for the insights list. */
export interface V4Insight {
  title: string;
  href: string;
  /** Featured image, shown as the row's hover background. */
  image: string | null;
}

export const getV4Insights = cache(async (limit = 3): Promise<V4Insight[]> => {
  const sb = getClient();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from('blog_posts')
      .select('slug, title, featured_image_url')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return (data as Record<string, unknown>[])
      .filter((r) => r.slug && r.title)
      .map((r) => ({
        title: r.title as string,
        href: `/blogs/${r.slug as string}`,
        image: (r.featured_image_url as string) ?? null,
      }));
  } catch {
    return [];
  }
});

/** Latest published whitepaper for the download card. */
export interface V4Whitepaper {
  title: string;
  blurb: string | null;
  href: string;
}

export const getV4Whitepaper = cache(async (): Promise<V4Whitepaper | null> => {
  const sb = getClient();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('whitepapers')
      .select('slug, title, description')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    const r = data as Record<string, unknown>;
    if (!r.slug || !r.title) return null;
    // CMS descriptions can run to whole paragraphs; the download card
    // only has room for a teaser, so trim to a sentence-ish length at a
    // word boundary (the card also line-clamps as a second guard).
    let blurb = (r.description as string) ?? null;
    if (blurb && blurb.length > 180) {
      const cut = blurb.slice(0, 180);
      blurb = `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 120))}…`;
    }
    return {
      title: r.title as string,
      blurb,
      href: `/whitepapers/${r.slug as string}`,
    };
  } catch {
    return null;
  }
});

/**
 * Live facts for the curated success stories: the headline metric of
 * each published case study, keyed by slug. The section keeps its
 * editorial framing (tabs, summaries, footage) but the numbers and the
 * links stay tied to what is actually published in the CMS.
 */
export interface V4StoryFacts {
  metricValue: string | null;
  metricLabel: string | null;
}

export const getV4CaseStudyFacts = cache(
  async (slugs: string[]): Promise<Record<string, V4StoryFacts>> => {
    const sb = getClient();
    if (!sb || slugs.length === 0) return {};
    try {
      const { data, error } = await sb
        .from('case_studies')
        .select('slug, metrics')
        .eq('status', 'published')
        .in('slug', slugs);
      if (error || !data) return {};
      const out: Record<string, V4StoryFacts> = {};
      for (const row of data as Record<string, unknown>[]) {
        const slug = row.slug as string | undefined;
        if (!slug) continue;
        const metrics = Array.isArray(row.metrics)
          ? (row.metrics as { label?: string; value?: string }[])
          : [];
        out[slug] = {
          metricValue: metrics[0]?.value ?? null,
          metricLabel: metrics[0]?.label ?? null,
        };
      }
      return out;
    } catch {
      return {};
    }
  },
);

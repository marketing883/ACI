import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';

export interface ClusterPost {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  featuredImage: string | null;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fetch published blog posts relevant to a pillar's topic, so a pillar
// page can link its supporting articles (the "cluster" the SEO audit
// wanted). Matches keywords against title, category, and tags over a
// bounded recent window, case-insensitive. Returns [] on missing creds or
// no match, so the caller renders nothing rather than something off-topic.
// This is topic-based, not traffic-based: it needs no Search Console data,
// which we do not have yet.
export const getClusterPosts = cache(
  async (keywords: string[], limit = 3, excludeSlug?: string): Promise<ClusterPost[]> => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !keywords.length) return [];
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Wide window: the keyword filter is the real selector, so pull enough
    // recent posts that keyword-sparse topics (e.g. snowflake) can still
    // surface matches instead of returning 1 result from a 60-row cap.
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, category, tags, featured_image_url')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(200);

    if (error || !data) return [];

    const kw = keywords.map((k) => k.toLowerCase());
    const matched = data.filter((p: { slug?: string; title?: string; category?: string; tags?: string[] }) => {
      // Exclude the current post BEFORE slicing so it never eats a card slot.
      if (excludeSlug && p.slug === excludeSlug) return false;
      const hay = `${p.title || ''} ${p.category || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
      return kw.some((k) => hay.includes(k));
    });

    return matched.slice(0, limit).map((p: { slug: string; title: string; excerpt?: string | null; category?: string | null; featured_image_url?: string | null }) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? null,
      category: p.category ?? null,
      featuredImage: p.featured_image_url ?? null,
    }));
  },
);

// Most-recent published posts, excluding one slug. Used as the fallback for
// related-article blocks when a post's category/tags are too sparse to yield
// enough keyword matches, so every article still links to siblings (no
// crawl dead-ends).
export const getRecentPosts = cache(
  async (limit = 3, excludeSlug?: string): Promise<ClusterPost[]> => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt, category, tags, featured_image_url')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .limit(limit + 1);

    if (error || !data) return [];

    return data
      .filter((p: { slug?: string }) => !(excludeSlug && p.slug === excludeSlug))
      .slice(0, limit)
      .map((p: { slug: string; title: string; excerpt?: string | null; category?: string | null; featured_image_url?: string | null }) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? null,
        category: p.category ?? null,
        featuredImage: p.featured_image_url ?? null,
      }));
  },
);

import { createClient } from '@supabase/supabase-js';

// Server-side, read-only metadata lookups for the blog and whitepaper
// detail pages. Both detail pages are Client Components that fetch their
// body on the client, so the <title>, description, and canonical have to
// be resolved here in the route's generateMetadata instead. Uses the anon
// key against published rows only, the same access path as the sitemap
// and the case-study detail page. Returns null on missing creds or a miss
// so the caller can fall back to a bare self-canonical.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface PostMeta {
  title: string; // final <title>, brand suffix already applied
  description: string | null;
  canonical: string | null; // editorial override from the CMS, if set
  ogImage: string | null;
}

function getClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function withBrand(title: string): string {
  return title.includes('ACI Infotech') ? title : `${title} | ACI Infotech`;
}

export async function getBlogPostMeta(slug: string): Promise<PostMeta | null> {
  const supabase = getClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('blog_posts')
    .select(
      'title, excerpt, seo_title, seo_description, canonical_url, og_image_url, featured_image_url',
    )
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single();

  if (error || !data) return null;

  return {
    title: withBrand(data.seo_title || data.title),
    description: data.seo_description || data.excerpt || null,
    canonical: data.canonical_url || null,
    ogImage: data.og_image_url || data.featured_image_url || null,
  };
}

export async function getWhitepaperMeta(slug: string): Promise<PostMeta | null> {
  const supabase = getClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('whitepapers')
    .select(
      'title, excerpt, description, meta_title, meta_description, canonical_url, og_image_url, thumbnail_url',
    )
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;

  return {
    title: withBrand(data.meta_title || data.title),
    description: data.meta_description || data.excerpt || data.description || null,
    canonical: data.canonical_url || null,
    ogImage: data.og_image_url || data.thumbnail_url || null,
  };
}

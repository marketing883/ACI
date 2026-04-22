/**
 * Server-side data fetchers for the v2 homepage. Pulls real featured
 * content from Supabase using the service role key (bypasses RLS).
 *
 * Configuration errors fail loud: if the Supabase URL or keys are
 * missing, `getClient()` throws before any query runs. This surfaces
 * broken environments at build/render time rather than silently
 * serving empty arrays. The `prebuild` env-check script catches this
 * even earlier; the throw here is a second safety net for runtime
 * misconfigurations (e.g. an env file drift after deploy).
 *
 * Actual Supabase runtime errors (network failures, transient query
 * errors) remain caught by each fetcher's `try/catch` and return
 * empty arrays so a flaky network doesn't 500 the homepage.
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Resolve a Supabase client using the service-role key (bypasses RLS)
 * or the anon key as a fallback for local dev. Throws if neither the
 * URL nor at least one key is present.
 */
function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      '[fetch-home-data] NEXT_PUBLIC_SUPABASE_URL is missing. Set it in the env file this build is using (.env for prod, .env.staging for staging) and rebuild.',
    );
  }
  const key = serviceKey || anonKey;
  if (!key) {
    throw new Error(
      '[fetch-home-data] No Supabase key available. Set SUPABASE_SERVICE_ROLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY in the env file this build is using and rebuild.',
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface HomeCaseStudy {
  id: string;
  slug: string;
  title: string;
  client_descriptor: string | null;
  industry: string | null;
  challenge: string | null;
  solution: string | null;
  metrics: { label: string; value: string; description?: string }[];
  technologies: string[];
  services: string[];
  testimonial_quote: string | null;
  featured_image_url: string | null;
}

export async function fetchFeaturedCaseStudies(limit = 4): Promise<HomeCaseStudy[]> {
  const supabase = getClient();
  try {
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data.map((r: Record<string, unknown>) => ({
      id: (r.id as string) ?? '',
      slug: (r.slug as string) ?? '',
      title: (r.title as string) ?? '',
      client_descriptor: (r.client_descriptor as string) ?? null,
      industry: (r.industry as string) ?? null,
      challenge: (r.challenge as string) ?? null,
      solution: (r.solution as string) ?? null,
      metrics: Array.isArray(r.metrics)
        ? (r.metrics as HomeCaseStudy['metrics'])
        : [],
      technologies: Array.isArray(r.technologies) ? (r.technologies as string[]) : [],
      services: Array.isArray(r.services) ? (r.services as string[]) : [],
      testimonial_quote: (r.testimonial_quote as string) ?? null,
      featured_image_url: (r.featured_image_url as string) ?? null,
    }));
  } catch {
    return [];
  }
}

export interface HomeNewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  source: string | null;
  external_url: string | null;
  published_at: string | null;
  image_url: string | null;
}

export async function fetchFeaturedNews(limit = 4): Promise<HomeNewsItem[]> {
  const supabase = getClient();
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data.map((r: Record<string, unknown>) => ({
      id: (r.id as string) ?? '',
      title: (r.title as string) ?? '',
      excerpt: (r.excerpt as string) ?? null,
      source: (r.source as string) ?? null,
      external_url: (r.external_url as string) ?? null,
      published_at: (r.published_at as string) ?? null,
      image_url: (r.image_url as string) ?? null,
    }));
  } catch {
    return [];
  }
}

export interface HomeBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  read_time_minutes: number | null;
  published_at: string | null;
  featured_image_url: string | null;
}

export async function fetchFeaturedBlogs(limit = 4): Promise<HomeBlogPost[]> {
  const supabase = getClient();
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, category, read_time_minutes, published_at, featured_image_url')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error || !data) return [];
    return data.map((r: Record<string, unknown>) => ({
      id: (r.id as string) ?? '',
      slug: (r.slug as string) ?? '',
      title: (r.title as string) ?? '',
      excerpt: (r.excerpt as string) ?? null,
      category: (r.category as string) ?? null,
      read_time_minutes: typeof r.read_time_minutes === 'number' ? r.read_time_minutes : null,
      published_at: (r.published_at as string) ?? null,
      featured_image_url: (r.featured_image_url as string) ?? null,
    }));
  } catch {
    return [];
  }
}

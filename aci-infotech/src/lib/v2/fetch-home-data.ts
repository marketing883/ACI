/**
 * Server-side data fetchers for the v2 homepage. Pulls real featured
 * content from Supabase using the service role key (bypasses RLS).
 * All functions fail safe — they return empty arrays on any error so
 * the homepage renders with fallbacks rather than crashing.
 */

import { createClient } from '@supabase/supabase-js';

/**
 * Prefers the service-role key (bypasses RLS, works for admin routes
 * and server components that need to read any row). Falls back to the
 * anon key so the v2 preview still renders real data on developer
 * machines that only have the public keys configured. Published +
 * featured content should be readable by anon via RLS on the
 * relevant tables.
 */
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
  if (!supabase) return [];
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
  if (!supabase) return [];
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
  if (!supabase) return [];
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

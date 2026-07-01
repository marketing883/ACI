import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';

// Server-side fetch for a single published blog post, used by the blog
// detail page's generateMetadata AND its render. Wrapped in React cache()
// so both callers share one query per request. Anon key, published-only,
// the same access path as the sitemap. Returns null on missing creds or a
// miss so the page can notFound().

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  content_format?: 'markdown' | 'html' | null;
  author_name: string;
  author_title?: string | null;
  author_bio?: string | null;
  author_image_url?: string | null;
  author_linkedin?: string | null;
  category?: string | null;
  tags?: string[] | null;
  featured_image_url?: string | null;
  read_time_minutes?: number | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  og_image_url?: string | null;
  faqs?: Array<{ question: string; answer: string }> | null;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .single();
    if (error || !data) return null;
    return data as BlogPost;
  },
);

// Trimmed shape for listing/card rendering (no heavy `content` column).
export interface BlogListItem {
  slug: string;
  title: string;
  excerpt: string | null;
  author_name: string | null;
  author_title: string | null;
  author_image_url: string | null;
  category: string | null;
  tags: string[] | null;
  featured_image_url: string | null;
  read_time_minutes: number | null;
  published_at: string | null;
  created_at: string | null;
  is_featured: boolean | null;
}

const LIST_COLUMNS =
  'slug, title, excerpt, author_name, author_title, author_image_url, category, tags, featured_image_url, read_time_minutes, published_at, created_at, is_featured';

// Paginated published-post fetch for the /blogs index and /blogs/page/[n]
// routes. Server-side, anon key, ordered newest-first. Filters explicitly on
// status='published' (the source of truth) so drafts never surface in a
// listing where they would link to a 404. Returns the page slice plus the
// total count so callers can render numbered pagination. Wrapped in
// React cache() to dedupe within a request.
export const getPublishedBlogPosts = cache(
  async (
    page = 1,
    pageSize = 12,
  ): Promise<{ posts: BlogListItem[]; total: number }> => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return { posts: [], total: 0 };
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const from = (Math.max(1, page) - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, count, error } = await supabase
      .from('blog_posts')
      .select(LIST_COLUMNS, { count: 'exact' })
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .range(from, to);
    if (error || !data) return { posts: [], total: 0 };
    return { posts: data as unknown as BlogListItem[], total: count ?? data.length };
  },
);

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

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: (url, options = {}) => fetch(url, { ...options, cache: 'no-store' })
    }
  });

  // Get ALL posts ordered by published_at to find newest
  const { data: allPosts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, published_at, created_at, is_published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(30);

  // Also search for specific posts by title
  const { data: searchPosts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, published_at, created_at, is_published')
    .or('title.ilike.%data management%,title.ilike.%lakehouse strategy%,title.ilike.%feb%,title.ilike.%jan 14%')
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    totalPosts: allPosts?.length || 0,
    newestByPublishedAt: allPosts?.slice(0, 10).map(p => ({
      title: p.title?.substring(0, 50),
      published_at: p.published_at,
      created_at: p.created_at,
      is_published: p.is_published
    })),
    searchResults: searchPosts?.map(p => ({
      title: p.title?.substring(0, 50),
      published_at: p.published_at,
      created_at: p.created_at,
      is_published: p.is_published
    })) || []
  });
}

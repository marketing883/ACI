import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Check configuration status
  const configStatus = {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    hasServiceKey: !!supabaseServiceKey,
    cmsWillWork: !!(supabaseUrl && supabaseServiceKey),
    warning: !supabaseServiceKey ? 'SUPABASE_SERVICE_ROLE_KEY is missing - CMS is in DEMO MODE and posts are NOT being saved!' : null
  };

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase credentials', configStatus }, { status: 500 });
  }

  // Use SERVICE ROLE KEY to bypass RLS (same as CMS admin)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
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
    configStatus,
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

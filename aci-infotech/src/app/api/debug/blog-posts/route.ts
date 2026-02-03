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

  // Get all published posts
  const { data: allPosts, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, published_at, created_at, is_published')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Sort in JS
  const sortedPosts = (allPosts || []).sort((a, b) => {
    const dateA = new Date(a.published_at || a.created_at || 0).getTime();
    const dateB = new Date(b.published_at || b.created_at || 0).getTime();
    return dateB - dateA;
  });

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    totalPublished: allPosts?.length || 0,
    rawFromSupabase: allPosts?.slice(0, 10).map(p => ({
      title: p.title?.substring(0, 50),
      published_at: p.published_at,
      created_at: p.created_at,
      is_published: p.is_published
    })),
    afterJSSort: sortedPosts.slice(0, 10).map(p => ({
      title: p.title?.substring(0, 50),
      published_at: p.published_at,
      created_at: p.created_at
    }))
  });
}

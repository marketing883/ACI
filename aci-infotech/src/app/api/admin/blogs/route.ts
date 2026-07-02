import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Check if Supabase is configured
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!(url && serviceKey);
}

// Server-side Supabase client with service role key (bypasses RLS)
function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(url, serviceKey);
}

// READ - Get published blog posts (uses service role to bypass RLS)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') === 'true';
    const slug = searchParams.get('slug');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const featured = searchParams.get('featured') === 'true';

    // Demo mode: return empty array when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured');
      return NextResponse.json({ posts: [], demo: true });
    }

    const supabase = getServiceSupabase();

    // If id is provided, fetch single post by ID (for admin editing)
    const id = searchParams.get('id');
    if (id) {
      const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Blog fetch by ID error:', error);
        return NextResponse.json({ post: null, error: error.message }, { status: 404 });
      }

      return NextResponse.json({ post });
    }

    // If slug is provided, fetch single post by slug
    if (slug) {
      const { data: post, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .not('published_at', 'is', null)
        .single();

      if (error) {
        console.error('Blog fetch error:', error);
        return NextResponse.json({ post: null, error: error.message });
      }

      return NextResponse.json({ post });
    }

    // Fetch all posts (optionally filtered by published status)
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false });

    if (publishedOnly) {
      // Source of truth for "public" is status='published'. Filtering on
      // published_at alone leaked draft posts (which carry a published_at
      // date) into the public listing, where they 404 on click because the
      // detail page reads via the anon key and RLS only exposes
      // status='published' rows. Match that here so the listing never links
      // to a post that will 404.
      query = query.eq('status', 'published');
    }

    if (featured) {
      query = query.eq('is_featured', true);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: posts, error, count } = await query;

    if (error) {
      console.error('Blog fetch error:', error);
      return NextResponse.json(
        { error: error.message, posts: [], total: 0 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      posts: posts || [],
      total: count || 0,
      limit,
      offset,
      hasMore: (offset + limit) < (count || 0)
    });
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts', posts: [], total: 0 },
      { status: 500 }
    );
  }
}

// Helper to transform frontend field names to database column names
function transformFieldNames(data: Record<string, unknown>): Record<string, unknown> {
  const transformed = { ...data };
  // Database uses 'is_featured' column directly, no transformation needed.
  //
  // `status` is the source of truth for what's publicly visible (the
  // detail page's RLS-scoped anon read and the public listing both filter
  // on status='published'). The admin editor only ever sends
  // `is_published`, and this function used to translate that into
  // `published_at` alone while DROPPING `is_published` from the payload
  // before the insert/update -- so `status` was never set and
  // `is_published` was never actually persisted. Every post published
  // through the CMS ended up with a published_at date but status left at
  // its default ('draft'), so the public site 404'd it. Set both columns
  // here so publishing from the admin UI actually publishes.
  if ('is_published' in transformed) {
    if (transformed.is_published && !transformed.published_at) {
      transformed.published_at = new Date().toISOString();
    } else if (!transformed.is_published) {
      transformed.published_at = null;
    }
    transformed.status = transformed.is_published ? 'published' : 'draft';
  }
  return transformed;
}

// CREATE - New blog post
export async function POST(request: NextRequest) {
  try {
    const { content_format, ...rawData } = await request.json();
    const data = transformFieldNames(rawData);
    // Note: content_format is extracted but not saved (column doesn't exist in DB)

    // Demo mode: return mock response when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured, returning mock blog post');
      const mockBlog = {
        id: randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data,
      };
      return NextResponse.json({
        success: true,
        blog: mockBlog,
        demo: true,
        message: 'Demo mode: Blog post not actually saved. Configure Supabase for real storage.',
      });
    }

    const supabase = getServiceSupabase();

    const { data: blog, error } = await supabase
      .from('blog_posts')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Blog insert error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Blog POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

// UPDATE - Edit blog post
export async function PUT(request: NextRequest) {
  try {
    const { id, content_format, ...rawData } = await request.json();
    const data = transformFieldNames(rawData);

    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    console.log('Updating blog post:', id);
    console.log('Update data keys:', Object.keys(data));
    // Note: content_format is extracted but not saved (column doesn't exist in DB)

    // Demo mode: return mock response when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured, returning mock update');
      const mockBlog = {
        id,
        updated_at: new Date().toISOString(),
        ...data,
      };
      return NextResponse.json({
        success: true,
        blog: mockBlog,
        demo: true,
        message: 'Demo mode: Blog post not actually updated. Configure Supabase for real storage.',
      });
    }

    const supabase = getServiceSupabase();

    const { data: blog, error } = await supabase
      .from('blog_posts')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Blog update error:', error);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return NextResponse.json(
        { error: error.message, details: error, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error('Blog PUT error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE - Remove blog post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    // Demo mode: return success when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured, returning mock delete');
      return NextResponse.json({
        success: true,
        demo: true,
        message: 'Demo mode: Blog post not actually deleted. Configure Supabase for real storage.',
      });
    }

    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Blog delete error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Blog DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

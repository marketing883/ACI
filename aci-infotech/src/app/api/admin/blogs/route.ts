import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key (bypasses RLS)
function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Supabase credentials not configured');
  }

  return createClient(url, serviceKey);
}

// CREATE - New blog post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
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
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    console.log('Updating blog post:', id);
    console.log('Update data keys:', Object.keys(data));

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

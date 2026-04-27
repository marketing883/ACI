import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET - Get single published job by slug (public)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if job is closed
    if (data.closes_at && new Date(data.closes_at) < new Date()) {
      return NextResponse.json({ error: 'This position is no longer accepting applications' }, { status: 410 });
    }

    // Increment view count (using service role for this)
    const supabaseService = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await supabaseService
      .from('jobs')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', data.id);

    return NextResponse.json({ job: data });
  } catch (error) {
    console.error('Error in GET /api/jobs/[slug]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

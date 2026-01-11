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

// READ - Get case studies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Demo mode: return empty array when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured');
      return NextResponse.json({ caseStudies: [], demo: true });
    }

    const supabase = getServiceSupabase();

    // If slug is provided, fetch single case study
    if (slug) {
      const { data: caseStudy, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Case study fetch error:', error);
        return NextResponse.json({ caseStudy: null, error: error.message });
      }

      return NextResponse.json({ caseStudy });
    }

    // Fetch all case studies (no is_published column in this table)
    let query = supabase
      .from('case_studies')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (featured) {
      query = query.eq('is_featured', true);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: caseStudies, error, count } = await query;

    if (error) {
      console.error('Case studies fetch error:', error);
      return NextResponse.json(
        { error: error.message, caseStudies: [], total: 0 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      caseStudies: caseStudies || [],
      total: count || 0,
      limit,
      offset,
      hasMore: (offset + limit) < (count || 0)
    });
  } catch (error) {
    console.error('Case studies GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch case studies', caseStudies: [], total: 0 },
      { status: 500 }
    );
  }
}

// CREATE - New case study
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Demo mode: return mock response when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured, returning mock case study');
      const mockCaseStudy = {
        id: randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data,
      };
      return NextResponse.json({
        success: true,
        caseStudy: mockCaseStudy,
        demo: true,
        message: 'Demo mode: Case study not actually saved. Configure Supabase for real storage.',
      });
    }

    const supabase = getServiceSupabase();

    const { data: caseStudy, error } = await supabase
      .from('case_studies')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Case study insert error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, caseStudy });
  } catch (error) {
    console.error('Case study POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create case study' },
      { status: 500 }
    );
  }
}

// UPDATE - Edit case study
export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Case study ID is required' },
        { status: 400 }
      );
    }

    // Demo mode: return mock response when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured, returning mock update');
      const mockCaseStudy = {
        id,
        updated_at: new Date().toISOString(),
        ...data,
      };
      return NextResponse.json({
        success: true,
        caseStudy: mockCaseStudy,
        demo: true,
        message: 'Demo mode: Case study not actually updated. Configure Supabase for real storage.',
      });
    }

    const supabase = getServiceSupabase();

    const { data: caseStudy, error } = await supabase
      .from('case_studies')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Case study update error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, caseStudy });
  } catch (error) {
    console.error('Case study PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update case study' },
      { status: 500 }
    );
  }
}

// DELETE - Remove case study
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Case study ID is required' },
        { status: 400 }
      );
    }

    // Demo mode: return success when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured, returning mock delete');
      return NextResponse.json({
        success: true,
        demo: true,
        message: 'Demo mode: Case study not actually deleted. Configure Supabase for real storage.',
      });
    }

    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from('case_studies')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Case study delete error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Case study DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete case study' },
      { status: 500 }
    );
  }
}

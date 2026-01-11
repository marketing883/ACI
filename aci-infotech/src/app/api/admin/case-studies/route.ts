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

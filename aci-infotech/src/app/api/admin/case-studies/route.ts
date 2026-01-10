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

// CREATE - New case study
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
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

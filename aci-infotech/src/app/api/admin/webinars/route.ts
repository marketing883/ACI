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

// CREATE - New webinar
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const supabase = getServiceSupabase();

    const { data: webinar, error } = await supabase
      .from('webinars')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Webinar insert error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, webinar });
  } catch (error) {
    console.error('Webinar POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create webinar' },
      { status: 500 }
    );
  }
}

// UPDATE - Edit webinar
export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Webinar ID is required' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    const { data: webinar, error } = await supabase
      .from('webinars')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Webinar update error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, webinar });
  } catch (error) {
    console.error('Webinar PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update webinar' },
      { status: 500 }
    );
  }
}

// DELETE - Remove webinar
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Webinar ID is required' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from('webinars')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Webinar delete error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webinar DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete webinar' },
      { status: 500 }
    );
  }
}

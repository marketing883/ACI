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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const supabase = getServiceSupabase();

    const { data: whitepaper, error } = await supabase
      .from('whitepapers')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Whitepaper save error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      whitepaper,
    });

  } catch (error) {
    console.error('Whitepaper save error:', error);
    return NextResponse.json(
      { error: 'Failed to save whitepaper' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Whitepaper ID is required' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    const { data: whitepaper, error } = await supabase
      .from('whitepapers')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Whitepaper update error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      whitepaper,
    });

  } catch (error) {
    console.error('Whitepaper update error:', error);
    return NextResponse.json(
      { error: 'Failed to update whitepaper' },
      { status: 500 }
    );
  }
}

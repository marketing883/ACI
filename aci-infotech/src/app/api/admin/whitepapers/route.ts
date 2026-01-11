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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Demo mode: return mock response when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured, returning mock whitepaper');
      const mockWhitepaper = {
        id: randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data,
      };
      return NextResponse.json({
        success: true,
        whitepaper: mockWhitepaper,
        demo: true,
        message: 'Demo mode: Whitepaper not actually saved. Configure Supabase for real storage.',
      });
    }

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

    // Demo mode: return mock response when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured, returning mock update');
      const mockWhitepaper = {
        id,
        updated_at: new Date().toISOString(),
        ...data,
      };
      return NextResponse.json({
        success: true,
        whitepaper: mockWhitepaper,
        demo: true,
        message: 'Demo mode: Whitepaper not actually updated. Configure Supabase for real storage.',
      });
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Whitepaper ID is required' },
        { status: 400 }
      );
    }

    // Demo mode: return success when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured, returning mock delete');
      return NextResponse.json({
        success: true,
        demo: true,
        message: 'Demo mode: Whitepaper not actually deleted. Configure Supabase for real storage.',
      });
    }

    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from('whitepapers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Whitepaper delete error:', error);
      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Whitepaper DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete whitepaper' },
      { status: 500 }
    );
  }
}

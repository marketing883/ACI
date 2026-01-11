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

// READ - Get whitepapers
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
      return NextResponse.json({ whitepapers: [], demo: true });
    }

    const supabase = getServiceSupabase();

    // If slug is provided, fetch single whitepaper
    if (slug) {
      const { data: whitepaper, error } = await supabase
        .from('whitepapers')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Whitepaper fetch error:', error);
        return NextResponse.json({ whitepaper: null, error: error.message });
      }

      return NextResponse.json({ whitepaper });
    }

    // Fetch all whitepapers (no is_published column in this table)
    let query = supabase
      .from('whitepapers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (featured) {
      query = query.eq('is_featured', true);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: whitepapers, error, count } = await query;

    if (error) {
      console.error('Whitepapers fetch error:', error);
      return NextResponse.json(
        { error: error.message, whitepapers: [], total: 0 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      whitepapers: whitepapers || [],
      total: count || 0,
      limit,
      offset,
      hasMore: (offset + limit) < (count || 0)
    });
  } catch (error) {
    console.error('Whitepapers GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch whitepapers', whitepapers: [], total: 0 },
      { status: 500 }
    );
  }
}

// CREATE - New whitepaper
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

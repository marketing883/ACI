import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

// GET - Fetch all whitepaper leads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search') || '';
    const whitepaper = searchParams.get('whitepaper') || '';
    const downloaded = searchParams.get('downloaded');

    // Demo mode: return empty array when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured');
      return NextResponse.json({ leads: [], demo: true, total: 0 });
    }

    const supabase = getServiceSupabase();

    let query = supabase
      .from('whitepaper_leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
    }

    if (whitepaper) {
      query = query.eq('whitepaper_slug', whitepaper);
    }

    if (downloaded === 'true') {
      query = query.eq('token_used', true);
    } else if (downloaded === 'false') {
      query = query.eq('token_used', false);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: leads, error, count } = await query;

    if (error) {
      console.error('Whitepaper leads fetch error:', error);
      return NextResponse.json(
        { error: error.message, leads: [], total: 0 },
        { status: 500 }
      );
    }

    return NextResponse.json({
      leads: leads || [],
      total: count || 0,
      limit,
      offset,
      hasMore: (offset + limit) < (count || 0)
    });
  } catch (error) {
    console.error('Whitepaper leads GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch whitepaper leads', leads: [], total: 0 },
      { status: 500 }
    );
  }
}

// DELETE - Remove a whitepaper lead
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Demo mode: return success when Supabase isn't configured
    if (!isSupabaseConfigured()) {
      console.log('Demo mode: Supabase not configured, returning mock delete');
      return NextResponse.json({
        success: true,
        demo: true,
        message: 'Demo mode: Lead not actually deleted. Configure Supabase for real storage.',
      });
    }

    const supabase = getServiceSupabase();

    const { error } = await supabase
      .from('whitepaper_leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Whitepaper lead delete error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Whitepaper lead DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete whitepaper lead' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Admin reads/writes for lp_leads (every form under /lp/*).
//
// This used to live at /api/lp/leads, which sits outside /api/admin/* -
// src/middleware.ts returns early on those paths and never checks a user,
// so GET, PATCH and DELETE on the whole lead table were reachable by
// anyone on the internet, through a service-role client that bypasses RLS.
// Moving it under /api/admin puts it behind the same auth gate as every
// other lead endpoint. Do not add it to PUBLIC_READ_ADMIN_PATHS in
// src/lib/auth/roles.ts.

export const dynamic = 'force-dynamic';

// Server-side Supabase client with service role key
function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const serviceCluster = searchParams.get('service_cluster');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const supabase = getServiceSupabase();

    if (!supabase) {
      return NextResponse.json({
        leads: [],
        total: 0,
        demo: true,
        message: 'Supabase not configured',
      });
    }

    let query = supabase
      .from('lp_leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (serviceCluster) {
      query = query.eq('service_cluster', serviceCluster);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(
        `email.ilike.%${search}%,company_name.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
      );
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: leads, error, count } = await query;

    if (error) {
      console.error('Error fetching LP leads:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      leads: leads || [],
      total: count || 0,
      limit,
      offset,
      hasMore: (offset + limit) < (count || 0),
    });
  } catch (error) {
    console.error('LP leads fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// Update lead status
export async function PATCH(request: NextRequest) {
  try {
    const { id, status, notes } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const updateData: Record<string, string> = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const { data, error } = await supabase
      .from('lp_leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating LP lead:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (error) {
    console.error('LP lead update error:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// Delete lead
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

    const supabase = getServiceSupabase();

    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      );
    }

    const { error } = await supabase
      .from('lp_leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting LP lead:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('LP lead delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}

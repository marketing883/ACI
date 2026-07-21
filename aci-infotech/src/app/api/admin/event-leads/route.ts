import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// Admin reads/updates for event_leads (AION 2026 registrations, the
// lucky draw pool). Service-role so it bypasses RLS: event_leads only
// grants SELECT to authenticated users, so the browser anon client
// returns empty. Auth is enforced by middleware, which gates every
// /api/admin/* path.

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['new', 'contacted', 'attended', 'qualified', 'converted', 'lost'];

function configured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function GET() {
  try {
    if (!configured()) return NextResponse.json({ leads: [], demo: true });
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('event_leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Admin event-leads fetch error:', error);
      return NextResponse.json({ error: error.message, leads: [] }, { status: 500 });
    }
    return NextResponse.json({ leads: data || [] });
  } catch (error) {
    console.error('Admin event-leads GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations', leads: [] }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!configured()) return NextResponse.json({ success: true, demo: true });
    const { id, status } = await request.json();
    if (!id || !status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'A valid id and status are required' }, { status: 400 });
    }
    const supabase = getServiceSupabase();
    const { error } = await supabase.from('event_leads').update({ status }).eq('id', id);
    if (error) {
      console.error('Admin event-leads update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin event-leads PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!configured()) return NextResponse.json({ success: true, demo: true });
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'A registration id is required' }, { status: 400 });
    const supabase = getServiceSupabase();
    const { error } = await supabase.from('event_leads').delete().eq('id', id);
    if (error) {
      console.error('Admin event-leads delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin event-leads DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 });
  }
}

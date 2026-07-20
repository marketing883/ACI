import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// Admin reads/deletes for playbook_leads. Service-role so it bypasses
// RLS (the browser anon client is denied SELECT and returns empty).
// Auth is enforced by middleware, which gates every /api/admin/* path.

export const dynamic = 'force-dynamic';

function configured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function GET() {
  try {
    if (!configured()) return NextResponse.json({ leads: [], demo: true });
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('playbook_leads')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Admin playbook-leads fetch error:', error);
      return NextResponse.json({ error: error.message, leads: [] }, { status: 500 });
    }
    return NextResponse.json({ leads: data || [] });
  } catch (error) {
    console.error('Admin playbook-leads GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads', leads: [] }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!configured()) return NextResponse.json({ success: true, demo: true });
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Lead id is required' }, { status: 400 });
    const supabase = getServiceSupabase();
    const { error } = await supabase.from('playbook_leads').delete().eq('id', id);
    if (error) {
      console.error('Admin playbook-leads delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin playbook-leads DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}

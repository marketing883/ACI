import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// Admin reads/deletes for newsletter_subscribers. Service-role so it
// bypasses RLS (the browser anon client is denied SELECT and returns
// empty). Auth is enforced by middleware, which gates /api/admin/*.

export const dynamic = 'force-dynamic';

function configured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function GET() {
  try {
    if (!configured()) return NextResponse.json({ subscribers: [], demo: true });
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Admin subscribers fetch error:', error);
      return NextResponse.json({ error: error.message, subscribers: [] }, { status: 500 });
    }
    return NextResponse.json({ subscribers: data || [] });
  } catch (error) {
    console.error('Admin subscribers GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers', subscribers: [] }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!configured()) return NextResponse.json({ success: true, demo: true });
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Subscriber id is required' }, { status: 400 });
    const supabase = getServiceSupabase();
    const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
    if (error) {
      console.error('Admin subscribers delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin subscribers DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
  }
}

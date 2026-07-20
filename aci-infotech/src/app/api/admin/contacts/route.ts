import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// Admin reads/writes for the contacts (leads) table. Runs with the
// service-role key so it bypasses Row Level Security, which denies the
// browser anon client any SELECT on contacts. The admin page used to
// query Supabase directly from the browser and got an empty list; it
// now goes through here. Auth is enforced upstream: middleware gates
// every /api/admin/* path (this route is not on the public-read
// allowlist), so only an authenticated admin reaches it.

export const dynamic = 'force-dynamic';

function configured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// GET - all contacts, newest first (optional ?search=)
export async function GET(request: NextRequest) {
  try {
    if (!configured()) {
      return NextResponse.json({ contacts: [], demo: true, total: 0 });
    }
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get('search') || '').trim();

    const supabase = getServiceSupabase();
    let query = supabase
      .from('contacts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`,
      );
    }

    const { data: contacts, error, count } = await query;
    if (error) {
      console.error('Admin contacts fetch error:', error);
      return NextResponse.json({ error: error.message, contacts: [], total: 0 }, { status: 500 });
    }
    return NextResponse.json({ contacts: contacts || [], total: count || 0 });
  } catch (error) {
    console.error('Admin contacts GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts', contacts: [], total: 0 },
      { status: 500 },
    );
  }
}

// PATCH - update a contact's status and/or cached intelligence
export async function PATCH(request: NextRequest) {
  try {
    if (!configured()) {
      return NextResponse.json({ success: true, demo: true });
    }
    const body = await request.json();
    const { id, status, intelligence } = body ?? {};
    if (!id) {
      return NextResponse.json({ error: 'Contact id is required' }, { status: 400 });
    }

    const patch: Record<string, unknown> = {};
    if (typeof status === 'string') patch.status = status;
    if (intelligence !== undefined) patch.intelligence = intelligence;
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const supabase = getServiceSupabase();
    const { error } = await supabase.from('contacts').update(patch).eq('id', id);
    if (error) {
      console.error('Admin contacts update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin contacts PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}

// DELETE - remove a contact by ?id=
export async function DELETE(request: NextRequest) {
  try {
    if (!configured()) {
      return NextResponse.json({ success: true, demo: true });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Contact id is required' }, { status: 400 });
    }
    const supabase = getServiceSupabase();
    const { error } = await supabase.from('contacts').delete().eq('id', id);
    if (error) {
      console.error('Admin contacts delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin contacts DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}

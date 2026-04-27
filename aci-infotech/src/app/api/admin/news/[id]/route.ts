import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/rate-limit';
import { logAuditEvent } from '@/lib/audit-log';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get single news item
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const rateLimited = await checkRateLimit(request, 'read');
    if (rateLimited) return rateLimited;

    const { id } = await params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'News item not found' }, { status: 404 });
    }

    return NextResponse.json({ news: data });
  } catch (error) {
    console.error('Error in GET /api/admin/news/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update news item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const rateLimited = await checkRateLimit(request, 'standard');
    if (rateLimited) return rateLimited;

    const { id } = await params;
    const supabase = getSupabase();
    const body = await request.json();

    const {
      title,
      excerpt,
      source,
      external_url,
      link_text,
      image_url,
      published_at,
      status,
      is_featured,
      display_order,
    } = body;

    const updateData = {
      title,
      excerpt,
      source,
      external_url,
      link_text,
      image_url,
      published_at,
      status,
      is_featured,
      display_order,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('news')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating news:', error);
      return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
    }

    logAuditEvent({
      action: 'update',
      resource_type: 'news',
      resource_id: id,
      resource_title: data.title,
    }, request);

    return NextResponse.json({ news: data });
  } catch (error) {
    console.error('Error in PUT /api/admin/news/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete news item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const rateLimited = await checkRateLimit(request, 'standard');
    if (rateLimited) return rateLimited;

    const { id } = await params;
    const supabase = getSupabase();

    // Get news details before deletion for audit log
    const { data: newsToDelete } = await supabase
      .from('news')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting news:', error);
      return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
    }

    logAuditEvent({
      action: 'delete',
      resource_type: 'news',
      resource_id: id,
      resource_title: newsToDelete?.title,
    }, request);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/news/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

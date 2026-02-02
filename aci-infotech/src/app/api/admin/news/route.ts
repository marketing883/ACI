import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/rate-limit';
import { logAuditEvent } from '@/lib/audit-log';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getSupabase() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET - List news items
export async function GET(request: NextRequest) {
  try {
    const rateLimited = await checkRateLimit(request, 'read');
    if (rateLimited) return rateLimited;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const supabase = getSupabase();

    let query = supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    if (featured) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching news:', error);
      return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
    }

    return NextResponse.json({ news: data || [] });
  } catch (error) {
    console.error('Error in GET /api/admin/news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create news item
export async function POST(request: NextRequest) {
  try {
    const rateLimited = await checkRateLimit(request, 'standard');
    if (rateLimited) return rateLimited;

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

    const insertData = {
      title,
      excerpt,
      source,
      external_url,
      link_text: link_text || 'Read Full Story',
      image_url,
      published_at: published_at || new Date().toISOString().split('T')[0],
      status: status || 'draft',
      is_featured: is_featured || false,
      display_order: display_order || 0,
    };

    const { data, error } = await supabase
      .from('news')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error creating news:', error);
      return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
    }

    logAuditEvent({
      action: 'create',
      resource_type: 'news',
      resource_id: data.id,
      resource_title: data.title,
    }, request);

    return NextResponse.json({ news: data });
  } catch (error) {
    console.error('Error in POST /api/admin/news:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

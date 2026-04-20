import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// POST - Record trigger shown
export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const { session_id, trigger_id, page_path, trigger_context } = await request.json();

    if (!session_id || !trigger_id) {
      return NextResponse.json(
        { error: 'session_id and trigger_id required' },
        { status: 400 }
      );
    }

    // Get visitor_id from session
    const { data: session } = await supabase
      .from('visitor_sessions')
      .select('visitor_id')
      .eq('session_id', session_id)
      .single();

    // Insert trigger history
    await supabase.from('trigger_history').insert({
      session_id,
      visitor_id: session?.visitor_id || 'unknown',
      trigger_id,
      page_path: page_path || null,
      trigger_context: trigger_context || {},
    });

    // Update trigger impressions
    await supabase.rpc('increment_trigger_impressions', { trigger_id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Trigger History] Error:', error);
    return NextResponse.json(
      { error: 'Failed to record trigger history' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// POST - Record trigger engagement (user responded)
export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const { session_id, trigger_id, response } = await request.json();

    if (!session_id || !trigger_id) {
      return NextResponse.json(
        { error: 'session_id and trigger_id required' },
        { status: 400 }
      );
    }

    // Update the most recent trigger history entry for this session/trigger
    const { data: history } = await supabase
      .from('trigger_history')
      .select('id')
      .eq('session_id', session_id)
      .eq('trigger_id', trigger_id)
      .order('shown_at', { ascending: false })
      .limit(1)
      .single();

    if (history) {
      await supabase
        .from('trigger_history')
        .update({
          response: response || 'engaged',
          responded_at: new Date().toISOString(),
        })
        .eq('id', history.id);
    }

    // Update trigger engagements count if engaged
    if (response === 'engaged') {
      const { data: trigger } = await supabase
        .from('engagement_triggers')
        .select('engagements')
        .eq('id', trigger_id)
        .single();

      if (trigger) {
        await supabase
          .from('engagement_triggers')
          .update({
            engagements: (trigger.engagements || 0) + 1,
          })
          .eq('id', trigger_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Trigger Engagement] Error:', error);
    return NextResponse.json(
      { error: 'Failed to record engagement' },
      { status: 500 }
    );
  }
}

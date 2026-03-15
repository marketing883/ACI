import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with service role for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface VisitorEvent {
  session_id: string;
  visitor_id: string;
  page_view_id?: string;
  event_type: string;
  event_category: string;
  event_target?: string;
  event_value?: string;
  event_data?: Record<string, unknown>;
  page_x?: number;
  page_y?: number;
  viewport_x?: number;
  viewport_y?: number;
  element_x?: number;
  element_y?: number;
  page_path?: string;
  section_id?: string;
  scroll_depth?: number;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const events: VisitorEvent[] = body.events;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'No events provided' }, { status: 400 });
    }

    // Validate and sanitize events
    const validatedEvents = events.map((event) => ({
      session_id: String(event.session_id || '').substring(0, 100),
      visitor_id: String(event.visitor_id || '').substring(0, 100),
      page_view_id: event.page_view_id ? String(event.page_view_id).substring(0, 100) : null,
      event_type: String(event.event_type || 'unknown').substring(0, 50),
      event_category: String(event.event_category || 'unknown').substring(0, 50),
      event_target: event.event_target ? String(event.event_target).substring(0, 500) : null,
      event_value: event.event_value ? String(event.event_value).substring(0, 500) : null,
      event_data: event.event_data || {},
      page_x: typeof event.page_x === 'number' ? event.page_x : null,
      page_y: typeof event.page_y === 'number' ? event.page_y : null,
      viewport_x: typeof event.viewport_x === 'number' ? event.viewport_x : null,
      viewport_y: typeof event.viewport_y === 'number' ? event.viewport_y : null,
      element_x: typeof event.element_x === 'number' ? event.element_x : null,
      element_y: typeof event.element_y === 'number' ? event.element_y : null,
      page_path: event.page_path ? String(event.page_path).substring(0, 500) : null,
      section_id: event.section_id ? String(event.section_id).substring(0, 100) : null,
      scroll_depth: typeof event.scroll_depth === 'number' ? event.scroll_depth : null,
      timestamp: event.timestamp || new Date().toISOString(),
    }));

    // Insert events in batch
    const { error: insertError } = await supabase
      .from('visitor_events')
      .insert(validatedEvents);

    if (insertError) {
      console.error('[Analytics Events] Insert error:', insertError);
      // Don't fail the request - just log the error
      // Events are not critical enough to block the user experience
    }

    // Update session metrics asynchronously
    const sessionIds = [...new Set(events.map((e) => e.session_id))];
    for (const sessionId of sessionIds) {
      const sessionEvents = events.filter((e) => e.session_id === sessionId);

      // Count events and calculate max scroll depth
      const eventCount = sessionEvents.length;
      const maxScrollDepth = Math.max(
        ...sessionEvents.map((e) => e.scroll_depth || 0),
        0
      );

      // Update session metrics
      const { error: updateError } = await supabase
        .from('visitor_sessions')
        .update({
          event_count: supabase.rpc('increment_counter', { row_id: sessionId, field: 'event_count', amount: eventCount }),
          max_scroll_depth: maxScrollDepth,
          last_activity_at: new Date().toISOString(),
        })
        .eq('session_id', sessionId);

      if (updateError) {
        // Try simpler update without RPC
        await supabase
          .from('visitor_sessions')
          .update({
            last_activity_at: new Date().toISOString(),
            max_scroll_depth: maxScrollDepth,
          })
          .eq('session_id', sessionId);
      }
    }

    // Process page view events for page_views table
    const pageViewEvents = events.filter(
      (e) => e.event_type === 'page_view' || e.event_type === 'page_exit'
    );

    for (const event of pageViewEvents) {
      if (event.event_type === 'page_view') {
        const pageViewData = event.event_data as {
          page_url?: string;
          page_path?: string;
          page_title?: string;
          page_type?: string;
          page_view_id?: string;
        };

        // Insert new page view
        await supabase.from('page_views').insert({
          id: pageViewData.page_view_id,
          session_id: event.session_id,
          visitor_id: event.visitor_id,
          page_url: pageViewData.page_url,
          page_path: pageViewData.page_path || event.page_path,
          page_title: pageViewData.page_title,
          page_type: pageViewData.page_type,
          entered_at: event.timestamp,
        });
      } else if (event.event_type === 'page_exit') {
        const exitData = event.event_data as {
          page_view_id?: string;
          time_on_page_ms?: number;
          visible_time_ms?: number;
          max_scroll_depth?: number;
          click_count?: number;
          sections?: Array<{
            section_id: string;
            section_name: string;
            time_visible_ms: number;
            scroll_depth_percent: number;
          }>;
        };

        // Update page view with exit data
        if (exitData.page_view_id) {
          await supabase
            .from('page_views')
            .update({
              exited_at: event.timestamp,
              time_on_page_ms: exitData.time_on_page_ms,
              visible_time_ms: exitData.visible_time_ms,
              max_scroll_depth: exitData.max_scroll_depth,
              click_count: exitData.click_count,
              section_views: exitData.sections || [],
            })
            .eq('id', exitData.page_view_id);
        }
      }
    }

    return NextResponse.json({ success: true, count: validatedEvents.length });
  } catch (error) {
    console.error('[Analytics Events] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process events' },
      { status: 500 }
    );
  }
}

// Handle beacon requests (which come as text/plain)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET - Fetch active triggers
export async function GET() {
  try {
    const { data: triggers, error } = await supabase
      .from('engagement_triggers')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: true });

    if (error) {
      console.error('[Triggers] Fetch error:', error);
      return NextResponse.json({ triggers: [] });
    }

    return NextResponse.json({ triggers: triggers || [] });
  } catch (error) {
    console.error('[Triggers] Error:', error);
    return NextResponse.json({ triggers: [] });
  }
}

// POST - Create new trigger (admin only)
export async function POST(request: NextRequest) {
  try {
    const trigger = await request.json();

    // Validate required fields
    if (!trigger.name || !trigger.trigger_type || !trigger.message_template) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('engagement_triggers')
      .insert({
        name: trigger.name,
        description: trigger.description || null,
        trigger_type: trigger.trigger_type,
        conditions: trigger.conditions || {},
        target_pages: trigger.target_pages || ['*'],
        exclude_pages: trigger.exclude_pages || [],
        action_type: trigger.action_type || 'chat_proactive',
        action_config: trigger.action_config || {},
        message_template: trigger.message_template,
        message_variants: trigger.message_variants || [],
        cooldown_minutes: trigger.cooldown_minutes || 30,
        max_shows_per_session: trigger.max_shows_per_session || 1,
        max_shows_per_visitor: trigger.max_shows_per_visitor || 3,
        delay_seconds: trigger.delay_seconds || 0,
        priority: trigger.priority || 100,
        device_types: trigger.device_types || ['desktop', 'tablet', 'mobile'],
        visitor_types: trigger.visitor_types || ['new', 'returning'],
        is_active: trigger.is_active !== false,
      })
      .select()
      .single();

    if (error) {
      console.error('[Triggers] Create error:', error);
      return NextResponse.json(
        { error: 'Failed to create trigger' },
        { status: 500 }
      );
    }

    return NextResponse.json({ trigger: data });
  } catch (error) {
    console.error('[Triggers] Error:', error);
    return NextResponse.json(
      { error: 'Failed to create trigger' },
      { status: 500 }
    );
  }
}

// PATCH - Update trigger (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Trigger ID required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('engagement_triggers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Triggers] Update error:', error);
      return NextResponse.json(
        { error: 'Failed to update trigger' },
        { status: 500 }
      );
    }

    return NextResponse.json({ trigger: data });
  } catch (error) {
    console.error('[Triggers] Error:', error);
    return NextResponse.json(
      { error: 'Failed to update trigger' },
      { status: 500 }
    );
  }
}

// DELETE - Delete trigger (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Trigger ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('engagement_triggers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Triggers] Delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete trigger' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Triggers] Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete trigger' },
      { status: 500 }
    );
  }
}

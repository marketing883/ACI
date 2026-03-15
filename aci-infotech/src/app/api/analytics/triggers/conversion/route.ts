import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST - Record trigger conversion
export async function POST(request: NextRequest) {
  try {
    const { session_id, trigger_id, conversion_type } = await request.json();

    if (!session_id || !trigger_id) {
      return NextResponse.json(
        { error: 'session_id and trigger_id required' },
        { status: 400 }
      );
    }

    // Update the most recent trigger history entry
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
          converted: true,
          conversion_type: conversion_type || 'chat_lead',
          converted_at: new Date().toISOString(),
        })
        .eq('id', history.id);
    }

    // Update trigger conversions count
    await supabase
      .from('engagement_triggers')
      .update({
        conversions: supabase.sql`conversions + 1`,
      })
      .eq('id', trigger_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Trigger Conversion] Error:', error);
    return NextResponse.json(
      { error: 'Failed to record conversion' },
      { status: 500 }
    );
  }
}

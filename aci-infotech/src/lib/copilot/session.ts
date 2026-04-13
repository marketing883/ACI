/**
 * Session + message persistence for Atheros.
 *
 * Thin writers over the tables created by
 * supabase/migrations/20260412_copilot_observability.sql. Used by the
 * Part-3 edge route after each turn and by the Part-6 admin live view.
 *
 * All writes use the service role key and are best-effort: a failing
 * persist MUST NOT take down the user-facing turn. Failures route
 * through log.error so the admin error log surfaces them.
 */

import { createClient } from '@supabase/supabase-js';
import { log } from './logger';

// Loose client type; see scripts/index-content.ts for rationale.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClient = any;

function serviceRoleClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface SessionUpsertInput {
  session_id: string;
  visitor_id?: string | null;
  page_entry?: string | null;
  flag_bucket?: number | null;
  client_version?: string | null;
  device_class?: 'mobile' | 'tablet' | 'desktop' | null;
}

export async function upsertSession(input: SessionUpsertInput): Promise<void> {
  const supabase = serviceRoleClient();
  if (!supabase) return;
  const { error } = await supabase
    .from('chat_sessions')
    .upsert(
      {
        session_id: input.session_id,
        visitor_id: input.visitor_id ?? null,
        page_entry: input.page_entry ?? null,
        flag_bucket: input.flag_bucket ?? null,
        client_version: input.client_version ?? null,
        device_class: input.device_class ?? null,
      },
      { onConflict: 'session_id' },
    );
  if (error) {
    log.warn('init', error, { sessionId: input.session_id, extra: { phase: 'upsertSession' } });
  }
}

export interface MessageInsertInput {
  session_id: string;
  role: 'user' | 'assistant' | 'tool' | 'admin' | 'system';
  content?: string | null;
  tool_name?: string | null;
  tool_args?: unknown;
  tool_result?: unknown;
  model?: string | null;
  input_tokens?: number | null;
  output_tokens?: number | null;
  latency_ms?: number | null;
  cost_usd?: number | null;
  thoughts?: string[] | null;
  status_events?: Array<{ at: number; text: string }> | null;
  stream_incomplete?: boolean;
}

export async function insertMessage(input: MessageInsertInput): Promise<void> {
  const supabase = serviceRoleClient();
  if (!supabase) return;
  const { error } = await supabase.from('chat_messages').insert({
    session_id: input.session_id,
    role: input.role,
    content: input.content ?? null,
    tool_name: input.tool_name ?? null,
    tool_args: input.tool_args ?? null,
    tool_result: input.tool_result ?? null,
    model: input.model ?? null,
    input_tokens: input.input_tokens ?? null,
    output_tokens: input.output_tokens ?? null,
    latency_ms: input.latency_ms ?? null,
    cost_usd: input.cost_usd ?? null,
    thoughts: input.thoughts ?? null,
    status_events: input.status_events ?? null,
    stream_incomplete: input.stream_incomplete ?? false,
  });
  if (error) {
    log.warn('init', error, {
      sessionId: input.session_id,
      extra: { phase: 'insertMessage', role: input.role },
    });
  }
}

export async function markSessionHandoff(
  sessionId: string,
  reason: string,
): Promise<void> {
  const supabase = serviceRoleClient();
  if (!supabase) return;
  const { error } = await supabase
    .from('chat_sessions')
    .update({ handoff_at: new Date().toISOString(), handoff_reason: reason })
    .eq('session_id', sessionId);
  if (error) {
    log.warn('tool', error, {
      sessionId,
      extra: { phase: 'markSessionHandoff', reason },
    });
  }
}

/**
 * Upsert captured lead fields into public.chat_leads. Keeps the existing
 * chat_leads shape so Part-1 ops (generateIntelligence, admin/chat-leads)
 * keep working. Called by the qualify_lead tool handler.
 */
export async function upsertChatLead(
  sessionId: string,
  fields: {
    name?: string;
    email?: string;
    company?: string;
    jobTitle?: string;
    industry?: string;
    timeline?: string;
    serviceInterest?: string;
    role?: string;
    team?: string;
  },
  conversation?: Array<{ role: string; content: string }>,
): Promise<void> {
  const supabase = serviceRoleClient();
  if (!supabase) return;
  // Email is required by the existing chat_leads schema. Upsert only when
  // we have one; otherwise the row is created on the next qualify_lead turn
  // that includes email.
  if (!fields.email) return;
  const { error } = await supabase.from('chat_leads').upsert(
    {
      session_id: sessionId,
      name: fields.name ?? null,
      email: fields.email,
      company: fields.company ?? null,
      job_title: fields.jobTitle ?? null,
      location: null,
      service_interest: fields.serviceInterest ?? null,
      requirements: fields.team ?? null,
      preferred_time: fields.timeline ?? null,
      conversation: conversation ?? [],
      source: 'atheros_v2',
    },
    { onConflict: 'session_id' },
  );
  if (error) {
    log.error('tool', error, {
      sessionId,
      extra: { phase: 'upsertChatLead' },
    });
  }
}

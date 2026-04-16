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
import { generateIntelligence } from '@/lib/intelligence';

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

export interface RetrievalSummary {
  topK: number;
  topSimilarity: number;
  sourceTypes: string[];
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
  retrieval_summary?: RetrievalSummary | null;
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
    retrieval_summary: input.retrieval_summary ?? null,
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
  priority?: 'critical' | 'urgent' | 'normal',
): Promise<void> {
  const supabase = serviceRoleClient();
  if (!supabase) return;
  const { error } = await supabase
    .from('chat_sessions')
    .update({
      handoff_at: new Date().toISOString(),
      handoff_reason: reason,
      handoff_priority: priority ?? 'normal',
    })
    .eq('session_id', sessionId);
  if (error) {
    log.warn('tool', error, {
      sessionId,
      extra: { phase: 'markSessionHandoff', reason, priority },
    });
  }
}

/**
 * Upsert captured lead fields into public.chat_leads. Keeps the existing
 * chat_leads shape so Part-1 ops (generateIntelligence, admin/chat-leads)
 * keep working. Called by the qualify_lead tool handler.
 *
 * Side effect: when an email arrives for the first time on a session,
 * fires generateIntelligence in the background and stores the resulting
 * IntelligenceReport on the chat_leads row. This mirrors the legacy
 * /api/chat/lead/route.ts behavior so the admin /admin/chat-leads page
 * shows a fully-enriched lead the moment an admin clicks through, with
 * no manual "Generate" click required.
 */
export interface UpsertChatLeadResult {
  /**
   * True when the email landed in chat_leads for the first time on this
   * session (no pre-existing row, or the pre-existing row had no
   * intelligence yet). Used by the caller to fire a one-shot
   * sendThankYouEmail alongside the intelligence generation.
   */
  freshEmail: boolean;
}

export async function upsertChatLead(
  sessionId: string,
  fields: {
    name?: string;
    email?: string;
    company?: string;
    website?: string;
    phone?: string;
    jobTitle?: string;
    industry?: string;
    timeline?: string;
    serviceInterest?: string;
    role?: string;
    team?: string;
    budget?: string;
    priority?: string;
    intent?: string;
    painPoint?: string;
    decisionRole?: string;
  },
  conversation?: Array<{ role: string; content: string }>,
): Promise<UpsertChatLeadResult> {
  const supabase = serviceRoleClient();
  if (!supabase) return { freshEmail: false };
  // Email is required by the existing chat_leads schema. Upsert only when
  // we have one; otherwise the row is created on the next qualify_lead turn
  // that includes email.
  if (!fields.email) return { freshEmail: false };

  // Detect "fresh email": is this session's row already in the table with
  // intelligence already attached? If not, we'll fire intelligence after
  // the upsert. We only fire once per session to avoid burning budget on
  // every qualify_lead call.
  let needsIntelligence = false;
  try {
    const { data: existing } = await supabase
      .from('chat_leads')
      .select('id, intelligence')
      .eq('session_id', sessionId)
      .maybeSingle();
    needsIntelligence = !existing || existing.intelligence == null;
  } catch (err) {
    // copilot-allow-silent-catch: read failure is non-fatal; we err on the
    // side of generating (worst case: minor double-generation).
    log.warn('tool', err, { sessionId, extra: { phase: 'upsertChatLead.preCheck' } });
    needsIntelligence = true;
  }

  const { data: upserted, error } = await supabase
    .from('chat_leads')
    .upsert(
      {
        session_id: sessionId,
        name: fields.name ?? null,
        email: fields.email,
        company: fields.company ?? null,
        website: fields.website ?? null,
        phone: fields.phone ?? null,
        job_title: fields.jobTitle ?? null,
        location: null,
        service_interest: fields.serviceInterest ?? null,
        requirements: fields.team ?? null,
        preferred_time: fields.timeline ?? null,
        budget: fields.budget ?? null,
        priority: fields.priority ?? null,
        intent: fields.intent ?? null,
        pain_point: fields.painPoint ?? null,
        decision_role: fields.decisionRole ?? null,
        conversation: conversation ?? [],
        source: 'atheros_v2',
      },
      { onConflict: 'session_id' },
    )
    .select('id')
    .single();
  if (error) {
    log.error('tool', error, {
      sessionId,
      extra: { phase: 'upsertChatLead' },
    });
    return { freshEmail: false };
  }

  if (!needsIntelligence || !upserted?.id) return { freshEmail: false };

  // Fire-and-forget intelligence generation. Mirrors the legacy
  // /api/chat/lead/route.ts pattern. Failures land in chat_errors via
  // log.error; the user-facing turn is never blocked.
  const leadId = upserted.id as string;
  void generateIntelligence({
    name: fields.name,
    email: fields.email,
    company: fields.company ?? null,
    job_title: fields.jobTitle ?? null,
    location: null,
    service_interest: fields.serviceInterest ?? undefined,
    requirements: fields.team ?? undefined,
    conversation: conversation ?? [],
  })
    .then(async (intelligence) => {
      try {
        const { error: updateErr } = await supabase
          .from('chat_leads')
          .update({ intelligence, lead_score: intelligence.leadScore })
          .eq('id', leadId);
        if (updateErr) {
          log.warn('tool', updateErr, {
            sessionId,
            extra: { phase: 'upsertChatLead.intelligencePersist', leadId },
          });
        } else {
          log.info('tool', `intelligence stored for chat_lead ${leadId}`, {
            sessionId,
          });
        }
      } catch (err) {
        // copilot-allow-silent-catch: persist failure already logged above
        log.warn('tool', err, { sessionId, extra: { phase: 'upsertChatLead.persistCatch' } });
      }
    })
    .catch((err) => {
      log.error('generate', err, {
        sessionId,
        extra: { phase: 'generateIntelligence', leadId },
      });
    });

  return { freshEmail: true };
}

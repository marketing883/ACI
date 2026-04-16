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
import type { ConversationLeadState } from './prompt';

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

/**
 * Read the current lead context for a session: the accumulated lead fields
 * (ConversationLeadState shape, mapped from chat_leads columns) plus the
 * lead_score from the intelligence pipeline.
 *
 * Used by the v2 route at the start of every turn so the system prompt's
 * QUALIFICATION STATE and LEAD TEMPERATURE blocks reflect what's actually
 * captured in the database, not whatever the client happens to be holding
 * (which today is nothing — ChatWidget passes an empty placeholder).
 *
 * Returns an object with null-safe defaults. If no row exists yet, state
 * is an empty object and score is null — callers treat these as the
 * "pre-qualification" baseline.
 *
 * Note: industry and role are captured by qualify_lead but not yet
 * persisted on chat_leads (columns missing). Sub-task 3 adds them; until
 * then this helper returns them as undefined.
 */
export async function readLeadContext(
  sessionId: string,
): Promise<{ state: ConversationLeadState; score: number | null }> {
  const supabase = serviceRoleClient();
  if (!supabase) return { state: {}, score: null };
  try {
    const { data, error } = await supabase
      .from('chat_leads')
      .select(
        'name, email, company, website, phone, job_title, industry, role, service_interest, requirements, preferred_time, budget, priority, intent, pain_point, decision_role, lead_score',
      )
      .eq('session_id', sessionId)
      .maybeSingle();
    if (error || !data) return { state: {}, score: null };
    // Map chat_leads columns -> ConversationLeadState, dropping nulls so
    // undefined === not-captured in the prompt's LEAD_STATE_KEYS loop.
    const state: ConversationLeadState = {};
    if (data.name) state.name = data.name;
    if (data.email) state.email = data.email;
    if (data.company) state.company = data.company;
    if (data.website) state.website = data.website;
    if (data.phone) state.phone = data.phone;
    if (data.job_title) state.jobTitle = data.job_title;
    if (data.industry) state.industry = data.industry;
    if (data.role) state.role = data.role;
    if (data.service_interest) state.serviceInterest = data.service_interest;
    // chat_leads.requirements stores qualify_lead.team (legacy column name).
    if (data.requirements) state.team = data.requirements;
    // chat_leads.preferred_time stores qualify_lead.timeline (legacy name).
    if (data.preferred_time) state.timeline = data.preferred_time;
    if (data.budget) state.budget = data.budget;
    if (data.priority) state.priority = data.priority;
    if (data.intent) state.intent = data.intent;
    if (data.pain_point) state.painPoint = data.pain_point;
    if (data.decision_role) state.decisionRole = data.decision_role;
    const score = typeof data.lead_score === 'number' ? data.lead_score : null;
    return { state, score };
  } catch (err) {
    log.warn('tool', err, { sessionId, extra: { phase: 'readLeadContext' } });
    return { state: {}, score: null };
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

  // Read the existing row once. Used for:
  //   1. Decide whether this turn is the "fresh email" moment (first time
  //      email surfaces on this session) so the caller can fire the
  //      thank-you email exactly once.
  //   2. Decide whether to fire intelligence (only after email is
  //      captured — intelligence generation needs email + domain).
  //   3. Merge incoming fields with existing column values so un-included
  //      fields don't get overwritten to null on the upsert.
  let existing:
    | {
        id?: string;
        intelligence?: unknown;
        name?: string | null;
        email?: string | null;
        company?: string | null;
        website?: string | null;
        phone?: string | null;
        job_title?: string | null;
        industry?: string | null;
        role?: string | null;
        service_interest?: string | null;
        requirements?: string | null;
        preferred_time?: string | null;
        budget?: string | null;
        priority?: string | null;
        intent?: string | null;
        pain_point?: string | null;
        decision_role?: string | null;
      }
    | null = null;
  try {
    const { data } = await supabase
      .from('chat_leads')
      .select(
        'id, intelligence, name, email, company, website, phone, job_title, industry, role, service_interest, requirements, preferred_time, budget, priority, intent, pain_point, decision_role',
      )
      .eq('session_id', sessionId)
      .maybeSingle();
    existing = data ?? null;
  } catch (err) {
    // copilot-allow-silent-catch: read failure is non-fatal. We proceed
    // with existing=null; the upsert may insert a fresh row.
    log.warn('tool', err, { sessionId, extra: { phase: 'upsertChatLead.preCheck' } });
  }

  // Fresh email: this is the first turn where email lands on this
  // session's row. Used by the caller to fire thank-you once, and by
  // the intelligence gate below.
  const incomingEmail =
    typeof fields.email === 'string' && fields.email.trim().length > 0
      ? fields.email.trim()
      : undefined;
  const existingEmail =
    typeof existing?.email === 'string' && existing.email.trim().length > 0
      ? existing.email.trim()
      : undefined;
  const freshEmail = Boolean(incomingEmail) && !existingEmail;
  // Intelligence fires when:
  //   - email just arrived (freshEmail), AND
  //   - no prior intelligence attached to the row.
  // If email is not present at all this turn, skip intelligence and just
  // persist whatever fields we have.
  const needsIntelligence =
    freshEmail && (!existing || existing.intelligence == null);

  // pick: prefer a non-empty incoming value; otherwise keep whatever is
  // already in chat_leads; otherwise null. This is the core of the
  // non-destructive upsert.
  const pick = (
    incoming: string | undefined,
    existingVal: string | null | undefined,
  ): string | null => {
    const trimmed = typeof incoming === 'string' ? incoming.trim() : '';
    if (trimmed.length > 0) return trimmed;
    return existingVal ?? null;
  };

  const { data: upserted, error } = await supabase
    .from('chat_leads')
    .upsert(
      {
        session_id: sessionId,
        name: pick(fields.name, existing?.name),
        // Email may be null on the first few qualify_lead calls; column
        // is nullable per the 20260416_chat_leads_partial_capture
        // migration. Once captured, subsequent turns preserve it via
        // the pick() fallback.
        email: pick(incomingEmail, existing?.email),
        company: pick(fields.company, existing?.company),
        website: pick(fields.website, existing?.website),
        phone: pick(fields.phone, existing?.phone),
        job_title: pick(fields.jobTitle, existing?.job_title),
        industry: pick(fields.industry, existing?.industry),
        role: pick(fields.role, existing?.role),
        location: null,
        service_interest: pick(fields.serviceInterest, existing?.service_interest),
        requirements: pick(fields.team, existing?.requirements),
        preferred_time: pick(fields.timeline, existing?.preferred_time),
        budget: pick(fields.budget, existing?.budget),
        priority: pick(fields.priority, existing?.priority),
        intent: pick(fields.intent, existing?.intent),
        pain_point: pick(fields.painPoint, existing?.pain_point),
        decision_role: pick(fields.decisionRole, existing?.decision_role),
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

  if (!needsIntelligence || !upserted?.id) return { freshEmail };

  // Fire-and-forget intelligence generation. Mirrors the legacy
  // /api/chat/lead/route.ts pattern. Failures land in chat_errors via
  // log.error; the user-facing turn is never blocked.
  //
  // Use the MERGED values (incoming fields OR existing row) so the
  // intelligence report reflects everything we know about the lead at
  // this moment, not just the fields that happened to arrive on the
  // email-capture turn. Without this fallback, a session that captured
  // name+company on turns 1-3 and email alone on turn 5 would hand the
  // model a skeletal { email } payload and get a sparse report back.
  const leadId = upserted.id as string;
  void generateIntelligence({
    name: fields.name ?? existing?.name ?? undefined,
    email: incomingEmail ?? existing?.email ?? undefined,
    company: fields.company ?? existing?.company ?? null,
    job_title: fields.jobTitle ?? existing?.job_title ?? null,
    location: null,
    service_interest:
      fields.serviceInterest ?? existing?.service_interest ?? undefined,
    requirements: fields.team ?? existing?.requirements ?? undefined,
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

  return { freshEmail };
}

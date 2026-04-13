/**
 * POST /api/chat/v2
 *
 * Atheros v2 edge route. Orchestrates a single turn:
 *   1. Flag + kill-switch check. Flag off returns 404 so probes cannot
 *      enumerate the endpoint.
 *   2. Rate limit (visitor + IP).
 *   3. Session upsert + user message persist.
 *   4. Retrieve content via hybridRetrieve.
 *   5. Build the system prompt (identity + page context + retrieved
 *      knowledge + lead state).
 *   6. Stream a reply from the Haiku 4.5 -> GPT-4o-mini -> Haiku 3.5
 *      fallback chain. Emit status, thought, token, tool_call_* events.
 *   7. Execute mutating tool calls server-side (qualify_lead,
 *      handoff_to_human, schedule_meeting) and persist the full turn.
 *   8. Flush `done` with usage + cost.
 *
 * Runtime: Node (not edge) because:
 *   - @supabase/supabase-js insert paths perform better here,
 *   - Upstash works on edge but the @upstash/ratelimit + Redis combination
 *     is more reliable on Node during the dark launch.
 * The route still streams via ReadableStream and never buffers the full
 * reply server-side.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

import { COPILOT_KILL_SWITCH, isCopilotV2Active, bucketForVisitor } from '@/lib/copilot/flags';
import { log } from '@/lib/copilot/logger';
import { FALLBACK_USER_MESSAGES } from '@/lib/copilot/brand';
import { MODEL_CHAIN, maxOutputTokens } from '@/lib/copilot/models';
import { TOOL_SPECS, getToolSpec, anthropicTools, openaiTools } from '@/lib/copilot/tools';
import type { AtherosToolName } from '@/lib/copilot/tools';
import { buildSystemPrompt, splitThoughtFromReply } from '@/lib/copilot/prompt';
import { hybridRetrieve, augmentContextFromQuery, type PageContext } from '@/lib/copilot/retrieval';
import { checkRateLimit } from '@/lib/copilot/ratelimit';
import {
  insertMessage,
  markSessionHandoff,
  upsertChatLead,
  upsertSession,
} from '@/lib/copilot/session';
import { createStreamEmitter, SSE_RESPONSE_HEADERS } from '@/lib/copilot/stream';
import type { AtherosStreamEvent } from '@/lib/copilot/stream';
import { costUsd } from '@/lib/copilot/cost';
import { sendThankYouEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(8000),
});

const pageContextSchema: z.ZodType<PageContext> = z.object({
  path: z.string().optional(),
  entitySlug: z.string().optional(),
  entityType: z
    .enum([
      'lp',
      'service',
      'industry',
      'platform',
      'case_study',
      'blog',
      'whitepaper',
      'playbook',
    ])
    .optional(),
  cluster: z.string().optional() as z.ZodType<PageContext['cluster']>,
  industry: z.string().optional() as z.ZodType<PageContext['industry']>,
  platform: z.string().optional() as z.ZodType<PageContext['platform']>,
  role: z
    .enum(['cio', 'cdo', 'cto', 'ciso', 'ceo', 'cmo', 'other'])
    .optional(),
});

const leadStateSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
  team: z.string().optional(),
  timeline: z.string().optional(),
  serviceInterest: z.string().optional(),
  role: z.string().optional(),
  budget: z.string().optional(),
  priority: z.string().optional(),
  intent: z.string().optional(),
});

const requestSchema = z.object({
  sessionId: z.string().min(4).max(120),
  visitorId: z.string().max(120).optional(),
  pageContext: pageContextSchema.optional(),
  leadState: leadStateSchema.optional(),
  messages: z.array(messageSchema).min(1).max(40),
  turnIndex: z.number().int().min(1).max(200).optional(),
});

type RequestShape = z.infer<typeof requestSchema>;

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  const startedAt = Date.now();

  // --- Flag gate ----------------------------------------------------------
  if (COPILOT_KILL_SWITCH) {
    log.warn('init', 'kill_switch_active', { route: '/api/chat/v2' });
    return NextResponse.json(
      { ok: false, reason: 'kill-switch', message: FALLBACK_USER_MESSAGES.allModelsDown },
      { status: 503 },
    );
  }

  // Parse + validate body.
  let body: RequestShape;
  try {
    const raw = (await request.json()) as unknown;
    body = requestSchema.parse(raw);
  } catch (err) {
    log.warn('init', err, { route: '/api/chat/v2', extra: { phase: 'parse-body' } });
    return NextResponse.json(
      { ok: false, reason: 'bad-request' },
      { status: 400 },
    );
  }

  // Flag / rollout bucket.
  if (!isCopilotV2Active(body.visitorId ?? null)) {
    // 404 to keep the endpoint invisible pre-rollout.
    return NextResponse.json({ ok: false, reason: 'not-found' }, { status: 404 });
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    null;

  // Rate limits.
  const rl = await checkRateLimit(body.visitorId ?? null, ip);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        ok: false,
        reason: 'rate-limited',
        bucket: rl.bucket,
        message: FALLBACK_USER_MESSAGES.rateLimited,
      },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds ?? 60) } },
    );
  }

  const bucket = bucketForVisitor(body.visitorId ?? null);
  await upsertSession({
    session_id: body.sessionId,
    visitor_id: body.visitorId ?? null,
    page_entry: body.pageContext?.path ?? null,
    flag_bucket: bucket,
    client_version: request.headers.get('x-atheros-client') ?? 'unknown',
  });

  const userTurn = body.messages[body.messages.length - 1];
  if (userTurn?.role === 'user') {
    await insertMessage({
      session_id: body.sessionId,
      role: 'user',
      content: userTurn.content,
    });
  }

  // Live-takeover gate: if an admin has claimed this session in relay
  // mode, suppress AI generation entirely. The user's turn is persisted
  // above so the admin sees it; the admin's reply will arrive via
  // /api/admin/copilot/takeover. We close the SSE stream immediately
  // with a status event so the client renders the "admin is here" banner.
  const adminMode = await readAdminClaimedMode(body.sessionId);
  if (adminMode === 'relay') {
    const emitter = createStreamEmitter();
    (async () => {
      try {
        emitter.emit({
          type: 'status',
          text: 'A real person from ACI is replying in this conversation.',
        });
        emitter.emit({
          type: 'done',
          model: 'admin-relay',
          inputTokens: 0,
          outputTokens: 0,
          costUsd: 0,
          latencyMs: Date.now() - startedAt,
        });
      } finally {
        await emitter.close();
      }
    })();
    return new Response(emitter.readable, { headers: SSE_RESPONSE_HEADERS });
  }

  // --- Build the stream ---------------------------------------------------
  const emitter = createStreamEmitter();
  const statusEvents: Array<{ at: number; text: string }> = [];
  const thoughts: string[] = [];

  (async () => {
    try {
      await runTurn({
        body,
        userQuery: userTurn?.content ?? '',
        emit: (ev) => {
          if (ev.type === 'status') statusEvents.push({ at: Date.now() - startedAt, text: ev.text });
          if (ev.type === 'thought') thoughts.push(ev.text);
          emitter.emit(ev);
        },
        startedAt,
        ip,
      });
    } catch (err) {
      log.error('generate', err, {
        sessionId: body.sessionId,
        route: '/api/chat/v2',
      });
      const fallbackLatency = Date.now() - startedAt;
      emitter.emit({ type: 'status', text: 'Something went wrong. Sending a brief note instead.' });
      for (const t of (FALLBACK_USER_MESSAGES.allModelsDown + ' ').match(/.{1,40}/g) ?? []) {
        emitter.emit({ type: 'token', text: t });
      }
      emitter.emit({
        type: 'done',
        model: 'fallback',
        inputTokens: 0,
        outputTokens: 0,
        costUsd: 0,
        latencyMs: fallbackLatency,
        streamIncomplete: true,
      });
      await insertMessage({
        session_id: body.sessionId,
        role: 'assistant',
        content: FALLBACK_USER_MESSAGES.allModelsDown,
        model: 'fallback',
        stream_incomplete: true,
        thoughts,
        status_events: statusEvents,
      });
    } finally {
      await emitter.close();
    }
  })();

  return new Response(emitter.readable, { headers: SSE_RESPONSE_HEADERS });
}

async function readAdminClaimedMode(sessionId: string): Promise<'relay' | 'copilot' | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data } = await supabase
      .from('chat_sessions')
      .select('admin_claimed_by, admin_mode')
      .eq('session_id', sessionId)
      .maybeSingle();
    if (data?.admin_claimed_by && (data.admin_mode === 'relay' || data.admin_mode === 'copilot')) {
      return data.admin_mode;
    }
    return null;
  } catch (err) {
    log.warn('init', err, { sessionId, extra: { phase: 'readAdminClaimedMode' } });
    return null;
  }
}

// ---------------------------------------------------------------------------
// Turn runner
// ---------------------------------------------------------------------------

interface RunTurnInput {
  body: RequestShape;
  userQuery: string;
  emit: (ev: AtherosStreamEvent) => void;
  startedAt: number;
  ip: string | null;
}

async function runTurn(input: RunTurnInput): Promise<void> {
  const { body, userQuery, emit, startedAt } = input;

  // Augment page context with platform / industry / cluster signals detected
  // in the user's message so retrieval and the prompt both see the full
  // intent. "Dynamics 365 for manufacturing" on a generic page must still
  // pin platform=microsoft-dynamics AND industry=manufacturing.
  const enrichedContext = augmentContextFromQuery(body.pageContext ?? {}, userQuery);

  emit({ type: 'status', text: 'Looking up ACI context.' });
  const retrieved = await hybridRetrieve(userQuery, enrichedContext, { topK: 8 });
  emit({
    type: 'status',
    text:
      retrieved.length > 0
        ? `Found ${retrieved.length} relevant chunks.`
        : 'No direct matches; answering from posture.',
  });

  // Summarize retrieval for the content-gap feed. Persisted on the
  // assistant turn's chat_messages row; queried by /api/admin/copilot/content-gaps.
  const retrievalSummary = {
    topK: retrieved.length,
    topSimilarity:
      retrieved.length === 0
        ? 0
        : Math.max(...retrieved.map((r) => r.similarity ?? 0)),
    sourceTypes: Array.from(new Set(retrieved.map((r) => r.source_type).filter(Boolean))),
  };

  const systemPrompt = buildSystemPrompt({
    pageContext: enrichedContext,
    retrieved,
    leadState: body.leadState ?? {},
    turnIndex: body.turnIndex ?? body.messages.length,
  });

  // Attempt each model in the chain until one streams successfully.
  for (const model of MODEL_CHAIN) {
    try {
      if (model.provider === 'anthropic') {
        await streamFromAnthropic({ model, systemPrompt, body, emit, startedAt, retrievalSummary });
      } else {
        await streamFromOpenAI({ model, systemPrompt, body, emit, startedAt, retrievalSummary });
      }
      return;
    } catch (err) {
      log.warn('generate', err, {
        sessionId: body.sessionId,
        model: model.label,
        extra: { phase: 'model-call' },
      });
      emit({ type: 'status', text: `Switching models (${model.label} failed).` });
      continue;
    }
  }
  throw new Error('All models in chain failed.');
}

// ---------------------------------------------------------------------------
// Anthropic streaming
// ---------------------------------------------------------------------------

interface ModelStreamInput {
  model: (typeof MODEL_CHAIN)[number];
  systemPrompt: string;
  body: RequestShape;
  emit: (ev: AtherosStreamEvent) => void;
  startedAt: number;
  retrievalSummary: { topK: number; topSimilarity: number; sourceTypes: string[] };
}

async function streamFromAnthropic(input: ModelStreamInput): Promise<void> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY missing');
  const client = new Anthropic({ apiKey: key });

  const modelMessages = input.body.messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  let emittedThought = false;
  let textBuffer = '';
  let streamedTextLength = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  const pendingToolCalls = new Map<
    string,
    { name: string; jsonBuffer: string }
  >();
  // Captured tool_use blocks from the first stream, used to build the
  // follow-up agentic-loop call when the model skipped prose.
  const completedToolUses: Array<{
    id: string;
    name: string;
    input: unknown;
    resultSummary: string;
  }> = [];

  // Shared helper: accept a streamed text delta and emit it through the
  // thought-parsing pipeline (dim "~ ..." line vs. normal tokens).
  const handleTextDelta = (delta: string) => {
    textBuffer += delta;
    streamedTextLength += delta.length;
    if (!emittedThought) {
      const { thought, reply } = splitThoughtFromReply(textBuffer);
      if (thought && reply) {
        input.emit({ type: 'thought', text: thought });
        emittedThought = true;
        if (reply.length > 0) input.emit({ type: 'token', text: reply });
        return;
      }
      if (textBuffer.length > 160 && !textBuffer.trimStart().startsWith('~')) {
        emittedThought = true;
        input.emit({ type: 'token', text: textBuffer });
      }
      return;
    }
    input.emit({ type: 'token', text: delta });
  };

  const stream = await client.messages.stream({
    model: input.model.id,
    max_tokens: maxOutputTokens(),
    system: input.systemPrompt,
    // Tool schemas are authored as strict JSON Schema with `type: "object"` at
    // the root; the Anthropic SDK's InputSchema type is stricter than the
    // runtime wire format, so we cast to the SDK's accepted shape here.
    tools: anthropicTools() as unknown as Anthropic.Tool[],
    messages: modelMessages,
  });

  for await (const event of stream) {
    if (event.type === 'content_block_start') {
      if (event.content_block.type === 'tool_use') {
        pendingToolCalls.set(event.content_block.id, {
          name: event.content_block.name,
          jsonBuffer: '',
        });
        input.emit({
          type: 'tool_call_start',
          id: event.content_block.id,
          name: event.content_block.name,
        });
      }
    } else if (event.type === 'content_block_delta') {
      if (event.delta.type === 'text_delta') {
        handleTextDelta(event.delta.text);
      } else if (event.delta.type === 'input_json_delta') {
        const contentBlockIndex = (event as { index: number }).index;
        const ids = Array.from(pendingToolCalls.keys());
        const id = ids[contentBlockIndex] ?? ids[ids.length - 1];
        if (id) {
          const slot = pendingToolCalls.get(id);
          if (slot) slot.jsonBuffer += event.delta.partial_json;
        }
      }
    } else if (event.type === 'content_block_stop') {
      const finishedId = [...pendingToolCalls.keys()].pop();
      if (finishedId) {
        const slot = pendingToolCalls.get(finishedId);
        if (slot) {
          let parsedInput: unknown = {};
          try {
            parsedInput = slot.jsonBuffer ? JSON.parse(slot.jsonBuffer) : {};
          } catch {
            // copilot-allow-silent-catch: bad JSON handled in executeToolCall
          }
          await executeToolCall({
            callId: finishedId,
            toolName: slot.name,
            argsJson: slot.jsonBuffer,
            sessionId: input.body.sessionId,
            conversation: input.body.messages,
            emit: input.emit,
          });
          completedToolUses.push({
            id: finishedId,
            name: slot.name,
            input: parsedInput,
            resultSummary: describeToolResult(slot.name, parsedInput),
          });
          pendingToolCalls.delete(finishedId);
        }
      }
    } else if (event.type === 'message_delta') {
      if (event.usage) {
        inputTokens = event.usage.input_tokens ?? inputTokens;
        outputTokens = event.usage.output_tokens ?? outputTokens;
      }
    }
  }

  // Agentic tool-use loop: if Haiku skipped prose and only fired tools,
  // send the tool results back and ask for the actual reply. One extra
  // round-trip; roughly doubles cost on tool-firing turns (~$0.002 to
  // ~$0.004) but eliminates the canned-fallback UX.
  if (streamedTextLength === 0 && completedToolUses.length > 0) {
    input.emit({ type: 'status', text: 'Composing reply from the panels above.' });
    try {
      const toolUseContent = completedToolUses.map((t) => ({
        type: 'tool_use' as const,
        id: t.id,
        name: t.name,
        input: (t.input ?? {}) as Record<string, unknown>,
      }));
      const toolResultContent = completedToolUses.map((t) => ({
        type: 'tool_result' as const,
        tool_use_id: t.id,
        content: t.resultSummary,
      }));

      const followUp = await client.messages.stream({
        model: input.model.id,
        max_tokens: maxOutputTokens(),
        system: input.systemPrompt,
        // Anthropic requires the tools array when the message history
        // contains tool_use blocks, otherwise it 400s with
        // "tool_use ids were found without tool_use definitions".
        // We still force text via tool_choice:'none' so the model
        // cannot re-enter the tool loop and must write prose.
        tools: anthropicTools() as unknown as Anthropic.Tool[],
        tool_choice: { type: 'none' as const },
        messages: [
          ...modelMessages,
          { role: 'assistant', content: toolUseContent },
          { role: 'user', content: toolResultContent },
        ],
      });

      for await (const ev of followUp) {
        if (ev.type === 'content_block_delta' && ev.delta.type === 'text_delta') {
          handleTextDelta(ev.delta.text);
        } else if (ev.type === 'message_delta' && ev.usage) {
          inputTokens += ev.usage.input_tokens ?? 0;
          outputTokens += ev.usage.output_tokens ?? 0;
        }
      }
    } catch (err) {
      log.warn('generate', err, {
        sessionId: input.body.sessionId,
        extra: { phase: 'agentic-follow-up' },
      });
      // Fall through to finalizeTurn; the contextual fallback in
      // ChatColumn will cover the empty reply as a last resort.
    }
  }

  await finalizeTurn({
    body: input.body,
    model: input.model.label,
    replyText: emittedThought
      ? textBuffer
          .replace(/^\s*~[^\n]*\n?/, '')
          .trim()
      : textBuffer.trim(),
    inputTokens,
    outputTokens,
    startedAt: input.startedAt,
    emit: input.emit,
    retrievalSummary: input.retrievalSummary,
  });
}

function describeToolResult(name: string, args: unknown): string {
  switch (name) {
    case 'show_content_panel': {
      const a = args as { panelType?: string; entityRef?: string };
      return `panel ${a.panelType ?? 'unknown'}/${a.entityRef ?? 'unknown'} rendered on the right`;
    }
    case 'offer_action_buttons':
      return 'action chips rendered under the reply';
    case 'request_field': {
      const a = args as { fieldName?: string };
      return `inline input for ${a.fieldName ?? 'field'} rendered under the reply`;
    }
    case 'cite_source': {
      const a = args as { slug?: string };
      return `citation pill for ${a.slug ?? 'source'} rendered`;
    }
    case 'qualify_lead':
      return 'lead fields captured to the chat_leads row';
    case 'schedule_meeting':
      return 'meeting request recorded; admin will follow up';
    case 'handoff_to_human':
      return 'handoff to human recorded; admin notified';
    default:
      return 'tool executed';
  }
}

// ---------------------------------------------------------------------------
// OpenAI streaming
// ---------------------------------------------------------------------------

async function streamFromOpenAI(input: ModelStreamInput): Promise<void> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY missing');
  const client = new OpenAI({ apiKey: key });

  const modelMessages = input.body.messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  let emittedThought = false;
  let textBuffer = '';
  let inputTokens = 0;
  let outputTokens = 0;
  const toolAccumulators = new Map<
    number,
    { id: string; name: string; jsonBuffer: string }
  >();

  const stream = await client.chat.completions.create({
    model: input.model.id,
    max_tokens: maxOutputTokens(),
    stream: true,
    stream_options: { include_usage: true },
    messages: [
      { role: 'system', content: input.systemPrompt },
      ...modelMessages,
    ],
    tools: openaiTools(),
  });

  for await (const chunk of stream) {
    const choice = chunk.choices?.[0];
    if (choice?.delta?.content) {
      const delta = choice.delta.content;
      textBuffer += delta;
      if (!emittedThought) {
        const { thought, reply } = splitThoughtFromReply(textBuffer);
        if (thought && reply) {
          input.emit({ type: 'thought', text: thought });
          emittedThought = true;
          if (reply.length > 0) input.emit({ type: 'token', text: reply });
          continue;
        }
        if (textBuffer.length > 160 && !textBuffer.trimStart().startsWith('~')) {
          emittedThought = true;
          input.emit({ type: 'token', text: textBuffer });
        }
        continue;
      }
      input.emit({ type: 'token', text: delta });
    }
    const toolCalls = choice?.delta?.tool_calls ?? [];
    for (const tc of toolCalls) {
      const idx = tc.index ?? 0;
      let slot = toolAccumulators.get(idx);
      if (!slot) {
        slot = { id: tc.id ?? `tc_${idx}`, name: tc.function?.name ?? '', jsonBuffer: '' };
        toolAccumulators.set(idx, slot);
        input.emit({ type: 'tool_call_start', id: slot.id, name: slot.name });
      }
      if (tc.function?.name && !slot.name) slot.name = tc.function.name;
      if (tc.function?.arguments) slot.jsonBuffer += tc.function.arguments;
    }
    if (chunk.usage) {
      inputTokens = chunk.usage.prompt_tokens ?? inputTokens;
      outputTokens = chunk.usage.completion_tokens ?? outputTokens;
    }
  }

  // Flush any completed tool calls.
  for (const slot of toolAccumulators.values()) {
    await executeToolCall({
      callId: slot.id,
      toolName: slot.name,
      argsJson: slot.jsonBuffer,
      sessionId: input.body.sessionId,
      conversation: input.body.messages,
      emit: input.emit,
    });
  }

  await finalizeTurn({
    body: input.body,
    model: input.model.label,
    replyText: emittedThought
      ? textBuffer.replace(/^\s*~[^\n]*\n?/, '').trim()
      : textBuffer.trim(),
    inputTokens,
    outputTokens,
    startedAt: input.startedAt,
    emit: input.emit,
  });
}

// ---------------------------------------------------------------------------
// Tool execution
// ---------------------------------------------------------------------------

interface ExecuteToolInput {
  callId: string;
  toolName: string;
  argsJson: string;
  sessionId: string;
  conversation: RequestShape['messages'];
  emit: (ev: AtherosStreamEvent) => void;
}

async function executeToolCall(input: ExecuteToolInput): Promise<void> {
  const spec = getToolSpec(input.toolName as AtherosToolName);
  if (!spec) {
    log.warn('tool', `unknown tool ${input.toolName}`, { sessionId: input.sessionId });
    input.emit({
      type: 'tool_call_end',
      id: input.callId,
      name: input.toolName,
      result: 'error',
      message: 'unknown-tool',
    });
    return;
  }

  let parsedArgs: unknown;
  try {
    parsedArgs = input.argsJson ? JSON.parse(input.argsJson) : {};
  } catch (err) {
    log.warn('tool', err, {
      sessionId: input.sessionId,
      tool: input.toolName,
      extra: { phase: 'json-parse' },
    });
    input.emit({
      type: 'tool_call_end',
      id: input.callId,
      name: input.toolName,
      result: 'error',
      message: 'invalid-json',
    });
    return;
  }

  const validated = spec.schema.safeParse(parsedArgs);
  if (!validated.success) {
    log.warn('tool', 'zod-validation-failed', {
      sessionId: input.sessionId,
      tool: input.toolName,
      extra: { issues: validated.error.issues, received: parsedArgs },
    });
    input.emit({
      type: 'tool_call_end',
      id: input.callId,
      name: input.toolName,
      result: 'error',
      message: 'invalid-args',
    });
    return;
  }

  // Args echoed in the SSE end frame so the client can render UI-only
  // tools (panel, chips, field, citation) and admin replay (Part 6) sees
  // the exact values the model produced. validated.data is unknown here;
  // cast for the wire shape — the schema already proved each field's type.
  const echoArgs = validated.data as Record<string, unknown>;

  if (!spec.mutates) {
    // UI-only tool; echo it back and persist the call in chat_messages.
    input.emit({
      type: 'tool_call_end',
      id: input.callId,
      name: input.toolName,
      result: 'ok',
      args: echoArgs,
    });
    await insertMessage({
      session_id: input.sessionId,
      role: 'tool',
      tool_name: input.toolName,
      tool_args: validated.data,
      tool_result: { ok: true },
    });
    return;
  }

  // Mutating tools: qualify_lead, schedule_meeting, handoff_to_human.
  try {
    if (spec.name === 'qualify_lead') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fields = validated.data as any;
      const leadResult = await upsertChatLead(
        input.sessionId,
        fields,
        input.conversation,
      );
      // Fire a one-shot thank-you email the first time we capture an email
      // on this session. Fire-and-forget: Resend failure must never block
      // the streaming turn.
      if (leadResult.freshEmail && typeof fields.email === 'string') {
        const firstName =
          typeof fields.name === 'string' && fields.name.trim().length > 0
            ? fields.name.trim().split(/\s+/)[0]
            : 'there';
        const serviceCluster =
          typeof fields.serviceInterest === 'string' && fields.serviceInterest.trim().length > 0
            ? fields.serviceInterest.trim()
            : 'enterprise transformation';
        const lookingFor =
          typeof fields.serviceInterest === 'string' && fields.serviceInterest.trim().length > 0
            ? fields.serviceInterest.trim()
            : 'your current initiative';
        void sendThankYouEmail({
          firstName,
          email: fields.email,
          serviceCluster,
          lookingFor,
          ctoText: 'Schedule a discovery call',
        }).catch((err) => {
          log.warn('tool', err, {
            sessionId: input.sessionId,
            extra: { phase: 'qualify_lead.thankYouEmail' },
          });
        });
      }
    } else if (spec.name === 'handoff_to_human') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload = validated.data as any;
      await markSessionHandoff(input.sessionId, payload.reason ?? 'other');
    }
    // schedule_meeting is intentionally stored as a chat_messages tool_call
    // only for now; Part 6 pulls it into the admin handoff inbox.
    await insertMessage({
      session_id: input.sessionId,
      role: 'tool',
      tool_name: input.toolName,
      tool_args: validated.data,
      tool_result: { ok: true },
    });
    input.emit({
      type: 'tool_call_end',
      id: input.callId,
      name: input.toolName,
      result: 'ok',
      args: echoArgs,
    });
  } catch (err) {
    log.error('tool', err, {
      sessionId: input.sessionId,
      tool: input.toolName,
    });
    input.emit({
      type: 'tool_call_end',
      id: input.callId,
      name: input.toolName,
      result: 'error',
      message: 'execution-failed',
    });
    await insertMessage({
      session_id: input.sessionId,
      role: 'tool',
      tool_name: input.toolName,
      tool_args: validated.data,
      tool_result: { ok: false, reason: 'execution-failed' },
    });
  }
}

// ---------------------------------------------------------------------------
// Finalization
// ---------------------------------------------------------------------------

interface FinalizeInput {
  body: RequestShape;
  model: string;
  replyText: string;
  inputTokens: number;
  outputTokens: number;
  startedAt: number;
  emit: (ev: AtherosStreamEvent) => void;
  retrievalSummary?: { topK: number; topSimilarity: number; sourceTypes: string[] };
}

async function finalizeTurn(input: FinalizeInput): Promise<void> {
  const latencyMs = Date.now() - input.startedAt;
  const cost = costUsd(input.model, {
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
  });
  input.emit({
    type: 'done',
    model: input.model,
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
    costUsd: cost,
    latencyMs,
  });
  await insertMessage({
    session_id: input.body.sessionId,
    role: 'assistant',
    content: input.replyText,
    model: input.model,
    input_tokens: input.inputTokens,
    output_tokens: input.outputTokens,
    latency_ms: latencyMs,
    cost_usd: cost,
    retrieval_summary: input.retrievalSummary ?? null,
  });
}

// Introspection helpers consumed by tests / admin debug tools.
export function __exposedForTests() {
  return { TOOL_SPECS };
}

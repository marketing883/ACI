/**
 * Browser-side SSE consumer for /api/chat/v2.
 *
 * Dark-launch friendly: returns the final accumulated reply text so the
 * existing ChatWidget can drop in this call in place of its current
 * fetch('/api/chat') without changing the on-screen rendering. Tool
 * calls and status/thought events are delivered via callbacks; the
 * Part-4 UI wires them up, Part-3 just logs and ignores them.
 */

'use client';

import type { AtherosStreamEvent } from './stream';
import { isCopilotV2Active, COPILOT_V2_ENABLED, COPILOT_KILL_SWITCH } from './flags';

export interface AtherosStreamHandlers {
  onStatus?: (text: string) => void;
  onThought?: (text: string) => void;
  onToken?: (text: string) => void;
  onToolCallStart?: (id: string, name: string) => void;
  onToolCallEnd?: (
    id: string,
    name: string,
    result: 'ok' | 'error',
    args?: Record<string, unknown>,
  ) => void;
  onDone?: (usage: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    costUsd: number;
    latencyMs: number;
    streamIncomplete?: boolean;
  }) => void;
}

export interface AtherosStreamInput {
  sessionId: string;
  visitorId?: string;
  pageContext?: Record<string, unknown>;
  leadState?: Record<string, unknown>;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  turnIndex?: number;
  handlers?: AtherosStreamHandlers;
  signal?: AbortSignal;
}

export interface AtherosStreamResult {
  text: string;
  status: 'ok' | 'error' | 'not-enabled';
  incomplete?: boolean;
}

function isFlagActive(visitorId: string | undefined): boolean {
  if (COPILOT_KILL_SWITCH) return false;
  if (!COPILOT_V2_ENABLED) return false;
  return isCopilotV2Active(visitorId ?? null);
}

export function copilotV2Active(visitorId: string | undefined): boolean {
  return isFlagActive(visitorId);
}

export async function streamAtherosReply(
  input: AtherosStreamInput,
): Promise<AtherosStreamResult> {
  if (!isFlagActive(input.visitorId)) {
    return { text: '', status: 'not-enabled' };
  }

  const res = await fetch('/api/chat/v2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-atheros-client': 'atheros-widget/v2',
    },
    body: JSON.stringify({
      sessionId: input.sessionId,
      visitorId: input.visitorId,
      pageContext: input.pageContext,
      leadState: input.leadState,
      messages: input.messages,
      turnIndex: input.turnIndex,
    }),
    signal: input.signal,
  });

  if (!res.ok || !res.body) {
    // 404 = flag off for this visitor; 429 = rate limited; others = genuine
    // error. Caller falls back to the v1 route when status !== 'ok'.
    return {
      text: '',
      status: res.status === 404 ? 'not-enabled' : 'error',
    };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  let incomplete = false;

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // SSE frames separated by double-newline.
      let idx = buffer.indexOf('\n\n');
      while (idx >= 0) {
        const frame = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        idx = buffer.indexOf('\n\n');
        const evt = parseSseFrame(frame);
        if (!evt) continue;
        switch (evt.type) {
          case 'status':
            input.handlers?.onStatus?.(evt.text);
            break;
          case 'thought':
            input.handlers?.onThought?.(evt.text);
            break;
          case 'token':
            text += evt.text;
            input.handlers?.onToken?.(evt.text);
            break;
          case 'tool_call_start':
            input.handlers?.onToolCallStart?.(evt.id, evt.name);
            break;
          case 'tool_call_end':
            input.handlers?.onToolCallEnd?.(evt.id, evt.name, evt.result, evt.args);
            break;
          case 'done':
            if (evt.streamIncomplete) incomplete = true;
            input.handlers?.onDone?.({
              model: evt.model,
              inputTokens: evt.inputTokens,
              outputTokens: evt.outputTokens,
              costUsd: evt.costUsd,
              latencyMs: evt.latencyMs,
              streamIncomplete: evt.streamIncomplete,
            });
            break;
        }
      }
    }
  } catch {
    // copilot-allow-silent-catch: abort / disconnect; caller decides what to do
    return { text, status: 'error', incomplete: true };
  }

  return { text, status: 'ok', incomplete };
}

function parseSseFrame(frame: string): AtherosStreamEvent | null {
  if (!frame) return null;
  let eventName = '';
  let data = '';
  for (const line of frame.split('\n')) {
    if (line.startsWith('event: ')) eventName = line.slice(7).trim();
    else if (line.startsWith('data: ')) data += line.slice(6);
    else if (line.startsWith(':')) continue; // comment (SSE keepalive)
  }
  if (!eventName || !data) return null;
  try {
    const payload = JSON.parse(data) as Record<string, unknown>;
    return { type: eventName, ...payload } as AtherosStreamEvent;
  } catch {
    // copilot-allow-silent-catch: malformed frame; skip
    return null;
  }
}

/**
 * SSE stream helpers for Atheros.
 *
 * The Part-3 edge route emits a multiplexed Server-Sent Events stream.
 * Event types:
 *   - status          : server-side pipeline narration ("Looking up ACI
 *                       playbooks..."). Emitted at retrieve/tool-call
 *                       stage boundaries.
 *   - thought         : one-line "approach" the model was asked to prefix
 *                       its reply with. Rendered dimmed in the UI.
 *   - token           : normal reply token delta.
 *   - tool_call_start : JSON { id, name, argsPreview? } when a tool begins.
 *   - tool_call_end   : JSON { id, name, result?: 'ok'|'error', message? }.
 *   - done            : JSON { model, inputTokens, outputTokens, costUsd,
 *                              latencyMs }.
 *
 * Output frames are standard SSE: `event: <type>\ndata: <json>\n\n`.
 * Consumers either use EventSource directly (simple token rendering) or
 * a manual reader over ReadableStream (thought-stream UX and tool wiring).
 */

export type AtherosStreamEvent =
  | { type: 'status'; text: string }
  | { type: 'thought'; text: string }
  | { type: 'token'; text: string }
  | {
      type: 'tool_call_start';
      id: string;
      name: string;
      argsPreview?: Record<string, unknown>;
    }
  | {
      type: 'tool_call_end';
      id: string;
      name: string;
      result: 'ok' | 'error';
      message?: string;
      /**
       * Validated tool arguments echoed back so the client can render
       * UI-only tool calls (show_content_panel, offer_action_buttons,
       * request_field, cite_source). Server-side mutating tools also
       * include their args so admin replay (Part 6) reproduces the UX
       * the user saw.
       */
      args?: Record<string, unknown>;
    }
  | {
      type: 'done';
      model: string;
      inputTokens: number;
      outputTokens: number;
      costUsd: number;
      latencyMs: number;
      streamIncomplete?: boolean;
    };

export interface StreamEmitter {
  emit(event: AtherosStreamEvent): void;
  close(): Promise<void>;
  readable: ReadableStream<Uint8Array>;
}

const encoder = new TextEncoder();

function encodeSseFrame(event: AtherosStreamEvent): Uint8Array {
  const { type, ...rest } = event;
  // Keep the payload small by dropping the type from `data` (it is already
  // the SSE `event:` field). JSON-encode the rest.
  const payload = JSON.stringify(rest);
  return encoder.encode(`event: ${type}\ndata: ${payload}\n\n`);
}

/**
 * Create a new SSE-producing ReadableStream. The caller calls `emit` for
 * every event and `close` when done.
 */
export function createStreamEmitter(): StreamEmitter {
  let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null;
  const readable = new ReadableStream<Uint8Array>({
    start(controller) {
      controllerRef = controller;
      // Prime the connection so the client flushes headers immediately.
      controller.enqueue(encoder.encode(': atheros\n\n'));
    },
    cancel() {
      controllerRef = null;
    },
  });

  function emit(event: AtherosStreamEvent) {
    if (!controllerRef) return;
    try {
      controllerRef.enqueue(encodeSseFrame(event));
    } catch {
      // copilot-allow-silent-catch: client disconnected mid-stream; the
      // route's outer logger catches the underlying error separately.
      controllerRef = null;
    }
  }

  async function close() {
    if (!controllerRef) return;
    try {
      controllerRef.close();
    } catch {
      // copilot-allow-silent-catch: close on already-closed stream is a no-op
    }
    controllerRef = null;
  }

  return { emit, close, readable };
}

export const SSE_RESPONSE_HEADERS: HeadersInit = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
  'X-Accel-Buffering': 'no',
};

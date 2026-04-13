/**
 * Atheros model configuration.
 *
 * Three-layer fallback keeps cost low and quality high:
 *   1. Claude Haiku 4.5 (primary) - fast, cheap, tool use, streaming.
 *   2. GPT-4o-mini  (fallback 1) - comparable cost, different vendor.
 *   3. Claude Haiku 3.5 (fallback 2) - belt-and-braces against a 4.5 outage.
 *
 * Sonnet/Opus and GPT-4o never run in the chat hot path. The post-capture
 * intelligence flow (src/lib/intelligence.ts) keeps using Sonnet because
 * users never wait on it.
 *
 * This module only declares the chain; src/lib/copilot/stream.ts handles
 * the actual streaming + tool-call orchestration.
 */

export type AtherosProvider = 'anthropic' | 'openai';

export interface AtherosModel {
  id: string;
  provider: AtherosProvider;
  /** Friendly label used in admin UIs and chat_messages.model. */
  label: string;
  /** Hot-path context window used to budget retrieved chunks. */
  maxInputTokens: number;
  maxOutputTokens: number;
}

export const MODELS = {
  primary: {
    id: 'claude-haiku-4-5-20251001',
    provider: 'anthropic',
    label: 'claude-haiku-4-5',
    maxInputTokens: 200_000,
    maxOutputTokens: 400,
  },
  fallback1: {
    id: 'gpt-4o-mini',
    provider: 'openai',
    label: 'gpt-4o-mini',
    maxInputTokens: 128_000,
    maxOutputTokens: 400,
  },
  fallback2: {
    id: 'claude-3-5-haiku-20241022',
    provider: 'anthropic',
    label: 'claude-haiku-3-5',
    maxInputTokens: 200_000,
    maxOutputTokens: 400,
  },
} as const satisfies Record<string, AtherosModel>;

export const MODEL_CHAIN: readonly AtherosModel[] = [
  MODELS.primary,
  MODELS.fallback1,
  MODELS.fallback2,
];

/** Default generation budget per turn. Overridable via env for experiments. */
export function maxOutputTokens(): number {
  const raw = Number.parseInt(process.env.COPILOT_MAX_OUTPUT_TOKENS ?? '', 10);
  if (Number.isFinite(raw) && raw > 50 && raw <= 2000) return raw;
  return 400;
}

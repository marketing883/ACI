/**
 * Atheros cost estimator.
 *
 * Converts token counts into USD so chat_messages.cost_usd reflects the
 * true per-turn spend. Used by the Part-3 streaming route when it writes
 * its turn record, and by the Part-6 admin dashboard cost rollup.
 *
 * Prices are per 1M tokens, current as of the Atheros plan lock.
 * If a provider updates pricing, edit this file - no other changes needed.
 */

export type CostModelId =
  | 'claude-haiku-4-5'
  | 'claude-haiku-3-5'
  | 'gpt-4o-mini'
  | 'gpt-4o'
  | 'claude-sonnet-4'
  | 'text-embedding-3-small';

interface ModelPrice {
  /** USD per 1M input tokens. */
  input: number;
  /** USD per 1M output tokens. Embeddings use input only. */
  output: number;
}

export const MODEL_PRICES: Readonly<Record<CostModelId, ModelPrice>> = {
  'claude-haiku-4-5': { input: 0.8, output: 4.0 },
  'claude-haiku-3-5': { input: 0.8, output: 4.0 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'gpt-4o': { input: 2.5, output: 10.0 },
  'claude-sonnet-4': { input: 3.0, output: 15.0 },
  'text-embedding-3-small': { input: 0.02, output: 0 },
} as const;

export interface Usage {
  inputTokens: number;
  outputTokens?: number;
}

/**
 * Returns the USD cost for a single model call. Safe for unknown model ids
 * (returns 0 so a logging miss never poisons a total).
 */
export function costUsd(model: string, usage: Usage): number {
  const price = MODEL_PRICES[model as CostModelId];
  if (!price) return 0;
  const inputCost = (usage.inputTokens / 1_000_000) * price.input;
  const outputCost = ((usage.outputTokens ?? 0) / 1_000_000) * price.output;
  return Number((inputCost + outputCost).toFixed(6));
}

/**
 * Sum several model calls into a single turn cost. Useful when a turn
 * uses both an embedding call and a generation call.
 */
export function sumCostUsd(
  calls: Array<{ model: string; usage: Usage }>,
): number {
  const total = calls.reduce((acc, c) => acc + costUsd(c.model, c.usage), 0);
  return Number(total.toFixed(6));
}

/**
 * Human-readable formatter used in admin UIs.
 * $0.0000432 becomes "$0.00004"; $0.14 becomes "$0.14".
 */
export function formatCostUsd(n: number): string {
  if (n === 0) return '$0';
  if (n < 0.01) return `$${n.toFixed(5)}`;
  if (n < 1) return `$${n.toFixed(3)}`;
  return `$${n.toFixed(2)}`;
}

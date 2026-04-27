/**
 * Atheros embeddings wrapper.
 *
 * Thin client around OpenAI text-embedding-3-small (1536 dims, $0.02 per 1M
 * tokens). Used by the indexer (scripts/index-content.ts) and by the runtime
 * retrieval path (src/lib/copilot/retrieval.ts).
 *
 * Fails loud: every failure route lands in log.* with stage 'retrieve' (for
 * runtime lookups) or 'indexer' (for batch writes). Callers decide whether
 * to fall back to structured-only retrieval.
 */

import OpenAI from 'openai';
import { log } from './logger';
import { costUsd } from './cost';

export const EMBEDDING_MODEL = 'text-embedding-3-small' as const;
export const EMBEDDING_DIMS = 1536 as const;
const BATCH_SIZE = 100;

let clientSingleton: OpenAI | null = null;

function getClient(): OpenAI | null {
  if (clientSingleton) return clientSingleton;
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  clientSingleton = new OpenAI({ apiKey: key });
  return clientSingleton;
}

export interface EmbedResult {
  embeddings: number[][];
  tokensUsed: number;
  costUsd: number;
}

/**
 * Embed one or many texts. Batches of 100 per request (OpenAI limit).
 * Preserves input order in the returned embeddings.
 *
 * Returns `null` if the API key is missing. Throws on explicit API failure
 * (caller decides if it can fall back to structured-only).
 */
export async function embedTexts(
  texts: readonly string[],
  stage: 'retrieve' | 'indexer' = 'indexer',
): Promise<EmbedResult | null> {
  if (texts.length === 0) {
    return { embeddings: [], tokensUsed: 0, costUsd: 0 };
  }
  const client = getClient();
  if (!client) {
    log.warn(stage, 'OPENAI_API_KEY missing; embeddings disabled');
    return null;
  }

  const out: number[][] = new Array(texts.length);
  let totalTokens = 0;
  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    try {
      const res = await client.embeddings.create({
        model: EMBEDDING_MODEL,
        input: batch as string[],
      });
      if (!res.data || res.data.length !== batch.length) {
        throw new Error(
          `embeddings batch shape mismatch: expected ${batch.length}, got ${res.data?.length ?? 0}`,
        );
      }
      for (let j = 0; j < batch.length; j++) {
        out[i + j] = res.data[j].embedding;
      }
      totalTokens += res.usage?.total_tokens ?? 0;
    } catch (err) {
      log.error(stage, err, { extra: { batchStart: i, batchSize: batch.length } });
      throw err;
    }
  }

  return {
    embeddings: out,
    tokensUsed: totalTokens,
    costUsd: costUsd(EMBEDDING_MODEL, { inputTokens: totalTokens }),
  };
}

/**
 * Convenience for a single query embedding (runtime retrieval).
 * Returns null on any failure so the retrieval layer can fall back to
 * structured-only without taking down the turn.
 */
export async function embedQuery(
  text: string,
): Promise<{ embedding: number[]; tokensUsed: number; costUsd: number } | null> {
  try {
    const res = await embedTexts([text], 'retrieve');
    if (!res || res.embeddings.length === 0) return null;
    return {
      embedding: res.embeddings[0],
      tokensUsed: res.tokensUsed,
      costUsd: res.costUsd,
    };
  } catch (err) {
    // copilot-allow-silent-catch: already logged by embedTexts; swallow so
    // the retrieval layer can downgrade gracefully.
    log.warn('retrieve', err, { extra: { phase: 'embedQuery' } });
    return null;
  }
}

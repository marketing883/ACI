/**
 * Atheros hybrid retrieval.
 *
 * Three entry points:
 *   - structuredLookup(ctx)  : instant, deterministic lookup by page/cluster/
 *                              industry/platform. Zero network. Used when
 *                              context clearly maps to a known entity.
 *   - semanticSearch(query)  : pgvector cosine similarity via the
 *                              match_content_chunks RPC (migration in
 *                              20260412_pgvector_content_chunks.sql).
 *   - hybridRetrieve(query)  : combines both paths, dedupes, re-ranks,
 *                              returns top-K for prompt injection.
 *
 * Callers: the Part-3 edge route (src/app/api/chat/v2/route.ts) and any
 * unit tests that need to exercise retrieval.
 */

import { createClient } from '@supabase/supabase-js';
import { embedQuery } from './embeddings';
import { log } from './logger';
import type {
  AudienceRole,
  ContentChunk,
  IndustryId,
  PlatformId,
  RetrievedChunk,
  ServiceClusterId,
} from '@/data/types';

export interface PageContext {
  /** Current path (e.g. '/services/data-engineering' or '/lp/databricks-migration'). */
  path?: string;
  /** Stable slug of a known entity, if we know one from the URL. */
  entitySlug?: string;
  /** Stable entity type when known. */
  entityType?: ContentChunk['source_type'];
  /** Inferred service cluster from path or LP. */
  cluster?: ServiceClusterId;
  /** Inferred industry from LP param or path. */
  industry?: IndustryId | string;
  /** Platform when the user is clearly on a platform context. */
  platform?: PlatformId;
  /** Audience role (from LP ?role= or qualify_lead). */
  role?: AudienceRole;
}

export interface RetrievalOptions {
  topK?: number;
  sourceTypes?: ContentChunk['source_type'][];
  minSimilarity?: number;
}

const DEFAULT_TOP_K = 8;
const DEFAULT_MIN_SIMILARITY = 0.2;

// ---------------------------------------------------------------------------
// Structured lookup
// ---------------------------------------------------------------------------

/**
 * Returns the canonical content_chunks.source_slug/source_type pairs that
 * match the page context. No network. Used by hybridRetrieve as a pinning
 * layer.
 */
export function structuredLookup(
  ctx: PageContext,
): Array<{ source_type: ContentChunk['source_type']; source_slug: string; reason: string }> {
  const out: Array<{
    source_type: ContentChunk['source_type'];
    source_slug: string;
    reason: string;
  }> = [];

  if (ctx.entitySlug && ctx.entityType) {
    out.push({
      source_type: ctx.entityType,
      source_slug: ctx.entitySlug,
      reason: 'explicit-entity',
    });
  }

  // Derive from path when entity not explicitly provided.
  const path = ctx.path;
  if (path && out.length === 0) {
    const serviceMatch = path.match(/^\/services\/([a-z0-9-]+)/);
    const industryMatch = path.match(/^\/industries\/([a-z0-9-]+)/);
    const platformMatch = path.match(/^\/platforms\/([a-z0-9-]+)/);
    const lpMatch = path.match(/^\/lp\/([a-z0-9-]+)/);
    const caseMatch = path.match(/^\/case-studies\/([a-z0-9-]+)/);
    if (serviceMatch) {
      out.push({ source_type: 'service', source_slug: serviceMatch[1], reason: 'path' });
    } else if (industryMatch) {
      out.push({ source_type: 'industry', source_slug: industryMatch[1], reason: 'path' });
    } else if (platformMatch) {
      out.push({ source_type: 'platform', source_slug: platformMatch[1], reason: 'path' });
    } else if (lpMatch) {
      out.push({ source_type: 'lp', source_slug: lpMatch[1], reason: 'path' });
    } else if (caseMatch) {
      out.push({ source_type: 'case_study', source_slug: caseMatch[1], reason: 'path' });
    }
  }

  if (ctx.cluster) {
    out.push({ source_type: 'service', source_slug: ctx.cluster, reason: 'cluster' });
  }
  if (ctx.platform) {
    out.push({ source_type: 'platform', source_slug: ctx.platform, reason: 'platform' });
  }

  // Dedup by (type, slug).
  const seen = new Set<string>();
  return out.filter((e) => {
    const k = `${e.source_type}:${e.source_slug}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

// ---------------------------------------------------------------------------
// Semantic search (pgvector)
// ---------------------------------------------------------------------------

function serviceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Cosine-similarity search via the match_content_chunks RPC. Returns an
 * empty array on any failure so the caller can fall back to structured-only.
 */
export async function semanticSearch(
  query: string,
  ctx: PageContext = {},
  opts: RetrievalOptions = {},
): Promise<RetrievedChunk[]> {
  const topK = opts.topK ?? DEFAULT_TOP_K;
  const sourceTypes = opts.sourceTypes ?? null;
  const minSimilarity = opts.minSimilarity ?? DEFAULT_MIN_SIMILARITY;

  const embedded = await embedQuery(query);
  if (!embedded) return [];

  const supabase = serviceRoleClient();
  if (!supabase) {
    log.warn('retrieve', 'supabase service role missing; semantic search disabled');
    return [];
  }

  try {
    const { data, error } = await supabase.rpc('match_content_chunks', {
      query_embedding: embedded.embedding,
      match_count: topK,
      source_types: sourceTypes,
      industry_filter: (ctx.industry as string) ?? null,
      cluster_filter: (ctx.cluster as string) ?? null,
      role_filter: (ctx.role as string) ?? null,
    });
    if (error) {
      log.error('retrieve', error, { extra: { query, ctx } });
      return [];
    }
    const rows = (data ?? []) as Array<{
      id: string;
      source_type: ContentChunk['source_type'];
      source_slug: string;
      title: string;
      section_path: string | null;
      text: string;
      metadata: ContentChunk['metadata'];
      similarity: number;
    }>;
    return rows
      .filter((r) => r.similarity >= minSimilarity)
      .map((r) => ({
        id: r.id,
        source_type: r.source_type,
        source_slug: r.source_slug,
        title: r.title,
        section_path: r.section_path ?? undefined,
        text: r.text,
        metadata: r.metadata ?? {},
        similarity: r.similarity,
      }));
  } catch (err) {
    log.error('retrieve', err, { extra: { query } });
    return [];
  }
}

// ---------------------------------------------------------------------------
// Hybrid retrieval
// ---------------------------------------------------------------------------

/**
 * Primary entry. Merges structuredLookup (pinned entities) with
 * semanticSearch results, dedupes by (source_type, source_slug, section_path),
 * and re-ranks:
 *   - pinned entity chunks get a +0.15 similarity boost,
 *   - LP chunks get +0.05 when page context has a matching cluster.
 * Returns up to `topK` results, sorted by boosted score desc.
 */
export async function hybridRetrieve(
  query: string,
  ctx: PageContext = {},
  opts: RetrievalOptions = {},
): Promise<RetrievedChunk[]> {
  const topK = opts.topK ?? DEFAULT_TOP_K;
  const pinned = structuredLookup(ctx);
  const pinnedKeys = new Set(pinned.map((p) => `${p.source_type}:${p.source_slug}`));

  const semantic = await semanticSearch(query, ctx, opts);

  // Pull canonical chunks for pinned entities too, even if semantic search
  // did not return them (entitySlug + entityType is known-good).
  const pinnedChunks = await fetchChunksBySlug(pinned);

  // Score + dedupe.
  const byKey = new Map<string, RetrievedChunk>();
  for (const s of semantic) {
    const boost =
      pinnedKeys.has(`${s.source_type}:${s.source_slug}`) ? 0.15 : 0;
    const clusterBoost =
      s.source_type === 'lp' && ctx.cluster && s.metadata?.cluster === ctx.cluster
        ? 0.05
        : 0;
    const score = Math.min(1, s.similarity + boost + clusterBoost);
    const k = `${s.source_type}:${s.source_slug}:${s.section_path ?? ''}`;
    byKey.set(k, { ...s, similarity: score });
  }
  for (const p of pinnedChunks) {
    const k = `${p.source_type}:${p.source_slug}:${p.section_path ?? ''}`;
    const existing = byKey.get(k);
    const pinnedScore = Math.max(0.65, existing?.similarity ?? 0);
    byKey.set(k, { ...p, similarity: pinnedScore });
  }

  return Array.from(byKey.values())
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

async function fetchChunksBySlug(
  pairs: ReadonlyArray<{ source_type: ContentChunk['source_type']; source_slug: string }>,
): Promise<RetrievedChunk[]> {
  if (pairs.length === 0) return [];
  const supabase = serviceRoleClient();
  if (!supabase) return [];
  try {
    const orFilter = pairs
      .map(
        (p) => `and(source_type.eq.${p.source_type},source_slug.eq.${p.source_slug})`,
      )
      .join(',');
    const { data, error } = await supabase
      .from('content_chunks')
      .select('id,source_type,source_slug,title,section_path,text,metadata')
      .or(orFilter)
      .limit(20);
    if (error) {
      log.warn('retrieve', error, { extra: { phase: 'fetchChunksBySlug', pairs } });
      return [];
    }
    return (data ?? []).map((r) => ({
      id: r.id as string,
      source_type: r.source_type as ContentChunk['source_type'],
      source_slug: r.source_slug as string,
      title: r.title as string,
      section_path: (r.section_path as string | null) ?? undefined,
      text: r.text as string,
      metadata: (r.metadata as ContentChunk['metadata']) ?? {},
      similarity: 0.65,
    }));
  } catch (err) {
    log.warn('retrieve', err, { extra: { phase: 'fetchChunksBySlug' } });
    return [];
  }
}

/**
 * Format retrieved chunks for injection into the Part-3 system prompt.
 * Each chunk is wrapped in a tagged block the model is instructed to
 * cite as `[source:slug]`.
 */
export function formatForPrompt(chunks: readonly RetrievedChunk[]): string {
  if (chunks.length === 0) return '';
  const lines: string[] = ['<atheros-context>'];
  for (const c of chunks) {
    const tag = `[${c.source_type}:${c.source_slug}]`;
    const path = c.section_path ? ` (${c.section_path})` : '';
    lines.push(`<chunk tag="${tag}" title="${c.title}${path}">`);
    lines.push(c.text);
    lines.push('</chunk>');
  }
  lines.push('</atheros-context>');
  return lines.join('\n');
}

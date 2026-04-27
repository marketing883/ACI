/**
 * Atheros Outcome Copy override resolver.
 *
 * Resolves admin-edited copy from public.outcome_copy_overrides at
 * request time, with a short in-memory TTL so a save reflects on the
 * live site within ~60 seconds without a redeploy.
 *
 * Used by:
 *   - src/lib/copilot/pillCopy.ts (idle / peek copy)
 *   - src/lib/copilot/welcome.ts (chat opener)
 *   - Future: panel.primary_oc / chip overrides in Part 6.5.
 *
 * Server-only. The resolver runs inside route handlers (pillCopy /
 * welcome are imported by /api/chat/v2/route.ts), so it has access
 * to process.env.SUPABASE_SERVICE_ROLE_KEY.
 */

import { createClient } from '@supabase/supabase-js';
import { log } from './logger';

export type OverrideSurface =
  | 'idle'
  | 'peek.proactive'
  | 'peek.narration'
  | 'panel.primary_oc'
  | 'chip'
  | 'welcome';

export interface OverrideRow {
  route_pattern: string;
  surface: OverrideSurface;
  variant_key: string | null;
  text: string;
  is_active: boolean;
}

const CACHE_TTL_MS = 60_000;

interface Cache {
  rows: OverrideRow[];
  fetchedAt: number;
}

let cache: Cache | null = null;
let inflight: Promise<OverrideRow[]> | null = null;

async function fetchAllOverrides(): Promise<OverrideRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  try {
    const { data, error } = await supabase
      .from('outcome_copy_overrides')
      .select('route_pattern,surface,variant_key,text,is_active')
      .eq('is_active', true);
    if (error) {
      log.warn('init', error, { extra: { phase: 'outcomeCopyResolver.fetch' } });
      return [];
    }
    return (data ?? []) as OverrideRow[];
  } catch (err) {
    log.warn('init', err, { extra: { phase: 'outcomeCopyResolver.fetch.catch' } });
    return [];
  }
}

async function getOverrides(): Promise<OverrideRow[]> {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) return cache.rows;
  if (!inflight) {
    inflight = fetchAllOverrides()
      .then((rows) => {
        cache = { rows, fetchedAt: Date.now() };
        return rows;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/**
 * Match a route_pattern against a pathname. Supports trailing-wildcard
 * prefixes: `/lp/*` matches any `/lp/...`. Exact match is always
 * preferred over a wildcard match.
 */
function matchesRoute(pattern: string, pathname: string): boolean {
  if (pattern === pathname) return true;
  if (pattern.endsWith('/*')) {
    const prefix = pattern.slice(0, -2);
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  }
  if (pattern.endsWith('*')) {
    return pathname.startsWith(pattern.slice(0, -1));
  }
  return false;
}

/**
 * Resolve the override that should win for a given (pathname, surface,
 * variant). Longest exact pattern wins; among matching wildcards the
 * longest prefix wins. variant_key matches strictly; null variant is
 * treated as the fallback when no variant-specific row exists.
 */
export async function resolveOutcomeOverride(
  pathname: string,
  surface: OverrideSurface,
  variant?: string | null,
): Promise<string | null> {
  const all = await getOverrides();
  if (all.length === 0) return null;

  let best: { row: OverrideRow; score: number } | null = null;
  for (const r of all) {
    if (r.surface !== surface) continue;
    if (variant && r.variant_key && r.variant_key !== variant) continue;
    if (!matchesRoute(r.route_pattern, pathname)) continue;
    // Score: exact route match >> longer wildcard match. Variant-specific
    // edges out variant-null when both present.
    let score = r.route_pattern.length;
    if (r.route_pattern === pathname) score += 1000;
    if (r.variant_key && variant && r.variant_key === variant) score += 100;
    if (!best || score > best.score) best = { row: r, score };
  }
  return best?.row.text ?? null;
}

/** Test/admin-only: invalidate the in-memory cache after a save. */
export function invalidateOutcomeOverrideCache(): void {
  cache = null;
}

/**
 * Voice-rule lint mirroring auditPillCopy / auditWelcome. Returns the
 * list of issues; an empty list means the copy is safe to save.
 */
export function lintOutcomeCopy(text: string): string[] {
  const issues: string[] = [];
  if (!text || text.trim().length === 0) issues.push('empty');
  if (/!/.test(text)) issues.push('contains exclamation');
  if (/[—–]/.test(text)) issues.push('contains em or en dash');
  if (/\$|pricing|cost per/i.test(text)) issues.push('mentions pricing');
  if (/\btalk to (an? )?architect\b/i.test(text)) issues.push('uses generic "talk to an architect"');
  if (/I('m| am)? an AI|as an AI|\bI can help you with\b/i.test(text)) {
    issues.push('AI-assistant-sounding phrase');
  }
  if (text.length > 280) issues.push('over 280 chars');
  return issues;
}

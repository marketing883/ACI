/**
 * Pure, framework-free helpers for picking generated art per case
 * study and guaranteeing diversity across siblings rendered on the
 * homepage. This module has no 'use client' directive and no React
 * dependency, so it can be imported from the server component that
 * queries Supabase (CaseStudiesKineticSection) and from the client
 * component that renders each card (CaseStudyKinetic) without
 * crossing the server/client boundary.
 */

export type ArtKey =
  | 'heartbeat'
  | 'barColumns'
  | 'convergingLines'
  | 'alignment'
  | 'candles';

const ALL_ART_KEYS: ArtKey[] = [
  'candles',
  'barColumns',
  'heartbeat',
  'convergingLines',
  'alignment',
];

/**
 * Minimum shape needed to score a study. Intentionally a structural
 * subset of KineticStudy so both the DB mapper and the component can
 * pass their local shape in without coupling.
 */
export type StudyForArt = {
  services?: string[];
  outcome: string;
  approach: string;
  metricLabel: string;
  industry: string;
  artVariant?: string;
};

/**
 * Return the study's art preferences in priority order.
 *
 * If the admin set an explicit `artVariant` on the row, it pins the
 * first choice. The remaining three are returned as fallbacks so the
 * diversity algorithm can resolve conflicts when two siblings
 * accidentally carry the same explicit variant.
 *
 * Otherwise we score each art key across four signal tiers:
 *   1. Strong, specific content signals (analytics, AI, alignment).
 *   2. Industry convention (finance -> bars, manufacturing ->
 *      heartbeat, healthcare -> converging lines).
 *   3. Weaker content signals (modernization, real-time, cost).
 *   4. A neutral baseline so alignment breaks ties.
 */
export function artPreferencesForStudy(study: StudyForArt): ArtKey[] {
  if (
    study.artVariant === 'barColumns' ||
    study.artVariant === 'heartbeat' ||
    study.artVariant === 'convergingLines' ||
    study.artVariant === 'alignment' ||
    study.artVariant === 'candles'
  ) {
    const rest = ALL_ART_KEYS.filter((k) => k !== study.artVariant);
    return [study.artVariant as ArtKey, ...rest];
  }

  const services = (study.services ?? []).join(' ').toLowerCase();
  const content = `${study.outcome} ${study.approach} ${study.metricLabel}`.toLowerCase();
  const signal = `${services} ${content}`;
  const industry = study.industry.toLowerCase();

  const scores: Record<ArtKey, number> = {
    barColumns: 0,
    heartbeat: 0,
    convergingLines: 0,
    alignment: 0,
    candles: 0,
  };

  // Strong content signals.
  if (/analytics|\bbi\b|report|dashboard|self[- ]service|power ?bi|tableau/.test(signal)) {
    scores.barColumns += 6;
  }
  if (/\bai\b|\bml\b|agent|\bllm\b|gen[- ]?ai|govern|shadow ai|\bcompliance\b/.test(signal)) {
    scores.convergingLines += 6;
  }
  if (/align|unif|consolid|\bintegrat|supplier|multi[- ]location|global roll|post[- ]acquisition|\bm&a\b|merger/.test(signal)) {
    scores.alignment += 6;
  }
  // Finance-specific content: trading floors, risk, portfolios,
  // allocations, P&L work, regulatory reporting. These reliably suit
  // the candlestick metaphor over any other.
  if (/trading|\bstock\b|equity|equities|portfolio|allocation|\brisk\b|\bp&l\b|profitab|capital markets|sec\b|regulator/.test(signal)) {
    scores.candles += 6;
  }

  // Industry conventions. Finance now defaults to candles (the
  // unambiguous financial-services visual), not bars. Bars stay
  // reserved for explicit analytics/BI stories regardless of sector.
  if (/financ|insuranc|bank|invest|capital/.test(industry)) scores.candles += 5;
  if (/manufactur|industrial|automotive|energy|utilities|logistics|transport/.test(industry)) scores.heartbeat += 4;
  if (/health|pharma|clinical|bio|life sciences/.test(industry)) scores.convergingLines += 4;

  // Weaker content signals.
  if (/migrat|moderniz|legacy|\bcloud\b|re[- ]?architect|lift[- ]and[- ]shift/.test(signal)) {
    scores.heartbeat += 2;
  }
  if (/real[- ]?time|stream|kafka|cdc/.test(signal)) scores.heartbeat += 1;
  if (/cost|saving|reduction|faster/.test(signal)) scores.barColumns += 1;

  scores.alignment += 1;

  return [...ALL_ART_KEYS].sort((a, b) => scores[b] - scores[a]);
}

/**
 * Greedy diversity assignment: walk the studies in order, give each
 * its highest-preference art key that has not yet been taken. Returns
 * one key per study. If we exceed the four distinct variants, the
 * taken-set resets so the rotation continues cleanly.
 */
export function assignDiverseArt(studies: StudyForArt[]): ArtKey[] {
  const taken = new Set<ArtKey>();
  const result: ArtKey[] = [];
  for (const s of studies) {
    const prefs = artPreferencesForStudy(s);
    const chosen = prefs.find((k) => !taken.has(k)) ?? prefs[0];
    taken.add(chosen);
    result.push(chosen);
    if (taken.size >= ALL_ART_KEYS.length) taken.clear();
  }
  return result;
}

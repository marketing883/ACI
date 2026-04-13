/**
 * Atheros pill copy.
 *
 * Per-route natural-language micro-copy for the mobile pill (idle + peek)
 * and a hook for a future desktop pill label. The copy rules are strict:
 *   - absolutely natural human language,
 *   - not sales-y,
 *   - not AI-assistant-sounding,
 *   - short enough to read in a glance (idle <= 28 chars, peek <= 90),
 *   - never mentions pricing, never generic "talk to an architect".
 *
 * Part-6 overlays this map with the admin-editable outcome-copy table;
 * the resolver here is the fallback when no override is active.
 */

import { resolveOutcomeOverride } from './outcomeCopyResolver';

export interface PillCopy {
  /** Shown on the idle pill. Short, curious, concrete. */
  idle: string;
  /** Shown when the peek lifts from the pill after dwell + scroll.
   *  More specific than idle. Still human, still curious. */
  peek: string;
}

/**
 * Exact pathname overrides (highest priority).
 */
const EXACT: Record<string, PillCopy> = {
  '/': {
    idle: 'Ask about what we actually build',
    peek: 'Most teams arrive here with the same three questions. Want to compare notes?',
  },
  '/contact': {
    idle: 'Ask while you fill the form',
    peek: 'The form is the fastest path. I can answer while you type if it helps.',
  },
  '/case-studies': {
    idle: 'Map one of these to your stack',
    peek: 'Pick one; I can walk through how it would translate for your team.',
  },
  '/playbooks': {
    idle: 'Which playbook fits?',
    peek: 'Every playbook started as a 3am fire. Want to see where yours overlaps?',
  },
  '/services': {
    idle: 'Where do you want to start?',
    peek: 'Pick a service and I can line up the proof we have for your industry.',
  },
  '/industries': {
    idle: 'What breaks in your space?',
    peek: 'The patterns repeat. Tell me what hurts; I can show you how we fixed it before.',
  },
  '/platforms': {
    idle: 'Which platform?',
    peek: 'The platform is only half the answer. Ask me where the rollout usually slips.',
  },
  '/blogs': {
    idle: 'Skip the scroll',
    peek: 'Tell me the question you came to answer and I can point you at the right piece.',
  },
};

/**
 * Prefix-matched routes (second priority). Longest prefix wins.
 */
const PREFIXES: Array<[string, PillCopy]> = [
  [
    '/services/data-engineering',
    {
      idle: 'Ask about Unity Catalog',
      peek: 'Lakehouse migrations slip in the same three places. Want to walk it through?',
    },
  ],
  [
    '/services/applied-ai-ml',
    {
      idle: 'What are you trying to predict?',
      peek: 'Most MLOps stories are the boring ones. Mine is too. Want the rundown?',
    },
  ],
  [
    '/services/cloud-modernization',
    {
      idle: 'Where are you stuck?',
      peek: 'Migrations are a sequencing problem. Ask me how we order it.',
    },
  ],
  [
    '/services/martech-cdp',
    {
      idle: 'Identity resolution trouble?',
      peek: 'CDPs fall apart at identity. I can show you the fixes.',
    },
  ],
  [
    '/services/cyber-security',
    {
      idle: 'What is the riskiest seam?',
      peek: 'Zero trust is a verb. Ask me which edges to enforce first.',
    },
  ],
  [
    '/services/digital-transformation',
    {
      idle: 'What is breaking?',
      peek: 'Automation pays back in the boring loops. Want the checklist?',
    },
  ],
  [
    '/services/app-development',
    {
      idle: 'Greenfield or rescue?',
      peek: 'Rescue projects are 60% of what we do. Want to compare notes?',
    },
  ],
  [
    '/services/qa-testing',
    {
      idle: 'Where does quality slip?',
      peek: 'Most test suites are slow. Ask me how we cut cycle time.',
    },
  ],
  [
    '/industries/financial-services',
    {
      idle: 'Consolidation on the table?',
      peek: 'Post-acquisition rollups have a pattern. Want to see it?',
    },
  ],
  [
    '/industries/healthcare',
    {
      idle: 'FHIR ingest or something else?',
      peek: 'The hard part is de-identification without losing the signal. Want the approach?',
    },
  ],
  [
    '/industries/retail',
    {
      idle: 'POS realtime or loyalty?',
      peek: 'Retail data lives and dies at the edge. Want the pipeline shape?',
    },
  ],
  [
    '/industries/manufacturing',
    {
      idle: 'OT or IT first?',
      peek: 'Predictive ops only pays back when the interventions are wired in. Ask how.',
    },
  ],
  [
    '/industries/hospitality',
    {
      idle: 'Multi-location rollout?',
      peek: 'Unifying property data is half architecture, half change management. Want both?',
    },
  ],
  [
    '/industries/energy',
    {
      idle: 'Grid, ops, or field?',
      peek: 'Most utility data is right there. It is just not organized. Ask me how we unkink it.',
    },
  ],
  [
    '/industries/transportation',
    {
      idle: 'Fleet, freight, or both?',
      peek: 'Telemetry is easy; acting on it is not. Want the pattern?',
    },
  ],
  [
    '/platforms/databricks',
    {
      idle: 'Unity Catalog, MLflow, or cost?',
      peek: 'Databricks projects slip on governance more often than compute. Want to walk it?',
    },
  ],
  [
    '/platforms/snowflake',
    {
      idle: 'Warehouse or lakehouse?',
      peek: 'Snowflake is great once the warehouses are consolidated. Ask me how.',
    },
  ],
  [
    '/platforms/aws',
    {
      idle: 'What are you running?',
      peek: 'The sequencing matters more than the services. Want the map?',
    },
  ],
  [
    '/platforms/azure',
    {
      idle: 'Fabric, Synapse, or both?',
      peek: 'Ask me which parts of Fabric are ready and which still need glue.',
    },
  ],
  [
    '/platforms/salesforce',
    {
      idle: 'Sales, Service, or Data Cloud?',
      peek: 'Salesforce rollouts are 30% config, 70% data. Want the approach?',
    },
  ],
  [
    '/platforms/sap',
    {
      idle: 'S/4 migration on the roadmap?',
      peek: 'S/4 projects hinge on data quality. Ask me where we put the gates.',
    },
  ],
  [
    '/platforms/servicenow',
    {
      idle: 'ITSM or HR Service Delivery?',
      peek: 'Workflow quality beats feature count. Want the sequence?',
    },
  ],
  [
    '/platforms/braze',
    {
      idle: 'Journeys, canvases, or data?',
      peek: 'Braze works best when upstream identity is clean. Ask me how we hand that off.',
    },
  ],
  [
    '/platforms/microsoft-dynamics',
    {
      idle: 'Finance, Supply, or CRM?',
      peek: 'Copilot needs clean data to be useful. Ask me how we get there.',
    },
  ],
  // /lp/* routes are intentionally chat-suppressed (see ChatWidget.tsx
  // isChatSuppressedRoute). No pill copy needed.
  [
    '/case-studies/',
    {
      idle: 'Map this to your stack',
      peek: 'Want to see where this translates and where it does not?',
    },
  ],
];

const DEFAULT_COPY: PillCopy = {
  idle: 'Ask Atheros',
  peek: 'Most people show up with a specific question. What is yours?',
};

/**
 * Resolve the pill copy for a given pathname (synchronous fallback).
 * Admin overrides apply only via resolvePillCopyWithOverrides.
 */
export function resolvePillCopy(pathname: string | null | undefined): PillCopy {
  if (!pathname) return DEFAULT_COPY;
  if (EXACT[pathname]) return EXACT[pathname];
  // Longest-prefix match so /services/data-engineering beats /services.
  let bestMatch: PillCopy | null = null;
  let bestLen = 0;
  for (const [prefix, copy] of PREFIXES) {
    if (pathname.startsWith(prefix) && prefix.length > bestLen) {
      bestMatch = copy;
      bestLen = prefix.length;
    }
  }
  return bestMatch ?? DEFAULT_COPY;
}

/**
 * Async resolver: consults outcome_copy_overrides for idle/peek per
 * surface, falling back to the static resolver when no override matches.
 * Server-side use only (requires the service-role key).
 */
export async function resolvePillCopyWithOverrides(
  pathname: string | null | undefined,
  variant?: string | null,
): Promise<PillCopy> {
  const base = resolvePillCopy(pathname);
  if (!pathname) return base;
  const [idleOverride, peekOverride] = await Promise.all([
    resolveOutcomeOverride(pathname, 'idle', variant ?? null),
    resolveOutcomeOverride(pathname, 'peek.proactive', variant ?? null),
  ]);
  return {
    idle: idleOverride ?? base.idle,
    peek: peekOverride ?? base.peek,
  };
}

/**
 * Full audit helper used by the Part-5 tests: every entry in EXACT +
 * PREFIXES must satisfy the voice rules.
 */
export function auditPillCopy(): Array<{ route: string; issue: string }> {
  const issues: Array<{ route: string; issue: string }> = [];
  const all: Array<[string, PillCopy]> = [
    ...Object.entries(EXACT),
    ...PREFIXES,
  ];
  for (const [route, copy] of all) {
    const both = `${copy.idle}\n${copy.peek}`;
    if (copy.idle.length > 36) issues.push({ route, issue: 'idle too long (>36 chars)' });
    if (copy.peek.length > 110) issues.push({ route, issue: 'peek too long (>110 chars)' });
    if (/!/.test(both)) issues.push({ route, issue: 'contains exclamation' });
    if (/[—–]/.test(both)) issues.push({ route, issue: 'contains em/en dash' });
    if (/\btalk to (an? )?architect\b/i.test(both))
      issues.push({ route, issue: 'uses generic "talk to an architect"' });
    if (/\$|pricing|cost per/i.test(both))
      issues.push({ route, issue: 'mentions pricing' });
    if (/I('m| am)? an AI|as an AI|\bI can help you with\b/i.test(both))
      issues.push({ route, issue: 'AI-assistant-sounding phrase' });
  }
  return issues;
}

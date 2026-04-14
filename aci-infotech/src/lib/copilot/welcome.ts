/**
 * Atheros welcome composer.
 *
 * The first message in any new Atheros thread. Per-page so the very
 * first sentence proves Atheros knows what the visitor is looking at.
 *
 * Voice rules (strict):
 *   - absolutely natural human language,
 *   - no exclamation points, no em/en dashes,
 *   - no AI-assistant phrasing ("I'd be happy to", "As an AI"),
 *   - no sales-voice ("discover", "unlock"),
 *   - never mentions pricing,
 *   - never says "talk to an architect" as a generic CTA.
 *
 * `auditWelcome()` walks every entry and asserts the rules. Test
 * coverage is in scripts/test-welcome.mjs.
 */

import { services } from '@/data/services';
import { industries } from '@/data/industries';
import { platforms } from '@/data/platforms';
import type { ServiceClusterId, IndustryId, PlatformId } from '@/data/types';
import { resolveOutcomeOverride } from './outcomeCopyResolver';

export interface Welcome {
  text: string;
}

const DEFAULT_WELCOME: Welcome = {
  text:
    'Hi, Atheros here. Tell me what you are working on and I will find the right starting point.',
};

/**
 * Hand-authored copy for high-traffic exact paths and prefixes. Longest
 * prefix wins; exact match beats any prefix.
 */
const EXACT: Record<string, Welcome> = {
  '/': {
    text:
      "Hi, Atheros here. I know ACI's work inside and out. Tell me what you are working on and I will point you at the right place to start.",
  },
  '/preview/home': {
    text:
      "Hi, Atheros here. I know ACI's work inside and out. Tell me what you are working on and I will point you at the right place to start.",
  },
  '/contact': {
    text:
      'Hi, Atheros here. The form is the fastest path. I can answer questions while you type if that helps.',
  },
  '/services': {
    text:
      'Hi, Atheros here. Six clusters on this page, all in production. Which one are you weighing?',
  },
  '/industries': {
    text:
      'Hi, Atheros here. Pick a vertical and I will show you the patterns we ship there.',
  },
  '/platforms': {
    text:
      'Hi, Atheros here. A platform is half the answer. Which one is on your roadmap?',
  },
  '/case-studies': {
    text:
      'Hi, Atheros here. Pick a case study and I can translate it to your stack.',
  },
  '/playbooks': {
    text:
      'Hi, Atheros here. Every playbook started as a 3am fire. Which one looks closest to yours?',
  },
  '/blogs': {
    text:
      'Hi, Atheros here. Tell me the question you came to answer and I will point you at the right piece.',
  },
};

/**
 * Hand-authored prefix copy for static service / industry / platform
 * pages we have strong opinions about. Falls through to dynamic
 * composition (below) for any service/industry/platform page that is
 * not listed here.
 */
const PREFIX_OVERRIDES: Array<[string, Welcome]> = [
  [
    '/services/data-engineering',
    {
      text: 'Hi, Atheros here. Data engineering page is up. Three reasons people land here: cost, latency, governance. Which one is on your plate?',
    },
  ],
  [
    '/services/applied-ai-ml',
    {
      text: 'Hi, Atheros here. Applied AI page. Most asks are either GenAI in production or ML on existing data. Which is yours?',
    },
  ],
  [
    '/services/cloud-modernization',
    {
      text: 'Hi, Atheros here. Cloud modernization page. Are you migrating, optimizing, or both?',
    },
  ],
  [
    '/services/martech-cdp',
    {
      text: 'Hi, Atheros here. On the MarTech and CDP page. Identity resolution is what trips most teams. Sound familiar, or is activation the bigger pain?',
    },
  ],
  [
    '/services/cyber-security',
    {
      text: 'Hi, Atheros here. Security page. Zero trust, data residency, or audit are the three asks I hear most. Where are you?',
    },
  ],
  [
    '/services/digital-transformation',
    {
      text: 'Hi, Atheros here. Automation page. Which loops are eating your team right now?',
    },
  ],
  [
    '/services/app-development',
    {
      text: 'Hi, Atheros here. App development page. Greenfield or rescue?',
    },
  ],
  [
    '/services/qa-testing',
    {
      text: 'Hi, Atheros here. QA page. Most teams come here to cut cycle time. Is that you, or something else?',
    },
  ],
  [
    '/platforms/databricks',
    {
      text: 'Hi, Atheros here. Databricks page. Lakehouse, MLOps, cost optimization show up most often. Which one is the immediate need?',
    },
  ],
  [
    '/platforms/snowflake',
    {
      text: 'Hi, Atheros here. Snowflake page. Are you consolidating warehouses, or moving toward a lakehouse?',
    },
  ],
  [
    '/platforms/aws',
    {
      text: 'Hi, Atheros here. AWS page. What are you running, and what is the next move?',
    },
  ],
  [
    '/platforms/azure',
    {
      text: 'Hi, Atheros here. Azure page. Fabric, Synapse, or both?',
    },
  ],
  [
    '/platforms/salesforce',
    {
      text: 'Hi, Atheros here. Salesforce page. Sales, Service, or Data Cloud?',
    },
  ],
  [
    '/platforms/sap',
    {
      text: 'Hi, Atheros here. SAP page. S/4 migration on the roadmap, or is this about a specific module?',
    },
  ],
  [
    '/platforms/servicenow',
    {
      text: 'Hi, Atheros here. ServiceNow page. ITSM or HR Service Delivery?',
    },
  ],
  [
    '/platforms/braze',
    {
      text: 'Hi, Atheros here. Braze page. Are journeys clean, or is upstream identity the issue?',
    },
  ],
  [
    '/platforms/microsoft-dynamics',
    {
      text: 'Hi, Atheros here. Dynamics page. Finance, Supply, or CRM?',
    },
  ],
  [
    '/industries/financial-services',
    {
      text: 'Hi, Atheros here. Financial services page. Consolidation, fraud, or analytics modernization, where are you?',
    },
  ],
  [
    '/industries/healthcare',
    {
      text: 'Hi, Atheros here. Healthcare page. FHIR ingest, claims data, or device telemetry, which one is in scope?',
    },
  ],
  [
    '/industries/retail',
    {
      text: 'Hi, Atheros here. Retail page. POS realtime or loyalty analytics?',
    },
  ],
  [
    '/industries/manufacturing',
    {
      text: 'Hi, Atheros here. Manufacturing page. OT or IT side first?',
    },
  ],
  [
    '/industries/hospitality',
    {
      text: 'Hi, Atheros here. Hospitality page. The pattern that comes up most: unifying property data without breaking property-level reporting. Want to walk through it?',
    },
  ],
  [
    '/industries/energy',
    {
      text: 'Hi, Atheros here. Energy page. Grid, ops, or field?',
    },
  ],
  [
    '/industries/transportation',
    {
      text: 'Hi, Atheros here. Transportation page. Fleet, freight, or both?',
    },
  ],
  [
    '/case-studies/',
    {
      text: 'Hi, Atheros here. You are on a case study. Want me to translate any part of it to your stack?',
    },
  ],
  [
    '/playbooks/',
    {
      text: 'Hi, Atheros here. Reading a playbook. Which step do you want to dig into?',
    },
  ],
  [
    '/blogs/',
    {
      text: 'Hi, Atheros here. Reading a piece. Want me to summarize the part that matters for your situation?',
    },
  ],
  // /lp/* routes are intentionally chat-suppressed (see ChatWidget.tsx
  // isChatSuppressedRoute). No welcome copy needed.
  [
    '/whitepapers/',
    {
      text: 'Hi, Atheros here. Whitepaper page. Want a quick map of what it covers before you commit to the read?',
    },
  ],
];

/**
 * Compose a welcome from /services/<slug>, /industries/<slug>, or
 * /platforms/<slug> when no hand-authored override exists. Uses the
 * data file's title + tagline so adding a new entity gets a
 * contextual welcome for free.
 */
function dynamicWelcome(pathname: string): Welcome | null {
  const serviceMatch = pathname.match(/^\/services\/([a-z0-9-]+)/);
  if (serviceMatch) {
    const slug = serviceMatch[1] as ServiceClusterId;
    const s = services[slug];
    if (s) return { text: `Hi, Atheros here. ${s.title} page is up. ${trimEnd(s.tagline)}. What pulled you in?` };
  }
  const industryMatch = pathname.match(/^\/industries\/([a-z0-9-]+)/);
  if (industryMatch) {
    const slug = industryMatch[1] as IndustryId;
    const i = industries[slug];
    if (i) return { text: `Hi, Atheros here. ${i.title} page is up. ${trimEnd(i.tagline)}. What pulled you in?` };
  }
  const platformMatch = pathname.match(/^\/platforms\/([a-z0-9-]+)/);
  if (platformMatch) {
    const slug = platformMatch[1] as PlatformId;
    const p = platforms[slug];
    if (p) return { text: `Hi, Atheros here. ${p.title} page is up. ${trimEnd(p.tagline)}. What pulled you in?` };
  }
  return null;
}

function trimEnd(s: string): string {
  return s.replace(/[\s.,;:]+$/g, '');
}

/**
 * Synchronous resolver used at first render. Falls back through the
 * static maps and dynamic composition. Admin overrides apply only to
 * the async resolver below (because they require a DB read).
 */
export function resolveWelcome(pathname: string | null | undefined): Welcome {
  if (!pathname) return DEFAULT_WELCOME;
  if (EXACT[pathname]) return EXACT[pathname];

  let bestPrefix: Welcome | null = null;
  let bestLen = 0;
  for (const [prefix, w] of PREFIX_OVERRIDES) {
    if (pathname.startsWith(prefix) && prefix.length > bestLen) {
      bestPrefix = w;
      bestLen = prefix.length;
    }
  }
  if (bestPrefix) return bestPrefix;

  const dyn = dynamicWelcome(pathname);
  if (dyn) return dyn;

  return DEFAULT_WELCOME;
}

/**
 * Async resolver that consults outcome_copy_overrides first. Used by
 * the server route when it needs the most up-to-date copy. Falls back
 * to resolveWelcome() when no admin override matches.
 */
export async function resolveWelcomeWithOverrides(
  pathname: string | null | undefined,
  variant?: string | null,
): Promise<Welcome> {
  if (pathname) {
    const overridden = await resolveOutcomeOverride(pathname, 'welcome', variant ?? null);
    if (overridden) return { text: overridden };
  }
  return resolveWelcome(pathname);
}

/**
 * Audit helper used by scripts/test-welcome.mjs. Walks every static
 * entry; dynamic entries are checked against the data file taglines
 * during the test.
 */
export function auditWelcome(): Array<{ route: string; issue: string }> {
  const issues: Array<{ route: string; issue: string }> = [];
  const all: Array<[string, Welcome]> = [
    ...Object.entries(EXACT),
    ...PREFIX_OVERRIDES,
  ];
  for (const [route, w] of all) {
    const t = w.text;
    if (/!/.test(t)) issues.push({ route, issue: 'contains exclamation' });
    if (/[—–]/.test(t)) issues.push({ route, issue: 'contains em/en dash' });
    if (/\btalk to (an? )?architect\b/i.test(t))
      issues.push({ route, issue: 'uses generic "talk to an architect"' });
    if (/\$|pricing|cost per/i.test(t))
      issues.push({ route, issue: 'mentions pricing' });
    if (/I('m| am)? an AI|as an AI|\bI can help you with\b/i.test(t))
      issues.push({ route, issue: 'AI-assistant-sounding phrase' });
    if (t.length > 200) issues.push({ route, issue: 'over 200 chars' });
  }
  return issues;
}

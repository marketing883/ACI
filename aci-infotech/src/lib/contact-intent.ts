/**
 * The sitewide contact-intent contract.
 *
 * Every CTA that points at /contact carries structured intent in the
 * query string, built by `contactHref()` so the vocabulary stays
 * closed: `service`, `platform`, and `industry` must be real slugs,
 * `topic` is a short free label for the section the CTA sat in, and
 * `source` names the CTA position (hero, cta-section, bridge, nav).
 *
 * The contact page parses the same contract with `parseContactIntent`,
 * reflects it back to the visitor, and submits it so the database and
 * the lead-intelligence pipeline receive categories instead of guesses.
 * Shared by server and client code; no imports beyond the standard lib.
 */

export const SERVICE_LABELS: Record<string, string> = {
  'data-engineering': 'Data Engineering',
  'applied-ai-ml': 'Applied AI & ML',
  'cloud-modernization': 'Cloud Modernization',
  'cyber-security': 'Cyber Security',
  'martech-cdp': 'MarTech & CDP',
  'digital-transformation': 'Digital Transformation',
  'app-development': 'App Development',
  'quality-engineering': 'Quality Engineering',
  'advisory-strategy': 'Advisory & Strategy',
  gcc: 'GCC & Captive Centers',
  'managed-operations': 'Managed Operations',
};

export const PLATFORM_LABELS: Record<string, string> = {
  databricks: 'Databricks',
  snowflake: 'Snowflake',
  aws: 'AWS',
  azure: 'Microsoft Azure',
  gcp: 'Google Cloud',
  salesforce: 'Salesforce',
  sap: 'SAP',
  servicenow: 'ServiceNow',
  'microsoft-dynamics': 'Microsoft Dynamics 365',
  braze: 'Braze',
};

export const INDUSTRY_LABELS: Record<string, string> = {
  'financial-services': 'Financial Services',
  healthcare: 'Healthcare',
  retail: 'Retail & Consumer',
  manufacturing: 'Manufacturing',
  energy: 'Energy & Utilities',
  'oil-gas': 'Oil & Gas',
  hospitality: 'Hospitality',
  transportation: 'Transportation & Logistics',
};

export type ContactReason =
  | 'project-inquiry'
  | 'architecture-call'
  | 'partnership'
  | 'careers'
  | 'general';

export interface ContactIntent {
  /** Validated service slug, when the CTA sat on or under a service. */
  service?: string;
  /** Validated platform slug. */
  platform?: string;
  /** Validated industry slug. */
  industry?: string;
  /** Free short label for the section the CTA sat in ("analytics"). */
  topic?: string;
  /** Playbook or resource identifier carried from gated flows. */
  playbook?: string;
  /** Contact reason; defaults to project-inquiry when intent exists. */
  reason?: ContactReason;
  /** CTA position: hero, cta-section, bridge, nav, footer, chat. */
  source?: string;
}

const REASONS: ContactReason[] = [
  'project-inquiry',
  'architecture-call',
  'partnership',
  'careers',
  'general',
];

/** Build a /contact href carrying validated intent. Single source of
    truth for every CTA on the site. */
export function contactHref(intent: ContactIntent): string {
  const params = new URLSearchParams();
  if (intent.service && SERVICE_LABELS[intent.service]) params.set('service', intent.service);
  if (intent.platform && PLATFORM_LABELS[intent.platform]) params.set('platform', intent.platform);
  if (intent.industry && INDUSTRY_LABELS[intent.industry]) params.set('industry', intent.industry);
  if (intent.topic) params.set('topic', intent.topic);
  if (intent.playbook) params.set('playbook', intent.playbook);
  if (intent.reason) params.set('reason', intent.reason);
  if (intent.source) params.set('source', intent.source);
  const qs = params.toString();
  return qs ? `/contact?${qs}` : '/contact';
}

/** Parse and validate intent from URL search params. Unknown slugs are
    dropped rather than echoed, so nothing unvalidated reaches the UI
    or the database. Accepts the legacy `type` param as a reason. */
export function parseContactIntent(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): ContactIntent {
  const get = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const intent: ContactIntent = {};
  const service = get('service');
  if (service && SERVICE_LABELS[service]) intent.service = service;
  const platform = get('platform');
  if (platform && PLATFORM_LABELS[platform]) intent.platform = platform;
  const industry = get('industry');
  if (industry && INDUSTRY_LABELS[industry]) intent.industry = industry;

  const topic = get('topic');
  if (topic && /^[a-z0-9-]{2,40}$/i.test(topic)) intent.topic = topic.toLowerCase();
  const playbook = get('playbook');
  if (playbook && /^[a-z0-9-]{2,80}$/i.test(playbook)) intent.playbook = playbook;

  const reason = (get('reason') ?? get('type')) as ContactReason | undefined;
  if (reason && REASONS.includes(reason)) intent.reason = reason;

  const source = get('source');
  if (source && /^[a-z0-9:-]{2,60}$/i.test(source)) intent.source = source.toLowerCase();

  return intent;
}

/** Human label for the strongest signal in the intent, or undefined. */
export function intentLabel(intent: ContactIntent): string | undefined {
  if (intent.service) {
    const base = SERVICE_LABELS[intent.service];
    return intent.topic ? `${base} · ${humanizeTopic(intent.topic)}` : base;
  }
  if (intent.platform) return PLATFORM_LABELS[intent.platform];
  if (intent.industry) return INDUSTRY_LABELS[intent.industry];
  if (intent.playbook) return `Playbook: ${humanizeTopic(intent.playbook)}`;
  return undefined;
}

/** The canonical service_interest value stored on the contact row and
    fed to lead intelligence: the resolved label, most specific first. */
export function intentServiceInterest(intent: ContactIntent): string | undefined {
  if (intent.service) return SERVICE_LABELS[intent.service];
  if (intent.platform) return PLATFORM_LABELS[intent.platform];
  if (intent.industry) return INDUSTRY_LABELS[intent.industry];
  return undefined;
}

export function humanizeTopic(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Flat record for dataLayer pushes and jsonb storage. */
export function intentToRecord(intent: ContactIntent): Record<string, string> {
  const out: Record<string, string> = {};
  if (intent.service) out.service = intent.service;
  if (intent.platform) out.platform = intent.platform;
  if (intent.industry) out.industry = intent.industry;
  if (intent.topic) out.topic = intent.topic;
  if (intent.playbook) out.playbook = intent.playbook;
  if (intent.reason) out.reason = intent.reason;
  if (intent.source) out.source = intent.source;
  return out;
}

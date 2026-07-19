import type { ContactIntent } from '@/lib/contact-intent';

/**
 * The smart-form question matrix. One stage question for anyone with a
 * project, plus a short focus checklist chosen by where the visitor
 * came from. Careers, partnership, and general questions get neither:
 * asking a job applicant about project timelines loses the applicant.
 */

export const STAGE_OPTIONS = [
  { value: 'exploring', label: 'Just exploring' },
  { value: 'scoping', label: 'Scoping it, need an estimate' },
  { value: 'live-project', label: 'Live project needs help' },
  { value: 'urgent', label: 'Something is broken right now' },
] as const;

export type StageValue = (typeof STAGE_OPTIONS)[number]['value'];

/** Focus options per service. Short, concrete, five max. */
const FOCUS_BY_SERVICE: Record<string, string[]> = {
  'data-engineering': ['Pipeline reliability', 'Cloud costs', 'Governance and lineage', 'AI-ready data', 'Migration'],
  'applied-ai-ml': ['Getting to production', 'Proving ROI', 'Data quality', 'Governance and risk', 'Agent workflows'],
  'cloud-modernization': ['Migration planning', 'Cloud costs', 'Legacy dependencies', 'Reliability', 'Security and compliance'],
  'martech-cdp': ['Identity resolution', 'Data silos', 'Campaign activation', 'Privacy compliance', 'Measurement'],
  'digital-transformation': ['Manual processes', 'System integration', 'Cost reduction', 'Process automation'],
  'managed-operations': ['Incident volume', 'Alert noise', 'Coverage gaps', 'Cost of downtime', 'SLA pressure'],
  'quality-engineering': ['Release confidence', 'Test automation', 'Performance', 'Flaky suites'],
  'cyber-security': ['Risk assessment', 'Compliance deadline', 'Incident response', 'Security operations'],
  'app-development': ['New product build', 'Legacy rewrite', 'Team capacity', 'Performance'],
  'advisory-strategy': ['Roadmap and architecture', 'Vendor selection', 'Cost review', 'AI strategy'],
  gcc: ['Setting up a center', 'Scaling a team', 'Transition planning', 'Cost model'],
};

/** Platforms borrow the focus list of the practice that owns them. */
const SERVICE_FOR_PLATFORM: Record<string, string> = {
  databricks: 'data-engineering',
  snowflake: 'data-engineering',
  aws: 'cloud-modernization',
  azure: 'cloud-modernization',
  gcp: 'cloud-modernization',
  salesforce: 'martech-cdp',
  braze: 'martech-cdp',
  'microsoft-dynamics': 'digital-transformation',
  sap: 'digital-transformation',
  servicenow: 'digital-transformation',
};

/** Industry pages get one cross-practice list. */
const FOCUS_FOR_INDUSTRY = [
  'Data platform',
  'AI and automation',
  'Customer experience',
  'Operations and reliability',
  'Compliance',
];

/** No intent at all, but they picked "project inquiry". */
const FOCUS_DEFAULT = ['Data platform', 'AI and ML', 'Cloud', 'Automation', 'Operations'];

/** Reasons that get the stage + focus questions. Everyone else just
    gets the message box. */
const PROJECT_REASONS = new Set(['project-inquiry', 'architecture-call']);

export function isProjectReason(reason: string): boolean {
  return PROJECT_REASONS.has(reason);
}

/** The focus checklist for this visitor, or null when asking would be
    noise (careers, partnership, general). */
export function focusOptionsFor(intent: ContactIntent, reason: string): string[] | null {
  if (!isProjectReason(reason)) return null;
  if (intent.service && FOCUS_BY_SERVICE[intent.service]) return FOCUS_BY_SERVICE[intent.service];
  if (intent.platform) {
    const svc = SERVICE_FOR_PLATFORM[intent.platform];
    if (svc && FOCUS_BY_SERVICE[svc]) return FOCUS_BY_SERVICE[svc];
  }
  if (intent.industry) return FOCUS_FOR_INDUSTRY;
  return FOCUS_DEFAULT;
}

export function stageLabel(value: string): string {
  return STAGE_OPTIONS.find((s) => s.value === value)?.label ?? value;
}

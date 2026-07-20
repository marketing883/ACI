/**
 * The canonical ACI Infotech "brain": one source of truth for who the
 * company is, what it sells, who it sells to, and what a strong lead
 * looks like. Both AI agents import from here so their knowledge can
 * never drift again:
 *   - Atheros (chat co-pilot) — src/lib/copilot/brand.ts + prompt.ts
 *   - Lead intelligence agent — src/lib/intelligence.ts (+ the admin
 *     on-demand route and the whitepaper nurture helper)
 *
 * Positioning and scale facts are anchored to the vetted /llms.txt
 * intro (src/app/llms.txt/route.ts), the current v4 site copy, and the
 * closed taxonomy in src/lib/contact-intent.ts. We deliberately do NOT
 * carry the older, unverified "80+/250+ Fortune 500 clients", "$1B+",
 * "95% retention" claims that had drifted across three copies of the
 * intelligence prompt: only facts the site actually states live here.
 *
 * Voice: plain, senior-engineer English. No em/en dashes, no hollow
 * amplifiers (see CLAUDE.md). Proof points are anonymized per the
 * site-wide "no client names" rule.
 */

// ---------------------------------------------------------------------
// Scale facts (from /llms.txt, the vetted canonical description)
// ---------------------------------------------------------------------
export const ACI_FACTS = {
  founded: 2006,
  headquarters: 'Somerset, New Jersey, United States',
  engineers: '1,200+',
  deliveryHubs: 11, // Somerset HQ + Atlanta, Dallas, Miami, London, Dubai, Noida, Hyderabad, Bangalore, Kuala Lumpur, Singapore
  projectsDelivered: '500+',
  website: 'https://aciinfotech.com',
} as const;

// One-paragraph positioning. Keep in sync with /llms.txt line 1 of the intro.
export const ACI_POSITIONING =
  'ACI Infotech is an enterprise data and AI engineering firm, headquartered in ' +
  'Somerset, New Jersey, with 1,200+ engineers across 11 global delivery hubs. ' +
  'Founded in 2006, ACI builds the enterprise data foundation, puts AI on top of ' +
  'it, and runs both in production. The work spans data engineering and lakehouse ' +
  'platforms, applied AI and GenAI, cloud modernization, MarTech and CDP (through ' +
  'the ACI Interactive division), cybersecurity, and 24/7 managed operations. ' +
  '500+ enterprise projects are documented as reusable playbooks. Forward-deployed ' +
  'AI engineering is delivered with strategic partner ArqAI through ArqAI Labs ' +
  '(https://thearq.ai). ACI stands behind the work with SLAs.';

// The one-line story used in short contexts.
export const ACI_TAGLINE =
  'Build the data foundation. Put AI on top. Run both in production.';

// ---------------------------------------------------------------------
// The 11 service practices (slugs match src/lib/contact-intent.ts and
// the /services/<slug> routes). oneLiner is the live nav copy.
// ---------------------------------------------------------------------
export interface Practice {
  slug: string;
  name: string;
  oneLiner: string;
  detail: string;
}

export const ACI_PRACTICES: Practice[] = [
  {
    slug: 'data-engineering',
    name: 'Data Engineering',
    oneLiner: 'Lakehouses that match the ledger',
    detail:
      'Governed lakehouses on Databricks or Snowflake, real-time pipelines, lineage and observability, and AI-ready data products.',
  },
  {
    slug: 'applied-ai-ml',
    name: 'Applied AI & ML',
    oneLiner: 'Copilots and agents that ship',
    detail:
      'GenAI copilots, agents, RAG, and ML that reach production with MLOps, evaluation, and governance, not just a demo.',
  },
  {
    slug: 'cloud-modernization',
    name: 'Cloud Modernization',
    oneLiner: 'Multi-cloud without the chaos',
    detail:
      'Migration and modernization across AWS, Azure, and Google Cloud, with cost control, reliability, and security built in.',
  },
  {
    slug: 'martech-cdp',
    name: 'MarTech & CDP',
    oneLiner: 'Customer data activated in real time',
    detail:
      'Composable CDP and MarTech on a governed identity spine (Salesforce, Adobe, Braze, Segment), delivered by the ACI Interactive division.',
  },
  {
    slug: 'digital-transformation',
    name: 'Digital Transformation',
    oneLiner: 'Intelligent process automation',
    detail:
      'Process automation across systems and teams on ServiceNow, SAP, UiPath, and Power Automate, with a human in the loop where it counts.',
  },
  {
    slug: 'cyber-security',
    name: 'Cyber Security',
    oneLiner: 'Security built in, not bolted on',
    detail:
      'Security engineering, cloud and data governance, compliance, and incident response wired into the platform from the start.',
  },
  {
    slug: 'app-development',
    name: 'App Development',
    oneLiner: 'Applications built to survive production',
    detail:
      'Product and platform engineering: applications built to run reliably at enterprise scale, not just pass a demo.',
  },
  {
    slug: 'quality-engineering',
    name: 'Quality Engineering',
    oneLiner: 'Quality built into every release',
    detail:
      'Test automation, performance engineering, and release confidence built into the delivery pipeline.',
  },
  {
    slug: 'advisory-strategy',
    name: 'Advisory & Strategy',
    oneLiner: 'Strategy grounded in delivery',
    detail:
      'Data, AI, and cloud strategy, architecture, and roadmaps from a team that also runs the build, so the plan survives contact with production.',
  },
  {
    slug: 'gcc',
    name: 'GCC & Captive Centers',
    oneLiner: 'Captive centers stood up, not outsourced',
    detail:
      'Global Capability Centers set up and scaled as an extension of the client, not an outsourcing arm.',
  },
  {
    slug: 'managed-operations',
    name: 'Managed Operations',
    oneLiner: '24/7 NOC and SOC coverage',
    detail:
      '24/7 run-and-operate under published SLAs: NOC and SOC coverage, DevOps, SRE, and monitoring for platforms that carry production.',
  },
];

// ---------------------------------------------------------------------
// Platforms and industries (labels from contact-intent.ts)
// ---------------------------------------------------------------------
export const ACI_PLATFORMS: string[] = [
  'Databricks', 'Snowflake', 'AWS', 'Microsoft Azure', 'Google Cloud',
  'Salesforce', 'SAP', 'ServiceNow', 'Microsoft Dynamics 365', 'Braze',
];

export const ACI_INDUSTRIES: string[] = [
  'Financial Services', 'Healthcare', 'Retail & Consumer', 'Manufacturing',
  'Energy & Utilities', 'Oil & Gas', 'Hospitality', 'Transportation & Logistics',
];

// ---------------------------------------------------------------------
// Proof (anonymized, from published case studies)
// ---------------------------------------------------------------------
export const ACI_PROOF: string[] = [
  '30% reduction in data latency on a governed lakehouse across 600+ retail locations',
  'Claims processing cut from 72 hours to 4 with AI document automation at a national healthcare provider',
  '90 days from prototype to production on an Azure lakehouse for a global financial services firm',
  '2.5x email engagement after MarTech was rebuilt on a governed identity spine',
  '99.97% uptime across 72+ servers under managed operations',
  'One data platform for 400,000 employees across 53 countries at a global food services operator',
  '0.1% error rate after end-to-end contract lifecycle automation',
];

// ---------------------------------------------------------------------
// Ideal Customer Profile + lead-scoring rubric (for the intelligence
// agent). Drafted from the site and case studies; refine as the sales
// motion sharpens.
// ---------------------------------------------------------------------
export const ACI_ICP = {
  summary:
    'Large enterprises (roughly $500M+ revenue, Fortune 1000 scale) with complex ' +
    'data estates, legacy systems, and a live data, AI, cloud, or MarTech initiative ' +
    'they need engineered and run in production.',
  strongIndustries: ACI_INDUSTRIES,
  buyerPersonas: [
    'CDO / Chief Data Officer', 'CTO', 'CIO', 'VP / Head of Data, Analytics, or Engineering',
    'CMO / VP Marketing (for MarTech & CDP)', 'Head of Cloud or Platform', 'CISO',
    'VP of Digital Transformation',
  ],
  triggerInitiatives: [
    'Data platform / lakehouse modernization', 'GenAI or ML into production',
    'Cloud migration or cost optimization', 'MarTech / CDP build or replatform',
    'Legacy modernization', 'Managed operations / SRE takeover', 'Standing up a GCC',
  ],
  fitSignals: [
    'Enterprise work email (not a personal domain)',
    'Senior title (Director level or above), or a clear decision-making role',
    'A named initiative, timeline, or budget signal',
    'A regulated or data-heavy industry from the strong-fit list',
    'Specific platforms named (Databricks, Snowflake, SAP, Salesforce, Azure, etc.)',
    'Scale or multi-system complexity (many locations, large data volumes, legacy estate)',
  ],
  disqualifiers: [
    'Personal email with no company context',
    'Student, job seeker, or recruiter',
    'Solo operator or very small business with no enterprise scale',
    'A vendor or competitor pitching services to ACI',
    'Off-topic request unrelated to data, AI, cloud, MarTech, or managed operations',
  ],
  dealShape:
    'Multi-month engagements, forward-deployed teams, and production ownership under ' +
    'SLAs, not one-off staff augmentation.',
} as const;

// leadScore (0-100) bands the intelligence agent should calibrate to.
export const ACI_SCORING_RUBRIC = [
  '80-100 (Hot): senior decision-maker at an enterprise in a strong-fit industry, with a named initiative plus a timeline or budget signal and a clear match to an ACI practice.',
  '60-79 (Warm): good-fit company and a relevant need, but mid-level contact or one missing signal (no timeline, no budget, or vague scope).',
  '40-59 (Nurture): plausible fit but early or exploratory, junior contact, or thin detail.',
  '0-39 (Low): poor fit, personal email with no company, off-ICP request, job seeker, vendor, or competitor.',
] as const;

// ---------------------------------------------------------------------
// Pre-formatted blocks for prompt injection. Agents import these so the
// exact same knowledge lands in every prompt.
// ---------------------------------------------------------------------

/** Company + services block for any system/analysis prompt. */
export function companyContextBlock(): string {
  const practices = ACI_PRACTICES.map((p) => `- ${p.name}: ${p.detail}`).join('\n');
  return [
    'ABOUT ACI INFOTECH',
    ACI_POSITIONING,
    '',
    `Founded ${ACI_FACTS.founded}. HQ ${ACI_FACTS.headquarters}. ${ACI_FACTS.engineers} engineers across ${ACI_FACTS.deliveryHubs} global delivery hubs. ${ACI_FACTS.projectsDelivered} enterprise projects.`,
    '',
    'THE 11 PRACTICES',
    practices,
    '',
    `PLATFORMS: ${ACI_PLATFORMS.join(', ')}.`,
    `INDUSTRIES: ${ACI_INDUSTRIES.join(', ')}.`,
    '',
    'ARQAI: ArqAI is ACI\'s strategic partner, not an internal product. Forward-deployed AI engineering is delivered together through ArqAI Labs (https://thearq.ai).',
    '',
    'PROOF (anonymized, never name clients):',
    ...ACI_PROOF.map((p) => `- ${p}`),
  ].join('\n');
}

/** ICP + scoring rubric block for the lead-intelligence agent. */
export function icpBlock(): string {
  return [
    'IDEAL CUSTOMER PROFILE',
    ACI_ICP.summary,
    `Strong-fit industries: ${ACI_ICP.strongIndustries.join(', ')}.`,
    `Buyer personas: ${ACI_ICP.buyerPersonas.join(', ')}.`,
    `Trigger initiatives: ${ACI_ICP.triggerInitiatives.join(', ')}.`,
    `Deal shape: ${ACI_ICP.dealShape}`,
    '',
    'FIT SIGNALS (raise the score):',
    ...ACI_ICP.fitSignals.map((s) => `- ${s}`),
    '',
    'DISQUALIFIERS (lower the score):',
    ...ACI_ICP.disqualifiers.map((s) => `- ${s}`),
    '',
    'LEAD SCORE RUBRIC (0-100):',
    ...ACI_SCORING_RUBRIC.map((s) => `- ${s}`),
  ].join('\n');
}

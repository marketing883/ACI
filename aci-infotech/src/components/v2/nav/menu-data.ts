/**
 * Shared data for the v2 mega menus.
 *
 * The shape mirrors NAV_DATA from the v1 Navigation.tsx but adds the
 * richer per-item fields the v2 menus surface (tagline, key outcomes,
 * capability hints). We copy here rather than import from v1 so the
 * v2 menu system can evolve independently of the v1 nav.
 */

export interface ServiceMenuItem {
  label: string;
  href: string;
  /** Short one-liner used in the menu list. */
  description: string;
  /** Preview-panel elements — used by ServicesMenu's live preview. */
  tagline?: string;
  keyOutcomes?: string[];
}

export const SERVICES: ServiceMenuItem[] = [
  {
    label: 'Applied AI & GenAI',
    href: '/services/applied-ai-ml',
    description: 'Copilots and agents that ship',
    tagline: 'From first RAG to production with evaluation harnesses.',
    keyOutcomes: [
      'Production copilots, agents, and document intelligence',
      'Model drift caught in hours, not quarters',
      '90 days from RAG prototype to production',
    ],
  },
  {
    label: 'Cloud & Infrastructure',
    href: '/services/cloud-modernization',
    description: 'Multi-cloud without the chaos',
    tagline: 'Landing zones, FinOps, and migrations off legacy stacks.',
    keyOutcomes: [
      'Cutovers from VMware, Hadoop, and mainframe',
      'Runbooks your SRE actually opens',
      'Multi-cloud with zero vendor lock-in',
    ],
  },
  {
    label: 'Data & Analytics',
    href: '/services/data-engineering',
    description: 'Lakehouses that match the ledger',
    tagline: 'Streaming and batch on one plane, governance that passes audit.',
    keyOutcomes: [
      'Lakehouse architectures in 10 weeks',
      '2M+ events per second in production',
      'Lineage and governance as first-class features',
    ],
  },
  {
    label: 'MarTech & CDP',
    href: '/services/martech-cdp',
    description: 'Customer data activated in real time',
    tagline: 'Unified identity, segments that refresh with the event.',
    keyOutcomes: [
      'Real-time activation across marketing cloud, paid, and owned',
      'Segments that refresh with the event, not the batch',
      'Measured lift on engagement metrics',
    ],
  },
  {
    label: 'Platform Engineering',
    href: '/services/app-development',
    description: 'Golden paths engineers adopt',
    tagline: 'Internal developer platforms without the governance theater.',
    keyOutcomes: [
      'Commit-to-prod lead time in hours',
      'Backstage, Kubernetes, ArgoCD as the backbone',
      'Self-service scaffolders with built-in compliance',
    ],
  },
  {
    label: 'Digital & Experience',
    href: '/services/digital-transformation',
    description: 'Composable commerce and content',
    tagline: 'Headless storefronts and edge personalization for retailers and banks.',
    keyOutcomes: [
      'LCP p75 under 1.2 seconds',
      'Edge personalization without cache headaches',
      'Design systems that ship in 14 markets',
    ],
  },
  {
    label: 'Cyber & Trust',
    href: '/services/cyber-security',
    description: 'Security built in, not bolted on',
    tagline: 'Zero-trust, compliance readiness, and threat response.',
    keyOutcomes: [
      'SOC 2, ISO 27001, HIPAA, and PCI readiness',
      'Incident response runbooks ready for day one',
      'MTTR under four hours, measured and enforced',
    ],
  },
  {
    label: 'Managed Services',
    href: '/services/managed-operations',
    description: '24/7 NOC and SOC coverage',
    tagline: 'Follow-the-sun operations on the platforms you already run.',
    keyOutcomes: [
      'NOC on SolarWinds, Datadog, Dynatrace',
      'SOC on LogRhythm, Splunk, Sentinel',
      'One escalation path across both centers',
    ],
  },
  {
    label: 'Advisory & Strategy',
    href: '/services/advisory-strategy',
    description: 'Strategy grounded in delivery',
    tagline: 'Advisors arrive with the engineers who will build the plan.',
    keyOutcomes: [
      'Written plan in 48 hours, not six weeks',
      'Build pod ready to ship in two weeks',
      'Outcomes measured, not slides delivered',
    ],
  },
  {
    label: 'GCC & Captive Ops',
    href: '/services/gcc',
    description: 'Captive centers stood up, not outsourced',
    tagline: 'Your team, run from India or LatAm, on a documented BOT path.',
    keyOutcomes: [
      'First pod live in 90 days, entity and all',
      'Hiring, facilities, IT, and governance in one engagement',
      'Build-operate-transfer onto your payroll when you are ready',
    ],
  },
];

// ------------------------------------------------------------------

export interface PlatformMenuItem {
  label: string;
  href: string;
  /** Capability line shown below the logo. */
  capability: string;
}

export interface PlatformCategory {
  id: string;
  label: string;
  items: PlatformMenuItem[];
}

export const PLATFORM_CATEGORIES: PlatformCategory[] = [
  {
    id: 'data',
    label: 'Data',
    items: [
      {
        label: 'Databricks',
        href: '/platforms/databricks',
        capability: 'Lakehouse + ML runtime',
      },
      {
        label: 'Snowflake',
        href: '/platforms/snowflake',
        capability: 'Data cloud, Snowpark, AI',
      },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud',
    items: [
      {
        label: 'AWS',
        href: '/platforms/aws',
        capability: 'Landing zones, FinOps, cutovers',
      },
      {
        label: 'Azure',
        href: '/platforms/azure',
        capability: 'Landing zones, OpenAI, AI',
      },
    ],
  },
  {
    id: 'enterprise',
    label: 'Enterprise',
    items: [
      {
        label: 'SAP',
        href: '/platforms/sap',
        capability: 'S/4HANA, BTP, integration',
      },
      {
        label: 'ServiceNow',
        href: '/platforms/servicenow',
        capability: 'ITSM, HRSD, workflow',
      },
      {
        label: 'Microsoft Dynamics',
        href: '/platforms/microsoft-dynamics',
        capability: 'ERP + CRM',
      },
    ],
  },
  {
    id: 'customer',
    label: 'Customer',
    items: [
      {
        label: 'Salesforce',
        href: '/platforms/salesforce',
        capability: 'CDP, Marketing Cloud, Agentforce',
      },
      {
        label: 'Braze',
        href: '/platforms/braze',
        capability: 'Cross-channel orchestration',
      },
    ],
  },
];

// ------------------------------------------------------------------

export interface IndustryMenuItem {
  label: string;
  href: string;
  /** Slug used to match a featured case study from Supabase. */
  slug: string;
}

export const INDUSTRIES: IndustryMenuItem[] = [
  { label: 'Financial Services', href: '/industries/financial-services', slug: 'financial-services' },
  { label: 'Healthcare', href: '/industries/healthcare', slug: 'healthcare' },
  { label: 'Retail & Consumer', href: '/industries/retail', slug: 'retail' },
  { label: 'Hospitality', href: '/industries/hospitality', slug: 'hospitality' },
  { label: 'Manufacturing', href: '/industries/manufacturing', slug: 'manufacturing' },
  { label: 'Energy & Utilities', href: '/industries/energy', slug: 'energy' },
  { label: 'Transportation', href: '/industries/transportation', slug: 'transportation' },
];

/**
 * Fallback featured engagement shown in the Industries mega menu when
 * the CMS fetcher does not return a matching case study for the
 * hovered industry. Kept local so the menu always has substance, even
 * in local dev without CMS credentials.
 */
export interface IndustryFeature {
  clientDescriptor: string;
  headline: string;
  metric: { value: string; label: string };
  href: string;
}

export const INDUSTRY_FEATURES: Record<string, IndustryFeature> = {
  'financial-services': {
    clientDescriptor: 'Fortune 500 Financial Services Client',
    headline: 'SAP finance transformation with 67% faster allocations.',
    metric: { value: '$500K', label: 'Annual operational savings' },
    href: '/case-studies',
  },
  healthcare: {
    clientDescriptor: 'US healthcare network',
    headline: 'HIPAA-compliant data platform on Azure.',
    metric: { value: '100%', label: 'Audit pass rate' },
    href: '/case-studies',
  },
  retail: {
    clientDescriptor: 'Fortune 500 Retail Client',
    headline: 'Databricks modernization across 500 locations.',
    metric: { value: '$4.2M', label: 'Annual operational savings' },
    href: '/case-studies',
  },
  hospitality: {
    clientDescriptor: 'Fortune 500 Hospitality Client',
    headline: 'Unified data platform across global operations.',
    metric: { value: '$4.7M', label: 'Annual procurement savings' },
    href: '/case-studies',
  },
  manufacturing: {
    clientDescriptor: 'Global CPG & F&B leader',
    headline: 'Self-service analytics for brand managers.',
    metric: { value: '75%', label: 'Fewer IT requests' },
    href: '/case-studies',
  },
  energy: {
    clientDescriptor: 'Regional utility',
    headline: 'Grid data platform with regulatory reporting.',
    metric: { value: '99.5%', label: 'Platform reliability' },
    href: '/case-studies',
  },
  transportation: {
    clientDescriptor: 'Fleet operator',
    headline: 'Real-time logistics analytics at scale.',
    metric: { value: '22%', label: 'Fewer empty miles' },
    href: '/case-studies',
  },
};

// ------------------------------------------------------------------

export interface ResourceMenuItem {
  /** Category label rendered as the eyebrow above the feature card. */
  eyebrow: string;
  /** Index-page href — where "see all X" goes. */
  indexHref: string;
  /** CTA text for the feature card. */
  cta: string;
}

export const RESOURCES: Record<'playbooks' | 'work' | 'whitepapers' | 'insights', ResourceMenuItem> = {
  playbooks: {
    eyebrow: 'Playbooks',
    indexHref: '/playbooks',
    cta: 'Read the playbook',
  },
  work: {
    eyebrow: 'Work',
    indexHref: '/case-studies',
    cta: 'See the engagement',
  },
  whitepapers: {
    eyebrow: 'Whitepapers',
    indexHref: '/whitepapers',
    cta: 'Download',
  },
  insights: {
    eyebrow: 'Insights',
    indexHref: '/blogs',
    cta: 'Read',
  },
};

// ------------------------------------------------------------------

export interface CompanyMenuItem {
  label: string;
  href: string;
  /** Short supporting line rendered in the list. */
  description: string;
}

export const COMPANY: CompanyMenuItem[] = [
  { label: 'About', href: '/about', description: 'Who we are and why we build' },
  { label: 'Careers', href: '/careers', description: 'Current open positions' },
  { label: 'News', href: '/news', description: 'Press and partnerships' },
];

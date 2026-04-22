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
    label: 'Data Engineering',
    href: '/services/data-engineering',
    description: 'Platforms that feed AI and analytics',
    tagline: 'Lakehouses, event streams, quality gates.',
    keyOutcomes: [
      'Lakehouse architectures in 10 weeks',
      '2M+ events per hour in production',
      'Governance and lineage as first-class features',
    ],
  },
  {
    label: 'Applied AI & ML',
    href: '/services/applied-ai-ml',
    description: 'From GenAI pilots to production ML',
    tagline: 'Copilots, agents, and document intelligence that ship.',
    keyOutcomes: [
      'Production copilots with evaluation harnesses',
      'Agentic systems for regulated enterprises',
      'Model drift caught in hours, not quarters',
    ],
  },
  {
    label: 'Cloud Modernization',
    href: '/services/cloud-modernization',
    description: 'Multi-cloud without the chaos',
    tagline: 'Landing zones, FinOps, migrations off legacy stacks.',
    keyOutcomes: [
      'Cutovers from VMware, Hadoop, and mainframe',
      'Runbooks your SRE actually opens',
      'Multi-cloud with zero vendor lock-in',
    ],
  },
  {
    label: 'MarTech & CDP',
    href: '/services/martech-cdp',
    description: 'Customer 360 that actually works',
    tagline: 'Unified customer data for real-time marketing.',
    keyOutcomes: [
      'Real-time signals, not batch exports',
      'Personalization at enterprise scale',
      'Measured lift on engagement metrics',
    ],
  },
  {
    label: 'Digital Transformation',
    href: '/services/digital-transformation',
    description: 'Intelligent process automation',
    tagline: 'Workflow automation with ServiceNow, Dynamics, and RPA.',
    keyOutcomes: [
      'Processes automated end to end',
      'Integration across legacy and modern',
      'Measurable reduction in manual work',
    ],
  },
  {
    label: 'App Development',
    href: '/services/app-development',
    description: 'Applications built to survive production',
    tagline: 'Production web and mobile apps with SLAs.',
    keyOutcomes: [
      'Next.js, .NET, Node, and Python at scale',
      '99.5% uptime SLAs',
      'Security and accessibility as defaults',
    ],
  },
  {
    label: 'Quality Engineering',
    href: '/services/quality-engineering',
    description: 'Quality, engineered in.',
    tagline: 'Testing strategy that scales with your release cadence.',
    keyOutcomes: [
      'Shift-left pipelines with Playwright and k6',
      'Regression caught before staging',
      'Performance baselines locked in CI',
    ],
  },
  {
    label: 'Cyber Security',
    href: '/services/cyber-security',
    description: 'Security built in, not bolted on',
    tagline: 'Zero-trust, compliance, and threat response.',
    keyOutcomes: [
      'SOC 2, ISO 27001, HIPAA, and PCI readiness',
      'Incident response runbooks ready for day one',
      'Security built into the delivery pipeline',
    ],
  },
  {
    label: 'Managed Operations',
    href: '/services/managed-operations',
    description: '24/7 NOC and SOC coverage',
    tagline: 'Follow-the-sun operations on the platforms you already run.',
    keyOutcomes: [
      'NOC on SolarWinds, Datadog, Dynatrace',
      'SOC on LogRhythm, Splunk, Sentinel',
      'One escalation path across both centers',
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

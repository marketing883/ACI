// Content + nav data for the v3 "Data and AI" homepage preview.
// Authored against the messaging spine: data and AI paired, outcome
// and industry led, plain voice, every claim backed by a number.
// Proof figures match the locked hero in ACIHomepageContent.md.

export type NavLink = { label: string; href: string; note?: string };

export type NavColumn = {
  heading: string;
  links: NavLink[];
};

export type NavItem = {
  label: string;
  href: string;
  columns?: NavColumn[];
  feature?: { kicker: string; title: string; body: string; href: string };
};

// ---- Hero -----------------------------------------------------------

export const hero = {
  eyebrow: 'Data + AI, in production',
  // Authored two-line headline so it never widows.
  headlineTop: 'From data foundation',
  headlineBottom: 'to AI outcomes.',
  subhead:
    'We engineer the data foundation, build the AI on top, and run it in production. Most enterprise AI stalls before it gets there.',
  primaryCta: { label: 'Get in touch', href: '/contact' },
  secondaryCta: { label: 'See the work', href: '/case-studies' },
};

// ---- Proof bar ------------------------------------------------------

export type Proof = {
  // value is split so the counter animates the number and keeps the
  // prefix/suffix static. The DOM renders the final value, so no-JS
  // and SSR show the real figure.
  prefix?: string;
  value: number;
  suffix?: string;
  label: string;
};

export const proofs: Proof[] = [
  { value: 250, suffix: '+', label: 'Systems in production' },
  { prefix: '$', value: 1, suffix: 'B+', label: 'Value delivered' },
  { value: 95, suffix: '%', label: 'Client retention' },
  { value: 20, suffix: ' yrs', label: 'Fortune 500 work' },
];

export const partners = [
  'Databricks',
  'Snowflake',
  'AWS',
  'Azure',
  'Google Cloud',
  'SAP',
  'ServiceNow',
  'Salesforce',
];

// ---- Data + AI pairing (the wedge) ---------------------------------

export const wedge = {
  eyebrow: 'The pairing',
  title: ['The AI works because', 'the data is ready.'],
  body: 'Most enterprise AI fails on data that was never built for it. We engineer the foundation and build the AI on top, so it ships and runs. Few firms can honestly say they do both at production scale and prove it.',
  steps: [
    {
      no: '01',
      title: 'Data, made AI-ready',
      body: 'We unify, model, and govern the data the AI depends on. Lakehouse, warehouse, and pipelines built for scale.',
    },
    {
      no: '02',
      title: 'AI, built on top',
      body: 'Predictive and generative systems wired into the operation, not a demo deck. Evaluated, grounded, and shipped.',
    },
    {
      no: '03',
      title: 'Run in production',
      body: 'Past the pilot, into the live environment, with the same security and change discipline as anything else you run.',
    },
  ],
};

// ---- Industry outcomes ---------------------------------------------

export type Industry = {
  name: string;
  href: string;
  promise: string;
  metricValue: number;
  metricPrefix?: string;
  metricSuffix?: string;
  metricLabel: string;
  proof: string;
};

export const industries: Industry[] = [
  {
    name: 'Financial Services',
    href: '/industries/financial-services',
    promise: 'Real-time finance and reporting, modernized without downtime.',
    metricValue: 67,
    metricSuffix: '%',
    metricLabel: 'Faster allocation processing',
    proof: 'SAP finance modernization, zero-downtime migration.',
  },
  {
    name: 'Retail & Convenience',
    href: '/industries/retail',
    promise: 'Decisions in hours, not days, across every store.',
    metricValue: 73,
    metricSuffix: '%',
    metricLabel: 'Fewer stockouts',
    proof: '$4.2M saved across 500+ locations on Databricks.',
  },
  {
    name: 'CPG',
    href: '/industries/retail',
    promise: 'Self-service intelligence in the hands of brand managers.',
    metricValue: 94,
    metricSuffix: '%',
    metricLabel: 'Adoption',
    proof: 'Campaign analysis from 3 weeks to 4 hours.',
  },
  {
    name: 'Hospitality & Facilities',
    href: '/industries/hospitality',
    promise: 'One view of data across every country you operate in.',
    metricValue: 34,
    metricLabel: 'Countries unified',
    proof: '78% faster processing, $4.7M procurement savings.',
  },
  {
    name: 'Manufacturing & Supply Chain',
    href: '/industries/manufacturing',
    promise: 'End-to-end visibility and forecasting you can act on.',
    metricValue: 100,
    metricSuffix: '%',
    metricLabel: 'Supply chain visibility',
    proof: '25% cost reduction across the network.',
  },
];

// ---- CTA ------------------------------------------------------------

export const cta = {
  eyebrow: 'Start here',
  title: ['Tell us what', 'you need built.'],
  body: 'Bring the outcome you are after. We map the operation, build the data and AI to reach it, and run it in production.',
  primary: { label: 'Tell us what you need built', href: '/contact' },
  secondary: { label: 'See the work', href: '/case-studies' },
};

// ---- Footer ---------------------------------------------------------

export const footerBoilerplate =
  'ACI Infotech is an engineering services firm for enterprises. We design, build, and run production data platforms, cloud infrastructure, and AI systems for Fortune 500 companies across financial services, healthcare, retail, and manufacturing.';

// ---- Navigation (mega menu) ----------------------------------------

export const navItems: NavItem[] = [
  {
    label: 'Services',
    href: '/services',
    columns: [
      {
        heading: 'Data + AI',
        links: [
          { label: 'Data Engineering', href: '/services/data-engineering' },
          { label: 'Applied AI & ML', href: '/services/applied-ai-ml' },
        ],
      },
      {
        heading: 'Foundation',
        links: [
          { label: 'Cloud Modernization', href: '/services/cloud-modernization' },
          { label: 'MarTech & CDP', href: '/services/martech-cdp' },
          { label: 'Digital Transformation', href: '/services/digital-transformation' },
          { label: 'App Development', href: '/services/app-development' },
        ],
      },
      {
        heading: 'Run it',
        links: [
          { label: 'Quality Engineering', href: '/services/quality-engineering' },
          { label: 'Cyber Security', href: '/services/cyber-security' },
          { label: 'Managed Operations', href: '/services/managed-operations' },
          { label: 'Advisory & Strategy', href: '/services/advisory-strategy' },
          { label: 'GCC & Captive Ops', href: '/services/gcc' },
        ],
      },
    ],
    feature: {
      kicker: 'The pairing',
      title: 'Data and AI, together',
      body: 'The AI works only when the data under it is ready. We build both.',
      href: '/services',
    },
  },
  {
    label: 'Industries',
    href: '/industries',
    columns: [
      {
        heading: 'Sectors',
        links: [
          { label: 'Financial Services', href: '/industries/financial-services' },
          { label: 'Retail & Consumer', href: '/industries/retail' },
          { label: 'Healthcare & Life Sciences', href: '/industries/healthcare' },
          { label: 'Hospitality & Food Services', href: '/industries/hospitality' },
        ],
      },
      {
        heading: 'More',
        links: [
          { label: 'Manufacturing', href: '/industries/manufacturing' },
          { label: 'Energy & Utilities', href: '/industries/energy' },
          { label: 'Transportation & Logistics', href: '/industries/transportation' },
        ],
      },
    ],
    feature: {
      kicker: 'Outcome led',
      title: 'We start with your outcome',
      body: 'We map the operation first, then build for the result you need.',
      href: '/industries',
    },
  },
  {
    label: 'Platforms',
    href: '/platforms',
    columns: [
      {
        heading: 'Data',
        links: [
          { label: 'Databricks', href: '/platforms/databricks' },
          { label: 'Snowflake', href: '/platforms/snowflake' },
          { label: 'SAP', href: '/platforms/sap' },
        ],
      },
      {
        heading: 'Cloud',
        links: [
          { label: 'AWS', href: '/platforms/aws' },
          { label: 'Microsoft Azure', href: '/platforms/azure' },
          { label: 'Google Cloud', href: '/platforms/gcp' },
        ],
      },
      {
        heading: 'Apps',
        links: [
          { label: 'Salesforce', href: '/platforms/salesforce' },
          { label: 'Microsoft Dynamics', href: '/platforms/microsoft-dynamics' },
          { label: 'ServiceNow', href: '/platforms/servicenow' },
          { label: 'Braze', href: '/platforms/braze' },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    href: '/blogs',
    columns: [
      {
        heading: 'Read',
        links: [
          { label: 'Blog', href: '/blogs' },
          { label: 'Case Studies', href: '/case-studies' },
          { label: 'News & Press', href: '/news' },
        ],
      },
      {
        heading: 'Download',
        links: [
          { label: 'Whitepapers', href: '/whitepapers' },
          { label: 'Playbooks', href: '/playbooks' },
        ],
      },
    ],
  },
  {
    label: 'Company',
    href: '/about',
    columns: [
      {
        heading: 'ACI',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Careers', href: '/careers' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
  },
];

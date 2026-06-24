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
  image: string;
};

// Unsplash placeholders, vibrant + relevant. V3Image falls back to a
// blue/lime gradient if any URL fails, so a bad link never breaks the
// layout. Swap these for curated/licensed art before go-live.
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=70`;

export const industries: Industry[] = [
  {
    name: 'Financial Services',
    href: '/industries/financial-services',
    promise: 'Real-time finance and reporting, modernized without downtime.',
    metricValue: 67,
    metricSuffix: '%',
    metricLabel: 'Faster allocation processing',
    proof: 'SAP finance modernization, zero-downtime migration.',
    image: UNSPLASH('photo-1460925895917-afdab827c52f'),
  },
  {
    name: 'Retail & Convenience',
    href: '/industries/retail',
    promise: 'Decisions in hours, not days, across every store.',
    metricValue: 73,
    metricSuffix: '%',
    metricLabel: 'Fewer stockouts',
    proof: '$4.2M saved across 500+ locations on Databricks.',
    image: UNSPLASH('photo-1441986300917-64674bd600d8'),
  },
  {
    name: 'CPG',
    href: '/industries/retail',
    promise: 'Self-service intelligence in the hands of brand managers.',
    metricValue: 94,
    metricSuffix: '%',
    metricLabel: 'Adoption',
    proof: 'Campaign analysis from 3 weeks to 4 hours.',
    image: UNSPLASH('photo-1542744173-8e7e53415bb0'),
  },
  {
    name: 'Hospitality & Facilities',
    href: '/industries/hospitality',
    promise: 'One view of data across every country you operate in.',
    metricValue: 34,
    metricLabel: 'Countries unified',
    proof: '78% faster processing, $4.7M procurement savings.',
    image: UNSPLASH('photo-1414235077428-338989a2e8c0'),
  },
  {
    name: 'Manufacturing & Supply Chain',
    href: '/industries/manufacturing',
    promise: 'End-to-end visibility and forecasting you can act on.',
    metricValue: 100,
    metricSuffix: '%',
    metricLabel: 'Supply chain visibility',
    proof: '25% cost reduction across the network.',
    image: UNSPLASH('photo-1581091226825-a6a2a5aee158'),
  },
];

// ---- Value pillars --------------------------------------------------

export type Pillar = { no: string; title: string; body: string };

export const pillars: Pillar[] = [
  {
    no: '01',
    title: 'Data and AI, together',
    body: 'The AI works only when the data under it is ready, and we are the ones who engineer it to be. That pairing is the whole point, not two separate menus.',
  },
  {
    no: '02',
    title: 'We start with your outcome',
    body: 'We map the operation first, by industry, then build for the result you need. Not a generic platform you have to grow into.',
  },
  {
    no: '03',
    title: 'We ship it and run it',
    body: 'Past the pilot, into the live environment, with the same security and change discipline as anything else you run.',
  },
  {
    no: '04',
    title: 'We have the receipts',
    body: '250+ systems in production. $1B+ delivered. 95% client retention across 20 years of Fortune 500 work.',
  },
];

export const pillarsHead = {
  eyebrow: 'How we work',
  title: ['Data and AI are the work.', 'Everything else keeps it running.'],
  body: 'Cloud, platform engineering, integration, and managed operations are the foundation underneath. We build all of it, so what we ship stays shipped.',
  featureImage: UNSPLASH('photo-1451187580459-43490279c0fa'),
  featureKicker: 'In production',
  featureTitle: 'Built to survive the 2am call',
  featureBody:
    'We do not hand off a slide deck. We run what we build, with SLAs and on-call, the same way you run the rest of your stack.',
};

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

/**
 * Homepage success-story content, in a server-safe module.
 *
 * This lives outside V5SuccessStories.tsx because that file is a client
 * component, and every export of a `'use client'` module reaches a
 * Server Component as a client-reference proxy rather than the value:
 * `SUCCESS_STORY_SCHEMA.map` threw here, and `SUCCESS_STORY_SLUGS.length`
 * was quietly `undefined`, so the homepage's CMS metric lookup ran with a
 * proxy for its slug list and fell through to the hard-coded numbers.
 * Plain data belongs on this side of the boundary; both the page and the
 * component import it from here.
 */

import {
  Database,
  BrainCircuit,
  ServerCog,
  Boxes,
  ShieldCheck,
  Table2,
  GitBranch,
  Activity,
  Landmark,
  ArrowRightLeft,
  Radar,
  Siren,
  type LucideIcon,
} from 'lucide-react';

export type Story = {
  id: string;
  tab: string;
  Icon: LucideIcon;
  eyebrow: string;
  title: string;
  metric: string;
  metricLabel: string;
  summary: string;
  tags: Tag[];
  cta: string;
  href: string;
  video: string;
  webm: string;
};

export type StoryFacts = Record<string, { metricValue: string | null; metricLabel: string | null }>;

/** A stack chip. Named products carry their own mark; capabilities that
 *  are not a product (CI/CD, NOC, Migration) carry a line glyph, because
 *  the case studies behind those two stories name capabilities rather
 *  than vendors and we do not invent a logo to fill the row. */
export type Tag = { label: string; logo?: string; Glyph?: LucideIcon };

const AZURE = '/brand/azure-glyph.svg';
const DATABRICKS = '/brand/tech/databricks.svg';
const KUBERNETES = '/brand/tech/kubernetes.svg';
const SAP = '/brand/sap-glyph.svg';

export const STORIES: Story[] = [
  {
    id: 'data-velocity',
    tab: 'Data velocity',
    Icon: Database,
    eyebrow: 'Retail / Data engineering',
    title: 'Retail data, rebuilt for operational speed.',
    metric: '87%',
    metricLabel: 'reduction in data-processing time',
    summary:
      'ACI replaced fragmented pipelines with a governed Databricks lakehouse, moving critical analytics from days to hours.',
    tags: [
      { label: 'Azure', logo: AZURE },
      { label: 'Databricks', logo: DATABRICKS },
      { label: 'Delta Lake', Glyph: Table2 },
    ],
    cta: 'Read the Databricks story',
    href: '/case-studies/databricks-modernization-ai-enablement-for-leading-c-store-chain',
    video: '/assets/success-stories/data-velocity.mp4',
    webm: '/assets/success-stories/data-velocity.webm',
  },
  {
    id: 'ai-in-production',
    tab: 'AI in production',
    Icon: BrainCircuit,
    eyebrow: 'Financial services / Applied AI',
    title: 'A lakehouse that moves models into production faster.',
    metric: '90d',
    metricLabel: 'from prototype to production',
    summary:
      'ACI connected Azure Data Lake, Databricks, AKS, and Synapse into a governed foundation for analytics and machine learning.',
    tags: [
      { label: 'Azure', logo: AZURE },
      { label: 'Databricks', logo: DATABRICKS },
      { label: 'Kubernetes', logo: KUBERNETES },
    ],
    cta: 'Read the Azure Lakehouse story',
    href: '/case-studies/driving-enterprise-data-transformation-with-aci-s-azure-lakehouse',
    video: '/assets/success-stories/decision-intelligence.mp4',
    webm: '/assets/success-stories/decision-intelligence.webm',
  },
  {
    id: 'reliable-scale',
    tab: 'Reliable scale',
    Icon: ServerCog,
    eyebrow: 'Technology / DevOps and platform',
    title: 'A complex digital estate, engineered to stay available.',
    metric: '99.97%',
    metricLabel: 'system uptime across 72+ servers',
    summary:
      'Automated CI/CD, monitoring, load balancing, and centralized logs helped releases move faster without disrupting operations.',
    tags: [
      { label: 'CI/CD', Glyph: GitBranch },
      { label: 'Monitoring', Glyph: Activity },
      { label: 'Platform ops', Glyph: ServerCog },
    ],
    cta: 'Read the DevOps story',
    href: '/case-studies/optimizing-enterprise-it-operations-with-automated-devops-and-monitoring',
    video: '/assets/success-stories/reliable-scale.mp4',
    webm: '/assets/success-stories/reliable-scale.webm',
  },
  {
    id: 'erp-modernization',
    tab: 'ERP modernization',
    Icon: Boxes,
    eyebrow: 'Financial services / SAP S/4HANA',
    title: 'Finance reporting, rebuilt on S/4HANA.',
    metric: '67%',
    metricLabel: 'less allocation processing time',
    summary:
      'ACI moved a global investment firm onto SAP S/4HANA and rebuilt its allocation and reporting run, migrating with zero downtime.',
    tags: [
      { label: 'SAP S/4HANA', logo: SAP },
      { label: 'Finance', Glyph: Landmark },
      { label: 'Migration', Glyph: ArrowRightLeft },
    ],
    cta: 'Read the SAP S/4HANA story',
    href: '/case-studies/modernizes-finance-reporting-with-sap-transformation',
    video: '/assets/success-stories/intelligent-operations.mp4',
    webm: '/assets/success-stories/intelligent-operations.webm',
  },
  {
    id: 'noc-soc',
    tab: 'NOC and SOC',
    Icon: ShieldCheck,
    eyebrow: 'Banking / Infrastructure and security operations',
    title: 'Reactive IT put under constant watch.',
    metric: '68%',
    metricLabel: 'less network downtime',
    summary:
      'ACI placed a Fortune 500 bank estate under proactive NOC and SOC monitoring, holding 99.94% uptime and taking $4.7M a year out of IT cost.',
    tags: [
      { label: 'NOC', Glyph: Radar },
      { label: 'SOC', Glyph: Siren },
      { label: 'Monitoring', Glyph: Activity },
    ],
    cta: 'Read the infrastructure story',
    href: '/case-studies/transforming-reactive-it-into-strategic-advantage-with-aci',
    video: '/assets/success-stories/noc-soc.mp4',
    webm: '/assets/success-stories/noc-soc.webm',
  },
];

export const SUCCESS_STORY_SLUGS = STORIES.map((s) => s.href.split('/').pop() as string);

/** The stories as the page states them, for the homepage's ItemList
 *  JSON-LD. Exported from here rather than restated in the page so the
 *  schema and the cards can never claim different numbers. Live CMS
 *  metrics override `metric` at render time; these are the fallbacks
 *  the cards themselves fall back to. */
export const SUCCESS_STORY_SCHEMA = STORIES.map((s) => ({
  name: s.title,
  description: s.summary,
  path: s.href,
  metric: s.metric,
  metricLabel: s.metricLabel,
  about: s.eyebrow,
}));

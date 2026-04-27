/**
 * Ten services for the ServicesDial. Wording follows the editorial
 * homepage framing (italic emphasis word, "X & Y" shape). The ten
 * entries here and the ten items in the nav mega menu track each
 * other. ASCII diagrams preserve the "live terminal" feel — they
 * are rendered inside a <pre> with mono font.
 *
 * The `emphasis` field is the italicized word inside the title. The
 * title is rendered as a React fragment with the emphasis styled
 * differently from the surrounding text.
 */

export interface ServiceDefinition {
  id: string;
  index: string;
  tag: string;
  status: string;
  title: string;
  /** The italic word or phrase inside the row title (e.g. "AI", "Engineering"). */
  emphasis: string;
  /** What goes before the emphasis (e.g. "Applied "). */
  titlePrefix: string;
  /** What goes after the emphasis in the row title (e.g. " & GenAI"). */
  titleSuffix?: string;
  desc: string;
  stats: { value: string; label: string }[];
  stack: string[];
  /** Plain-text ASCII diagram. Rendered inside <pre>. */
  diagram: string;
}

export const SERVICES: ServiceDefinition[] = [
  {
    id: 'ai',
    index: '01',
    tag: '/ AI-ENG · CAPABILITY',
    status: 'live · 12 engagements',
    title: 'Applied AI & GenAI',
    titlePrefix: 'Applied ',
    emphasis: 'AI',
    titleSuffix: ' & GenAI',
    desc:
      'Production copilots, agentic systems, and document intelligence. From first RAG to running in production with evaluation harnesses that catch model drift in hours rather than audits.',
    stats: [
      { value: '12', label: 'Live engagements' },
      { value: '94%', label: 'Eval pass rate' },
      { value: '90d', label: 'RAG to prod' },
    ],
    stack: ['LangGraph', 'LlamaIndex', 'vLLM', 'Bedrock', 'Azure OpenAI', 'Weaviate', 'Ragas'],
    diagram: `ingest ──▶ retrieve + rerank ──▶ generate
                                    │
                                    ▼
                          eval · guardrails`,
  },
  {
    id: 'cloud',
    index: '02',
    tag: '/ CLOUD · CAPABILITY',
    status: 'live · 140+ clusters',
    title: 'Cloud & Infrastructure',
    titlePrefix: 'Cloud ',
    emphasis: '&',
    titleSuffix: ' Infrastructure',
    desc:
      'Landing zones, migrations, and FinOps programs across AWS, Azure, and GCP. Cutovers from VMware, Hadoop, and mainframe environments, handed over with a runbook your SRE actually opens.',
    stats: [
      { value: '140+', label: 'Clusters managed' },
      { value: '$18M', label: 'Annual takeout' },
      { value: '0s', label: 'Planned downtime' },
    ],
    stack: ['Terraform', 'Crossplane', 'ArgoCD', 'Karpenter', 'Kubernetes', 'AWS', 'Azure', 'GCP'],
    diagram: `           control plane
on-prem ──▶ IaC → GitOps → policy
            │         │         │
            ▼         ▼         ▼
         aws-prod  az-prod   gcp-prod`,
  },
  {
    id: 'data',
    index: '03',
    tag: '/ DATA · CAPABILITY',
    status: 'live · 40 lakehouses',
    title: 'Data & Analytics',
    titlePrefix: 'Data ',
    emphasis: '&',
    titleSuffix: ' Analytics',
    desc:
      'Lakehouse architectures, streaming and batch pipelines on one plane, governance that holds up to audit. Built so the number on the dashboard matches the number in the ledger.',
    stats: [
      { value: '40', label: 'Warehouses live' },
      { value: '2.4M/s', label: 'Events ingested' },
      { value: '<1%', label: 'Cost variance' },
    ],
    stack: ['Databricks', 'Snowflake', 'dbt', 'Kafka', 'Iceberg', 'Trino', 'Unity Catalog'],
    diagram: `sources ──▶ ingest ──▶ bronze ──▶ silver ──▶ gold ──▶ BI
                              │
                              └──▶ feature store ──▶ ML`,
  },
  {
    id: 'martech',
    index: '04',
    tag: '/ MARTECH · CAPABILITY',
    status: 'live · 11 activations',
    title: 'MarTech & CDP',
    titlePrefix: 'MarTech ',
    emphasis: '&',
    titleSuffix: ' CDP',
    desc:
      'Customer data unified across every touchpoint and activated in real time across marketing cloud, paid, and owned channels. Segments that refresh with the event, not with the next batch.',
    stats: [
      { value: '11', label: 'Activations live' },
      { value: '340', label: 'Segments in use' },
      { value: '<1s', label: 'Signal to touch' },
    ],
    stack: ['Salesforce', 'Braze', 'Segment', 'Snowflake', 'Iterable', 'mParticle'],
    diagram: `sources ──▶ identity ──▶ CDP ──▶ segments
                                           │
                                           ▼
                            marketing cloud · paid · owned`,
  },
  {
    id: 'platform',
    index: '05',
    tag: '/ PLATFORM · CAPABILITY',
    status: 'live · 17 IDPs',
    title: 'Platform Engineering',
    titlePrefix: 'Platform ',
    emphasis: 'Engineering',
    desc:
      'Internal developer platforms with golden paths your engineers actually adopt. Lead time from commit to production measured in hours, without the governance theater.',
    stats: [
      { value: '17', label: 'IDPs running' },
      { value: '4x', label: 'Faster shipping' },
      { value: '42h', label: 'Lead time p50' },
    ],
    stack: ['Backstage', 'Kubernetes', 'ArgoCD', 'Tekton', 'OPA', 'Terraform'],
    diagram: `developer ──▶ backstage ──▶ scaffolder ──▶ repo + pipeline
                  │                              │
                  └──▶ catalog ◀── runtime ◀─────┘`,
  },
  {
    id: 'digital',
    index: '06',
    tag: '/ DX · CAPABILITY',
    status: 'live · 9 storefronts',
    title: 'Digital & Experience',
    titlePrefix: 'Digital ',
    emphasis: '&',
    titleSuffix: ' Experience',
    desc:
      'Headless commerce, composable content, and edge personalization for retailers and banks. Built for organizations that expect to win on page-load speed and experience depth, not catalog size.',
    stats: [
      { value: '+18%', label: 'Conversion lift' },
      { value: '1.1s', label: 'LCP p75' },
      { value: '14', label: 'Markets live' },
    ],
    stack: ['Next.js', 'Vercel', 'Contentful', 'Algolia', 'commercetools', 'Stripe'],
    diagram: `     edge ─ personalize
user ─┤                        ├──▶ CMS + commerce
     └─ experiments ──────────┘
     design-system · A/B · analytics`,
  },
  {
    id: 'cyber',
    index: '07',
    tag: '/ CYBER · CAPABILITY',
    status: 'live · zero breaches',
    title: 'Cyber & Trust',
    titlePrefix: 'Cyber ',
    emphasis: '&',
    titleSuffix: ' Trust',
    desc:
      'Zero-trust architectures, cloud security programs, and compliance readiness for SOC 2, HIPAA, and PCI. Incident response runbooks ready for the day a novel exploit reaches the feed.',
    stats: [
      { value: '0', label: 'Breaches on our watch' },
      { value: '<4h', label: 'MTTR' },
      { value: '100%', label: 'SOC2 coverage' },
    ],
    stack: ['Zscaler', 'CrowdStrike', 'Snyk', 'Vault', 'AWS GuardDuty', 'OPA'],
    diagram: `identity ──▶ zero-trust gateway ──▶ workloads
   │                │                      │
   ▼                ▼                      ▼
  MFA            policy                telemetry
                                          │
                              ◀── SOC · 24×7 ◀──┘`,
  },
  {
    id: 'managed',
    index: '08',
    tag: '/ OPS · CAPABILITY',
    status: 'live · 99.5% uptime',
    title: 'Managed Services',
    titlePrefix: 'Managed ',
    emphasis: 'Services',
    desc:
      'SLO-driven operations with documented on-call rotations and quarterly chaos drills. Follow-the-sun coverage across cloud, data, and applications, on a pager that rings before yours does.',
    stats: [
      { value: '99.5%', label: 'Rolling uptime' },
      { value: '8m', label: 'MTTA' },
      { value: '24x7', label: 'Follow the sun' },
    ],
    stack: ['PagerDuty', 'Datadog', 'SolarWinds', 'LogRhythm', 'Splunk', 'Grafana'],
    diagram: `    NJ ──▶ Hyderabad ──▶ Toronto ──▶ NJ    (follow-the-sun)
     │        │            │
     ▼        ▼            ▼
   on-call  on-call      on-call
     └────────┴──── one runbook ────┘`,
  },
  {
    id: 'advisory',
    index: '09',
    tag: '/ ADVISORY · CAPABILITY',
    status: 'live · C-suite mandate',
    title: 'Advisory & Strategy',
    titlePrefix: 'Advisory ',
    emphasis: '&',
    titleSuffix: ' Strategy',
    desc:
      'Technology strategy grounded in delivery. Our advisors arrive with the engineers who will build what the strategy recommends, not with a deck and a calendar invite for six weeks out.',
    stats: [
      { value: '48h', label: 'To a written plan' },
      { value: '86', label: 'CTOs advised' },
      { value: '0', label: 'Pure-slide engagements' },
    ],
    stack: ['North-star maps', 'TCO models', 'Capability audits', 'ROI frameworks'],
    diagram: `problem ─────────▶ assess ─────────▶ plan
                       │
                       ▼
                   build pod ◀── ships in 2 wks
                       │
                       ▼
                    outcomes`,
  },
  {
    id: 'gcc',
    index: '10',
    tag: '/ GCC · CAPABILITY',
    status: 'live · 3 centers',
    title: 'GCC & Captive Ops',
    titlePrefix: 'GCC ',
    emphasis: '&',
    titleSuffix: ' Captive Ops',
    desc:
      'Stand up a captive delivery center and run it like a first-party team, not an outsourcing contract. Entity setup, hiring, facilities, and operating model delivered in one engagement, with a documented build-operate-transfer path onto your payroll when you are ready.',
    stats: [
      { value: '90d', label: 'To first live pod' },
      { value: '340+', label: 'Engineers placed' },
      { value: 'BOT', label: 'Path to full transfer' },
    ],
    stack: ['Entity setup', 'Talent pipeline', 'Facilities', 'IT & security', 'Operating model', 'BOT framework'],
    diagram: `design ──▶ entity ──▶ hiring ──▶ pods live
                                      │
                                      ▼
                         build ─ operate ─ transfer`,
  },
];

/**
 * Eight services for the ServicesDial. Each entry matches the design
 * handoff verbatim (see design_handoff_aci_homepage/reference/index.html
 * SERVICES array). ASCII diagrams preserve the original "live terminal"
 * feel — they are rendered inside a <pre> with mono font.
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
      'Production-grade copilots, agents and document intelligence. RAG-to-retire in 12 weeks, behind your firewall, with an eval harness that catches drift in hours.',
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
      'AWS, Azure, GCP, and hybrid. Landing zones, FinOps, cutovers from mainframe and VMware, with a runbook your SRE actually trusts.',
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
      'Lakehouse in 10 weeks. Streaming + batch on one plane. Governance, lineage, cost, treated as first-class features, not month-six regrets.',
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
    id: 'platform',
    index: '04',
    tag: '/ PLATFORM · CAPABILITY',
    status: 'live · 17 IDPs',
    title: 'Platform Engineering',
    titlePrefix: 'Platform ',
    emphasis: 'Engineering',
    desc:
      'Paved roads, not policy PDFs. Internal developer platforms that cut lead time from weeks to hours, with golden paths your engineers actually want to use.',
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
    index: '05',
    tag: '/ DX · CAPABILITY',
    status: 'live · 9 storefronts',
    title: 'Digital & Experience',
    titlePrefix: 'Digital ',
    emphasis: '&',
    titleSuffix: ' Experience',
    desc:
      'Headless commerce, composable content, edge personalization. For retailers and banks that refuse to lose to a startup on page load or personalization.',
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
    index: '06',
    tag: '/ CYBER · CAPABILITY',
    status: 'live · zero breaches',
    title: 'Cyber & Trust',
    titlePrefix: 'Cyber ',
    emphasis: '&',
    titleSuffix: ' Trust',
    desc:
      'Zero-trust architectures, cloud security, threat modeling. Built for SOC2, HIPAA, PCI, and for 3AM when a novel exploit hits the feed.',
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
    index: '07',
    tag: '/ OPS · CAPABILITY',
    status: 'live · 99.5% uptime',
    title: 'Managed Services',
    titlePrefix: 'Managed ',
    emphasis: 'Services',
    desc:
      'SLOs, chaos drills, on-call rotations. A pager that rings before yours does, across cloud, data and apps, on three continents.',
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
    index: '08',
    tag: '/ ADVISORY · CAPABILITY',
    status: 'live · C-suite mandate',
    title: 'Advisory & Strategy',
    titlePrefix: 'Advisory ',
    emphasis: '&',
    titleSuffix: ' Strategy',
    desc:
      'Tech strategy grounded in delivery. No 80-slide deck and a handshake, our advisors show up with the engineers who will actually ship it.',
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
];

import type { FlowSceneConfig } from './FlowScene';

// One FlowScene config per service page. Each picks an honest metaphor
// for what the practice actually does: what goes in (labeled sources),
// what the work is (the named sphere), and what the client gets (three
// labeled output tiers). Numbers on stat cards reuse copy already
// approved on the pages; nothing here is invented.

export const FLOWS: Record<string, FlowSceneConfig> = {
  'data-engineering': {
    seed: 20260718,
    ariaLabel:
      'Animated diagram: data from CRM, ERP, IoT, SaaS apps, logs, and files flows through a governance layer into three tiers serving analytics, AI, and applications',
    sourcesTitle: 'Source systems',
    sources: ['CRM', 'ERP', 'IoT & sensors', 'SaaS apps', 'Logs & events', 'Files & docs'],
    centerTitle: 'Governance layer',
    centerSub: 'quality · lineage · access',
    outputs: ['Analytics & BI', 'AI & ML', 'Applications'],
    logos: [
      { src: '/brand/databricks-color-on-light.svg', alt: 'Databricks', px: 42 },
      { src: '/brand/snowflake-color.svg', alt: 'Snowflake', label: 'Snowflake', px: 24 },
    ],
    stat: { title: '40+ lakehouse implementations', sub: 'Certified on both platforms. Run in production.' },
    caption: 'raw → governed → served',
  },

  'applied-ai-ml': {
    seed: 20260719,
    ariaLabel:
      'Animated diagram: lakehouse data, documents, tickets, policies, and APIs flow through a model and context layer into copilots, forecasts, and agents',
    sourcesTitle: 'Context',
    sources: ['Lakehouse', 'Documents', 'Tickets', 'Policies', 'APIs'],
    centerTitle: 'Model & context layer',
    centerSub: 'RAG · guardrails · evals',
    outputs: ['Copilots', 'Forecasts', 'Agents'],
    logos: [
      { src: '/brand/anthropic-wordmark.svg', alt: 'Anthropic', px: 34 },
      { src: '/brand/openai-wordmark.svg', alt: 'OpenAI', px: 34 },
    ],
    stat: { title: 'Frontier models, governed', sub: 'Delivered with our strategic partner ArqAI.' },
    caption: 'context → model → action',
  },

  'cloud-modernization': {
    seed: 20260720,
    ariaLabel:
      'Animated diagram: data center VMs, legacy apps, databases, and middleware flow through a migration factory into rehost, replatform, and refactor tracks',
    sourcesTitle: 'Your estate',
    sources: ['Data center VMs', 'Legacy apps', 'Databases', 'Middleware', 'File shares'],
    centerTitle: 'Migration factory',
    centerSub: 'assess · plan · move',
    outputs: ['Rehost', 'Replatform', 'Refactor'],
    logos: [
      { src: '/brand/aws-color.png', alt: 'AWS', px: 34 },
      { src: '/brand/azure-color.png', alt: 'Microsoft Azure', px: 34 },
      { src: '/brand/googlecloud-color.svg', alt: 'Google Cloud', label: 'Google Cloud', px: 24 },
    ],
    stat: { title: '200+ cloud migrations', sub: 'Delivered across all three clouds.' },
    caption: 'estate → factory → cloud',
  },

  'cyber-security': {
    seed: 20260721,
    ariaLabel:
      'Animated diagram: signals from endpoints, identities, cloud workloads, network, and email pass a zero-trust core that blocks red threat particles, protecting apps, data, and users',
    sourcesTitle: 'Attack surface',
    sources: ['Endpoints', 'Identities', 'Cloud workloads', 'Network', 'Email'],
    centerTitle: 'Zero-trust core',
    centerSub: 'detect · verify · block',
    outputs: ['Protected apps', 'Protected data', 'Protected users'],
    behavior: 'deflect',
    legend: 'threats blocked at the core',
    logos: [
      { src: '/brand/dynatrace-color.svg', alt: 'Dynatrace', label: 'Dynatrace', px: 28 },
      { src: '/brand/microsoft-mono.svg', alt: 'Microsoft', label: 'Microsoft', px: 22 },
    ],
    stat: { title: 'ISO 27001 certified SOC', sub: 'SIEM on Splunk, Sentinel, and CrowdStrike.' },
    caption: 'signal → verified → protected',
  },

  'martech-cdp': {
    seed: 20260722,
    ariaLabel:
      'Animated diagram: signals from web, mobile, email, stores, and ad platforms resolve into single customer identities, then split into segments, journeys, and activation',
    sourcesTitle: 'Signals',
    sources: ['Web', 'Mobile', 'Email', 'Stores & POS', 'Ad platforms'],
    centerTitle: 'Identity resolution',
    centerSub: 'one profile per person',
    outputs: ['Segments', 'Journeys', 'Activation'],
    logos: [
      { src: '/brand/salesforce-color.png', alt: 'Salesforce', px: 36 },
      { src: '/images/Solution-Partners/braze.png', alt: 'Braze', px: 32 },
    ],
    stat: { title: 'Salesforce & Braze practice', sub: 'We implement what we recommend.' },
    caption: 'signals → identity → activation',
  },

  'digital-transformation': {
    seed: 20260723,
    ariaLabel:
      'Animated diagram: tickets, invoices, approvals, and documents flow through an automation core into automated workflows, integrated systems, and rebuilt apps',
    sourcesTitle: 'Manual today',
    sources: ['Tickets', 'Invoices', 'Approvals', 'Documents', 'Spreadsheets'],
    centerTitle: 'Automation core',
    centerSub: 'workflow · integration · RPA',
    outputs: ['Automated flows', 'Integrated systems', 'Rebuilt apps'],
    logos: [
      { src: '/images/Solution-Partners/servicenow.png', alt: 'ServiceNow', px: 32 },
      { src: '/brand/microsoft-mono.svg', alt: 'Microsoft', label: 'Microsoft', px: 22 },
    ],
    stat: { title: 'ServiceNow partner, UiPath certified', sub: 'Power Automate across the Microsoft stack.' },
    caption: 'manual → automated → measured',
  },

  'app-development': {
    seed: 20260724,
    ariaLabel:
      'Animated diagram: identity, lakehouse data, ML models, and APIs flow through an application core into web apps, mobile apps, and internal tools',
    sourcesTitle: 'Plugged into',
    sources: ['SSO & identity', 'Lakehouse', 'ML models', 'Internal APIs', 'Third-party APIs'],
    centerTitle: 'Application core',
    centerSub: 'design · build · ship',
    outputs: ['Web apps', 'Mobile apps', 'Internal tools'],
    logos: [
      { src: '/brand/azure-color.png', alt: 'Microsoft Azure', px: 34 },
      { src: '/images/Solution-Partners/kubernetes.svg', alt: 'Kubernetes', label: 'Kubernetes', px: 24 },
    ],
    stat: { title: 'Cloud-native on your stack', sub: 'Azure, AWS, and Kubernetes in production.' },
    caption: 'idea → build → production',
  },

  'quality-engineering': {
    seed: 20260725,
    ariaLabel:
      'Animated diagram: commits, pull requests, and builds pass through quality gates; red defects loop back to the source while passing work lands as tested releases, performance baselines, and security signoff',
    sourcesTitle: 'Every change',
    sources: ['Commits', 'Pull requests', 'Builds', 'Configs'],
    centerTitle: 'Quality gates',
    centerSub: 'functional · performance · security',
    outputs: ['Tested releases', 'Perf baselines', 'Security signoff'],
    behavior: 'loopback',
    legend: 'defects loop back, not forward',
    stat: { title: '90%+ automation as the default', sub: 'Full suites in CI, under ten minutes.' },
    caption: 'commit → gate → ship',
  },

  'advisory-strategy': {
    seed: 20260726,
    ariaLabel:
      'Animated diagram: systems inventory, spend data, team interviews, and market scan flow through an assessment into a roadmap, business case, and operating model',
    sourcesTitle: 'Evidence',
    sources: ['Systems inventory', 'Spend data', 'Team interviews', 'Market scan'],
    centerTitle: 'Assessment',
    centerSub: 'evidence, not opinion',
    outputs: ['Roadmap', 'Business case', 'Operating model'],
    stat: { title: 'Written plan in 48 hours', sub: 'Advisory pod on the ground in five days.' },
    caption: 'evidence → decision → plan',
  },

  gcc: {
    seed: 20260727,
    ariaLabel:
      'Animated diagram: talent pipeline, facilities, legal and payroll, and IT setup flow through a build and operate phase into engineering pods, support functions, and full ownership',
    sourcesTitle: 'Groundwork',
    sources: ['Talent pipeline', 'Facilities', 'Legal & payroll', 'IT & security'],
    centerTitle: 'Build & operate',
    centerSub: 'your center, stood up',
    outputs: ['Engineering pods', 'Support functions', 'Full ownership'],
    stat: { title: 'First pod live in 90 days', sub: 'Entity, hiring, and a documented transfer path.' },
    caption: 'build → operate → transfer',
  },

  'managed-operations': {
    seed: 20260728,
    ariaLabel:
      'Animated diagram: alerts, incidents, tickets, and telemetry flow through 24x7 triage into auto-remediated fixes, engineer-resolved incidents, and root-cause fixes',
    sourcesTitle: 'The noise',
    sources: ['Alerts', 'Incidents', 'Tickets', 'Telemetry'],
    centerTitle: '24x7 triage',
    centerSub: 'runbooks · automation · SLAs',
    outputs: ['Auto-remediated', 'Engineer-resolved', 'Root-cause fixes'],
    stat: { title: '15 minute P1 response', sub: 'Follow-the-sun NOC across three time zones.' },
    caption: 'alert → triage → resolved',
  },
  'platform-databricks': {
    seed: 20260729,
    ariaLabel:
      'Animated diagram: operational databases, event streams, files, and SaaS exports land in Delta Lake under Unity Catalog, then serve SQL and BI, streaming, and machine learning from one governed copy',
    sourcesTitle: 'What lands',
    sources: ['Operational DBs', 'Event streams', 'Files & objects', 'SaaS exports', 'Legacy warehouse'],
    centerTitle: 'Delta Lake + Unity Catalog',
    centerSub: 'one copy, governed',
    outputs: ['SQL & BI', 'Streaming', 'ML & GenAI'],
    logos: [{ src: '/brand/databricks-color-on-light.svg', alt: 'Databricks', px: 42 }],
    stat: { title: '40+ lakehouse implementations', sub: 'Certified on data engineering, ML, and platform admin.' },
    caption: 'bronze → silver → gold',
  },
  'platform-snowflake': {
    seed: 20260730,
    ariaLabel:
      'Animated diagram: operational databases, files, SaaS exports, and partner shares load into a governed Snowflake warehouse, then serve analytics, data sharing, and data applications',
    sourcesTitle: 'What loads',
    sources: ['Operational DBs', 'Files & objects', 'SaaS exports', 'Partner shares'],
    centerTitle: 'Governed warehouse',
    centerSub: 'one platform, priced by use',
    outputs: ['Analytics & BI', 'Data sharing', 'Data apps'],
    logos: [{ src: '/brand/snowflake-color.svg', alt: 'Snowflake', label: 'Snowflake', px: 30 }],
    stat: { title: 'Databricks and Snowflake partner', sub: 'Certified architects on both. We implement what fits.' },
    caption: 'load → govern → share',
  },

  'platform-aws': {
    seed: 20260731,
    ariaLabel:
      'Animated diagram: data center VMs, legacy apps, databases, and file shares pass through an AWS landing zone with guardrails into compute, data and analytics, and AI services',
    sourcesTitle: 'Your estate',
    sources: ['Data center VMs', 'Legacy apps', 'Databases', 'File shares'],
    centerTitle: 'AWS landing zone',
    centerSub: 'accounts · guardrails · IAM',
    outputs: ['Compute & containers', 'Data & analytics', 'AI services'],
    logos: [{ src: '/brand/aws-color.png', alt: 'AWS', px: 40 }],
    stat: { title: '200+ cloud migrations', sub: 'Delivered across AWS, Azure, and GCP.' },
    caption: 'assess → migrate → run',
  },

  'platform-azure': {
    seed: 20260801,
    ariaLabel:
      'Animated diagram: Microsoft 365, Dynamics 365, on-prem Active Directory, and SQL Server estates pass through an Azure landing zone into apps on AKS, data on Synapse and Fabric, and Azure AI',
    sourcesTitle: 'Already Microsoft',
    sources: ['Microsoft 365', 'Dynamics 365', 'On-prem AD', 'SQL Server', 'Legacy apps'],
    centerTitle: 'Azure landing zone',
    centerSub: 'identity first, then everything',
    outputs: ['Apps on AKS', 'Data & Fabric', 'Azure AI'],
    logos: [{ src: '/brand/azure-color.png', alt: 'Microsoft Azure', px: 40 }],
    stat: { title: '200+ cloud migrations', sub: 'Delivered across Azure, AWS, and GCP.' },
    caption: 'estate → landing zone → cloud',
  },

  'platform-gcp': {
    seed: 20260802,
    ariaLabel:
      'Animated diagram: operational databases, event streams, files, and SaaS exports flow into a governed Google Cloud data core, then serve BigQuery analytics, Vertex AI, and apps on GKE',
    sourcesTitle: 'What lands',
    sources: ['Operational DBs', 'Event streams', 'Files & objects', 'SaaS exports'],
    centerTitle: 'Data & AI core',
    centerSub: 'BigQuery at the center',
    outputs: ['BigQuery analytics', 'Vertex AI', 'Apps on GKE'],
    logos: [{ src: '/brand/googlecloud-color.svg', alt: 'Google Cloud', label: 'Google Cloud', px: 28 }],
    stat: { title: '200+ cloud migrations', sub: 'Delivered across GCP, AWS, and Azure.' },
    caption: 'land → query → predict',
  },

  'platform-salesforce': {
    seed: 20260803,
    ariaLabel:
      'Animated diagram: sales activity, service cases, marketing touches, and commerce orders resolve into a Salesforce Customer 360, then power Sales Cloud, Service Cloud, and Agentforce',
    sourcesTitle: 'Every touchpoint',
    sources: ['Sales activity', 'Service cases', 'Marketing touches', 'Commerce orders'],
    centerTitle: 'Customer 360',
    centerSub: 'one record per customer',
    outputs: ['Sales Cloud', 'Service Cloud', 'Agentforce'],
    logos: [{ src: '/brand/salesforce-color.png', alt: 'Salesforce', px: 40 }],
    stat: { title: 'Salesforce partner', sub: 'With an Agentforce practice. We implement what we recommend.' },
    caption: 'touchpoint → record → action',
  },

  'platform-sap': {
    seed: 20260804,
    ariaLabel:
      'Animated diagram: finance, procurement, supply chain, and HR processes consolidate into a clean S/4HANA core, then serve reporting, planning, and integrations on BTP',
    sourcesTitle: 'The business',
    sources: ['Finance', 'Procurement', 'Supply chain', 'HR'],
    centerTitle: 'Clean S/4HANA core',
    centerSub: 'standardize, then extend',
    outputs: ['Reporting & close', 'Planning', 'BTP extensions'],
    logos: [{ src: '/brand/sap-color.svg', alt: 'SAP', px: 34 }],
    stat: { title: 'S/4HANA transformations delivered', sub: 'Including a global financial reporting consolidation.' },
    caption: 'process → core → insight',
  },

  'platform-servicenow': {
    seed: 20260805,
    ariaLabel:
      'Animated diagram: incidents, requests, changes, and assets flow through the ServiceNow workflow engine into ITSM, CSM, and HR service delivery',
    sourcesTitle: 'The queue',
    sources: ['Incidents', 'Requests', 'Changes', 'Assets'],
    centerTitle: 'Workflow engine',
    centerSub: 'route · automate · measure',
    outputs: ['ITSM', 'CSM', 'HR service delivery'],
    logos: [{ src: '/images/Solution-Partners/servicenow.png', alt: 'ServiceNow', px: 36 }],
    stat: { title: 'ServiceNow partner', sub: 'ITSM, CSM, and HRSD delivered and run.' },
    caption: 'ticket → workflow → resolved',
  },

  'platform-microsoft-dynamics': {
    seed: 20260806,
    ariaLabel:
      'Animated diagram: sales pipeline, service cases, finance, and operations data unify in Dataverse, then power Dynamics 365 CRM, ERP, and the Power Platform',
    sourcesTitle: 'The business',
    sources: ['Sales pipeline', 'Service cases', 'Finance', 'Operations'],
    centerTitle: 'Dataverse',
    centerSub: 'one data layer under it all',
    outputs: ['Dynamics CRM', 'Dynamics ERP', 'Power Platform'],
    logos: [{ src: '/brand/microsoft-mono.svg', alt: 'Microsoft', label: 'Dynamics 365', px: 24 }],
    stat: { title: 'Microsoft partner', sub: 'Dynamics 365 with Azure and Power Platform delivery.' },
    caption: 'record → Dataverse → workflow',
  },

  'platform-braze': {
    seed: 20260807,
    ariaLabel:
      'Animated diagram: events, profiles, segments, and catalogs flow through Braze journey orchestration into email, push and SMS, and in-app messaging',
    sourcesTitle: 'Signals in',
    sources: ['Events', 'Profiles', 'Segments', 'Catalogs'],
    centerTitle: 'Journey orchestration',
    centerSub: 'Canvas, in real time',
    outputs: ['Email', 'Push & SMS', 'In-app'],
    logos: [{ src: '/images/Solution-Partners/braze.png', alt: 'Braze', px: 36 }],
    stat: { title: 'Braze Alloy partner', sub: 'Wired to the data platform, not bolted on.' },
    caption: 'event → journey → message',
  },
};

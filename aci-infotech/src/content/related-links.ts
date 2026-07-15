import type { RelatedLink } from '@/components/seo/RelatedLinks';

// Curated cross-links that wire each pillar and industry into the topical
// cluster: platform -> the service it delivers and the industries it
// serves; service -> the platforms it runs on; industry -> the services
// and platforms behind it. Exact-match anchors, all internal.

// ---- Platform pillars ----
export const snowflakeRelated: RelatedLink[] = [
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'The pipelines and governance behind the warehouse.' },
  { label: 'Databricks', href: '/platforms/databricks', note: 'When streaming and ML share the same data.' },
  { label: 'Retail & Consumer', href: '/industries/retail', note: 'Customer data and demand forecasting.' },
  { label: 'Financial Services', href: '/industries/financial-services', note: 'Governed, audit-ready analytics.' },
  { label: 'Snowflake Consulting Services', href: '/lp/snowflake-consulting', note: 'Scoped engagements with certified Snowflake engineers.' },
];

export const databricksRelated: RelatedLink[] = [
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'Lakehouse pipelines and quality gates.' },
  { label: 'Applied AI & ML', href: '/services/applied-ai-ml', note: 'Models from pilot to production.' },
  { label: 'Snowflake', href: '/platforms/snowflake', note: 'The other data cloud we partner on.' },
  { label: 'Manufacturing', href: '/industries/manufacturing', note: 'IoT, quality, and supply-chain data.' },
  { label: 'Databricks Consulting Services', href: '/lp/databricks-services', note: 'Scoped engagements with certified Databricks engineers.' },
];

export const servicenowRelated: RelatedLink[] = [
  { label: 'Managed Operations', href: '/services/managed-operations', note: 'Run and support under an SLA.' },
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'Modernize the platforms underneath.' },
  { label: 'Cyber Security', href: '/services/cyber-security', note: 'Governance and access done right.' },
  { label: 'ServiceNow Implementation Services', href: '/lp/servicenow-implementation', note: 'Scoped ITSM and workflow implementations.' },
];

// ---- Service pillars ----
export const dataEngineeringRelated: RelatedLink[] = [
  { label: 'Snowflake', href: '/platforms/snowflake', note: 'Governed SQL analytics at scale.' },
  { label: 'Databricks', href: '/platforms/databricks', note: 'Lakehouse for BI, streaming, and ML.' },
  { label: 'Applied AI & ML', href: '/services/applied-ai-ml', note: 'What an AI-ready platform feeds.' },
  { label: 'Data Engineering Services (engagements)', href: '/lp/data-engineering-services', note: 'Scoped builds: pipelines, lakehouse, governance.' },
];

export const appliedAiRelated: RelatedLink[] = [
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'Most AI problems are data problems.' },
  { label: 'Databricks', href: '/platforms/databricks', note: 'MLflow, registry, and production ML.' },
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'The infrastructure AI runs on.' },
  { label: 'AI & ML Implementation Services', href: '/lp/ai-ml-implementation', note: 'Scoped model builds with MLOps included.' },
];

export const cloudModernizationRelated: RelatedLink[] = [
  { label: 'AWS', href: '/platforms/aws', note: 'Architecture, migration, and FinOps.' },
  { label: 'Microsoft Azure', href: '/platforms/azure', note: 'Landing zones and workloads.' },
  { label: 'Managed Operations', href: '/services/managed-operations', note: 'Keep it running after the move.' },
  { label: 'Cloud Migration Services', href: '/lp/cloud-migration-services', note: 'Scoped migrations with parallel-run cutovers.' },
];

// ---- Industries ----
export const retailRelated: RelatedLink[] = [
  { label: 'MarTech & CDP', href: '/services/martech-cdp', note: 'Unify the customer record.' },
  { label: 'Snowflake', href: '/platforms/snowflake', note: 'The data foundation underneath.' },
  { label: 'Applied AI & ML', href: '/services/applied-ai-ml', note: 'Personalization and forecasting.' },
];

export const financialServicesRelated: RelatedLink[] = [
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'Audit-ready data and lineage.' },
  { label: 'Cyber Security', href: '/services/cyber-security', note: 'Compliance and access controls.' },
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'Move regulated workloads safely.' },
];

export const manufacturingRelated: RelatedLink[] = [
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'Pull SAP and shop-floor data together.' },
  { label: 'Databricks', href: '/platforms/databricks', note: 'IoT and predictive maintenance.' },
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'Modernize aging analytics.' },
];

export const oilGasRelated: RelatedLink[] = [
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'SCADA, historian, and ERP unified.' },
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'Move on-prem analytics to the cloud.' },
  { label: 'Cyber Security', href: '/services/cyber-security', note: 'Protect critical infrastructure.' },
];

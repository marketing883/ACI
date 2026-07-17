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
  { label: 'Google Cloud', href: '/platforms/gcp', note: 'BigQuery, Vertex AI, and GKE estates.' },
  { label: 'Managed Operations', href: '/services/managed-operations', note: 'Keep it running after the move.' },
  { label: 'Cloud Migration Services', href: '/lp/cloud-migration-services', note: 'Scoped migrations with parallel-run cutovers.' },
];

export const martechCdpRelated: RelatedLink[] = [
  { label: 'Salesforce', href: '/platforms/salesforce', note: 'Data Cloud and CRM done together.' },
  { label: 'Braze', href: '/platforms/braze', note: 'Journeys that read the unified record.' },
  { label: 'Retail & Consumer', href: '/industries/retail', note: 'Where customer 360 pays for itself.' },
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'Identity resolution starts with clean data.' },
];

export const digitalTransformationRelated: RelatedLink[] = [
  { label: 'ServiceNow', href: '/platforms/servicenow', note: 'Workflows with an owner and an SLA.' },
  { label: 'Applied AI & ML', href: '/services/applied-ai-ml', note: 'Document AI and decisioning models.' },
  { label: 'App Development', href: '/services/app-development', note: 'When the process needs its own system.' },
  { label: 'Managed Operations', href: '/services/managed-operations', note: 'Run the automations after go-live.' },
];

export const cyberSecurityRelated: RelatedLink[] = [
  { label: 'Managed Operations', href: '/services/managed-operations', note: 'The 24/7 SOC that runs what we harden.' },
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'Secure landing zones from day one.' },
  { label: 'Financial Services', href: '/industries/financial-services', note: 'Controls that satisfy examiners.' },
];

export const appDevelopmentRelated: RelatedLink[] = [
  { label: 'Applied AI & ML', href: '/services/applied-ai-ml', note: 'The models these applications call.' },
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'The lakehouse the application queries.' },
  { label: 'Quality Engineering', href: '/services/quality-engineering', note: 'Testing wired into the same pipeline.' },
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'The platform underneath the app.' },
];

export const qualityEngineeringRelated: RelatedLink[] = [
  { label: 'App Development', href: '/services/app-development', note: 'The systems this quality bar protects.' },
  { label: 'Applied AI & ML', href: '/services/applied-ai-ml', note: 'The agents behind AI-augmented testing.' },
  { label: 'Managed Operations', href: '/services/managed-operations', note: 'Observability after the release.' },
];

export const advisoryStrategyRelated: RelatedLink[] = [
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'Where most roadmaps start.' },
  { label: 'Applied AI & ML', href: '/services/applied-ai-ml', note: 'AI strategy with a build pod attached.' },
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'TCO models turned into migrations.' },
  { label: 'GCC & Captive Operations', href: '/services/gcc', note: 'When the plan needs a delivery center.' },
];

export const gccRelated: RelatedLink[] = [
  { label: 'Managed Operations', href: '/services/managed-operations', note: 'Follow-the-sun coverage from the captive.' },
  { label: 'Advisory & Strategy', href: '/services/advisory-strategy', note: 'The operating-model design first.' },
  { label: 'App Development', href: '/services/app-development', note: 'What the pods actually build.' },
];

export const managedOperationsRelated: RelatedLink[] = [
  { label: 'Cyber Security', href: '/services/cyber-security', note: 'The controls the SOC watches.' },
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'We run what we migrate.' },
  { label: 'ServiceNow', href: '/platforms/servicenow', note: 'The ITSM backbone of both centers.' },
];

export const awsRelated: RelatedLink[] = [
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'Migration waves and cost governance.' },
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'Glue, Redshift, and lakehouse builds.' },
  { label: 'Managed Operations', href: '/services/managed-operations', note: 'The estate, watched around the clock.' },
  { label: 'Cloud Migration Services', href: '/lp/cloud-migration-services', note: 'Scoped migrations with parallel-run cutovers.' },
];

export const azureRelated: RelatedLink[] = [
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'Landing zones and workload moves.' },
  { label: 'Microsoft Dynamics 365', href: '/platforms/microsoft-dynamics', note: 'The business apps on the same cloud.' },
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'Fabric and Synapse pipelines.' },
  { label: 'Power BI Consulting', href: '/lp/power-bi-consulting', note: 'Dashboards on a governed model.' },
];

export const gcpRelated: RelatedLink[] = [
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'BigQuery lakehouses with lineage.' },
  { label: 'Applied AI & ML', href: '/services/applied-ai-ml', note: 'Vertex AI from pilot to production.' },
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'GKE estates run to an SLA.' },
  { label: 'Cloud Migration Services', href: '/lp/cloud-migration-services', note: 'Scoped migrations with parallel-run cutovers.' },
];

export const brazeRelated: RelatedLink[] = [
  { label: 'MarTech & CDP', href: '/services/martech-cdp', note: 'The customer record Braze reads.' },
  { label: 'Retail & Consumer', href: '/industries/retail', note: 'Journeys that move baskets.' },
  { label: 'Hospitality & Food Services', href: '/industries/hospitality', note: 'Guest engagement across locations.' },
  { label: 'Braze Implementation Services', href: '/lp/braze-implementation', note: 'Scoped implementations and ESP migrations.' },
];

export const salesforceRelated: RelatedLink[] = [
  { label: 'MarTech & CDP', href: '/services/martech-cdp', note: 'Data Cloud as the customer 360.' },
  { label: 'Retail & Consumer', href: '/industries/retail', note: 'Commerce and service on one CRM.' },
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'The pipelines feeding Data Cloud.' },
  { label: 'Salesforce Implementation Services', href: '/lp/salesforce-implementation', note: 'Scoped CRM builds and integrations.' },
];

export const sapRelated: RelatedLink[] = [
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'S/4HANA on a modern platform.' },
  { label: 'Manufacturing', href: '/industries/manufacturing', note: 'Where SAP meets the shop floor.' },
  { label: 'Managed Operations', href: '/services/managed-operations', note: 'Basis and estate support under SLA.' },
  { label: 'SAP S/4HANA Migration Services', href: '/lp/sap-s4hana-migration', note: 'Scoped ECC to S/4HANA moves.' },
];

export const microsoftDynamicsRelated: RelatedLink[] = [
  { label: 'Microsoft Azure', href: '/platforms/azure', note: 'The cloud underneath Dynamics.' },
  { label: 'App Development', href: '/services/app-development', note: 'Power Platform apps and extensions.' },
  { label: 'Managed Operations', href: '/services/managed-operations', note: 'Run and support after go-live.' },
  { label: 'Dynamics 365 Implementation Services', href: '/lp/dynamics-365-implementation', note: 'Scoped implementations with a 90-day plan.' },
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

export const healthcareRelated: RelatedLink[] = [
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'EHR, claims, and FHIR data unified.' },
  { label: 'Applied AI & ML', href: '/services/applied-ai-ml', note: 'Clinical and claims models with governance.' },
  { label: 'Cyber Security', href: '/services/cyber-security', note: 'HIPAA controls designed in, not bolted on.' },
];

export const energyRelated: RelatedLink[] = [
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'Grid, meter, and asset data in one place.' },
  { label: 'Cyber Security', href: '/services/cyber-security', note: 'NERC CIP controls for critical assets.' },
  { label: 'Managed Operations', href: '/services/managed-operations', note: 'OT and IT estates watched 24/7.' },
];

export const hospitalityRelated: RelatedLink[] = [
  { label: 'MarTech & CDP', href: '/services/martech-cdp', note: 'One guest record across every property.' },
  { label: 'Braze', href: '/platforms/braze', note: 'Loyalty journeys that actually send.' },
  { label: 'Applied AI & ML', href: '/services/applied-ai-ml', note: 'Demand and revenue forecasting.' },
];

export const transportationRelated: RelatedLink[] = [
  { label: 'Data Engineering', href: '/services/data-engineering', note: 'Telematics, TMS, and EDI unified.' },
  { label: 'Applied AI & ML', href: '/services/applied-ai-ml', note: 'Route and maintenance prediction.' },
  { label: 'Cloud Modernization', href: '/services/cloud-modernization', note: 'Fleet data off aging on-prem systems.' },
];

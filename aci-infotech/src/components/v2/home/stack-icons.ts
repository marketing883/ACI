/**
 * Stack chip logo resolution for the ServicesDial preview panel.
 *
 * Two sources in priority order:
 *   1. STACK_CDN_SLUGS — Simple Icons CDN slug. All entries here are
 *      verified to return 200 at cdn.simpleicons.org. Icons arrive as
 *      monochrome SVGs tinted by the color suffix in the URL.
 *   2. STACK_LOCAL_LOGOS — fall-back for brands Simple Icons has
 *      removed (AWS, Azure, Salesforce, ServiceNow, and others have
 *      been pulled at the trademark holder's request). We use the
 *      local partner-logo PNGs shipped under
 *      public/images/Solution-Partners/ and tint them via CSS filter
 *      so the row reads uniform.
 *
 * Labels with no entry in either map render as uppercase mono text
 * (Advisory artifacts like "TCO models", or AI tooling without
 * recognizable public logos like LangGraph or Ragas).
 */

/** Verified slugs on Simple Icons CDN. Tested 200 OK. */
export const STACK_CDN_SLUGS: Record<string, string> = {
  // Data & analytics
  Databricks: 'databricks',
  Snowflake: 'snowflake',
  'Unity Catalog': 'databricks',
  Kafka: 'apachekafka',
  Trino: 'trino',

  // Cloud / infra / platform
  Kubernetes: 'kubernetes',
  Terraform: 'terraform',
  ArgoCD: 'argo',
  GCP: 'googlecloud',
  Tekton: 'tekton',
  Backstage: 'backstage',

  // Digital / experience
  'Next.js': 'nextdotjs',
  Vercel: 'vercel',
  Contentful: 'contentful',
  Algolia: 'algolia',
  Stripe: 'stripe',

  // Cyber
  Snyk: 'snyk',
  Vault: 'vault',

  // Managed ops
  PagerDuty: 'pagerduty',
  Datadog: 'datadog',
  Grafana: 'grafana',
  Splunk: 'splunk',
  OpsGenie: 'opsgenie',
};

/**
 * Local fall-back logos for brands Simple Icons dropped. Paths are
 * relative to /public. Shipped PNGs come in their native brand
 * colors; we neutralize with a CSS filter in the render site so the
 * chip row looks consistent with the monochrome SVGs.
 */
export const STACK_LOCAL_LOGOS: Record<string, string> = {
  AWS: '/images/Solution-Partners/aws.png',
  'AWS GuardDuty': '/images/Solution-Partners/aws.png',
  Bedrock: '/images/Solution-Partners/aws.png',
  Karpenter: '/images/Solution-Partners/aws.png',
  Azure: '/images/Solution-Partners/azure.png',
  'Azure OpenAI': '/images/Solution-Partners/azure.png',
  'Microsoft Sentinel': '/images/Solution-Partners/azure.png',
  SAP: '/images/Solution-Partners/sap.png',
  'SAP S4/Hana': '/images/Solution-Partners/sap.png',
  'SAP S/4HANA': '/images/Solution-Partners/sap.png',
  ServiceNow: '/images/Solution-Partners/servicenow.png',
  Salesforce: '/images/Solution-Partners/salesforce.png',
  Dynatrace: '/images/Solution-Partners/dynatrace.png',
  Braze: '/images/Solution-Partners/braze.png',
};

/**
 * Third tier: homarr-labs/dashboard-icons on jsdelivr. Much broader
 * enterprise coverage than Simple Icons because it hasn't been
 * scrubbed at the request of trademark holders. All entries here are
 * verified to return 200 at the CDN URL. Served as full-color SVGs;
 * we apply the same brightness/invert filter as local PNGs so the
 * row stays visually consistent with the monochrome SVGs from
 * Simple Icons.
 */
export const STACK_DASHBOARD_SLUGS: Record<string, string> = {
  'Power BI': 'powerbi',
  'Microsoft Power BI': 'powerbi',
  Oracle: 'oracle',
  SolarWinds: 'solarwinds',
  LogRhythm: 'solarwinds',
  OpenAI: 'openai',
  Cloudflare: 'cloudflare',
  Netlify: 'netlify',
  Atlassian: 'atlassian',

  // Microsoft products that don't have dedicated brand icons — fall
  // back to the generic Microsoft logo so at least the brand parent
  // is recognizable.
  Microsoft: 'microsoft',
  'Microsoft Dynamics': 'microsoft',
  'Microsoft Dynamics 365': 'microsoft',
  'Dynamics 365': 'microsoft',
};

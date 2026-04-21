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
  ServiceNow: '/images/Solution-Partners/servicenow.png',
  Salesforce: '/images/Solution-Partners/salesforce.png',
  Dynatrace: '/images/Solution-Partners/dynatrace.png',
  Braze: '/images/Solution-Partners/braze.png',
};

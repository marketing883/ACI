/**
 * Mapping from stack item labels used in services-data.ts to Simple Icons
 * slugs (see simpleicons.org). Logos render from cdn.simpleicons.org in
 * monochrome — we pass the hex of --v2-text-secondary to the CDN path.
 *
 * Items not present in this map render as uppercase mono text chips
 * (Advisory artifacts, Databricks sub-products, vendor tools without a
 * Simple Icons entry, etc.). This is intentional — don't pad with
 * approximations because a mis-branded logo is worse than no logo.
 *
 * If we productionize beyond preview, mirror these SVGs under /public
 * and swap the CDN path. External CDN is fine for the preview build.
 */

export const STACK_LOGO_SLUGS: Record<string, string> = {
  // Data & analytics
  Databricks: 'databricks',
  Snowflake: 'snowflake',
  'Unity Catalog': 'databricks',
  dbt: 'dbt',
  Kafka: 'apachekafka',
  Trino: 'trino',

  // Cloud / infra
  AWS: 'amazonwebservices',
  Azure: 'microsoftazure',
  GCP: 'googlecloud',
  Kubernetes: 'kubernetes',
  Terraform: 'terraform',
  ArgoCD: 'argo',
  Crossplane: 'crossplane',
  Karpenter: 'amazonwebservices',

  // Platform engineering
  Tekton: 'tekton',

  // Digital / experience
  'Next.js': 'nextdotjs',
  Vercel: 'vercel',
  Contentful: 'contentful',
  Algolia: 'algolia',
  commercetools: 'commercetools',
  Stripe: 'stripe',

  // Cyber
  Zscaler: 'zscaler',
  CrowdStrike: 'crowdstrike',
  Snyk: 'snyk',
  'AWS GuardDuty': 'amazonwebservices',

  // Managed ops
  PagerDuty: 'pagerduty',
  Datadog: 'datadog',
  Grafana: 'grafana',
  Splunk: 'splunk',

  // AI (most of these are not in Simple Icons, so left as text)
  'Azure OpenAI': 'microsoftazure',
  Bedrock: 'amazonwebservices',
};

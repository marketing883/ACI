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
  // Data & analytics. "Unity Catalog" is a Databricks sub-product;
  // deliberately NOT aliased to the Databricks logo because both
  // appear in the same stack and would render duplicate chips.
  Databricks: 'databricks',
  Snowflake: 'snowflake',
  Kafka: 'apachekafka',
  Trino: 'trino',

  // Cloud / infra / platform
  Kubernetes: 'kubernetes',
  Terraform: 'terraform',
  ArgoCD: 'argo',
  GCP: 'googlecloud',
  'Google Cloud': 'googlecloud',
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
 * colors.
 *
 * Some brand logos (SAP, Azure wordmark, Salesforce) are dark-on-
 * white by default and disappear against our dark card surface.
 * Those entries specify an `invert` flag so we apply a light-on-dark
 * filter instead of the default soften filter.
 */
export type LocalLogoEntry = {
  src: string;
  /** True when the native logo is dark-on-white and needs inversion
   *  to read on the dark card surface. */
  invert?: boolean;
  /** True when the asset is already rendered in the correct tint
   *  (e.g. a purpose-drawn monochrome SVG), so StackChip should
   *  skip both SOFTEN_FILTER and INVERT_FILTER. */
  mono?: boolean;
};

export const STACK_LOCAL_LOGOS: Record<string, LocalLogoEntry> = {
  // The AWS "Smile" wordmark ships pure black on transparent, so on
  // the dark chip surface it reads as black-on-dark. Invert pulls it
  // to light-on-transparent so the logo is actually visible.
  AWS: { src: '/images/Solution-Partners/aws.png', invert: true },
  // AWS sub-products mapped to the AWS logo only when they appear
  // in a stack that does NOT also list AWS — prevents duplicate
  // chips. GuardDuty and Bedrock don't share a panel with AWS.
  // Karpenter does (Cloud practice), so it stays as a text chip.
  'AWS GuardDuty': { src: '/images/Solution-Partners/aws.png', invert: true },
  Bedrock: { src: '/images/Solution-Partners/aws.png', invert: true },
  // Azure ships with a wide "Microsoft Azure" wordmark PNG where the
  // actual A-peak icon takes up only a small fraction of the image.
  // When the chip constrains by height, the whole wordmark shrinks
  // and the brand mark becomes illegible. We route to a purpose-drawn
  // icon-only SVG (two overlapping triangles forming the A-peak) so
  // the mark fills the chip the way other single-letter brand icons
  // do. Same asset serves Azure OpenAI and Microsoft Sentinel since
  // both sit under the Azure umbrella.
  Azure: { src: '/brand/azure-mono.svg', mono: true },
  'Azure OpenAI': { src: '/brand/azure-mono.svg', mono: true },
  'Microsoft Sentinel': { src: '/brand/azure-mono.svg', mono: true },
  SAP: { src: '/images/Solution-Partners/sap.png', invert: true },
  'SAP S4/Hana': { src: '/images/Solution-Partners/sap.png', invert: true },
  'SAP S/4HANA': { src: '/images/Solution-Partners/sap.png', invert: true },
  // ServiceNow and Braze ship as dark-on-white wordmarks, so they need
  // inversion to stay legible against the dark card surface — same
  // treatment as SAP / Azure / Salesforce above.
  ServiceNow: { src: '/images/Solution-Partners/servicenow.png', invert: true },
  Salesforce: { src: '/images/Solution-Partners/salesforce.png', invert: true },
  Dynatrace: { src: '/images/Solution-Partners/dynatrace.png' },
  Braze: { src: '/images/Solution-Partners/braze.png', invert: true },

  // Microsoft renders from a purpose-drawn four-square SVG rather than
  // from the dashboard-icons full-color version. The full-color logo
  // stood out against the otherwise-monochrome row; flattening it
  // with a brightness/invert chain fused the four squares into a
  // single white block because the squares touch in that source file.
  // The SVG here keeps the 1-unit gap between squares so the iconic
  // window pattern reads even at chip size.
  Microsoft: { src: '/brand/microsoft-mono.svg', mono: true },
  'Microsoft Dynamics': { src: '/brand/microsoft-mono.svg', mono: true },
  'Microsoft Dynamics 365': { src: '/brand/microsoft-mono.svg', mono: true },
  'Dynamics 365': { src: '/brand/microsoft-mono.svg', mono: true },
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
  // LogRhythm was acquired by SolarWinds' competitor (and is now
  // part of Exabeam). Previously aliased to the SolarWinds logo,
  // which produced a duplicate chip in the Managed Services panel
  // where both were listed. Leave LogRhythm as a text chip.
  OpenAI: 'openai',
  Cloudflare: 'cloudflare',
  Netlify: 'netlify',
  Atlassian: 'atlassian',
};

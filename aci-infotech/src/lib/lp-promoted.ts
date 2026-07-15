/**
 * Landing pages promoted to organic search.
 *
 * The /lp catalog is written for paid traffic and ships noindexed by
 * default. These slugs are the exception: one page per distinct
 * commercial intent (roughly one per service cluster), indexable,
 * listed in the sitemap, and internally linked from the matching
 * pillar pages. They are the only pages on the site whose copy
 * targets bottom-funnel queries ("snowflake consulting",
 * "dynamics 365 implementation"), so keeping all of them out of the
 * index meant no page anywhere competed for those terms.
 *
 * Deliberately ONE slug per intent — several same-cluster variants
 * (databricks-migration, databricks-cost-optimization, ...) share
 * near-identical section copy, and indexing siblings would look like
 * doorway pages. Keep the rest paid-only.
 */

export const PROMOTED_LP_SLUGS: string[] = [
  'data-engineering-services', // data-engineering (cluster head)
  'snowflake-consulting', // distinct platform intent
  'databricks-services', // distinct platform intent
  'power-bi-consulting', // data-analytics
  'cloud-migration-services', // cloud-modernization
  'dynamics-365-implementation', // dynamics-365
  'generative-ai-consulting', // gen-ai
  'ai-ml-implementation', // ai-ml
  'agentic-ai-development', // agentic-ai
  'data-integration-services', // data-integration
  'sap-s4hana-migration', // erp-transformation
  'salesforce-implementation', // salesforce
  'servicenow-implementation', // servicenow
  'braze-implementation', // martech
  'data-governance-consulting', // data-observability
];

export function isPromotedLP(slug: string): boolean {
  return PROMOTED_LP_SLUGS.includes(slug);
}

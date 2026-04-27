/**
 * Client-name anonymization.
 *
 * Policy (strict, site-wide): real client names never render on ACI's site.
 * Case studies, blog posts, and every panel in Atheros read through the
 * `displayClient` helper, which returns the `client_descriptor` field
 * (an industry-and-scale phrase like "Fortune 500 Financial Services Client").
 * If the descriptor is missing, we fall back to a neutral generic. We
 * deliberately do NOT fall back to `client` or `client_name` so a missing
 * descriptor surfaces as a visible "Enterprise Client" and prompts the
 * content team to fill it, rather than silently leaking the real name.
 *
 * Source of truth:
 *   - DB: case_studies.client_descriptor (added in the Part-1 migration).
 *   - Hardcoded JSX data: a matching client_descriptor field on each entry.
 *
 * Accepts any shape that exposes an optional descriptor. Accepts the legacy
 * `client` / `client_name` fields for typing purposes only; it does not
 * read them.
 */

export type AnonymizableCaseStudyLike = {
  client_descriptor?: string | null;
  // The following fields are listed so TS accepts legacy shapes without
  // complaining, but `displayClient` never reads them.
  client?: string | null;
  client_name?: string | null;
};

export const DEFAULT_CLIENT_DESCRIPTOR = 'Enterprise Client' as const;

/**
 * Return the safe display string for a case-study-shaped row.
 * Always returns a non-empty string. Never returns a real client name.
 */
export function displayClient(row: AnonymizableCaseStudyLike | null | undefined): string {
  if (!row) return DEFAULT_CLIENT_DESCRIPTOR;
  const descriptor = row.client_descriptor?.trim();
  if (descriptor && descriptor.length > 0) return descriptor;
  return DEFAULT_CLIENT_DESCRIPTOR;
}

/**
 * Convenience for log-style contexts that want the client descriptor or a
 * provided fallback without allocating a new object.
 */
export function displayClientOr(
  row: AnonymizableCaseStudyLike | null | undefined,
  fallback: string,
): string {
  const descriptor = row?.client_descriptor?.trim();
  return descriptor && descriptor.length > 0 ? descriptor : fallback;
}

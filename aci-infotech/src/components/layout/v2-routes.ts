/**
 * V2 chrome rollout policy.
 *
 * The marketing site uses NavV2 + FooterV2 on every page by default.
 * `V1_LEGACY_PREFIXES` is the escape hatch: any path matching one of
 * its prefixes falls back to the v1 Navigation + Footer instead.
 * Currently empty — every section has migrated.
 *
 * If a section needs to roll back to v1 chrome (e.g. a regression
 * surfaces on /case-studies/[slug] but the rest of the site is
 * fine), add the prefix to V1_LEGACY_PREFIXES and redeploy. No
 * other code changes are needed.
 *
 * Routes that bypass nav/footer entirely (admin, landing pages, v2
 * previews, the staging v2 root) are filtered out by
 * ConditionalLayout BEFORE this function runs, so they're not
 * affected either way.
 */

export const V1_LEGACY_PREFIXES: readonly string[] = [];

/**
 * True when the given pathname should render V2 chrome (NavV2 +
 * FooterV2). False only when the pathname matches the v1 legacy
 * allowlist above.
 */
export function isV2NavRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  const onV1 = V1_LEGACY_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );
  return !onV1;
}

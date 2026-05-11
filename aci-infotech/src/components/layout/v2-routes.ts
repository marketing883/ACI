/**
 * Section-by-section V2 chrome migration.
 *
 * The site is rolling from the V1 Navigation/Footer to NavV2/FooterV2
 * one route group at a time so a regression on one section never
 * takes down the whole marketing site. ConditionalLayout reads this
 * list and renders V2 chrome on matching routes, V1 chrome on the
 * rest.
 *
 * To migrate a section:
 *   1. Add its top-level prefix to V2_NAV_PREFIXES below.
 *   2. Smoke-test that section's pages (top of page, scrolled, mega
 *      menu interactions, footer links).
 *   3. Ship.
 *
 * To roll back a section:
 *   - Remove its prefix from the list and redeploy. No code changes
 *     needed in the section itself.
 *
 * Notes:
 *   - The homepage (`/`) and `/preview/v2-home` are excluded on
 *     purpose. They use V2 chrome but inject it themselves through
 *     V2HomeContent so the nav can sit transparent over the hero;
 *     adding `/` here would cause double-render.
 *   - Admin routes (`/admin`) and landing pages (`/lp`) are excluded
 *     by ConditionalLayout regardless of this list.
 */

export const V2_NAV_PREFIXES: readonly string[] = [
  '/careers',
];

/**
 * True when the given pathname should render V2 chrome (NavV2 +
 * FooterV2) instead of the V1 Navigation + Footer.
 */
export function isV2NavRoute(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return V2_NAV_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );
}

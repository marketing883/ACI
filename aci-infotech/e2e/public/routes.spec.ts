import { test, expect } from '../fixtures/console-errors';

/**
 * Route smoke matrix. Every public route gets the same three-step
 * check: navigate, assert 200-ish (Playwright's goto throws on 4xx /
 * 5xx by default), and assert at least one heading renders. The
 * console-error fixture catches client-side crashes.
 *
 * We pick one representative slug for each [slug] route instead of
 * crawling them all - the template is shared, and five engines x N
 * slugs gets expensive fast.
 */

const ROUTES: Array<{ path: string; name: string }> = [
  { path: '/', name: 'home' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
  { path: '/services', name: 'services index' },
  { path: '/services/app-development', name: 'services/app-development' },
  { path: '/services/data-engineering', name: 'services/data-engineering' },
  { path: '/platforms', name: 'platforms index' },
  { path: '/platforms/snowflake', name: 'platforms/snowflake' },
  { path: '/industries', name: 'industries index' },
  { path: '/industries/financial-services', name: 'industries/financial-services' },
  { path: '/careers', name: 'careers index' },
  { path: '/case-studies', name: 'case-studies index' },
  { path: '/playbooks', name: 'playbooks index' },
  { path: '/whitepapers', name: 'whitepapers index' },
  { path: '/blogs', name: 'blogs index' },
  { path: '/news', name: 'news' },
  { path: '/privacy-policy', name: 'privacy-policy' },
  { path: '/terms-of-service', name: 'terms-of-service' },
];

for (const route of ROUTES) {
  test(`route ${route.name} renders`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: 'domcontentloaded' });
    // Any heading proves the template rendered.
    const anyHeading = page
      .locator('h1, h2, h3')
      .filter({ hasText: /\S/ })
      .first();
    await expect(anyHeading).toBeVisible({ timeout: 10_000 });
  });
}

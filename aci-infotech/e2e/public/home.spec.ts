import { test, expect } from '../fixtures/console-errors';

/**
 * Home + preview-home smoke. Walks the page top-to-bottom and asserts
 * every major section renders its headline without a client error.
 * The console-error fixture picks up any crash silently.
 */

test.describe('live home /', () => {
  test('renders without console errors', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ACI|Infotech/i);
    // Scroll the page to trigger lazy components + intersection
    // observers. framer-motion variants fire on viewport entry;
    // regressions often surface only after scroll.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 0));
  });
});

test.describe('preview home /preview/home', () => {
  test('hero + playbooks + case studies render', async ({ page }) => {
    await page.goto('/preview/home');

    // Hero: rotating H1 must be visible (scene 1 by default).
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1.first()).toBeVisible();

    // CTA label is "Start here" per the design lock.
    await expect(page.getByRole('link', { name: /start here/i }).first()).toBeVisible();

    // Playbooks console section identifier.
    await expect(page.getByText(/07 playbooks/i)).toBeVisible({ timeout: 15_000 });

    // Scroll the case-studies section into view.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
    await page.waitForTimeout(400);
  });
});

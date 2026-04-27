import { test, expect } from '../fixtures/console-errors';

/**
 * Admin surface smoke. Without credentials we can only verify the
 * login page renders cleanly across engines. With `E2E_ADMIN_USER` /
 * `E2E_ADMIN_PASS` env vars set we also log in and spot-check the
 * dashboard table overflow fix.
 *
 * The login page is still worth running on every engine - it exercises
 * `useSearchParams()` inside Suspense, which has broken in past Next
 * upgrades on Safari specifically.
 */

test('admin login page renders', async ({ page }) => {
  await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible({
    timeout: 10_000,
  });
  // A password field must exist.
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test.describe('with credentials', () => {
  const user = process.env.E2E_ADMIN_USER;
  const pass = process.env.E2E_ADMIN_PASS;
  test.skip(!user || !pass, 'E2E_ADMIN_USER / E2E_ADMIN_PASS not set');

  test('job-applications table is horizontally scrollable on mobile', async ({
    page,
  }) => {
    await page.goto('/admin/login', { waitUntil: 'domcontentloaded' });
    await page.locator('input[type="email"]').fill(user!);
    await page.locator('input[type="password"]').fill(pass!);
    await page.getByRole('button', { name: /sign in|log in/i }).click();
    await page.waitForURL(/\/admin(\/|$)/, { timeout: 15_000 });

    await page.goto('/admin/job-applications', { waitUntil: 'domcontentloaded' });
    // The fix wraps the table in an overflow-x-auto div.
    const scroller = page
      .locator('.overflow-x-auto')
      .filter({ has: page.locator('table') });
    await expect(scroller).toBeVisible({ timeout: 15_000 });
  });
});

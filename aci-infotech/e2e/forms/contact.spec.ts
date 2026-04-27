import { test, expect } from '../fixtures/console-errors';

/**
 * Contact form smoke. Fills every visible field and asserts the page
 * renders without client errors. We do NOT actually submit to avoid
 * polluting the real Supabase contacts table on every test run; the
 * submit path is covered separately by server-side integration tests.
 */

test('contact form renders + inputs are typable', async ({ page }) => {
  await page.goto('/contact', { waitUntil: 'domcontentloaded' });

  // Find the first name-like input by label or placeholder.
  const nameInput = page
    .getByLabel(/name/i)
    .or(page.getByPlaceholder(/name/i))
    .first();
  await expect(nameInput).toBeVisible({ timeout: 10_000 });
  await nameInput.fill('Playwright Test');
  await expect(nameInput).toHaveValue('Playwright Test');

  const emailInput = page
    .getByLabel(/email/i)
    .or(page.getByPlaceholder(/email/i))
    .first();
  await emailInput.fill('e2e@example.com');
  await expect(emailInput).toHaveValue('e2e@example.com');

  const messageInput = page
    .getByLabel(/message/i)
    .or(page.getByPlaceholder(/message|tell us/i))
    .first();
  await messageInput.fill('This is an automated Playwright smoke test.');
});

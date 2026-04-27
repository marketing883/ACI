import { test, expect } from '../fixtures/console-errors';

/**
 * Careers application form smoke. Navigates to the careers listing,
 * opens the first available job, fills the form (without submitting
 * so we don't pollute the real jobs inbox), and asserts the resume
 * input accepts a PDF under the new MIME-aware `accept` list.
 *
 * The point of this spec is not submission - it's catching browser-
 * specific input weirdness (Safari rejecting valid PDFs, drag-drop
 * breaking on mobile, etc.).
 */

const RESUME_FIXTURE = 'e2e/fixtures/sample-resume.pdf';

test('careers apply form renders and accepts a PDF', async ({ page }) => {
  await page.goto('/careers', { waitUntil: 'domcontentloaded' });

  // Click into the first open role. Careers grid renders as links to
  // /careers/[slug].
  const firstRole = page.locator('a[href^="/careers/"]').first();
  // Some viewports render the careers list empty if Supabase isn't
  // seeded; skip gracefully in that case rather than failing the
  // whole matrix on an environment issue.
  const roleCount = await firstRole.count();
  test.skip(roleCount === 0, 'no careers seeded in this environment');

  await firstRole.click();
  await page.waitForLoadState('domcontentloaded');

  // Apply CTA brings the form into view.
  const firstName = page
    .getByLabel(/first name/i)
    .or(page.getByPlaceholder(/first name/i))
    .first();
  await expect(firstName).toBeVisible({ timeout: 15_000 });
  await firstName.fill('Playwright');

  const lastName = page
    .getByLabel(/last name/i)
    .or(page.getByPlaceholder(/last name/i))
    .first();
  await lastName.fill('Smoke');

  const email = page
    .getByLabel(/email/i)
    .or(page.getByPlaceholder(/email/i))
    .first();
  await email.fill('e2e@example.com');

  // Resume is the key assertion - Safari used to reject extension-only
  // accept lists. The fix widened `accept` to include MIME types.
  const resume = page.locator('input[type="file"]').first();
  await resume.setInputFiles(RESUME_FIXTURE);
  // The input should have exactly one file attached; if Safari
  // rejected the MIME it would be empty.
  const files = await resume.evaluate(
    (el: HTMLInputElement) => el.files?.length ?? 0,
  );
  expect(files).toBe(1);
});

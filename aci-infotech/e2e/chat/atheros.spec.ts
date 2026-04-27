import { test, expect } from '../fixtures/console-errors';

/**
 * Atheros chat regression tests.
 *
 * The bug that motivated this matrix: tapping the mobile Atheros pill
 * on iOS Safari threw "Application error: a client-side exception has
 * occurred". Root cause was a mixed-type framer-motion animation on
 * MobileSheet's y axis combined with a race between AtherosNudge's
 * seed dispatch and ChatColumn mounting.
 *
 * These specs lock in the fix: tapping the pill on every engine must
 * open the sheet with zero console errors, and typing must land a
 * character in the input.
 */

test.describe('mobile pill (iphone-14 + pixel-7)', () => {
  test.skip(
    ({ browserName, isMobile }) => !isMobile,
    'mobile-only surface',
  );

  test('tapping the pill opens the converse sheet without crashing', async ({ page }) => {
    await page.goto('/preview/home', { waitUntil: 'domcontentloaded' });

    const pill = page.getByRole('button', { name: /atheros|ask/i }).first();
    await expect(pill).toBeVisible({ timeout: 10_000 });
    await pill.tap();

    // MobileSheet is a role=dialog with aria-label "Atheros".
    const sheet = page.getByRole('dialog', { name: /atheros/i });
    await expect(sheet).toBeVisible({ timeout: 8_000 });

    // Input should be typable; a crash in ChatColumn would blank the
    // sheet before this ever hits.
    const input = sheet.getByRole('textbox').first();
    await expect(input).toBeVisible({ timeout: 5_000 });
    await input.fill('what do you do for retail?');
    await expect(input).toHaveValue(/retail/i);
  });
});

test.describe('desktop chat (chromium/firefox/webkit-desktop)', () => {
  test.skip(
    ({ isMobile }) => isMobile,
    'desktop-only surface',
  );

  test('chat button opens ConsultationShell without crashing', async ({ page }) => {
    await page.goto('/preview/home', { waitUntil: 'domcontentloaded' });

    // Desktop chat button lives in ChatWidget; open via the 'atheros:open'
    // event (same path AtherosNudge uses) so we're agnostic to the
    // exact button markup.
    await page.evaluate(() =>
      window.dispatchEvent(new CustomEvent('atheros:open')),
    );

    const shell = page
      .getByRole('dialog', { name: /atheros/i })
      .or(page.locator('[data-atheros-shell]'));
    await expect(shell.first()).toBeVisible({ timeout: 8_000 });
  });
});

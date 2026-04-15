/**
 * Console-error collector fixture. Every spec that imports `test`
 * from this module automatically fails if the page under test logs
 * a `console.error` or a `pageerror` during the scenario.
 *
 * This is how we catch regressions like the iOS Atheros crash without
 * writing explicit assertions on every spec - any uncaught client
 * exception bubbles up as a pageerror and flunks the test.
 *
 * A small allow-list filters out noise that isn't our code: third-
 * party analytics beacons, missing favicons in dev, etc. Add sparingly.
 */
import { test as base, expect, type ConsoleMessage } from '@playwright/test';

const ALLOWLIST: RegExp[] = [
  // Next.js dev-only fast-refresh warnings
  /\[Fast Refresh\]/i,
  // Favicon noise in dev
  /favicon\.ico/i,
  // Supabase realtime reconnect spam when offline
  /realtime.*reconnect/i,
  // React hydration warnings that are non-fatal (keep tight)
  // Leave out - we want to fail on hydration errors.
];

function isAllowed(text: string): boolean {
  return ALLOWLIST.some((re) => re.test(text));
}

export const test = base.extend<{ failOnConsoleError: void }>({
  failOnConsoleError: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = [];

      const onConsole = (msg: ConsoleMessage) => {
        if (msg.type() !== 'error') return;
        const text = msg.text();
        if (isAllowed(text)) return;
        errors.push(`[console.error] ${text}`);
      };
      const onPageError = (err: Error) => {
        errors.push(`[pageerror] ${err.message}\n${err.stack ?? ''}`);
      };

      page.on('console', onConsole);
      page.on('pageerror', onPageError);

      await use();

      page.off('console', onConsole);
      page.off('pageerror', onPageError);

      if (errors.length > 0) {
        await testInfo.attach('console-errors.txt', {
          body: errors.join('\n\n'),
          contentType: 'text/plain',
        });
        // Fail loud with the first error so the Playwright report
        // shows a meaningful message in the test title.
        throw new Error(
          `Page produced ${errors.length} console error(s):\n\n${errors.join('\n\n')}`,
        );
      }
    },
    { auto: true },
  ],
});

export { expect };

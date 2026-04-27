import { defineConfig, devices } from '@playwright/test';

/**
 * Cross-browser regression matrix for the ACI site.
 *
 * Five projects cover the browsers our visitors actually use:
 *   - chromium-desktop : Chrome / Edge / Brave desktop
 *   - firefox-desktop  : Firefox desktop
 *   - webkit-desktop   : Safari desktop (also catches iPad Safari)
 *   - iphone-14        : iOS Safari via the real WebKit engine
 *   - pixel-7          : Android Chrome at a realistic mobile viewport
 *
 * Every spec in `e2e/` runs on every project unless it tags itself
 * with a project filter (e.g. `test.skip(({ browserName }) => ...)`).
 *
 * The web server runs `next start` in CI (after a prebuild) and
 * `next dev` locally so iterating on a failing test stays fast.
 */
const PORT = Number(process.env.E2E_PORT ?? 3000);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;
const IS_CI = !!process.env.CI;

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 2 : undefined,
  reporter: IS_CI ? [['html'], ['github']] : [['html'], ['list']],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'webkit-desktop',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      // The Atheros pill crash reproduced on iOS Safari; this project
      // is the one that must stay green for that class of bug.
      name: 'iphone-14',
      use: { ...devices['iPhone 14'] },
    },
    {
      name: 'pixel-7',
      use: { ...devices['Pixel 7'] },
    },
  ],

  webServer: {
    command: IS_CI ? 'npm run build && npm run start' : 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !IS_CI,
    timeout: 180_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});

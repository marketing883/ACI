#!/usr/bin/env node

/**
 * Prebuild env-validation guard.
 *
 * Runs before `next build` (wired via the `prebuild` npm script) and
 * aborts with a non-zero exit if required environment variables are
 * missing or obviously wrong. Catches the silent-fallback failure
 * mode early — where a missing Supabase key would let the CMS
 * fetchers return empty arrays, and the site would ship without any
 * real case studies, news, or blog posts.
 *
 * Exports / checks:
 *   - NEXT_PUBLIC_SUPABASE_URL          (required)
 *   - NEXT_PUBLIC_SITE_URL              (required, not localhost)
 *   - SUPABASE_SERVICE_ROLE_KEY         (preferred) OR
 *     NEXT_PUBLIC_SUPABASE_ANON_KEY     (fallback)    — at least one
 *
 * If only anon is present, a warning is printed (server-side reads
 * will be subject to RLS). If neither key is present, the build
 * fails.
 *
 * Note: `.env.staging` is NOT one of the env files Next auto-loads.
 * Callers are expected to source it into the shell before invoking
 * `npm run build` (see docs/staging.md).
 */

const CORE_REQUIRED = [
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    hint: 'Point at the Supabase project URL used by this environment.',
  },
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    hint: 'Absolute URL this build serves from (e.g. https://staging.aciinfotech.com). Must not be localhost in production/staging builds.',
  },
];

const isStaging = process.env.NEXT_PUBLIC_USE_V2_HOME === 'true';
const missing = [];
const warnings = [];

for (const req of CORE_REQUIRED) {
  const value = process.env[req.name];
  if (!value || value.trim() === '') {
    missing.push({ name: req.name, hint: req.hint, reason: 'missing' });
    continue;
  }
  if (
    req.name === 'NEXT_PUBLIC_SITE_URL' &&
    /^https?:\/\/localhost/i.test(value.trim())
  ) {
    missing.push({
      name: req.name,
      hint: req.hint,
      reason: `points at localhost (${value.trim()}) — must be the absolute hostname this build serves`,
    });
  }
}

// The anon key is required, not one-of-two. `next build` prerenders pages
// that construct a browser Supabase client through @supabase/ssr, and that
// client needs the URL and the anon key specifically - the service-role key
// does not satisfy it.
//
// This used to accept either key. A staging build passed this check with
// only the service-role key set, compiled, ran TypeScript, and then died
// ninety seconds later prerendering /admin/analytics with "@supabase/ssr:
// Your project's URL and API key are required". The whole point of this
// script is to catch that in one second instead, so it now names the key
// the build actually needs.
const hasServiceKey = !!(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const hasAnonKey = !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
if (!hasAnonKey) {
  missing.push({
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    reason: 'missing',
    hint: 'Required at build time: prerendered pages build a @supabase/ssr browser client, which needs the anon key. SUPABASE_SERVICE_ROLE_KEY does not substitute for it.',
  });
}
if (!hasServiceKey && !hasAnonKey) {
  missing.push({
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    reason: 'also not set',
    hint: 'Server-side reads fall back to the anon key and are then subject to RLS, so unpublished rows go missing. Set the service-role key for any real deployment.',
  });
} else if (!hasServiceKey) {
  warnings.push(
    'SUPABASE_SERVICE_ROLE_KEY is not set — falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY. Server-side reads will be subject to RLS; unpublished or private rows will be invisible.',
  );
}

if (missing.length > 0) {
  const border = '═'.repeat(72);
  console.error(`\n${border}`);
  console.error('  ✗ Build aborted — required environment variables are missing:');
  console.error(border);
  for (const m of missing) {
    console.error(`\n  • ${m.name}`);
    console.error(`      ${m.reason}`);
    console.error(`      ${m.hint}`);
  }
  console.error(
    `\n  Build context: ${isStaging ? 'STAGING (NEXT_PUBLIC_USE_V2_HOME=true)' : 'PRODUCTION'}`,
  );
  console.error(
    `\n  Set the variables above in the env file systemd loads for this`,
  );
  console.error(
    `  service (prod: .env ; staging: .env.staging) and re-run npm run build.`,
  );
  console.error(`${border}\n`);
  process.exit(1);
}

for (const w of warnings) {
  console.warn(`[check-build-env] warn: ${w}`);
}

console.log(
  `[check-build-env] OK — required env vars present (${isStaging ? 'staging' : 'production'} build).`,
);

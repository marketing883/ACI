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

// At least one Supabase key must be present. Service-role is preferred
// (server-side reads bypass RLS); anon is the fallback for local dev.
// Without either, the CMS fetchers have nothing to call.
const hasServiceKey = !!(process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
const hasAnonKey = !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
if (!hasServiceKey && !hasAnonKey) {
  missing.push({
    name: 'SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY',
    reason: 'neither is set',
    hint: 'Set SUPABASE_SERVICE_ROLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY. At least one is required for the CMS fetchers to read published content.',
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

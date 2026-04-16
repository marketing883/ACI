#!/usr/bin/env tsx
/**
 * One-shot DB fixer for case_studies. Uses SUPABASE_SERVICE_ROLE_KEY
 * (bypasses RLS). Idempotent — re-runs are safe.
 *
 * What it does:
 *  1. Fixes the duplicated word in the MSCI row's title
 *     ("...SAP Transformation Transformation" -> "...SAP Transformation")
 *  2. Backfills `services` for 6 published rows that shipped with no
 *     services tag. Inferred from each row's title + excerpt; mark this
 *     output and double-check in the admin UI before considering it
 *     final.
 *  3. Anonymizes `client_name` for the two rows that still carry a real
 *     client brand:
 *       - Sodexo  -> "Global Hospitality Services Leader"
 *       - Nestle  -> "Global CPG & Beverage Leader"
 *
 * The script does a SELECT first (preview), prints the change set, then
 * applies the UPDATEs. Run with --dry-run to preview without writing.
 *
 * Usage:
 *   cd aci-infotech
 *   npx tsx scripts/fix-case-studies.ts            # apply
 *   npx tsx scripts/fix-case-studies.ts --dry-run  # preview only
 */
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const log = (...args: unknown[]) => console.log(...args);
const dryRun = process.argv.includes('--dry-run');

if (!existsSync('.env.local')) {
  log('FATAL: .env.local not found. Run from aci-infotech/ directory.');
  process.exit(1);
}
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  log('FATAL: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

interface Update {
  slug: string;
  why: string;
  changes: Record<string, unknown>;
}

const updates: Update[] = [
  {
    slug: 'modernizes-finance-reporting-with-sap-transformation',
    why: 'Title has duplicated "Transformation" word.',
    changes: {
      title: 'Modernizing Finance & Reporting with SAP Transformation',
    },
  },
  // Empty services backfills (best-effort inferred from title + excerpt).
  {
    slug: 'modernizes-finance-reporting-with-sap-transformation',
    why: 'services empty — inferred SAP S/4HANA modernization tags.',
    changes: { services: ['Enterprise Integration', 'Data Engineering'] },
  },
  {
    slug: 'modernizing-wealth-advisory-crm-with-aci-s-salesforce-expertise',
    why: 'services empty — inferred Salesforce CRM migration tags.',
    changes: { services: ['MarTech & CDP', 'Enterprise Integration'] },
  },
  {
    slug: 'aci-infotech-powers-enterprise-cloud-modernization-with-proven-excellence',
    why: 'services empty — inferred Azure cloud migration tag.',
    changes: { services: ['Cloud Modernization'] },
  },
  {
    slug: 'aci-drives-shift-left-cybersecurity-for-medical-device-innovation',
    why: 'services empty — inferred shift-left security automation tag.',
    changes: { services: ['DevOps & Platform'] },
  },
  {
    slug: 'healthcare-cloud-transformation-aws-case-study',
    why: 'services empty — inferred AWS cloud + DevOps tags.',
    changes: { services: ['Cloud Modernization', 'DevOps & Platform'] },
  },
  {
    slug: 'from-fragmented-systems-to-intelligent-billing-aci-s-sap-transformation',
    why: 'services empty — inferred SAP BRIM billing tag.',
    changes: { services: ['Enterprise Integration'] },
  },
  // Anonymize remaining real client_name values.
  {
    slug: 'global-food-facilities-data-intelligence',
    why: 'client_name "Sodexo" is the real brand — replace with descriptor.',
    changes: { client_name: 'Global Hospitality Services Leader' },
  },
  {
    slug: 'global-cpg-self-service-analytics-brand-managers',
    why: 'client_name "Nestle" is the real brand — replace with descriptor.',
    changes: { client_name: 'Global CPG & Beverage Leader' },
  },
];

async function main() {
  log(`\n=== fix-case-studies ${dryRun ? '(DRY RUN)' : '(APPLY)'} ===\n`);

  for (const u of updates) {
    const { data: before, error: readErr } = await supabase
      .from('case_studies')
      .select('slug, title, services, client_name')
      .eq('slug', u.slug)
      .single();

    if (readErr || !before) {
      log(`SKIP ${u.slug}: row not found (${readErr?.message ?? 'no data'})`);
      continue;
    }

    // Decide if this update would actually change anything.
    const noOp = Object.entries(u.changes).every(([k, v]) => {
      const cur = (before as Record<string, unknown>)[k];
      return JSON.stringify(cur) === JSON.stringify(v);
    });
    if (noOp) {
      log(`OK    ${u.slug}: already matches (${Object.keys(u.changes).join(', ')}).`);
      continue;
    }

    log(`\nFIX   ${u.slug}`);
    log(`      reason: ${u.why}`);
    for (const [k, v] of Object.entries(u.changes)) {
      const cur = (before as Record<string, unknown>)[k];
      log(`      ${k}: ${JSON.stringify(cur)}`);
      log(`           -> ${JSON.stringify(v)}`);
    }

    if (dryRun) continue;

    const { error: updErr } = await supabase
      .from('case_studies')
      .update(u.changes)
      .eq('slug', u.slug);

    if (updErr) {
      log(`      *** UPDATE FAILED: ${updErr.message}`);
    } else {
      log(`      applied.`);
    }
  }

  log('\nDone.\n');
}

main().catch(e => {
  log('FATAL:', e);
  process.exit(1);
});

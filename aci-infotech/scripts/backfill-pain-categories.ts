#!/usr/bin/env tsx
/**
 * One-shot backfill: categorize existing pain_point values that don't yet
 * have a pain_point_category. Uses the same categorizePainPoint() function
 * that the real-time path uses (Claude Haiku, temperature 0).
 *
 * Safe to re-run: only processes rows with pain_point IS NOT NULL AND
 * pain_point_category IS NULL. Rate-limited to 1 call/200ms to avoid
 * API throttling.
 *
 * Usage:
 *   cd aci-infotech
 *   npx tsx scripts/backfill-pain-categories.ts            # apply
 *   npx tsx scripts/backfill-pain-categories.ts --dry-run   # preview only
 */
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// Inline the categorize function's import since tsx scripts can't
// always resolve @/ aliases cleanly. We import it dynamically.

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

async function main() {
  log(`\n=== backfill-pain-categories ${dryRun ? '(DRY RUN)' : '(APPLY)'} ===\n`);

  // Dynamically import the categorize function so we get proper API clients.
  const { categorizePainPoint } = await import('../src/lib/intelligence');

  const supabase = createClient(supabaseUrl!, serviceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Find rows that need categorization.
  const { data, error } = await supabase
    .from('chat_leads')
    .select('id, pain_point')
    .not('pain_point', 'is', null)
    .is('pain_point_category', null)
    .limit(1000);

  if (error) {
    log('Query failed:', error.message);
    process.exit(1);
  }

  const rows = (data ?? []) as Array<{ id: string; pain_point: string }>;
  log(`Found ${rows.length} rows to categorize.\n`);

  if (rows.length === 0) {
    log('Nothing to do.\n');
    return;
  }

  let done = 0;
  let skipped = 0;
  for (const row of rows) {
    const painText = row.pain_point?.trim();
    if (!painText || painText.length < 5) {
      log(`SKIP  ${row.id}: pain_point too short ("${painText}")`);
      skipped++;
      continue;
    }

    log(`[${done + 1}/${rows.length}] ${row.id}: "${painText.slice(0, 80)}${painText.length > 80 ? '...' : ''}"`);

    if (dryRun) {
      log('       (dry run — would call categorizePainPoint)');
      done++;
      continue;
    }

    try {
      const category = await categorizePainPoint(painText);
      if (category) {
        const { error: updateErr } = await supabase
          .from('chat_leads')
          .update({ pain_point_category: category })
          .eq('id', row.id);
        if (updateErr) {
          log(`       *** UPDATE FAILED: ${updateErr.message}`);
        } else {
          log(`       -> "${category}"`);
          done++;
        }
      } else {
        log('       -> (null — LLM returned nothing usable)');
        skipped++;
      }
    } catch (err) {
      log(`       *** ERROR: ${err}`);
      skipped++;
    }

    // Rate-limit: 200ms between calls to avoid API throttling.
    await new Promise((r) => setTimeout(r, 200));
  }

  log(`\nDone. Categorized: ${done}, Skipped: ${skipped}.\n`);
}

main().catch((e) => {
  log('FATAL:', e);
  process.exit(1);
});

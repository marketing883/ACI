#!/usr/bin/env tsx
/**
 * Audit script: list all case_studies in Supabase with anonymization
 * status. Read-only.
 *
 * Usage: from aci-infotech/, run:
 *   npx tsx scripts/audit-case-studies.ts
 */
import { readFileSync, existsSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

// Load .env.local manually (no dotenv dep). Send all output to stdout so
// `> file.txt` captures everything (including diagnostics).
const log = (...args: unknown[]) => console.log(...args);

if (!existsSync('.env.local')) {
  log('FATAL: .env.local not found. Run from aci-infotech/ directory.');
  process.exit(1);
}

for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

log('=== Diagnostics ===');
log('SUPABASE_URL:        ', supabaseUrl ? `${supabaseUrl.slice(0, 30)}...` : '(MISSING)');
log('ANON_KEY:            ', anonKey ? `${anonKey.slice(0, 12)}...${anonKey.slice(-6)}` : '(MISSING)');
log('SERVICE_ROLE_KEY:    ', serviceKey ? `${serviceKey.slice(0, 12)}...${serviceKey.slice(-6)}` : '(MISSING)');
log('');

if (!supabaseUrl || !anonKey) {
  log('FATAL: Missing SUPABASE env vars.');
  process.exit(1);
}

// Try anon first; if no rows, retry with service-role (RLS bypass).
async function tryQuery(key: string, label: string) {
  const supabase = createClient(supabaseUrl!, key);
  log(`--- Query attempt with ${label} ---`);
  const { data, error, count } = await supabase
    .from('case_studies')
    .select('slug, title, client_name, client_descriptor, status, excerpt, services, industry, is_featured, published_at', { count: 'exact' })
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) {
    log(`ERROR (${label}):`, JSON.stringify(error, null, 2));
    return null;
  }
  log(`Rows returned (${label}): ${data?.length ?? 0} (count: ${count ?? 'n/a'})`);
  return data;
}

async function main() {
  let data = await tryQuery(anonKey!, 'anon');

  if ((!data || data.length === 0) && serviceKey) {
    log('\nAnon returned no rows — retrying with service_role to bypass RLS...\n');
    data = await tryQuery(serviceKey, 'service_role');
  }

  if (!data || data.length === 0) {
    log('\nNo case studies found via either key. Check RLS policies or table contents.');
    return;
  }

  if (!data) {
    console.log('No rows.');
    return;
  }

  console.log(`\nFound ${data.length} case studies in Supabase:\n`);
  console.log('='.repeat(100));

  for (const row of data) {
    const leakInExcerpt = row.client_name && row.excerpt &&
      row.excerpt.toLowerCase().includes(row.client_name.toLowerCase());
    const leakInTitle = row.client_name && row.title &&
      row.title.toLowerCase().includes(row.client_name.toLowerCase());
    const missingDescriptor = !row.client_descriptor;

    console.log(`\nSLUG:        ${row.slug}`);
    console.log(`TITLE:       ${row.title}`);
    console.log(`CLIENT:      ${row.client_name || '(none)'}`);
    console.log(`DESCRIPTOR:  ${row.client_descriptor || '(MISSING — falls back to "Enterprise Client")'}`);
    console.log(`STATUS:      ${row.status}    FEATURED: ${row.is_featured ? 'yes' : 'no'}`);
    console.log(`INDUSTRY:    ${row.industry || '(none)'}`);
    console.log(`SERVICES:    ${Array.isArray(row.services) ? row.services.join(', ') : row.services || '(none)'}`);

    if (leakInTitle) console.log(`*** LEAK in TITLE: contains "${row.client_name}"`);
    if (leakInExcerpt) console.log(`*** LEAK in EXCERPT: contains "${row.client_name}"`);
    if (missingDescriptor) console.log(`*** MISSING DESCRIPTOR (will render as "Enterprise Client")`);

    if (row.excerpt) {
      const snippet = row.excerpt.replace(/\s+/g, ' ').slice(0, 200);
      console.log(`EXCERPT:     ${snippet}${row.excerpt.length > 200 ? '...' : ''}`);
    }
  }

  console.log('\n' + '='.repeat(100));
  console.log(`\nSummary: ${data.length} total`);
  console.log(`  - published: ${data.filter(r => r.status === 'published').length}`);
  console.log(`  - draft: ${data.filter(r => r.status === 'draft').length}`);
  console.log(`  - missing client_descriptor: ${data.filter(r => !r.client_descriptor).length}`);
  console.log(`  - title leaks raw client_name: ${data.filter(r => r.client_name && r.title?.toLowerCase().includes(r.client_name.toLowerCase())).length}`);
  console.log(`  - excerpt leaks raw client_name: ${data.filter(r => r.client_name && r.excerpt?.toLowerCase().includes(r.client_name.toLowerCase())).length}`);
}

main();

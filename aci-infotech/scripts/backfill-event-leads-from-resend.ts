#!/usr/bin/env tsx
/**
 * Recover AION 2026 registrations from the Resend notification emails.
 *
 * Between the 23 July deploy and the schema fix, every registration was
 * rejected by PostgREST (the four discovery columns did not exist yet) while
 * the API still returned success and sent both emails. The visitor saw the
 * thank-you screen, the sales team got the notification, and event_leads
 * stayed empty. The notification email is the only surviving copy.
 *
 * This reads those emails back through the Resend API, parses the payload out
 * of the template in src/lib/email.ts, and inserts the rows into event_leads.
 *
 * Recovered: name, email, phone, company, designation, pain points, journey
 * stage, wants-a-1:1, all four discovery answers, utm source/campaign, and the
 * original registration time. Lost for good: utm medium/content/term,
 * referrer, ip, user agent.
 *
 * Safe to re-run: the unique index on (event_slug, lower(email)) rejects
 * anything already in the pool and the script counts it as present.
 *
 * Usage (on the server, where RESEND_API_KEY and the service key are set):
 *   cd aci-infotech
 *   npx tsx scripts/backfill-event-leads-from-resend.ts --dry-run   # preview
 *   npx tsx scripts/backfill-event-leads-from-resend.ts             # apply
 */
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import {
  parseEventLeadEmail,
  parseConfirmationEmail,
  REGISTRATION_SUBJECT_PREFIX,
  CONFIRMATION_SUBJECT_PREFIX,
  PARTIAL_PLACEHOLDER,
  type ParsedEventLead,
} from '../src/lib/event-leads-email-parse';

const log = (...args: unknown[]) => console.log(...args);
const dryRun = process.argv.includes('--dry-run');

const EVENT_SLUG = 'digital-trust-summit-2026';

// ---------------------------------------------------------------- env

for (const file of ['.env', '.env.local']) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    // .env.local is read second and overrides .env, matching Next.js.
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const resendKey = process.env.RESEND_API_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const missing = [
  !resendKey && 'RESEND_API_KEY',
  !supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL',
  !serviceKey && 'SUPABASE_SERVICE_ROLE_KEY',
].filter(Boolean);

if (missing.length) {
  log(`FATAL: ${missing.join(', ')} missing. Run this from aci-infotech/ on the server.`);
  process.exit(1);
}

type ParsedLead = ParsedEventLead & { emailId: string; createdAt: string };

// ------------------------------------------------------------------ csv

function writeCsv(leads: ParsedLead[]): string {
  const headers = [
    'Registered', 'Name', 'Email', 'Phone', 'Company', 'Designation',
    'Journey stage', 'Wants 1:1', 'Challenges', 'Other',
    'Team challenges', 'Reporting/analytics', 'AI/ML exploration', 'AI adoption challenge',
    'UTM source', 'UTM campaign', 'Resend email id',
  ];
  const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = leads.map((l) => [
    l.createdAt, l.full_name, l.email, l.phone, l.company_name, l.job_title,
    l.journey_stage, l.wants_expert_meeting ? 'Yes' : 'No',
    l.pain_points.join('; '), l.pain_point_other,
    l.team_challenges, l.reporting_challenges, l.ai_ml_exploration, l.ai_adoption_challenge,
    l.utm_source, l.utm_campaign, l.emailId,
  ].map(escape).join(','));
  const path = `event-leads-recovered-${new Date().toISOString().slice(0, 10)}.csv`;
  writeFileSync(path, [headers.map(escape).join(','), ...rows].join('\r\n'));
  return path;
}

// -------------------------------------------------- tier 2: confirmations

type ConfirmationRef = { id: string; created_at: string; subject: string; to: string[] };

// Last resort. A confirmation email holds the registrant's first name and, via
// Resend's `to` field, their address. Company and designation are NOT NULL on
// the table, so rows recovered this way carry a conspicuous placeholder and go
// in only when asked for with --include-partial. The CSV is written either way:
// it is enough to rebuild the draw pool and to mail these people for the rest.
async function recoverFromConfirmations(resend: Resend, confirmations: ConfirmationRef[]) {
  const includePartial = process.argv.includes('--include-partial');
  const found: Array<{ first_name: string; email: string; createdAt: string; emailId: string }> = [];
  const failed: Array<{ id: string; subject: string; reason: string }> = [];

  for (const mail of confirmations) {
    const recipient = mail.to[0];
    if (!recipient) {
      failed.push({ id: mail.id, subject: mail.subject, reason: 'no recipient on the record' });
      continue;
    }
    const { data, error } = await resend.emails.get(mail.id);
    if (error || !data?.html) {
      failed.push({ id: mail.id, subject: mail.subject, reason: error?.message ?? 'no html body' });
      continue;
    }
    const parsed = parseConfirmationEmail(data.html, recipient);
    if (!parsed) {
      failed.push({ id: mail.id, subject: mail.subject, reason: 'could not read the greeting' });
      continue;
    }
    found.push({ ...parsed, createdAt: mail.created_at, emailId: mail.id });
  }

  found.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const seen = new Set<string>();
  const unique = found.filter((r) => {
    if (seen.has(r.email)) return false;
    seen.add(r.email);
    return true;
  });

  const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csvPath = `event-leads-partial-${new Date().toISOString().slice(0, 10)}.csv`;
  writeFileSync(
    csvPath,
    [
      ['Registered', 'First name', 'Email', 'Resend email id'].map(escape).join(','),
      ...unique.map((r) => [r.createdAt, r.first_name, r.email, r.emailId].map(escape).join(',')),
    ].join('\r\n')
  );

  log(`Identified ${unique.length} registrant(s) from ${confirmations.length} confirmation(s).`);
  log(`Wrote ${csvPath}.`);
  log('Company, designation, phone, pain points and the discovery answers are');
  log('not in these emails. Mail these people to collect the rest.\n');

  if (!includePartial) {
    log('Not inserting: partial rows would sit on the dashboard missing everything');
    log('but a name. Re-run with --include-partial to insert them anyway, with a');
    log(`visible "${PARTIAL_PLACEHOLDER}" in the required columns.\n`);
  } else if (dryRun) {
    for (const r of unique) log(`  would insert  ${r.email.padEnd(34)} ${r.first_name}`);
  } else {
    const supabase = createClient(supabaseUrl!, serviceKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    let inserted = 0;
    let present = 0;
    for (const r of unique) {
      const { error } = await supabase.from('event_leads').insert({
        event_slug: EVENT_SLUG,
        full_name: r.first_name,
        email: r.email,
        company_name: PARTIAL_PLACEHOLDER,
        job_title: PARTIAL_PLACEHOLDER,
        pain_points: [],
        wants_expert_meeting: false,
        status: 'new',
        created_at: r.createdAt,
      });
      if (!error) {
        inserted++;
        log(`  inserted      ${r.email}`);
      } else if (error.code === '23505') {
        present++;
        log(`  already there ${r.email}`);
      } else {
        log(`  FAILED        ${r.email}: ${error.message}`);
      }
    }
    log(`\ninserted: ${inserted}, already in the pool: ${present}`);
  }

  for (const f of failed) log(`\n  unreadable: ${f.subject}\n    ${f.id}: ${f.reason}`);
  log('');
}

// ----------------------------------------------------------------- main

async function main() {
  log(`\n=== backfill-event-leads-from-resend ${dryRun ? '(DRY RUN)' : '(APPLY)'} ===\n`);

  const resend = new Resend(resendKey);

  // 1. Page through every sent email, keeping both kinds of event mail.
  const notifications: Array<{ id: string; created_at: string; subject: string }> = [];
  const confirmations: ConfirmationRef[] = [];
  let oldestSeen: string | null = null;
  let scanned = 0;
  let cursor: string | undefined;

  for (;;) {
    const { data, error } = await resend.emails.list(
      cursor ? { limit: 100, after: cursor } : { limit: 100 }
    );
    if (error) {
      log('FATAL: Resend list failed:', error.message ?? error);
      process.exit(1);
    }
    const page = data?.data ?? [];
    if (!page.length) break;

    for (const mail of page) {
      scanned++;
      if (!oldestSeen || mail.created_at < oldestSeen) oldestSeen = mail.created_at;
      if (mail.subject?.startsWith(REGISTRATION_SUBJECT_PREFIX)) {
        notifications.push({ id: mail.id, created_at: mail.created_at, subject: mail.subject });
      } else if (mail.subject?.startsWith(CONFIRMATION_SUBJECT_PREFIX)) {
        confirmations.push({
          id: mail.id,
          created_at: mail.created_at,
          subject: mail.subject,
          to: mail.to ?? [],
        });
      }
    }

    if (!data?.has_more) break;
    cursor = page[page.length - 1].id;
  }

  log(`Scanned ${scanned} sent emails, back to ${oldestSeen ?? 'n/a'}.`);
  log(`Found ${notifications.length} registration notifications, ${confirmations.length} attendee confirmations.`);
  log('If that is fewer than expected, Resend retention has trimmed the history.\n');

  if (!notifications.length && !confirmations.length) {
    log('Nothing to recover.\n');
    return;
  }

  // The notifications carry the whole submission. Only fall back to the
  // confirmations if they are not there, since those give up little more than
  // a name and an address.
  if (!notifications.length) {
    log('No notifications in Resend, so the full submissions are gone.');
    log('Falling back to the attendee confirmations: name and email only.\n');
    await recoverFromConfirmations(resend, confirmations);
    return;
  }

  // 2. Fetch each body and parse it.
  const parsed: ParsedLead[] = [];
  const failed: Array<{ id: string; subject: string; reason: string }> = [];

  for (const mail of notifications) {
    const { data, error } = await resend.emails.get(mail.id);
    if (error || !data?.html) {
      failed.push({ id: mail.id, subject: mail.subject, reason: error?.message ?? 'no html body' });
      continue;
    }
    const lead = parseEventLeadEmail(data.html);
    if (!lead) {
      failed.push({ id: mail.id, subject: mail.subject, reason: 'could not parse name/email/company/title' });
      continue;
    }
    parsed.push({ ...lead, emailId: mail.id, createdAt: mail.created_at });
  }

  // Someone could have submitted twice while the writes were failing, since
  // the duplicate check never ran. Keep the earliest of each address.
  parsed.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const seen = new Set<string>();
  const unique = parsed.filter((l) => {
    if (seen.has(l.email)) return false;
    seen.add(l.email);
    return true;
  });

  log(`Parsed ${parsed.length}, ${parsed.length - unique.length} duplicate submission(s) collapsed.`);
  const csvPath = writeCsv(unique);
  log(`Wrote ${csvPath} before touching the database.\n`);

  // 3. Insert.
  let inserted = 0;
  let present = 0;
  const insertFailed: Array<{ email: string; reason: string }> = [];

  if (dryRun) {
    for (const l of unique) {
      log(`  would insert  ${l.email.padEnd(34)} ${l.company_name} (${l.createdAt.slice(0, 10)})`);
    }
  } else {
    const supabase = createClient(supabaseUrl!, serviceKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    for (const l of unique) {
      const { error } = await supabase.from('event_leads').insert({
        event_slug: EVENT_SLUG,
        full_name: l.full_name,
        email: l.email,
        phone: l.phone,
        company_name: l.company_name,
        job_title: l.job_title,
        pain_points: l.pain_points,
        pain_point_other: l.pain_point_other,
        journey_stage: l.journey_stage,
        wants_expert_meeting: l.wants_expert_meeting,
        team_challenges: l.team_challenges,
        reporting_challenges: l.reporting_challenges,
        ai_ml_exploration: l.ai_ml_exploration,
        ai_adoption_challenge: l.ai_adoption_challenge,
        utm_source: l.utm_source,
        utm_campaign: l.utm_campaign,
        status: 'new',
        // Keep the real registration time so ordering and the "This week"
        // tile stay honest.
        created_at: l.createdAt,
      });

      if (!error) {
        inserted++;
        log(`  inserted      ${l.email}`);
      } else if (error.code === '23505') {
        present++;
        log(`  already there ${l.email}`);
      } else {
        insertFailed.push({ email: l.email, reason: error.message });
        log(`  FAILED        ${l.email}: ${error.message}`);
      }
    }
  }

  log('\n--- summary ---');
  log(`notifications found : ${notifications.length}`);
  log(`parsed              : ${parsed.length}`);
  log(`unique registrations: ${unique.length}`);
  log(dryRun ? `would insert        : ${unique.length}` : `inserted            : ${inserted}`);
  if (!dryRun) log(`already in the pool : ${present}`);
  log(`unreadable emails   : ${failed.length}`);
  if (!dryRun) log(`insert failures     : ${insertFailed.length}`);
  log(`csv                 : ${csvPath}`);

  for (const f of failed) log(`\n  unreadable: ${f.subject}\n    ${f.id}: ${f.reason}`);
  for (const f of insertFailed) log(`\n  insert failed: ${f.email}\n    ${f.reason}`);
  log('');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});

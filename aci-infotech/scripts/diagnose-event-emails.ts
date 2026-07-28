#!/usr/bin/env tsx
/**
 * Read-only: what did Resend actually do with the AION 2026 emails?
 *
 * The attendees got their confirmations, the sales team never got a single
 * notification. Both go through the same Resend client, from the same verified
 * sender, in the same pair of calls. Only the recipient differs. This settles
 * which of the three things happened:
 *
 *   notifications present, last_event 'delivered'  -> Resend handed them over,
 *      so they are in a spam folder or a Workspace quarantine. Nothing lost:
 *      the backfill can rebuild every registration.
 *   notifications present, 'bounced' or 'failed'   -> the mailbox rejected
 *      them. Content is still in Resend, so the backfill still works.
 *   notifications absent, confirmations present    -> the sends were never
 *      accepted. Only the confirmations are left, which means name and email
 *      and nothing else.
 *
 * It also counts the other two notifications that use the same ADMIN_EMAIL
 * (landing page leads, whitepaper leads), which answers whether every lead
 * notification the site sends has been vanishing or only the event ones.
 *
 * Writes nothing, sends nothing, changes nothing.
 *
 * Usage:
 *   cd aci-infotech
 *   npx tsx scripts/diagnose-event-emails.ts
 */
import { readFileSync, existsSync } from 'node:fs';
import { Resend } from 'resend';
import {
  REGISTRATION_SUBJECT_PREFIX,
  CONFIRMATION_SUBJECT_PREFIX,
} from '../src/lib/event-leads-email-parse';

const log = (...args: unknown[]) => console.log(...args);

for (const file of ['.env', '.env.local']) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

if (!process.env.RESEND_API_KEY) {
  log('FATAL: RESEND_API_KEY missing. Run this from aci-infotech/ on the server.');
  process.exit(1);
}

const CATEGORIES = [
  { key: 'event notification', match: (s: string) => s.startsWith(REGISTRATION_SUBJECT_PREFIX) },
  { key: 'event confirmation', match: (s: string) => s.startsWith(CONFIRMATION_SUBJECT_PREFIX) },
  { key: 'LP lead notification', match: (s: string) => s.startsWith('New LP Lead:') },
  { key: 'whitepaper notification', match: (s: string) => s.toLowerCase().includes('whitepaper') },
];

interface Bucket {
  count: number;
  events: Record<string, number>;
  recipients: Record<string, number>;
  first: string | null;
  last: string | null;
}

function emptyBucket(): Bucket {
  return { count: 0, events: {}, recipients: {}, first: null, last: null };
}

async function main() {
  log('\n=== diagnose-event-emails (read-only) ===\n');

  const resend = new Resend(process.env.RESEND_API_KEY);
  const buckets: Record<string, Bucket> = Object.fromEntries(
    CATEGORIES.map((c) => [c.key, emptyBucket()])
  );

  let scanned = 0;
  let oldest: string | null = null;
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
      if (!oldest || mail.created_at < oldest) oldest = mail.created_at;

      const category = CATEGORIES.find((c) => c.match(mail.subject ?? ''));
      if (!category) continue;

      const b = buckets[category.key];
      b.count++;
      b.events[mail.last_event] = (b.events[mail.last_event] ?? 0) + 1;
      for (const addr of mail.to ?? []) {
        b.recipients[addr] = (b.recipients[addr] ?? 0) + 1;
      }
      if (!b.first || mail.created_at < b.first) b.first = mail.created_at;
      if (!b.last || mail.created_at > b.last) b.last = mail.created_at;
    }

    if (!data?.has_more) break;
    cursor = page[page.length - 1].id;
  }

  log(`Scanned ${scanned} sent emails, back to ${oldest ?? 'n/a'}.`);
  log('Anything older than that has aged out of Resend and cannot be recovered.\n');

  for (const { key } of CATEGORIES) {
    const b = buckets[key];
    log(`${key}: ${b.count}`);
    if (!b.count) {
      log('  none found\n');
      continue;
    }
    log(`  window     : ${b.first?.slice(0, 10)} to ${b.last?.slice(0, 10)}`);
    log(`  last_event : ${Object.entries(b.events).map(([k, v]) => `${k}=${v}`).join(', ')}`);
    log(`  recipients : ${Object.entries(b.recipients).map(([k, v]) => `${k} (${v})`).join(', ')}`);
    log('');
  }

  // The read of it.
  const notifications = buckets['event notification'];
  const confirmations = buckets['event confirmation'];

  log('--- what this means ---');

  if (!confirmations.count && !notifications.count) {
    log('Neither kind of event email is in Resend. Either nobody registered in the');
    log('window Resend still holds, or the sends never happened. Nothing to recover here.');
  } else if (notifications.count) {
    const delivered = notifications.events.delivered ?? 0;
    const bounced = (notifications.events.bounced ?? 0) + (notifications.events.failed ?? 0);
    log(`Notifications ARE in Resend (${notifications.count}), so every registration in`);
    log('them is fully recoverable. Run backfill-event-leads-from-resend.ts.');
    if (delivered) {
      log(`\n${delivered} show as delivered but nobody received them. Resend handed those`);
      log('over, so they are in a spam folder or a Google Workspace quarantine.');
      log('Check the quarantine for the recipients listed above.');
    }
    if (bounced) {
      log(`\n${bounced} bounced or failed. That mailbox is not accepting mail. Point`);
      log('ADMIN_EMAIL at a real, monitored address off the sending domain.');
    }
  } else {
    log(`${confirmations.count} confirmation(s) but ZERO notifications. The notification`);
    log('sends were never accepted by Resend, so the full submissions are gone.');
    log('The confirmations still give you each registrant name and email address:');
    log('  npx tsx scripts/backfill-event-leads-from-resend.ts --dry-run');
    log('will fall back to them and write a CSV.');
  }

  if (confirmations.count && notifications.count && confirmations.count !== notifications.count) {
    log(`\nMismatch: ${confirmations.count} confirmations vs ${notifications.count} notifications.`);
    log('The difference is registrations whose notification was never sent at all.');
  }

  log('');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});

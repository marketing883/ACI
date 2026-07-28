import { insertEventLead, unknownColumn, type EventLeadsDb, type InsertError } from '../src/lib/event-leads-db';

// Fake PostgREST: rejects any column not in `columns`, mimicking the error
// shapes Supabase actually returns.
function fakeDb(columns: string[], opts: { duplicate?: boolean; style?: 'PGRST204' | '42703' } = {}) {
  const attempts: Record<string, unknown>[] = [];
  const db: EventLeadsDb = {
    from: () => ({
      insert: (values: Record<string, unknown>) => ({
        select: () => ({
          single: async () => {
            attempts.push({ ...values });
            const bad = Object.keys(values).find((k) => !columns.includes(k));
            if (bad) {
              const error: InsertError =
                opts.style === '42703'
                  ? { code: '42703', message: `column event_leads.${bad} does not exist`, details: null }
                  : {
                      code: 'PGRST204',
                      message: `Could not find the '${bad}' column of 'event_leads' in the schema cache`,
                      details: null,
                    };
              return { data: null, error };
            }
            if (opts.duplicate) {
              return {
                data: null,
                error: { code: '23505', message: 'duplicate key value violates unique constraint', details: null },
              };
            }
            return { data: { id: 'lead-123' }, error: null };
          },
        }),
      }),
    }),
  };
  return { db, attempts };
}

const PROD_COLUMNS = [
  'event_slug', 'full_name', 'email', 'phone', 'company_name', 'job_title',
  'pain_points', 'pain_point_other', 'journey_stage', 'wants_expert_meeting',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'status', 'ip_address', 'user_agent', 'referrer',
];

const row = {
  event_slug: 'digital-trust-summit-2026',
  full_name: 'Test Person',
  email: 'test@example.com',
  phone: null,
  company_name: 'TestCo',
  job_title: 'CTO',
  pain_points: ['AI risk and compliance'],
  pain_point_other: null,
  journey_stage: 'scaling',
  team_challenges: 'hiring',
  reporting_challenges: 'stale dashboards',
  ai_ml_exploration: 'fraud detection',
  ai_adoption_challenge: 'data quality',
  wants_expert_meeting: true,
  utm_source: 'linkedin',
  utm_medium: null,
  utm_campaign: 'aion-2026',
  utm_content: null,
  utm_term: null,
  status: 'new',
  ip_address: '1.2.3.4',
  user_agent: 'test',
  referrer: null,
};

let failures = 0;
function check(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    console.log(`  PASS  ${name}`);
  } else {
    failures++;
    console.log(`  FAIL  ${name}`, extra ?? '');
  }
}

async function main() {
  // 1. Production today: the four discovery columns are missing (PGRST204).
  {
    const { db, attempts } = fakeDb(PROD_COLUMNS);
    const r = await insertEventLead(db, row);
    console.log('1. Missing discovery columns (PGRST204):');
    check('registration saved', r.id === 'lead-123', r);
    check('no error surfaced', r.error === null, r.error);
    check(
      'dropped exactly the four discovery columns',
      JSON.stringify([...r.dropped].sort()) ===
        JSON.stringify(['ai_adoption_challenge', 'ai_ml_exploration', 'reporting_challenges', 'team_challenges']),
      r.dropped
    );
    check('kept every other field', Object.keys(attempts[attempts.length - 1]).length === Object.keys(row).length - 4);
    check('kept the answers that do have columns', attempts[attempts.length - 1].pain_points !== undefined);
  }

  // 2. Same, via the raw Postgres error text.
  {
    const { db } = fakeDb(PROD_COLUMNS, { style: '42703' });
    const r = await insertEventLead(db, row);
    console.log('2. Missing discovery columns (42703):');
    check('registration saved', r.id === 'lead-123', r);
    check('dropped four', r.dropped.length === 4, r.dropped);
  }

  // 3. Migration applied: clean single insert, nothing dropped.
  {
    const { db, attempts } = fakeDb([...PROD_COLUMNS, 'team_challenges', 'reporting_challenges', 'ai_ml_exploration', 'ai_adoption_challenge']);
    const r = await insertEventLead(db, row);
    console.log('3. Migration applied:');
    check('saved', r.id === 'lead-123', r);
    check('nothing dropped', r.dropped.length === 0, r.dropped);
    check('one round trip', attempts.length === 1, attempts.length);
    check('discovery answers written', attempts[0].team_challenges === 'hiring');
  }

  // 4. Duplicate email is still reported as a duplicate, not an error.
  {
    const { db } = fakeDb([...PROD_COLUMNS, 'team_challenges', 'reporting_challenges', 'ai_ml_exploration', 'ai_adoption_challenge'], { duplicate: true });
    const r = await insertEventLead(db, row);
    console.log('4. Duplicate registration:');
    check('flagged duplicate', r.duplicate === true, r);
    check('no error surfaced', r.error === null, r.error);
  }

  // 5. A required column missing must NOT be dropped - fail loudly.
  {
    const { db } = fakeDb(PROD_COLUMNS.filter((c) => c !== 'company_name'));
    const r = await insertEventLead(db, row);
    console.log('5. Required column missing:');
    check('surfaces the error', r.error !== null && r.id === null, r);
    check('did not drop company_name', !r.dropped.includes('company_name'), r.dropped);
  }

  // 6. Regex parses both error shapes.
  {
    console.log('6. Error parsing:');
    check(
      'PGRST204 shape',
      unknownColumn({ code: 'PGRST204', message: "Could not find the 'team_challenges' column of 'event_leads' in the schema cache" }) === 'team_challenges'
    );
    check('42703 shape', unknownColumn({ code: '42703', message: 'column event_leads.ai_ml_exploration does not exist' }) === 'ai_ml_exploration');
    check('unrelated error ignored', unknownColumn({ code: '23514', message: 'check constraint violated' }) === null);
  }

  console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}

main();

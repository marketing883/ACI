// Persistence for AION 2026 event registrations.
//
// The registration insert used to be a single call whose error was logged
// and swallowed: the visitor saw the thank-you screen, the sales team got
// the notification email, and the row never reached event_leads. When the
// four discovery-question columns shipped ahead of their migration, every
// registration was dropped that way and the admin dashboard read zero.
//
// So: retry without any column this database has not got yet, and tell the
// caller whether the row actually landed.

export type InsertError = { code?: string; message?: string; details?: string | null };

// Columns the row can lose and still be a usable registration. Contact and
// qualification fields are NOT in here: if one of those is unknown the
// insert must fail loudly rather than quietly save a useless lead.
export const OPTIONAL_COLUMNS = new Set([
  'team_challenges',
  'reporting_challenges',
  'ai_ml_exploration',
  'ai_adoption_challenge',
  'pain_point_other',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'referrer',
  'ip_address',
  'user_agent',
]);

// PostgREST reports an unknown column two ways, depending on whether the
// schema cache or Postgres itself rejects it:
//   PGRST204  Could not find the 'team_challenges' column of 'event_leads' ...
//   42703     column event_leads.team_challenges does not exist
export function unknownColumn(error: InsertError): string | null {
  if (error.code !== 'PGRST204' && error.code !== '42703') return null;
  const text = `${error.message || ''} ${error.details || ''}`;
  const match =
    text.match(/'([a-z0-9_]+)' column/i) ||
    text.match(/column "?(?:[a-z0-9_]+\.)?([a-z0-9_]+)"? does not exist/i);
  return match ? match[1] : null;
}

// Just the slice of the Supabase client this needs, so tests can hand it a fake.
export interface EventLeadsDb {
  from(table: string): {
    insert(values: Record<string, unknown>): {
      select(columns: string): {
        single(): PromiseLike<{ data: { id?: string | null } | null; error: InsertError | null }>;
      };
    };
  };
}

export interface InsertResult {
  id: string | null;
  duplicate: boolean;
  dropped: string[];
  error: InsertError | null;
}

export async function insertEventLead(
  db: EventLeadsDb,
  row: Record<string, unknown>
): Promise<InsertResult> {
  const payload: Record<string, unknown> = { ...row };
  const dropped: string[] = [];

  // One attempt per droppable column, plus the first try.
  for (let attempt = 0; attempt <= OPTIONAL_COLUMNS.size; attempt++) {
    const { data, error } = await db.from('event_leads').insert(payload).select('id').single();

    if (!error) return { id: data?.id ?? null, duplicate: false, dropped, error: null };

    // 23505 = unique violation: same email is already in the draw pool.
    if (error.code === '23505') return { id: null, duplicate: true, dropped, error: null };

    const column = unknownColumn(error);
    if (!column || !(column in payload) || !OPTIONAL_COLUMNS.has(column)) {
      return { id: null, duplicate: false, dropped, error };
    }

    delete payload[column];
    dropped.push(column);
  }

  return {
    id: null,
    duplicate: false,
    dropped,
    error: { message: 'Gave up dropping unknown columns' },
  };
}

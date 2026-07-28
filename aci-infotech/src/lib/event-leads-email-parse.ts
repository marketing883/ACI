// Read an AION 2026 registration back out of its notification email.
//
// Between the 23 July deploy and the schema fix, registrations were rejected
// by PostgREST while the API still returned success and sent both emails. The
// notification to the sales team is the only surviving copy of those entries,
// so this parses the template in src/lib/email.ts back into a row.
//
// It is the inverse of sendEventLeadNotificationEmail(). If that template
// changes, scripts/test-event-leads-email-parse.ts catches it: the test
// renders the real email and round-trips it through here.

export const REGISTRATION_SUBJECT_PREFIX =
  'New National Digital Trust Summit, AION 2026 registration:';

// The attendee's confirmation. Worth far less than the notification, but it is
// the only trace left if the notifications never reached Resend at all: the
// recipient address comes off the Resend record, the first name off the
// greeting. Everything else about the registration is gone.
export const CONFIRMATION_SUBJECT_PREFIX = 'You are in the draw. See you at';

export const VALID_JOURNEY_STAGES = ['exploring', 'piloting', 'scaling', 'optimizing'];

// Match each discovery question on a distinctive fragment, never on position:
// the email drops unanswered questions, so the block is not a fixed shape and
// positional mapping would file answers under the wrong question.
const DISCOVERY_QUESTIONS: Array<{ match: string; column: DiscoveryColumn }> = [
  { match: 'biggest challenges your team', column: 'team_challenges' },
  { match: 'reporting or analytics', column: 'reporting_challenges' },
  { match: 'exploring AI or Machine Learning', column: 'ai_ml_exploration' },
  { match: 'adopting AI', column: 'ai_adoption_challenge' },
];

type DiscoveryColumn =
  | 'team_challenges'
  | 'reporting_challenges'
  | 'ai_ml_exploration'
  | 'ai_adoption_challenge';

export interface ParsedEventLead {
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string;
  job_title: string;
  pain_points: string[];
  pain_point_other: string | null;
  journey_stage: string | null;
  wants_expert_meeting: boolean;
  team_challenges: string | null;
  reporting_challenges: string | null;
  ai_ml_exploration: string | null;
  ai_adoption_challenge: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
}

// Placeholder for the two NOT NULL columns a confirmation email cannot supply.
// Deliberately conspicuous: a partial row must never read as a real one on the
// dashboard.
export const PARTIAL_PLACEHOLDER = 'Unknown (recovered from confirmation email)';

// Inverse of escapeHtml() in src/lib/email.ts. Order matters: &amp; goes last,
// or an escaped "&amp;lt;" would decode twice. Note ' is never escaped there.
export function unescapeHtml(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&');
}

export function clean(raw: string | undefined | null): string {
  if (!raw) return '';
  return unescapeHtml(raw.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
}

// Pull the value out of a "<td>Label:</td><td>value</td>" row.
export function labelledCell(html: string, label: string): string {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(
    new RegExp(`>\\s*${escaped}\\s*</td>\\s*<td[^>]*>([\\s\\S]*?)</td>`, 'i')
  );
  return clean(match?.[1]);
}

// Returns null when the email does not carry a usable registration. Never
// guesses: a row missing any of these would fail the NOT NULL constraints.
export function parseEventLeadEmail(html: string): ParsedEventLead | null {
  const full_name = labelledCell(html, 'Name:');
  const company_name = labelledCell(html, 'Company:');
  const job_title = labelledCell(html, 'Designation:');
  const email = clean(html.match(/mailto:([^"]+)"/)?.[1]).toLowerCase();

  if (!full_name || !email || !company_name || !job_title) return null;

  const phoneRaw = labelledCell(html, 'Phone:');
  const phone = !phoneRaw || phoneRaw === 'Not provided' ? null : phoneRaw;

  const painList = html.match(/Pain points:<\/p>\s*<ul[^>]*>([\s\S]*?)<\/ul>/i)?.[1] ?? '';
  const pain_points = [...painList.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((m) => clean(m[1]))
    .filter(Boolean);

  const pain_point_other =
    clean(html.match(/In their words:<\/span>([\s\S]*?)<\/p>/i)?.[1]) || null;

  const stageRaw = labelledCell(html, 'AI journey stage:').toLowerCase();
  // Null rather than fail the CHECK constraint on an unexpected value.
  const journey_stage = VALID_JOURNEY_STAGES.includes(stageRaw) ? stageRaw : null;

  const wants_expert_meeting = labelledCell(html, 'Wants a 1:1:').toLowerCase().startsWith('yes');

  const discovery: Record<DiscoveryColumn, string | null> = {
    team_challenges: null,
    reporting_challenges: null,
    ai_ml_exploration: null,
    ai_adoption_challenge: null,
  };
  const qaPairs = html.matchAll(
    /<p style="margin: 0 0 4px 0; color: #666;">([\s\S]*?)<\/p>\s*<p style="margin: 0 0 16px 0; color: #333;">([\s\S]*?)<\/p>/gi
  );
  for (const [, questionRaw, answerRaw] of qaPairs) {
    const question = clean(questionRaw);
    const answer = clean(answerRaw);
    if (!answer) continue;
    const field = DISCOVERY_QUESTIONS.find((q) => question.includes(q.match));
    if (field) discovery[field.column] = answer;
  }

  return {
    full_name,
    email,
    phone,
    company_name,
    job_title,
    pain_points,
    pain_point_other,
    journey_stage,
    wants_expert_meeting,
    ...discovery,
    utm_source: labelledCell(html, 'Source:') || null,
    utm_campaign: labelledCell(html, 'Campaign:') || null,
  };
}

// Everything a confirmation email can give up: the first name from the
// greeting. The address is not in the body, so the caller passes it in from
// Resend's `to` field. Returns null if the greeting is not there, so a
// different template cannot be mistaken for a registration.
export function parseConfirmationEmail(
  html: string,
  recipient: string
): { first_name: string; email: string } | null {
  // Greedy up to the last period before </h1>, so a first name that is itself
  // an abbreviation ("Dr.") survives.
  const match = html.match(/You are in,\s*([\s\S]*)\.\s*<\/h1>/i);
  const first_name = clean(match?.[1]);
  const email = recipient.trim().toLowerCase();
  if (!first_name || !email) return null;
  return { first_name, email };
}

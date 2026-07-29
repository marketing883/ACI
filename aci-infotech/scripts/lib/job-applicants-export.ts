// Pure helpers for scripts/export-job-applicants.ts.
//
// Kept apart from the runner so they can be tested without credentials, a
// database, or a storage bucket. Nothing here does IO.

export interface JobRow {
  id: string;
  title: string;
  department?: string | null;
  location?: string | null;
}

export interface ApplicationRow {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  current_company: string | null;
  current_title: string | null;
  years_experience: number | null;
  work_authorization: string | null;
  notice_period: string | null;
  salary_expectation: string | null;
  heard_from: string | null;
  resume_url: string | null;
  resume_filename: string | null;
  cover_letter: string | null;
  source: string | null;
  referral_name: string | null;
  status: string | null;
}

// Everything the candidate submitted. Deliberately excludes internal_notes,
// status_notes and rating (recruiter-side, not part of the application) and
// ip_address / user_agent (tracking noise, extra PII, no screening value).
export const CSV_HEADERS = [
  'Applied', 'First name', 'Last name', 'Email', 'Phone', 'Location',
  'LinkedIn', 'Portfolio', 'Current company', 'Current title', 'Years experience',
  'Work authorization', 'Notice period', 'Salary expectation', 'Heard from',
  'Cover letter', 'Source', 'Referral name', 'Status',
  'Resume filename', 'Resume file',
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'job';
}

// Anything that reaches a filesystem path goes through this. A candidate's
// name is untrusted input: without it, a name containing ../ would write
// outside the export directory.
export function sanitizeSegment(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '')
    .slice(0, 50);
}

// Extension from the stored path, falling back to the original upload name,
// then to .pdf. The apply route names uploads <job_id>/<ts>-<first>-<last>.<ext>.
export function resumeExtension(app: ApplicationRow): string {
  for (const candidate of [app.resume_url, app.resume_filename]) {
    const match = candidate?.match(/\.([A-Za-z0-9]{1,8})$/);
    if (match) return match[1].toLowerCase();
  }
  return 'pdf';
}

// NN prefix is the CSV row number, so a resume is never ambiguous when two
// candidates share a name.
export function resumeFileName(index: number, app: ApplicationRow): string {
  const n = String(index).padStart(2, '0');
  const last = sanitizeSegment(app.last_name) || 'unknown';
  const first = sanitizeSegment(app.first_name) || 'unknown';
  return `${n}-${last}-${first}.${resumeExtension(app)}`;
}

// Refuses to guess. Two roles are named "Head of Enterprise Sales (...)", so
// quietly taking the first match is how the wrong candidates get exported.
export function pickJob(matches: JobRow[], query: string): JobRow {
  if (matches.length === 0) {
    throw new Error(`No job matches "${query}". Check the title, or pass --job-id.`);
  }
  if (matches.length > 1) {
    const list = matches
      .map((j) => `  ${j.id}  ${j.title.trim()} (${j.location ?? 'no location'})`)
      .join('\n');
    throw new Error(
      `"${query}" matches ${matches.length} jobs. Re-run with --job-id for the one you want:\n${list}`
    );
  }
  return matches[0];
}

export function csvEscape(value: unknown): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export function applicantsToCsv(apps: ApplicationRow[], resumeFiles: Array<string | null>): string {
  const rows = apps.map((a, i) =>
    [
      a.created_at, a.first_name, a.last_name, a.email, a.phone, a.location,
      a.linkedin_url, a.portfolio_url, a.current_company, a.current_title,
      a.years_experience, a.work_authorization, a.notice_period,
      a.salary_expectation, a.heard_from, a.cover_letter, a.source,
      a.referral_name, a.status, a.resume_filename,
      resumeFiles[i] ? `resumes/${resumeFiles[i]}` : '',
    ]
      .map(csvEscape)
      .join(',')
  );
  // CRLF: Excel on Windows is the usual destination for these.
  return [CSV_HEADERS.map(csvEscape).join(','), ...rows].join('\r\n');
}

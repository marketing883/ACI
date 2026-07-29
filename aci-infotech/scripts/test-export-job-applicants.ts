#!/usr/bin/env tsx
/**
 * Covers the parts of the applicant export that would quietly do the wrong
 * thing: picking the wrong job when two titles are nearly identical, writing a
 * resume outside the export directory, colliding filenames when two candidates
 * share a name, and CSV rows breaking on a cover letter full of commas and
 * newlines.
 *
 * Usage:
 *   cd aci-infotech
 *   npx tsx scripts/test-export-job-applicants.ts
 */
import {
  applicantsToCsv,
  pickJob,
  resumeFileName,
  sanitizeSegment,
  slugify,
  CSV_HEADERS,
  type ApplicationRow,
  type JobRow,
} from './lib/job-applicants-export';

let failures = 0;
function check(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    console.log(`  PASS  ${name}`);
  } else {
    failures++;
    console.log(`  FAIL  ${name}`, extra ?? '');
  }
}

function application(over: Partial<ApplicationRow> = {}): ApplicationRow {
  return {
    id: 'a1',
    created_at: '2026-07-20T10:00:00Z',
    first_name: 'Ananya',
    last_name: 'Rao',
    email: 'ananya@example.com',
    phone: '+91 98765 43210',
    location: 'Hyderabad',
    linkedin_url: 'https://linkedin.com/in/ananya',
    portfolio_url: null,
    current_company: 'FinTech Bank',
    current_title: 'Regional Director',
    years_experience: 14,
    work_authorization: 'Indian citizen',
    notice_period: '60 days',
    salary_expectation: '90L',
    heard_from: 'LinkedIn',
    resume_url: 'f709bff2/1753000000000-ananya-rao.pdf',
    resume_filename: 'Ananya Rao CV.pdf',
    cover_letter: 'Hello',
    source: 'direct',
    referral_name: null,
    status: 'new',
    ...over,
  };
}

// The two real roles this has to tell apart.
const APAC: JobRow = {
  id: 'f709bff2-03a7-4899-aea1-70a7139111fd',
  title: 'Head of Enterprise Sales (APAC) ',
  location: 'Hyderabad, India',
};
const US: JobRow = {
  id: '05b82283-6b53-4e43-b176-dfd90e6fbf54',
  title: 'Head of Enterprise Sales (US) ',
  location: 'New Jersey, US',
};

console.log('1. Job resolution:');
check('single match returns it', pickJob([APAC], 'APAC').id === APAC.id);
try {
  pickJob([APAC, US], 'Head of Enterprise Sales');
  check('ambiguous title refuses to guess', false, 'no error thrown');
} catch (err) {
  const msg = err instanceof Error ? err.message : '';
  check('ambiguous title refuses to guess', msg.includes('matches 2 jobs'));
  check('error names both candidate job ids', msg.includes(APAC.id) && msg.includes(US.id));
}
try {
  pickJob([], 'Head of Nothing');
  check('no match errors', false, 'no error thrown');
} catch (err) {
  check('no match errors', err instanceof Error && err.message.includes('No job matches'));
}

console.log('2. Filenames are safe:');
check('path traversal stripped from a name',
  !sanitizeSegment('../../etc/passwd').includes('/') && !sanitizeSegment('../../etc/passwd').includes('..'),
  sanitizeSegment('../../etc/passwd'));
check('traversal cannot escape via resumeFileName',
  !resumeFileName(1, application({ first_name: '../..', last_name: '../etc' })).includes('/'),
  resumeFileName(1, application({ first_name: '../..', last_name: '../etc' })));
check('normal name reads well', resumeFileName(3, application()) === '03-Rao-Ananya.pdf',
  resumeFileName(3, application()));
check('two candidates with the same name do not collide',
  resumeFileName(4, application()) !== resumeFileName(5, application()));
check('extension follows the stored path',
  resumeFileName(1, application({ resume_url: 'job/x.docx', resume_filename: 'CV.pdf' })).endsWith('.docx'));
check('falls back to the uploaded filename',
  resumeFileName(1, application({ resume_url: 'job/noextension', resume_filename: 'CV.doc' })).endsWith('.doc'));
check('falls back to pdf',
  resumeFileName(1, application({ resume_url: 'job/none', resume_filename: null })).endsWith('.pdf'));
check('unicode name still yields a usable file',
  /^01-[A-Za-z0-9._-]+\.pdf$/.test(resumeFileName(1, application({ first_name: 'Ananya', last_name: 'Raø' }))),
  resumeFileName(1, application({ first_name: 'Ananya', last_name: 'Raø' })));
check('empty names do not produce a dotfile',
  !resumeFileName(1, application({ first_name: '', last_name: '' })).startsWith('.'),
  resumeFileName(1, application({ first_name: '', last_name: '' })));

console.log('3. CSV survives real cover letters:');
const nasty = application({
  cover_letter: 'Dear team,\r\n\r\nI "lead" APAC sales, revenue: 1,20,00,000.\nRegards',
  current_company: 'Ranbaxy & Co, "APAC"',
});
const csv = applicantsToCsv([nasty], ['01-Rao-Ananya.pdf']);
check('header count matches row field count',
  csv.split('\r\n')[0].split('","').length === CSV_HEADERS.length,
  csv.split('\r\n')[0].split('","').length);
check('quotes inside the cover letter are doubled', csv.includes('"lead"'.replace(/"/g, '""')));
check('embedded newlines stay inside the quoted field',
  csv.split('\r\n')[0] === CSV_HEADERS.map((h) => `"${h}"`).join(','));
check('commas in a company name do not add a column',
  csv.includes('"Ranbaxy & Co, ""APAC"""'));
check('resume path recorded', csv.includes('"resumes/01-Rao-Ananya.pdf"'));
check('missing resume leaves the cell empty',
  applicantsToCsv([application()], [null]).trim().endsWith('""'));

console.log('4. Output directory name:');
check('trailing space in the job title does not leak into the path',
  slugify('Head of Enterprise Sales (APAC) ') === 'head-of-enterprise-sales-apac',
  slugify('Head of Enterprise Sales (APAC) '));
check('APAC and US land in different directories',
  slugify(APAC.title) !== slugify(US.title));

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);

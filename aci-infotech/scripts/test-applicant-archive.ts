#!/usr/bin/env tsx
/**
 * Drives the real archive builder used by the admin Export button, with a fake
 * downloader instead of Supabase, then unzips the result and checks it.
 *
 * The parts worth testing: the zip actually opens, the spreadsheet is in it,
 * every resume lands under resumes/ with the planned name, a failed download
 * is recorded rather than silently dropped, and a candidate name containing
 * path characters cannot write outside the archive.
 *
 * Usage:
 *   cd aci-infotech
 *   npx tsx scripts/test-applicant-archive.ts
 */
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildApplicantArchive } from '../src/lib/job-applicants-archive';
import type { ApplicationRow } from '../src/lib/job-applicants-export';

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
    id: 'a1', created_at: '2026-05-25T10:00:00Z',
    first_name: 'Joji', last_name: 'George', email: 'pingjoji@gmail.com',
    phone: '+91 90000 00000', location: 'Kochi',
    linkedin_url: 'https://linkedin.com/in/joji', portfolio_url: null,
    current_company: 'Acme, "APAC"', current_title: 'Sales Director',
    years_experience: 12, work_authorization: 'Indian citizen',
    notice_period: '30 days', salary_expectation: '80L', heard_from: 'LinkedIn',
    resume_url: 'f709bff2/1753000000000-joji-george.pdf',
    resume_filename: 'Joji George CV.pdf',
    cover_letter: 'Line one,\nline "two"', source: 'direct', referral_name: null,
    status: 'new',
    ...over,
  };
}

// Minimal valid PDF, so the bytes that come out are checkable.
const PDF = Buffer.from('%PDF-1.4\n%fake resume\n%%EOF\n');

async function main() {
  const dir = mkdtempSync(join(tmpdir(), 'applicant-archive-'));
  const zipPath = join(dir, 'export.zip');

  const applications = [
    application(),
    application({ id: 'a2', first_name: 'Ananya', last_name: 'Rao', email: 'ananya@corp.com' }),
    // No resume uploaded.
    application({ id: 'a3', first_name: 'Meera', last_name: 'Iyer', email: 'meera@corp.com', resume_url: null, resume_filename: null }),
    // Storage download fails for this one.
    application({ id: 'a4', first_name: 'Sam', last_name: 'Fail', email: 'sam@corp.com', resume_url: 'f709bff2/gone.pdf' }),
    // Hostile name: must not escape the archive.
    application({ id: 'a5', first_name: '../..', last_name: '../etc', email: 'evil@corp.com', resume_url: 'f709bff2/x.pdf' }),
  ];

  const { stream, finished } = buildApplicantArchive({
    applications,
    baseName: 'head-of-enterprise-sales-apac-2026-07-29',
    sheetName: 'Head of Enterprise Sales (APAC)',
    download: async (path) => {
      if (path.endsWith('gone.pdf')) return { body: null, error: 'Object not found' };
      return { body: PDF, error: null };
    },
  });

  const chunks: Buffer[] = [];
  stream.on('data', (c: Buffer) => chunks.push(c));
  const streamDone = new Promise<void>((res, rej) => {
    stream.on('end', () => res());
    stream.on('error', rej);
  });

  const { missing } = await finished;
  await streamDone;
  writeFileSync(zipPath, Buffer.concat(chunks));

  const listing = execFileSync('unzip', ['-l', zipPath], { encoding: 'utf8' });
  const names = execFileSync('zipinfo', ['-1', zipPath], { encoding: 'utf8' }).trim().split('\n');

  console.log('1. The zip opens and holds what it should:');
  check('zip is readable', listing.includes('head-of-enterprise-sales-apac'));
  check('spreadsheet present',
    names.includes('head-of-enterprise-sales-apac-2026-07-29/applicants.xlsx'), names);
  check('missing-resumes.txt present',
    names.some((n) => n.endsWith('missing-resumes.txt')));
  check('three resumes written (2 ok + 1 hostile-name)',
    names.filter((n) => n.includes('/resumes/')).length === 3,
    names.filter((n) => n.includes('/resumes/')));

  console.log('2. Resume naming:');
  check('row number prefixes the file',
    names.includes('head-of-enterprise-sales-apac-2026-07-29/resumes/01-George-Joji.pdf'), names);
  check('second applicant numbered 02',
    names.some((n) => n.endsWith('/resumes/02-Rao-Ananya.pdf')));
  check('no entry escapes the archive root',
    names.every((n) => n.startsWith('head-of-enterprise-sales-apac-2026-07-29/')), names);
  check('no entry contains a traversal segment',
    names.every((n) => !n.split('/').includes('..')), names);

  console.log('3. Failures are recorded, not swallowed:');
  check('two applicants reported missing', missing.length === 2, missing);
  check('no-upload case named', missing.some((m) => m.includes('meera@corp.com') && m.includes('no resume')), missing);
  check('failed download named', missing.some((m) => m.includes('sam@corp.com') && m.includes('Object not found')), missing);
  const txt = execFileSync('unzip', ['-p', zipPath, 'head-of-enterprise-sales-apac-2026-07-29/missing-resumes.txt'], { encoding: 'utf8' });
  check('the txt lists both', txt.includes('meera@corp.com') && txt.includes('sam@corp.com'), txt);
  check('the txt states the totals', txt.includes('2 of 5 applicants'), txt);

  console.log('4. Contents survive the round trip:');
  const extracted = execFileSync('unzip', ['-p', zipPath, 'head-of-enterprise-sales-apac-2026-07-29/resumes/01-George-Joji.pdf']);
  check('resume bytes are intact', extracted.equals(PDF));
  const xlsx = execFileSync('unzip', ['-p', zipPath, 'head-of-enterprise-sales-apac-2026-07-29/applicants.xlsx']);
  check('xlsx is a real workbook (PK zip header)', xlsx.subarray(0, 2).toString() === 'PK');
  check('xlsx is not empty', xlsx.length > 3000, xlsx.length);

  // The sheet is itself a zip; the shared strings hold the cell text.
  const sheetDir = join(dir, 'sheet');
  writeFileSync(join(dir, 'wb.xlsx'), xlsx);
  execFileSync('unzip', ['-o', '-q', join(dir, 'wb.xlsx'), '-d', sheetDir]);
  const shared = readFileSync(join(sheetDir, 'xl/sharedStrings.xml'), 'utf8');
  console.log('5. Spreadsheet content:');
  check('candidate email in the sheet', shared.includes('pingjoji@gmail.com'));
  check('every header present', ['Applied', 'First name', 'LinkedIn', 'Cover letter', 'Resume file']
    .every((h) => shared.includes(h)));
  check('quotes and newlines in a cover letter survive', shared.includes('line &quot;two&quot;'), shared.slice(0, 0));
  check('applicant with no resume still has a row', shared.includes('meera@corp.com'));

  rmSync(dir, { recursive: true, force: true });
  console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) FAILED.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});

#!/usr/bin/env tsx
/**
 * Export every applicant for one role, with their resumes.
 *
 * The admin dashboard filters applications by job but downloads resumes one
 * click at a time, which does not scale past a handful of candidates. This
 * pulls the whole set: a CSV of everything the candidates submitted, plus the
 * resume files named to match the rows.
 *
 * Runs on the server. The `resumes` bucket is private and job_applications is
 * RLS-locked, so both need SUPABASE_SERVICE_ROLE_KEY.
 *
 * Handle the output like the candidate PII it is: it is written outside git
 * (see .gitignore), and it should not be forwarded anywhere it does not need
 * to go.
 *
 * Usage:
 *   cd aci-infotech
 *   npx tsx scripts/export-job-applicants.ts --job-id <uuid>
 *   npx tsx scripts/export-job-applicants.ts --title "Enterprise Sales (APAC)"
 *   npx tsx scripts/export-job-applicants.ts --job-id <uuid> --dry-run
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import {
  applicantsToCsv,
  pickJob,
  resumeFileName,
  slugify,
  type ApplicationRow,
  type JobRow,
} from './lib/job-applicants-export';

const log = (...args: unknown[]) => console.log(...args);
const dryRun = process.argv.includes('--dry-run');

function arg(name: string): string | null {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : null;
}

const jobIdArg = arg('--job-id');
const titleArg = arg('--title');

async function main() {
  if (!jobIdArg && !titleArg) {
    log('Usage: npx tsx scripts/export-job-applicants.ts --job-id <uuid> | --title "<job title>"');
    log('       add --dry-run to see what would be exported without writing anything');
    process.exit(1);
  }

  for (const file of ['.env', '.env.local']) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const missing = [
    !url && 'NEXT_PUBLIC_SUPABASE_URL',
    !serviceKey && 'SUPABASE_SERVICE_ROLE_KEY',
  ].filter(Boolean);
  if (missing.length) {
    log(`FATAL: ${missing.join(', ')} missing. Run this from aci-infotech/ on the server.`);
    log('The resumes bucket is private and job_applications is RLS-locked, so the');
    log('service role key is required. The anon key cannot read either.');
    process.exit(1);
  }

  const supabase = createClient(url!, serviceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  log(`\n=== export-job-applicants ${dryRun ? '(DRY RUN)' : ''} ===\n`);

  // 1. Resolve the job. Titles in this table carry trailing spaces and two
  //    roles differ only by region, so an ambiguous match must stop the run.
  let job: JobRow;
  if (jobIdArg) {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, department, location')
      .eq('id', jobIdArg)
      .single();
    if (error || !data) {
      log(`FATAL: no job with id ${jobIdArg}${error ? `: ${error.message}` : ''}`);
      process.exit(1);
    }
    job = data as JobRow;
  } else {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, title, department, location')
      .ilike('title', `%${titleArg}%`);
    if (error) {
      log('FATAL: job lookup failed:', error.message);
      process.exit(1);
    }
    try {
      job = pickJob((data ?? []) as JobRow[], titleArg!);
    } catch (err) {
      log(`FATAL: ${err instanceof Error ? err.message : err}`);
      process.exit(1);
    }
  }

  log(`Job: ${job.title.trim()}`);
  log(`     ${job.id}  ${job.department ?? ''} ${job.location ?? ''}`.trimEnd());

  // 2. Pull the applications, oldest first so the CSV reads in the order
  //    people applied.
  const { data: appData, error: appError } = await supabase
    .from('job_applications')
    .select('*')
    .eq('job_id', job.id)
    .order('created_at', { ascending: true });

  if (appError) {
    log('FATAL: application query failed:', appError.message);
    process.exit(1);
  }

  const applications = (appData ?? []) as ApplicationRow[];
  log(`Applications: ${applications.length}\n`);

  if (!applications.length) {
    log('Nothing to export.\n');
    return;
  }

  // 3. Fetch each resume. Track misses explicitly: a short export that looks
  //    complete is the failure mode that actually costs someone an interview.
  const outDir = join('exports', `${slugify(job.title)}-${new Date().toISOString().slice(0, 10)}`);
  const resumeDir = join(outDir, 'resumes');
  const resumeFiles: Array<string | null> = [];
  const missingResumes: Array<{ name: string; email: string; reason: string }> = [];

  if (!dryRun) mkdirSync(resumeDir, { recursive: true });

  for (const [i, app] of applications.entries()) {
    const rowNumber = i + 1;
    const who = `${app.first_name} ${app.last_name}`;

    if (!app.resume_url) {
      resumeFiles.push(null);
      missingResumes.push({ name: who, email: app.email, reason: 'no resume was uploaded' });
      log(`  ${String(rowNumber).padStart(2, '0')}. ${who.padEnd(28)} no resume`);
      continue;
    }

    const fileName = resumeFileName(rowNumber, app);

    if (dryRun) {
      resumeFiles.push(fileName);
      log(`  ${String(rowNumber).padStart(2, '0')}. ${who.padEnd(28)} -> resumes/${fileName}`);
      continue;
    }

    const { data: blob, error } = await supabase.storage.from('resumes').download(app.resume_url);
    if (error || !blob) {
      resumeFiles.push(null);
      missingResumes.push({ name: who, email: app.email, reason: error?.message ?? 'download failed' });
      log(`  ${String(rowNumber).padStart(2, '0')}. ${who.padEnd(28)} DOWNLOAD FAILED`);
      continue;
    }

    writeFileSync(join(resumeDir, fileName), Buffer.from(await blob.arrayBuffer()));
    resumeFiles.push(fileName);
    log(`  ${String(rowNumber).padStart(2, '0')}. ${who.padEnd(28)} -> resumes/${fileName}`);
  }

  // 4. The CSV, with each row pointing at the file it belongs to.
  const csv = applicantsToCsv(applications, resumeFiles);
  const csvPath = join(outDir, 'applicants.csv');
  if (!dryRun) writeFileSync(csvPath, csv);

  log('\n--- summary ---');
  log(`applicants        : ${applications.length}`);
  log(`resumes           : ${resumeFiles.filter(Boolean).length}`);
  log(`missing resumes   : ${missingResumes.length}`);
  log(dryRun ? `would write       : ${outDir}/` : `written to        : ${outDir}/`);

  for (const m of missingResumes) {
    log(`\n  no resume file: ${m.name} <${m.email}>\n    ${m.reason}`);
  }

  if (dryRun) {
    log('\nDry run: nothing was written and no files were downloaded.');
    log('Check the applicant count against /admin/job-applications before running for real.');
  } else {
    log('\nCandidate PII. It is outside git by way of .gitignore; keep it that way.');
  }
  log('');
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});

#!/usr/bin/env node
/**
 * Historical careers export for the TapResume migration.
 *
 * Spec: docs/integrations/TAPRESUME-EXPORT-ADDENDUM-2026-08-30.md
 * (ACI-EXPORT-ADDENDUM-2026-08-30), which supersedes the phase-2 HTTP
 * export routes for the migration. Those routes stay implemented and
 * returning 503; TapResume will never call them.
 *
 * Run ON THE VPS, from the app directory, as a user who can read .env:
 *
 *   cd /home/aciadmin/aci-website/aci-infotech
 *   node scripts/export-careers-history.mjs
 *
 * Writes /home/aciadmin/tapresume-import/ (mode 700):
 *   openings.jsonl  applications.jsonl  resumes/  manifest.json  checksums.txt
 *
 * THIS EXPORT CONTAINS CANDIDATE PII. It prints aggregates only - counts,
 * date ranges, status vocabularies, checksums. It never prints a name, an
 * email address, a filename, or any row content, because its output is
 * pasted into chat. Keep it that way.
 *
 * Deterministic: rows are ordered by source id, so a re-run produces
 * identical checksums (addendum 2.3).
 */

import { createClient } from '@supabase/supabase-js';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, appendFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUT_DIR = process.env.TAPRESUME_EXPORT_DIR || '/home/aciadmin/tapresume-import';
const PAGE = 1000; // PostgREST caps a single select; walk in pages.

// ---------------------------------------------------------------- env

/** Read .env without pulling in a dotenv dependency. */
function loadEnv(file = '.env') {
  if (!existsSync(file)) return {};
  const out = {};
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line.trim());
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

const env = { ...loadEnv('.env'), ...loadEnv('.env.local') };
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (from .env or the environment).');
  process.exit(1);
}
const db = createClient(url, key);

// ------------------------------------------------------------- helpers

async function fetchAll(table, orderCol = 'id') {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db
      .from(table)
      .select('*')
      .order(orderCol, { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }
  return rows;
}

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function iso(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? String(v) : d.toISOString();
}

function vocab(rows, field) {
  const counts = {};
  for (const r of rows) {
    const k = r[field] === null || r[field] === undefined ? '(null)' : String(r[field]);
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

function range(rows, field) {
  const vals = rows.map((r) => r[field]).filter(Boolean).map((v) => new Date(v)).filter((d) => !Number.isNaN(d.getTime()));
  if (vals.length === 0) return { earliest: null, latest: null };
  vals.sort((a, b) => a - b);
  return { earliest: vals[0].toISOString(), latest: vals[vals.length - 1].toISOString() };
}

// ---------------------------------------------------------------- main

const notes = [];
mkdirSync(OUT_DIR, { recursive: true, mode: 0o700 });
mkdirSync(join(OUT_DIR, 'resumes'), { recursive: true, mode: 0o700 });

console.log('reading source tables...');
const allOpenings = await fetchAll('jobs');
const applications = await fetchAll('job_applications');

// Openings the TapResume receiver created are not ACI history - they are
// TapResume's own publications projected into this table, and the first
// export run swept up the integration checklist's test openings as if they
// were real roles. managed_by is set only by the receiver, so it is an
// exact discriminator. Excluded here and counted in the manifest so the
// omission is visible rather than silent.
const openings = allOpenings.filter((o) => o.managed_by !== 'tapresume');
const excludedManaged = allOpenings.length - openings.length;
if (excludedManaged > 0) {
  notes.push(
    `${excludedManaged} opening(s) carrying managed_by='tapresume' were EXCLUDED. Those are receiver-created ` +
      'publications (including integration checklist test openings), not ACI historical data, and TapResume ' +
      'already owns them through the publication channel. Counted as counts.excluded_managed_openings.',
  );
}
notes.push(
  `openings read from public.jobs (${openings.length} rows); applications read from public.job_applications (${applications.length} rows)`,
);

// The site has no soft-delete column on either table, so "deleted but
// recoverable" rows do not exist to export. Say so rather than implying
// completeness we cannot vouch for (addendum 2.4).
const hasDeletedAt = openings.some((o) => 'deleted_at' in o) || applications.some((a) => 'deleted_at' in a);
if (!hasDeletedAt) {
  notes.push(
    'NO SOFT-DELETE: neither public.jobs nor public.job_applications carries a deleted_at or is_deleted column. ' +
      'Rows deleted through the admin (DELETE /api/admin/jobs/[id]) are removed outright and are NOT recoverable, ' +
      'so this export cannot include them. deleted_at is emitted as null throughout for schema conformance only.',
  );
}

const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com').replace(/\/$/, '');

// -------------------------------------------------------- openings.jsonl

const openingsPath = join(OUT_DIR, 'openings.jsonl');
writeFileSync(openingsPath, '', { mode: 0o600 });
for (const o of openings) {
  // Spread the raw row first so every source column travels under its own
  // name (addendum 2.2), then add the addendum's named fields. Explicit
  // nulls, never silent omission.
  const row = {
    ...o,
    source_id: String(o.id),
    slug: o.slug ?? null,
    public_url: o.slug ? `${siteBase}/careers/${o.slug}` : null,
    title: o.title ?? null,
    // The source column is `description`. Its stored format is not
    // declared anywhere in the schema; it is emitted verbatim as
    // description_html and flagged in schema_notes rather than guessed at.
    description_html: o.description ?? null,
    description_text: null,
    department: o.department ?? null,
    location: o.location ?? null,
    employment_type: o.employment_type ?? null,
    experience_level: o.experience_level ?? null,
    work_mode: o.location_type ?? null,
    skills: o.skills ?? null,
    status: o.status ?? null,
    created_at: iso(o.created_at),
    updated_at: iso(o.updated_at),
    published_at: iso(o.published_at),
    closed_at: iso(o.closes_at),
    deleted_at: null,
  };
  appendFileSync(openingsPath, JSON.stringify(row) + '\n');
}
notes.push(
  'openings.work_mode is sourced from jobs.location_type; openings.closed_at from jobs.closes_at; ' +
    'openings.description_html from jobs.description (stored format undeclared, emitted verbatim, description_text null)',
);

// ---------------------------------------------------- applications.jsonl

const openingIds = new Set(openings.map((o) => String(o.id)));
let orphanApplications = 0;
let applicationsWithoutResume = 0;

// resume_url holds the object path inside the private `resumes` storage
// bucket (see supabase/migrations/20260414_resumes_bucket.sql), not a URL.
const resumeJobs = [];
const applicationsPath = join(OUT_DIR, 'applications.jsonl');
writeFileSync(applicationsPath, '', { mode: 0o600 });

for (const a of applications) {
  const sourceId = String(a.id);
  const openingSourceId = a.job_id === null || a.job_id === undefined ? null : String(a.job_id);
  if (!openingSourceId || !openingIds.has(openingSourceId)) orphanApplications += 1;

  let resumeFile = null;
  if (a.resume_url) {
    const ext = String(a.resume_url).includes('.') ? '.' + String(a.resume_url).split('.').pop() : '';
    resumeFile = `${sourceId}${ext}`;
    resumeJobs.push({ storagePath: a.resume_url, outName: resumeFile });
  } else {
    applicationsWithoutResume += 1;
  }

  const row = {
    ...a,
    source_id: sourceId,
    opening_source_id: openingSourceId,
    name: [a.first_name, a.last_name].filter(Boolean).join(' ') || null,
    email: a.email ?? null,
    phone: a.phone ?? null,
    status: a.status ?? null,
    outcome: a.status ?? null,
    applied_at: iso(a.created_at),
    updated_at: iso(a.updated_at),
    resume_file: resumeFile,
    resume_original_filename: a.resume_filename ?? null,
    cover_letter: a.cover_letter ?? null,
    deleted_at: null,
  };
  appendFileSync(applicationsPath, JSON.stringify(row) + '\n');
}
notes.push(
  'applications.name is composed from job_applications.first_name and last_name, which are kept as their own columns too; ' +
    'applied_at from created_at; outcome mirrors status (the source has no separate outcome column); ' +
    'resume_file is renamed to {source_id}{ext} per addendum 2.2, with the original name in resume_original_filename',
);

// ------------------------------------------------------------- resumes/

// Downloads run a few at a time and report progress. The first version did
// these strictly one by one and printed nothing until all of them finished:
// on the real dataset that is 2410 round trips to object storage, twenty
// minutes of a silent cursor, and no way to tell a slow run from a hung
// one. Concurrency does not affect the output - files are written by name
// and checksums are taken over the sorted listing afterwards - so this
// stays deterministic and re-runnable per addendum 2.3.
console.log(`downloading ${resumeJobs.length} resume files...`);
const CONCURRENCY = 8;
const startedAt = Date.now();
let resumesWritten = 0;
let attempted = 0;
const resumeFailures = [];

async function downloadOne(job) {
  const { data, error } = await db.storage.from('resumes').download(job.storagePath);
  if (error || !data) {
    resumeFailures.push({ out_name: job.outName, reason: error?.message ?? 'empty body' });
  } else {
    writeFileSync(join(OUT_DIR, 'resumes', job.outName), Buffer.from(await data.arrayBuffer()), { mode: 0o600 });
    resumesWritten += 1;
  }
  attempted += 1;
  if (attempted % 100 === 0 || attempted === resumeJobs.length) {
    const secs = Math.round((Date.now() - startedAt) / 1000);
    const rate = attempted / Math.max(secs, 1);
    const left = Math.round((resumeJobs.length - attempted) / Math.max(rate, 0.01));
    console.log(
      `  ${attempted}/${resumeJobs.length} (${resumesWritten} ok, ${resumeFailures.length} failed) ` +
        `${secs}s elapsed, ~${left}s remaining`,
    );
  }
}

for (let i = 0; i < resumeJobs.length; i += CONCURRENCY) {
  await Promise.all(resumeJobs.slice(i, i + CONCURRENCY).map(downloadOne));
}
if (resumeFailures.length > 0) {
  notes.push(
    `${resumeFailures.length} resume file(s) referenced by an application could NOT be downloaded from the private ` +
      `'resumes' bucket. They are listed in manifest.resume_failures by output name and reason - never by applicant.`,
  );
}

// Files in the bucket that no application references. Addendum 2.3 wants
// two things that cannot both hold in one directory: every file in
// resumes/ referenced by exactly one application, AND unreferenced files
// kept in the export. So they are kept, in resumes_orphaned/ - the
// invariant holds for resumes/, and 64 real candidate documents whose
// application row is gone are not silently left behind.
let orphanResumeFiles = 0;
let orphanResumesWritten = 0;
{
  const referenced = new Set(resumeJobs.map((j) => j.storagePath));

  // Objects live one level down, under a job-id prefix
  // (`${job_id}/${timestamp}-name.ext`, see src/app/api/jobs/apply/route.ts).
  // A bare list('') returns those PREFIXES, not files - Supabase marks a
  // prefix with a null id. The first version compared prefix names against
  // full object paths, so every job folder looked like an orphaned file:
  // it reported 64 orphans that do not exist and then failed to download
  // all 64, because a folder is not a file. Walk each prefix instead.
  const { data: top, error } = await db.storage.from('resumes').list('', { limit: 10000 });
  let listed = [];
  if (!error) {
    for (const entry of top ?? []) {
      if (entry.id === null) {
        const { data: inner } = await db.storage.from('resumes').list(entry.name, { limit: 10000 });
        for (const f of inner ?? []) if (f.id !== null) listed.push({ name: `${entry.name}/${f.name}` });
      } else {
        listed.push({ name: entry.name });
      }
    }
  }
  if (error) {
    notes.push(`could not list the resumes bucket to detect orphaned files: ${error.message}`);
  } else {
    const orphans = listed.filter((f) => f.name && !referenced.has(f.name));
    orphanResumeFiles = orphans.length;
    if (orphanResumeFiles > 0) {
      mkdirSync(join(OUT_DIR, 'resumes_orphaned'), { recursive: true, mode: 0o700 });
      console.log(`downloading ${orphanResumeFiles} orphaned resume files...`);
      for (const f of orphans.sort((a, b) => a.name.localeCompare(b.name))) {
        const { data, error: dlErr } = await db.storage.from('resumes').download(f.name);
        if (dlErr || !data) {
          resumeFailures.push({ out_name: `orphaned/${f.name}`, reason: dlErr?.message ?? 'empty body' });
          continue;
        }
        // The storage path is `{job_id}/{file}`; flatten the separator so
        // the export stays one directory deep and the name still records
        // which opening's folder the file was found under.
        const flat = f.name.replace(/\//g, '__');
        writeFileSync(join(OUT_DIR, 'resumes_orphaned', flat), Buffer.from(await data.arrayBuffer()), { mode: 0o600 });
        orphanResumesWritten += 1;
      }
      notes.push(
        `${orphanResumeFiles} file(s) in the resumes bucket are referenced by no application row. Addendum 2.3 asks ` +
          'both that every file in resumes/ be referenced exactly once AND that unreferenced files stay in the ' +
          `export, so they are kept separately in resumes_orphaned/ (${orphanResumesWritten} downloaded) under ` +
          'their ORIGINAL storage names, since there is no application id to rename them by. resumes/ therefore ' +
          'holds exactly the referenced files and the invariant holds.',
      );
    }
  }
}

// ---------------------------------------------------------- manifest

const manifest = {
  exported_at: new Date().toISOString(),
  source_system: {
    engine: 'PostgreSQL via Supabase (PostgREST)',
    host: url,
    schema: 'public',
    tables_read: ['public.jobs', 'public.job_applications'],
    object_storage: "Supabase Storage, private bucket 'resumes'; job_applications.resume_url holds the object path",
    note: 'ACI staging and production share this Supabase project; this is the single live careers dataset.',
  },
  counts: {
    openings: openings.length,
    applications: applications.length,
    resume_files: resumesWritten,
    applications_without_resumes: applicationsWithoutResume,
    orphaned_applications: orphanApplications,
    orphaned_resume_files: orphanResumeFiles,
    orphaned_resume_files_exported: orphanResumesWritten,
    excluded_managed_openings: excludedManaged,
    resume_download_failures: resumeFailures.length,
  },
  date_range: {
    applied_at: range(applications, 'created_at'),
    published_at: range(openings, 'published_at'),
  },
  status_vocabulary: {
    openings: vocab(openings, 'status'),
    applications: vocab(applications, 'status'),
  },
  checksums: {
    'openings.jsonl': sha256File(openingsPath),
    'applications.jsonl': sha256File(applicationsPath),
  },
  resume_failures: resumeFailures,
  schema_notes: notes,
};
writeFileSync(join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), { mode: 0o600 });

// --------------------------------------------------------- checksums.txt

const lines = [
  `${manifest.checksums['openings.jsonl']}  openings.jsonl`,
  `${manifest.checksums['applications.jsonl']}  applications.jsonl`,
];
for (const dir of ['resumes', 'resumes_orphaned']) {
  const abs = join(OUT_DIR, dir);
  if (!existsSync(abs)) continue;
  for (const f of readdirSync(abs).sort()) {
    const p = join(abs, f);
    if (statSync(p).isFile()) lines.push(`${sha256File(p)}  ${dir}/${f}`);
  }
}
writeFileSync(join(OUT_DIR, 'checksums.txt'), lines.join('\n') + '\n', { mode: 0o600 });

// ------------------------------------------------------------- report

// Aggregates only. Nothing below may identify a person.
console.log('\n=== export complete: ' + OUT_DIR + ' ===');
console.log(JSON.stringify(
  {
    exported_at: manifest.exported_at,
    source_system: manifest.source_system,
    counts: manifest.counts,
    date_range: manifest.date_range,
    status_vocabulary: manifest.status_vocabulary,
    checksums: manifest.checksums,
    schema_notes: manifest.schema_notes,
    resume_failure_reasons: [...new Set(resumeFailures.map((f) => f.reason))],
  },
  null,
  2,
));
console.log('\nIntegrity (addendum 2.3):');
console.log(`  applications referencing a missing opening: ${orphanApplications} (counted, not dropped)`);
console.log(`  resume files in bucket referenced by nothing: ${orphanResumeFiles}`);
console.log('\nVerify line counts match the manifest:');
console.log(`  wc -l ${OUT_DIR}/openings.jsonl ${OUT_DIR}/applications.jsonl`);
console.log(`  chmod 700 ${OUT_DIR} && chown -R aciadmin: ${OUT_DIR}`);

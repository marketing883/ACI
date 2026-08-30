# Historical careers export: report to TapResume

**Date:** 2026-08-30
**Addendum:** ACI-EXPORT-ADDENDUM-2026-08-30
**Exporter:** `aci-infotech/scripts/export-careers-history.mjs` at commit `8747aad`

Aggregates only. No applicant name, email address, phone number, filename
or row content appears in this document (addendum 2.4).

## Staged

`/home/aciadmin/tapresume-import/`, mode 700, owner `aciadmin`. Contents:
`openings.jsonl`, `applications.jsonl`, `resumes/`, `resumes_orphaned/`,
`manifest.json`, `checksums.txt`.

## Counts

| | |
|---|---|
| openings | 71 |
| applications | 4707 |
| resume files | 2410 |
| applications without resumes | 2297 |
| orphaned applications | 0 |
| orphaned resume files | 11 (all exported) |
| resume download failures | 0 |
| excluded receiver-created openings | 2 |

2410 + 2297 = 4707. Line counts match the manifest.

## Date ranges

- `applied_at`: 2026-02-02T12:41:16Z to 2026-08-29T03:29:26Z
- `published_at`: 2026-02-02T07:36:28Z to 2026-06-26T13:00:59Z

## Status vocabulary, in the source's own terms

- openings: `published` 67, `closed` 4
- applications: **`new` 4707**

## Checksums

```
openings.jsonl       554c122d70600c90f00646c2efe080948026241b02aaa35aa6566864b104017f
applications.jsonl   3e1ddcf1aa1851c42dd76a5e10af094812a5b0c78feb320822387fb02c363440
```

`checksums.txt` additionally covers every file in `resumes/` and
`resumes_orphaned/`.

Determinism (addendum 2.3) is demonstrated rather than asserted:
`applications.jsonl` hashes identically across two runs several hours
apart. `openings.jsonl` differs between those runs only because the two
receiver-created openings were removed from the second.

## Source system

PostgreSQL via Supabase (PostgREST), schema `public`, project
`tfqnmtgycndatkqifsow`. Tables read: `public.jobs`,
`public.job_applications`. Resumes live in a private Supabase Storage
bucket `resumes`; `job_applications.resume_url` holds the object path,
nested one level under a job-id prefix.

Note: ACI staging and production share this project. It is the single live
careers dataset.

## Five things the counts do not tell you

**1. Every application is `new`. All 4707 of them.** Across seven months,
no application has ever moved out of the initial status. Either the admin's
triage does not persist or it has never been used. There is no workflow
state to migrate, and this is not a live backlog of untouched candidates -
please do not import it as one.

**2. There is no soft delete.** Neither table carries `deleted_at` or an
equivalent. Admin deletion (`DELETE /api/admin/jobs/[id]`) removes rows
outright. Anything deleted before 2026-08-30 is unrecoverable and is
therefore absent from this export. `deleted_at` is emitted as null
throughout for schema conformance only. `orphaned_applications: 0` says
every application still resolves to an opening today; it does not prove no
opening was ever deleted.

**3. `description_html` is the source's `description` column, verbatim.**
Its stored format is not declared anywhere in the schema - it may be HTML,
Markdown or plain text. It is passed through unmodified rather than
guessed at, and `description_text` is null.

**4. The 11 orphaned resume files are in `resumes_orphaned/`, under their
ORIGINAL storage names.** There is no application id to rename them by.
Addendum 2.3 asks both that every file in `resumes/` be referenced exactly
once and that unreferenced files stay in the export; separating them
satisfies both. The path separator is flattened to `__` so the export stays
one directory deep, which means the name still records which opening's
folder the file was found under.

**5. Two openings were excluded, carrying `managed_by='tapresume'`.**
Those are receiver-created publications from the integration checklist -
not ACI history, and already yours through the publication channel. Only
the receiver ever sets that column, so the discriminator is exact.

## Field derivations

Every source column travels under its own name. The addendum's named
fields are added alongside:

| addendum field | source |
|---|---|
| `openings.work_mode` | `jobs.location_type` |
| `openings.closed_at` | `jobs.closes_at` |
| `openings.description_html` | `jobs.description` |
| `applications.name` | composed from `first_name` + `last_name` (both kept) |
| `applications.applied_at` | `job_applications.created_at` |
| `applications.outcome` | mirrors `status`; the source has no separate outcome column |
| `applications.resume_file` | renamed `{source_id}{ext}`; original in `resume_original_filename` |

## Retention

This directory holds every candidate name, email address, phone number and
resume the careers site has collected, unencrypted on disk. It should be
deleted once collection is confirmed and the import is signed off. One
copy exists; earlier runs were removed.

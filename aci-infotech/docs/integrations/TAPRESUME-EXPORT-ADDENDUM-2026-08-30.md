# Addendum 1 to the ACI Careers Integration Contract: historical export

**Document id:** ACI-EXPORT-ADDENDUM-2026-08-30
**Amends:** ACI-CAREERS-INTEGRATION-CONTRACT-2026-08-30, section 2.2 and section 13 item 1
**Contract version (wire):** unchanged at `2026-08-29`. This addendum changes no signed byte layout, no body schema, and no acknowledgement shape.
**Status:** Binding. Closes open item 1.

## 1. Decision: the historical import uses a staged file export, not the HTTP export routes

The contract reserved three signed HTTP export routes for the one time historical migration and promised their schemas as an addendum. That addendum is now issued, and it supersedes them.

Both systems run on the same host. A one time migration therefore does not need paginated, signed, rate limited HTTP transfer with its own cursor semantics and failure modes; it needs a correct, complete, verifiable copy of the data. A staged file export is simpler to produce, simpler to check, and far simpler to redo if a field turns out to be missing.

Accordingly:

- `GET /export/jobs`, `GET /export/applications`, and `GET /export/resumes/{applicationId}` are **not** part of the migration path. Leave them implemented and returning 503 behind signature verification. TapResume will never call them. They may be removed once the import is signed off.
- The historical import consumes the staged export defined in section 2 below.
- Contract section 13 open item 1 is closed by this document. TapResume no longer owes an export route schema.

Nothing about the live publication channel changes.

## 2. The export

### 2.1 Where to stage it

Create `/home/aciadmin/tapresume-import/` on the deployment VPS, owner `aciadmin`, mode 700. The TapResume operator collects it server side. Nothing from this export may appear in chat, in logs, or in the git repository. Never print applicant names, email addresses, or resume content anywhere.

### 2.2 What to export

The COMPLETE history of the careers system: every opening and every application ever stored, including closed, expired, draft, and deleted but recoverable records. Do not filter, deduplicate, transform, or clean anything. Export the raw truth of the source system. If the source has soft deleted rows, include them with their deletion markers.

#### `openings.jsonl`

One JSON object per line, UTF-8, carrying every field the source holds. At minimum, where the source has them, using `null` rather than silently omitting:

- `source_id`, the stable primary key in your system, as a string
- `slug` and `public_url`, the live or former URL of the posting, which the post cutover redirects depend on
- `title`, `description_html` verbatim as stored, `description_text` if the source has a plain text form
- `department`, `location`, `employment_type`, `experience_level`, `work_mode`, `skills` as an array if structured, otherwise the raw string
- salary fields exactly as stored
- `status` in the source's own vocabulary, untranslated
- `created_at`, `updated_at`, `published_at`, `closed_at`, `deleted_at` as ISO 8601 with timezone
- every other column the source has, under its source name

#### `applications.jsonl`

One JSON object per line, every field the source holds. At minimum:

- `source_id`, stable primary key, as a string
- `opening_source_id`, referencing a row in `openings.jsonl`
- `name`, `email`, `phone`, and any other applicant fields exactly as stored
- `status` or `outcome` in the source's own vocabulary, `applied_at`, `updated_at` as ISO 8601
- `resume_file`, the filename it will carry in `resumes/`, or `null`
- `resume_original_filename`
- any cover letter, screening answers, or notes fields, verbatim

#### `resumes/`

Every resume and attachment, named `{application_source_id}{original_extension}`, for example `4271.pdf`. Where one application has several files, suffix `-1`, `-2` and list them as an array in the application row.

#### `manifest.json`

- `exported_at` as ISO 8601
- `source_system`: what actually backs the careers data, naming the database engine, host, and schema or the CMS, and which tables or collections were read
- `counts`: openings, applications, resume files, applications without resumes, orphaned applications referencing a missing opening, orphaned resume files
- `date_range`: earliest and latest `applied_at` and `published_at`
- `status_vocabulary`: the distinct status values in each file with their counts
- `checksums`: sha256 of `openings.jsonl` and `applications.jsonl`
- `schema_notes`: every source table, collection, and field exported from, including anything that could NOT be exported and why

#### `checksums.txt`

`sha256sum` output over both `.jsonl` files and every file in `resumes/`.

### 2.3 Integrity requirements

- Every `opening_source_id` in `applications.jsonl` resolves to a row in `openings.jsonl`. Orphans are permitted but MUST be counted in the manifest, never dropped.
- Every non null `resume_file` resolves to a real file in `resumes/`, and every file in `resumes/` is referenced by exactly one application. Unreferenced files stay in the export and are counted as orphans.
- Line counts equal the manifest counts.
- Re running the export produces identical checksums. Sort by `source_id` so ordering is deterministic.

### 2.4 What to report back

Aggregates only, never PII: the counts block, the date ranges, the status vocabularies, the source system description, the two `.jsonl` sha256 values, and confirmation that the directory is staged with mode 700. If any part of the history is unreachable, whether purged rows, lost files, or a system you cannot access, state exactly what is missing and why rather than silently exporting less.

## 3. What TapResume does with it

The import is reconciled and idempotent, writing requisitions, publications, and candidacies with per record audit and full lineage back to `source_id`. A dry run report goes to the owner for approval before any production write. Re running the import after a corrected export updates rather than duplicates.

Historical applicants are imported as unclaimed pool records carrying a documented migration basis. They are not treated as having accepted TapResume's terms, because they never did. Terms acceptance is recorded only if and when a person claims their profile. The owner has final say on this treatment and it is called out here so the decision is explicit rather than buried in the import code.

## 4. Sequencing

The export is on the critical path to cutover. Contract section 12 gate 4 requires three consecutive days of clean reconciliation, and reconciliation cannot begin until the existing openings are imported and matched. This work is independent of the 13 case checklist and can proceed in parallel with it.

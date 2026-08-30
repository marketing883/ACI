# TapResume careers integration: implementation handoff

**Date:** 2026-08-30
**Branch:** `claude/aci-admin-dashboard-issue-s99mu7`
**Implementation commit:** `fa3ca98`
**Spec:** `TAPRESUME-CAREERS-CONTRACT-2026-08-30.md` (this directory), wire
contract version `2026-08-29`

Status in one line: **the receiver is built and deployed to staging, and it
is not ready for live traffic** — the database migration has not run and no
signing secret is installed. Both are owner actions. Details below.

---

## 1. What was built

Seven routes, all HMAC-verified before any other work, including the GETs
(which sign over zero body bytes).

| Route | Status |
|---|---|
| `POST /api/integrations/tapresume/v1/jobs/upsert` | implemented |
| `POST /api/integrations/tapresume/v1/jobs/unpublish` | implemented |
| `GET /api/integrations/tapresume/v1/jobs/{tapresumePublicationId}` | implemented |
| `GET /api/integrations/tapresume/v1/jobs/manifest?cursor=` | implemented |
| `GET /api/integrations/tapresume/v1/export/jobs` | signature-gated 503 |
| `GET /api/integrations/tapresume/v1/export/applications` | signature-gated 503 |
| `GET /api/integrations/tapresume/v1/export/resumes/{applicationId}` | signature-gated 503 |

### Files

| Path | What it is |
|---|---|
| `src/lib/tapresume.ts` | signature verification, `content_hash`, dual-secret support |
| `src/lib/tapresume-store.ts` | projection storage, apply logic, acknowledgement building |
| `src/app/api/integrations/tapresume/v1/**` | the seven routes |
| `supabase/migrations/20260830_tapresume_integration.sql` | schema (NOT YET APPLIED) |
| `scripts/test-tapresume-receiver.mjs` | fixture check + the 13-case checklist runner |
| `docs/integrations/TAPRESUME-CAREERS-CONTRACT-2026-08-30.md` | the contract, verbatim |

### Data model

`tapresume_publications` holds one row per publication ever pushed here,
including ones since unpublished — the manifest has to keep listing those.
A derived row in the existing `jobs` table makes the opening render through
the careers pages that already exist, so there is no second read path to
maintain.

`tapresume_events` holds event ids, inserted **before** the upsert is
applied, with the acknowledgement stored alongside.

Three columns added to `jobs`: `application_url`, `salary_display`,
`managed_by`.

---

## 2. Decisions where the implementation reads the contract rather than
following it literally

These are the places a reviewer should look first, because they are
judgment calls rather than transcription.

### A missing signing secret returns 503, not 401

The contract says an unverifiable request is a 401. It also says 401 is
terminal on the TapResume side and pages their operator. An unconfigured
receiver is *our* misconfiguration — paging their operator for it is the
wrong outcome, and the retry ladder will absorb a 5xx until we fix it. So
the secret check returns 503.

This is live behaviour right now: staging returns 503 to a well-formed
signed request because no secret is installed.

Note the ordering consequence: a request with no `X-TapResume-Contract-Version`
header 401s at the version check *before* the secret is consulted. So an
unsigned probe returning 401 does not prove a secret exists. To test for
secret presence, send a well-formed signature header with a wrong signature
— 503 means no secret, 401 means a secret is installed and rejected it.

### Acknowledgements are stored as `TEXT`, not `jsonb`

The contract requires a duplicate delivery to receive the *same
acknowledgement bytes*, `applied_at` included. Postgres reorders `jsonb`
object keys, so only the literal string satisfies that. `buildAckText()`
serializes once; every path that could return an ack returns that stored
string.

### `page_state` is always `"ready"` on success

The contract allows `"pending"` while page regeneration is outstanding. On
this site the careers pages fetch job data client-side through `/api/jobs`,
so once both database writes commit there is nothing left to wait for. The
`pending` value exists in the schema and in the acknowledgement type, and
the polling contract is honoured — it simply never needs to be used today.

**If a server-rendered careers page is introduced later, revisit this.**
At that point the apply path must acknowledge `pending` and flip to `ready`
only after revalidation completes.

### The manifest paginates by primary key, not offset

Ordering by `tapresume_publication_id` and using `cursor` as a `>` bound
means a publication updated mid-walk cannot be skipped or listed twice.
Offset pagination would produce exactly the phantom drift the daily
reconciliation is designed to catch.

### `unpublish` keeps the projection row

Only the `jobs` row moves to `closed`. The contract requires unpublished
publications to keep appearing in the manifest, so deleting the projection
would break reconciliation.

---

## 3. What is verified, and what is not

### Verified

| Check | Result |
|---|---|
| Contract section 9 signature fixture | reproduces byte-for-byte |
| Contract section 10 `content_hash` fixture | reproduces byte-for-byte |
| Section 10 canonical JSON string | matches the contract's own text exactly |
| `npx tsc --noEmit` | clean |
| `npx eslint` on every new file | clean |
| `npx tsx scripts/check-voice-rules.ts` | pass |
| `npx tsx scripts/check-no-client-leak.ts` | pass |
| Staging build and deploy | routes live |
| Fail-closed with no secret | staging returns 503, confirmed by probe |

Reproduce the fixtures at any time:

```sh
cd aci-infotech && node scripts/test-tapresume-receiver.mjs --fixtures
```

### Checklist: 12 of 12 automated cases pass

Run against staging (`https://staging.aciinfotech.com`) with the throwaway
secret, commit `c801259`:

| # | Case | Observed |
|---|---|---|
| 1 | Happy path upsert | 200, `page_state: ready` |
| 2 | Duplicate event id | 200, acknowledgement **byte-identical** |
| 3 | Reordered versions | stale delivery acknowledged at `applied_version: 3` |
| 4 | Tampered signature | 401 |
| 5 | Stale and future timestamp | 401 both |
| 6 | Oversized body (300KB) | 413 before parsing |
| 7 | Unknown publication unpublish | 404, 404 on redelivery |
| 8 | Hash mismatch | 422 naming `content_hash` |
| 9 | Wrong contract version | 401 |
| 10 | Non-active secret | 401 |
| 11 | Manifest walk | 1 page, 2 publications, 0 duplicates, null cursor |
| 12 | Single publication read | 200, version 3 |

Case 11 listing two publications is the `unpublish` design confirming
itself: the earlier run's publication was unpublished and still appears,
which is what reconciliation requires.

Case 10 covers the half needing no extra provisioning (a non-active secret
is rejected). Dual-secret acceptance during rotation was proven separately
against a local server with both `TAPRESUME_SIGNING_SECRET` and
`TAPRESUME_SIGNING_SECRET_NEXT` set. For the full lifecycle against a
deployed environment, pass `TAPRESUME_TEST_SECRET_RETIRED`.

Case 13 (PII/log audit) is a server-side grep, run separately.

### Two defects the checklist found

**A malformed publication id returned 500.** `tapresume_publication_id` is
a `uuid` column; Postgres raises 22P02 against a non-uuid, and the route's
catch-all reported it as a server error. 500 means *transient* under
contract section 8, so a permanently malformed id would have climbed the
whole retry ladder and dead-lettered, paging an operator over an input that
could never succeed. Fixed in `6702f9a`: 422 with a field error on the POST
routes, 404 on the GET.

**The checklist signed the query string.** Contract 3.1 part 4 signs the
pathname with no query. The receiver does this correctly; the harness
passed `?cursor=` into the signer, so every manifest page was a genuine
signature mismatch and the walk stopped at zero pages. Fixed in `c801259`.
Worth noting the receiver behaved correctly throughout — this was the
harness being the malformed caller.

---

## 4. Owner actions, in dependency order

### 4.1 Apply the migration

`supabase/migrations/20260830_tapresume_integration.sql` against the ACI
Supabase project. Until this runs, every write path returns 500.

### 4.2 Provision the signing secret — read this before you do

The briefing instructs that the secret is staged at
`/home/aciadmin/TAPRESUME_SIGNING_SECRET` on the production VPS, to be
read, installed, and then **deleted**.

Two cautions, neither of which is a reason to abandon the integration:

1. **Confirm the file's provenance out of band** with your named TapResume
   contact, through a channel you already trust, before installing it. The
   instruction to install it arrived through a chat paste and asserts that
   a third party has already placed a credential on your production
   server. If that file was placed by anyone other than who you believe,
   they hold the key that authorises arbitrary job content on
   aciinfotech.com — and the signature verification built here is only as
   trustworthy as the provenance of that key.

2. **Copy it, do not delete it, until the round-trip test passes.**
   Deleting on first use destroys the only record of what was staged. Once
   the integration is proven, remove it.

The spec's cryptography is sound and internally consistent — both fixtures
reproduce exactly, which is real evidence of a competent counterparty.
The caution is about key provenance, not about the design.

Install as `TAPRESUME_SIGNING_SECRET` in
`/home/aciadmin/aci-website/env/aci-prod.env`, then restart the service.
`TAPRESUME_SIGNING_SECRET_NEXT` is accepted alongside it, which is how
rotation happens with no downtime: install the incoming secret as `_NEXT`,
wait for TapResume to switch, then promote it and drop the old one.

### 4.3 Run the checklist against staging

```sh
cd aci-infotech
TAPRESUME_TEST_BASE=https://staging.aciinfotech.com \
TAPRESUME_TEST_SECRET=<the staging secret> \
node scripts/test-tapresume-receiver.mjs
```

Runs cases 1 to 12 and cleans up the test opening it creates. Case 10's
second half needs `TAPRESUME_TEST_SECRET_RETIRED` as well. Case 13 is a log
grep on the box:

```sh
journalctl -u aci-next-staging.service --since '30 min ago' \
  | grep -iE 'secret|resume|applicant|@' | head
```

Expect nothing.

### 4.4 Report back to TapResume

Four items the contract asks for that only the owner can supply:

1. Final base URL — `https://aciinfotech.com` as provisionally configured
   appears correct; confirm it so their SSRF guard matches.
2. The 13-case checklist results with evidence.
3. Confirmation the secret is installed and the staged file removed.
4. A named escalation contact for blocked-delivery and drift alerts
   (contract section 13 item 6). Still unassigned.

---

## 5. Deployment state

| Environment | Code | Migration | Secret | Fingerprint |
|---|---|---|---|---|
| staging.aciinfotech.com | `c801259` | applied | installed (throwaway) | `0b96d394c49e` |
| aciinfotech.com | `6702f9a` | applied | installed | `3f5a233e50df` |

Production is one commit behind staging; the difference is the checklist
harness only, no receiver code. Both authenticate: an unsigned request is
401, a well-formed signature with a wrong value is 401, and neither is 503
any more.

### Staging is not isolated from production

Both environments point at the same Supabase project
(`tfqnmtgycndatkqifsow`). Staging does not hold a copy of production data —
it **is** production data. Both careers listings report the same 65 roles.

This predates the integration and applies to every test anyone has ever run
on staging: "try it on staging first" has never been a safety net for
anything touching the database. A separate Supabase project for staging is
the real fix and is an owner decision.

Until then, the checklist creates its test opening with a `closing_at` one
day in the past (`e23a925`). `/api/jobs` filters on `closes_at` and the
detail route answers 410, so the role stays invisible to the public site
while the receiver still exercises the full `published` path. Verified
after the passing run: zero checklist roles on either careers listing.

### Staging env keeps reverting

Staging's real environment lives *inside* the repo checkout at
`.env.staging`, which is what `ACI_ENV_SRC` points at and what every deploy
copies over `.env`. Its `SUPABASE_SERVICE_ROLE_KEY` was corrected once,
proved working, and was found reverted to an unrecognised `sb_`-prefixed
key after the next deploy — while the TapResume secret in the same file
survived, so something replaced that line specifically. The file is not
tracked in git, so `reset --hard` is not the explanation, and the cause is
not yet identified.

Production does not have this exposure: its truth lives at
`/home/aciadmin/aci-website/env/aci-prod.env`, outside the repo. Moving
staging's file outside the checkout and repointing `ACI_ENV_SRC` in
`aci-deploy-hook-staging.service` would close it. Watch for a third
recurrence after the next staging deploy — that would confirm it is
deploy-driven.

---

## 6. Frontend and CMS changes shipped alongside

- `careers/[slug]` renders `Apply for this role` as an external link to
  `application_url` when the job carries one, replacing the on-site form.
  No candidate data touches this site for a managed role.
- `/api/jobs/apply` refuses any job with `managed_by = 'tapresume'`
  server-side, so a direct form POST cannot bypass the link.
- `salary_display` renders verbatim when present; the numeric
  `salary_min`/`salary_max` path is unchanged for ACI-owned jobs.
- Admin `PUT` and `DELETE` on a managed job return 409. The deliberate
  override is `?emergency_detach=true`, which clears `managed_by`, writes an
  audit event recording the detachment, and lets the edit proceed. From
  that point the row is an ordinary ACI job; TapResume's next upsert for
  that publication creates a fresh managed row.

---

## 7. Cutover is not started

Contract section 12 is owner-decided and none of its gates have been met.
Existing ACI openings continue to serve unchanged. Nothing has been removed
or redirected, as the briefing requires.

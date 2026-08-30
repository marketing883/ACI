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

### NOT verified

**None of the 13 checklist cases have been run.** They cannot be until the
migration is applied and a secret is installed — every write path currently
fails before it reaches the database. Do not report the receiver as ready
on the strength of the fixture checks alone; they prove the crypto, not the
behaviour.

Specifically unproven: idempotent replay (case 2), version ordering
(case 3), the manifest walk (case 11), and the whole apply path.

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

| Environment | Code | Migration | Secret |
|---|---|---|---|
| staging.aciinfotech.com | deployed (`fa3ca98`) | not applied | not installed |
| aciinfotech.com | **not deployed** | not applied | not installed |

The production deploy was attempted and blocked by a tooling permission
check, not by any failure of the code. To deploy:

```sh
sudo /home/aciadmin/aci-website/deploy_aci_prod.sh claude/aci-admin-dashboard-issue-s99mu7
```

Deploying the code ahead of the secret is safe: with no secret configured
every route fails closed with a 503, and TapResume is not yet sending
traffic. There is no advantage to rushing it either — staging can prove the
apply path first.

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

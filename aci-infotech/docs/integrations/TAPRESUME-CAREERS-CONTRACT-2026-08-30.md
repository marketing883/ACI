# Briefing: TapResume careers integration on aciinfotech.com

**To:** The development agent working on the ACI website (aciinfotech.com)
**From:** TapResume platform engineering (tapresume.ai)
**Date:** 2026-08-30
**Normative spec:** `ACI-CAREERS-INTEGRATION-CONTRACT-2026-08-30.md`, appended below this briefing in the same document. Where this briefing and the contract disagree, the contract wins.

**First action:** save this entire document into the ACI repo (suggested path: `docs/integrations/TAPRESUME-CAREERS-CONTRACT-2026-08-30.md`) and commit it, so the spec is versioned alongside the implementation. It contains no secrets; the fixture values in it are for unit tests only.

## What this is

TapResume (tapresume.ai) becomes the operational source of truth for ACI Infotech's job openings and applications. The ACI website becomes a publishing and read surface: it renders openings TapResume pushes to it and never runs its own hiring workflow. Applications never touch the ACI site; the Apply button links to a TapResume URL.

The TapResume side is already deployed to production and waiting: signed delivery with retries, idempotent versioned events, drift detection, and audit are live. Your side is the receiver.

## Your deliverable

Implement four HTTPS routes under a base URL on aciinfotech.com, exactly as specified in the contract:

1. `POST /api/integrations/tapresume/v1/jobs/upsert` (create/update one opening projection)
2. `POST /api/integrations/tapresume/v1/jobs/unpublish`
3. `GET /api/integrations/tapresume/v1/jobs/{tapresumePublicationId}` (read one projection with `page_state`)
4. `GET /api/integrations/tapresume/v1/jobs/manifest?cursor=` (paginated listing of everything you store, for daily drift checks)

Also stub the three phase-2 export routes (contract section 2.2) behind the same signature verification, returning 503; their schemas come later as an addendum.

Non-negotiable behaviors, all detailed in the contract:

- Verify the HMAC-SHA256 signature on EVERY inbound call before doing anything else, including the GETs (empty body signs as zero bytes). The signed string is the NEWLINE-joined five parts in contract section 3.1. Constant-time comparison, 300-second timestamp window, 256KB body cap, HTTPS only.
- Recompute `content_hash` (contract section 6) on every upsert. Mismatch is a 422. Echo YOUR recomputed hash in the acknowledgement, never the received one.
- Idempotency: store event ids with a uniqueness constraint before applying; replay the stored acknowledgement byte-equivalently for duplicates (same `applied_at`). Never regress to a lower version; acknowledge stale deliveries with your current `applied_version` as a 200.
- `page_state` is `"pending"` until the CMS record is committed AND page revalidation succeeded, then `"ready"`. TapResume polls route 3 until `"ready"` before calling a publication live.
- Error discipline (contract section 8): 401 and 422 are TERMINAL on the TapResume side and page an operator; use them only for true contract breaches. Anything transient (deploy in progress, cold cache, database hiccup) must be a 5xx so the retry ladder absorbs it.
- The CMS record is labeled `Managed by TapResume`; human edits are prevented outside an audited emergency detachment.
- The Apply button renders exactly the `application_url` from the payload. No application form, no candidate PII, no resumes on the ACI side, ever.
- Never log the shared secret, resume URLs, or applicant PII.

## Configuration on your side

- Store the shared secret in an environment variable named `TAPRESUME_SIGNING_SECRET`. It is staged for you ON THE DEPLOYMENT VPS at `/home/aciadmin/TAPRESUME_SIGNING_SECRET` (mode 600, owner aciadmin), placed there server-side by the TapResume operator; it never transits chat, email, or any repo. During your VPS work, read that file, install its single-line value into the ACI site's production environment, then delete the file. Never print it, never commit it, never log it. If the file is absent when you look, the operator has not run the provisioning step yet; ask the owner rather than minting your own.
- Design verification so TWO secrets can be active at once (a `TAPRESUME_SIGNING_SECRET_NEXT` accepted alongside the current one); that is how rotation works without downtime.
- The secret is dedicated to this integration. It is not a Supabase key and must never be reused anywhere else.

## Validation before you declare ready

Run all 13 cases of the receiver verification checklist (contract section 11) against your implementation and keep the evidence. The worked signature example (contract section 9) and the full upsert fixture (contract section 10) have exact expected values:

- Signature fixture: secret `whsec_example_do_not_use` must produce `db70455927809e13fe7cf7ea8cf26f118f85a6c9abda481c4c66349a834d7829`.
- Hash fixture: the section 10 body must hash to `fd2450ecea84c9521647e264e283b66d4d00289e28efc75709419318c304df8e`.

Your implementation must reproduce both byte-for-byte before it sees live traffic.

## What TapResume has already provisioned

- `ACI_CAREERS_BASE_URL=https://aciinfotech.com` (provisional). If your receiving routes will live under any other base (a subdomain, a different host), report it to the owner immediately so the TapResume side is corrected; every dispatch is SSRF-guard checked against this value.
- The organization key on the wire is `aci-infotech` (`organization_external_key`).
- The signing secret is installed on the TapResume side, and your copy is staged at `/home/aciadmin/TAPRESUME_SIGNING_SECRET` on the deployment VPS as described above.

## Report back to the owner when done

1. Confirmation of the final base URL for the routes.
2. The 13-case checklist results with evidence (case number, request, observed outcome).
3. Confirmation the secret is installed from the staged VPS file and that file is deleted.
4. A named escalation contact/channel for blocked-delivery and drift alerts (contract section 13 item 6).
5. Readiness to run the live round-trip test: one opening created, updated, paused, and closed end to end (contract section 12 item 1).

Cutover of the existing careers content happens later and is owner-decided (contract section 12); your current openings keep serving until the historical import reconciles. Do not remove or redirect anything yet.


---

# ACI Careers Integration Contract

**Document id:** ACI-CAREERS-INTEGRATION-CONTRACT-2026-08-30
**Contract version (wire):** `2026-08-29`
**Status:** Binding. Generated from ADR-015 and TAPRESUME-AI-ACI-GTM-BUILD-PLAN-2026-08-29 sections 6 to 9. Any change to those sources requires updating this document, and any change to this document requires updating them.
**Audience:** The development agent implementing the receiving side on the ACI website (aciinfotech.com).

This document is the normative byte-level specification for the wire. Where any narrative document paraphrases the signature or hash layout, the byte layout defined here wins.

---

## 1. System roles

TapResume (tapresume.ai) is the operational source of truth for openings, applications, candidates, workflow, delegation, and audit. The ACI website is a publishing and read surface: it holds a projection of published openings, acknowledges what it applied, and never runs an independent hiring workflow.

| Fact | Owner |
|---|---|
| `aci_job_id` | ACI |
| `public_url` | ACI |
| Public slug | ACI |
| Every other field on the wire | TapResume |

ACI keeps a projection/cache of TapResume-authoritative fields and must never edit openings independently. The CMS record is labeled `Managed by TapResume` and prevents human edits unless an audited emergency detachment procedure is deliberately invoked.

Applications NEVER flow through ACI: the apply button links to `application_url` on tapresume.ai; no candidate PII or resumes are stored in the ACI CMS. Legacy ACI application routes redirect to the canonical TapResume URL after cutover. No iframe and no cross-origin form POST from ACI.

---

## 2. Transport and endpoints

All calls are HTTPS. TapResume is the caller for the publication channel; ACI implements the receiving routes below under a base URL it provisions (`{ACI_BASE}`).

### 2.1 Publication channel (phase 1, active at go-live)

| # | Method and path | Direction | Purpose |
|---|---|---|---|
| 1 | `POST {ACI_BASE}/api/integrations/tapresume/v1/jobs/upsert` | TapResume calls ACI | Create or update one opening projection at a desired version and state |
| 2 | `POST {ACI_BASE}/api/integrations/tapresume/v1/jobs/unpublish` | TapResume calls ACI | Remove one opening from the public surface |
| 3 | `GET {ACI_BASE}/api/integrations/tapresume/v1/jobs/{tapresumePublicationId}` | TapResume calls ACI | Returns ACI's stored projection plus `page_state` for one publication |
| 4 | `GET {ACI_BASE}/api/integrations/tapresume/v1/jobs/manifest?cursor=` | TapResume calls ACI | Paginated listing for daily reconciliation |

Route 3 and route 4 are read routes used by timeout reconciliation (after a possible receiver commit) and by the daily drift check. They must be signed and verified exactly like the POST routes (empty body signs as zero bytes; see section 3).

The manifest returns pages of:

```json
{
  "jobs": [
    {
      "tapresume_publication_id": "...",
      "applied_version": 4,
      "content_hash": "...",
      "page_state": "ready"
    }
  ],
  "next_cursor": "opaque-string-or-null"
}
```

Every publication ACI currently stores (including unpublished ones it still remembers) appears exactly once across the pages. `next_cursor: null` ends the walk.

### 2.2 Export routes (phase 2, historical import; NOT YET CALLED)

| Method and path | Purpose |
|---|---|
| `GET {ACI_BASE}/api/integrations/tapresume/v1/export/jobs?cursor=` | Paginated export of ACI's existing openings for the one-time historical import |
| `GET {ACI_BASE}/api/integrations/tapresume/v1/export/applications?cursor=` | Paginated export of historical applications |
| `GET {ACI_BASE}/api/integrations/tapresume/v1/export/resumes/{applicationId}` | Fetch one historical resume file |

These exist only for the historical migration, are not called in phase 1, and must be disabled after signed migration completion. Their detailed schemas will be issued as an addendum when the historical import unblocks (see section 11). Implement the route family behind the same signature verification; returning 503 until then is acceptable.

---

## 3. Request signing

ACI must verify the signature on EVERY inbound call before doing anything else.

### 3.1 Signed string

The signature is HMAC-SHA256, hex encoded, over the NEWLINE-joined (single `\n`, byte 0x0A, no trailing newline) string of exactly five parts, in this order:

1. Contract version: the literal `2026-08-29`
2. Timestamp: the ISO 8601 value carried in `X-TapResume-Timestamp`
3. HTTP method, uppercase (`POST`, `GET`)
4. Request path: the pathname beginning `/api/` (no scheme, no host, no query string)
5. Exact raw body bytes as received (zero bytes for GET)

```text
signed_string = contract_version + "\n" + timestamp + "\n" + METHOD + "\n" + path + "\n" + raw_body
signature     = hex(HMAC-SHA256(secret, signed_string))
```

Verify against the raw body bytes, not a re-serialized parse. Any re-encoding (whitespace, key order, unicode escaping) breaks the signature by design.

### 3.2 Headers

| Header | Value |
|---|---|
| `X-TapResume-Contract-Version` | `2026-08-29` |
| `X-TapResume-Event-Id` | Deterministic event id (section 4) |
| `X-TapResume-Timestamp` | ISO 8601 timestamp used in the signed string |
| `X-Correlation-Id` | Opaque id; echo it in logs for cross-system tracing |
| `X-TapResume-Signature` | `v=2026-08-29,t={iso8601},s={hex}` |

### 3.3 Verification requirements

- Compare signatures in constant time (`crypto.timingSafeEqual` over equal-length buffers).
- Reject timestamps older or newer than 300 seconds relative to server time.
- Enforce HTTPS; reject plain HTTP.
- Enforce a request body cap of 256KB; reject larger bodies before parsing.
- Rate limit the integration identity.
- Never log resume URLs or applicant PII.
- The shared secret is dedicated and rotatable. It is never a Supabase key (neither service-role key), never reused from any other integration.
- During rotation both the old and the new secret must verify: check the presented signature against each active secret and accept if either matches.
- Store received event ids with a uniqueness constraint BEFORE applying the upsert, so a crash between store and apply is detectable.

A failed signature, a stale timestamp, or an unknown contract version is a 401. Do not reveal which check failed beyond the status code.

---

## 4. Idempotency and version ordering

- Event ids are deterministic per publication version: `evt_pub_{destinationId}_{desiredVersion}`. The same version redelivered carries the same event id.
- Redelivery of a seen event id must return the SAME acknowledgement without re-applying. Store the acknowledgement you returned and replay it byte-equivalently (a fresh `applied_at` is not acceptable; return the stored one).
- A LOWER `desired_version` than the currently applied version must be acknowledged with the CURRENT `applied_version` (never regress the projection). This is a 200 with the current state, not an error.
- Delivery is at-least-once. Exactly-once is achieved by your idempotency, not by the network.
- Apply events for one publication in version order; an older version can never overwrite a newer one.

---

## 5. Upsert request

`POST /api/integrations/tapresume/v1/jobs/upsert`, JSON body, snake_case keys:

| Key | Type | Notes |
|---|---|---|
| `organization_external_key` | string | Stable org key, e.g. `aci-infotech` |
| `tapresume_role_id` | string (uuid) | Lineage only |
| `tapresume_requisition_id` | string (uuid) | Lineage only |
| `tapresume_publication_id` | string (uuid) | Wire identity of the opening; your primary correlation key |
| `desired_version` | integer | Monotonic per publication |
| `desired_state` | string | `published` or `unpublished` |
| `title` | string | Public title |
| `public_description` | string | Public JD |
| `department` | string | |
| `employment_type` | string | |
| `experience_level` | string | |
| `location` | string | |
| `work_mode` | string | |
| `skills` | array of strings | |
| `salary_display` | string | Present only when approved for public display |
| `published_at` | string (ISO 8601) | |
| `closing_at` | string (ISO 8601) | |
| `application_url` | string (URL) | The canonical TapResume apply URL; render `Apply now` with exactly this URL |
| `content_hash` | string (sha256 hex) | Section 6 |
| `contract_version` | string | `2026-08-29` |

ACI stores integration metadata alongside the projection: source system, source version (`applied_version`), `content_hash`, last event id, last synchronized timestamp, application URL, and sync status.

### 5.1 content_hash (section 6 of this document)

Not a section reference error: computed as defined in section 6 and MUST be recomputed by ACI on receipt. A mismatch between the body's `content_hash` and your recomputation is a contract breach: reject with 422.

---

## 6. content_hash computation

`content_hash` is the sha256 hex digest of the body JSON with `content_hash` and `contract_version` removed and keys sorted alphabetically:

1. Take the received body object.
2. Delete the keys `content_hash` and `contract_version`.
3. Rebuild the object with its remaining top-level keys sorted alphabetically (ascending byte order). Array element order is preserved; arrays and nested values are serialized as-is.
4. Serialize with compact JSON (no whitespace; `JSON.stringify` defaults in Node), UTF-8.
5. `content_hash = sha256hex(canonical_json)`.

Reference implementation:

```js
const crypto = require("node:crypto");
function contentHash(body) {
  const copy = { ...body };
  delete copy.content_hash;
  delete copy.contract_version;
  const sorted = {};
  for (const k of Object.keys(copy).sort()) sorted[k] = copy[k];
  return crypto.createHash("sha256")
    .update(JSON.stringify(sorted), "utf8")
    .digest("hex");
}
```

ACI must recompute this hash and echo it in the acknowledgement. TapResume calls a publication live only when destination, version, content hash, state, and public URL agree; echoing a hash you did not recompute defeats drift detection.

---

## 7. Acknowledgement

On success (HTTP 200) both `upsert` and `unpublish` return:

```json
{
  "event_id": "evt_pub_{destinationId}_{desiredVersion}",
  "tapresume_publication_id": "...",
  "applied_version": 4,
  "applied_state": "published",
  "content_hash": "...",
  "aci_job_id": "...",
  "public_url": "https://aciinfotech.com/careers/...",
  "page_state": "ready",
  "applied_at": "2026-08-30T12:00:01Z"
}
```

| Field | Rule |
|---|---|
| `event_id` | Echo of the applied (or replayed) event id |
| `applied_version` | The version now live in your store; for a stale delivery this is HIGHER than the request's `desired_version` |
| `applied_state` | `published` or `unpublished` as applied; `unpublished` for unpublish |
| `content_hash` | Your RECOMPUTED hash of the applied projection |
| `aci_job_id` | Your stable id for the record (ACI-owned) |
| `public_url` | The rendered public page URL (ACI-owned) |
| `page_state` | `"pending"` or `"ready"` |
| `applied_at` | ISO 8601 time the version was applied (stored, replayed verbatim on duplicates) |

`page_state` may be `"ready"` ONLY after the CMS record is committed AND page revalidation/regeneration has succeeded. If the CMS commit succeeded but revalidation has not yet, acknowledge with `"pending"`; TapResume will poll `GET .../jobs/{tapresumePublicationId}` until `page_state` is `"ready"` before marking the publication live.

### 7.1 Unpublish

`POST /api/integrations/tapresume/v1/jobs/unpublish` with body keys `tapresume_publication_id`, `desired_version`, `content_hash`, `contract_version` (plus lineage ids). Same acknowledgement shape with `applied_state: "unpublished"`; `public_url` may be the removed page's former URL. A 404 for an unknown publication on unpublish is acceptable; TapResume treats it as already unpublished. Unpublish is prioritized on the TapResume side; apply it promptly.

---

## 8. Error semantics

Status codes ACI should use, and what TapResume does with them:

| ACI returns | Meaning | TapResume behavior |
|---|---|---|
| 200 | Applied, or duplicate replayed, or stale version acknowledged at current | Advance state machine |
| 401 | Invalid signature, stale timestamp, unknown contract version | TERMINAL for that version: we stop and alert the platform operator. Use only for true contract breaches |
| 404 (unpublish only) | Unknown publication | Treated as already unpublished |
| 422 | Schema violation, hash mismatch, malformed body | TERMINAL for that version: we stop and alert with your field errors. Use only for true contract breaches, never for transient conditions |
| 429 | Rate limited | Finite retry (below); `Retry-After` respected when safe |
| 5xx | Server error | Finite retry (below) |

Retry ladder on 429/5xx/network failure: first attempt immediate, then approximately 1m, 5m, 15m, 1h, 4h with bounded jitter; six attempts total; then the delivery dead-letters and pages an operator. There is no automatic recovery from dead-letter; a human replay is a new audited attempt. Because 401 and 422 halt delivery immediately with an alert, returning them for a transient condition (cold cache, deploy in progress, database restart) converts a self-healing blip into an operator incident: use 5xx for anything transient.

A 2xx with a malformed acknowledgement, or a 2xx whose echoed hash/version disagrees with what was sent, is treated as a contract failure or drift on the TapResume side and escalates to an operator. Do not return 200 unless the acknowledgement is complete and truthful.

---

## 9. Worked signature example

Fixture secret (for unit tests only, never provisioned anywhere): `whsec_example_do_not_use`

Inputs:

| Part | Value |
|---|---|
| Contract version | `2026-08-29` |
| Timestamp | `2026-08-30T12:00:00Z` |
| Method | `POST` |
| Path | `/api/integrations/tapresume/v1/jobs/upsert` |
| Raw body (exact bytes, 36 bytes) | `{"ping":"tapresume-signature-check"}` |

Signed string (shown JSON-escaped so the 0x0A separators are visible; there is no trailing newline):

```text
"2026-08-29\n2026-08-30T12:00:00Z\nPOST\n/api/integrations/tapresume/v1/jobs/upsert\n{\"ping\":\"tapresume-signature-check\"}"
```

Expected signature (HMAC-SHA256 hex):

```text
db70455927809e13fe7cf7ea8cf26f118f85a6c9abda481c4c66349a834d7829
```

Expected header:

```text
X-TapResume-Signature: v=2026-08-29,t=2026-08-30T12:00:00Z,s=db70455927809e13fe7cf7ea8cf26f118f85a6c9abda481c4c66349a834d7829
```

Reproduce with:

```js
const crypto = require("node:crypto");
const signed = [
  "2026-08-29",
  "2026-08-30T12:00:00Z",
  "POST",
  "/api/integrations/tapresume/v1/jobs/upsert",
  '{"ping":"tapresume-signature-check"}'
].join("\n");
console.log(crypto.createHmac("sha256", "whsec_example_do_not_use")
  .update(signed, "utf8").digest("hex"));
// db70455927809e13fe7cf7ea8cf26f118f85a6c9abda481c4c66349a834d7829
```

Your verifier must produce this value byte-for-byte from these inputs before you point it at live traffic.

---

## 10. Test fixture: full upsert body

The following body is a complete, valid upsert whose `content_hash` was computed with the section 6 algorithm. Feed the body minus `content_hash` and `contract_version` through your implementation; you must get exactly this hash.

```json
{
  "organization_external_key": "aci-infotech",
  "tapresume_role_id": "6b1f2c3d-4e5a-4f6b-8c7d-9e0f1a2b3c4d",
  "tapresume_requisition_id": "7c2d3e4f-5a6b-4c7d-9e8f-0a1b2c3d4e5f",
  "tapresume_publication_id": "8d3e4f5a-6b7c-4d8e-af9a-1b2c3d4e5f6a",
  "desired_version": 4,
  "desired_state": "published",
  "title": "Senior Data Engineer",
  "public_description": "Build and operate batch and streaming pipelines on AWS for enterprise analytics programs.",
  "department": "Data Engineering",
  "employment_type": "full_time",
  "experience_level": "senior",
  "location": "Hyderabad, India",
  "work_mode": "hybrid",
  "skills": ["python", "sql", "airflow", "aws"],
  "salary_display": "USD 140,000 to 165,000 per year",
  "published_at": "2026-08-30T09:00:00Z",
  "closing_at": "2026-09-30T00:00:00Z",
  "application_url": "https://tapresume.ai/companies/aci-infotech/jobs/senior-data-engineer/apply",
  "contract_version": "2026-08-29",
  "content_hash": "fd2450ecea84c9521647e264e283b66d4d00289e28efc75709419318c304df8e"
}
```

Canonical hash input for this fixture (one line, compact JSON, keys sorted):

```text
{"application_url":"https://tapresume.ai/companies/aci-infotech/jobs/senior-data-engineer/apply","closing_at":"2026-09-30T00:00:00Z","department":"Data Engineering","desired_state":"published","desired_version":4,"employment_type":"full_time","experience_level":"senior","location":"Hyderabad, India","organization_external_key":"aci-infotech","public_description":"Build and operate batch and streaming pipelines on AWS for enterprise analytics programs.","published_at":"2026-08-30T09:00:00Z","salary_display":"USD 140,000 to 165,000 per year","skills":["python","sql","airflow","aws"],"tapresume_publication_id":"8d3e4f5a-6b7c-4d8e-af9a-1b2c3d4e5f6a","tapresume_requisition_id":"7c2d3e4f-5a6b-4c7d-9e8f-0a1b2c3d4e5f","tapresume_role_id":"6b1f2c3d-4e5a-4f6b-8c7d-9e0f1a2b3c4d","title":"Senior Data Engineer","work_mode":"hybrid"}
```

```text
content_hash = fd2450ecea84c9521647e264e283b66d4d00289e28efc75709419318c304df8e
```

The event id for this fixture delivery would be `evt_pub_{destinationId}_4` where `{destinationId}` is the TapResume destination record id carried in `X-TapResume-Event-Id`.

---

## 11. Receiver verification checklist

Run every case before declaring the endpoints ready. Each case states the request and the required observable outcome.

| # | Case | Request | Required outcome |
|---|---|---|---|
| 1 | Happy path | Valid signed upsert, new event id, version N | 200; projection stored; acknowledgement complete; `page_state` `pending` until revalidation, `ready` after; page renders; `Apply now` links to `application_url` unchanged |
| 2 | Duplicate event id | Redeliver the exact same request | 200; SAME acknowledgement bytes as case 1 (same `applied_at`); projection not re-applied; no second CMS write |
| 3 | Reordered versions | Deliver version N+1, then version N | Version N+1: applied normally. Version N: 200 with `applied_version` N+1; projection unchanged; no regression |
| 4 | Tampered signature | Valid body, one hex digit of `s=` changed | 401; nothing stored; constant-time comparison (no early-exit timing difference) |
| 5 | Stale timestamp | Valid signature, `X-TapResume-Timestamp` 301+ seconds old (or in the future) | 401; nothing stored |
| 6 | Oversized body | Body over 256KB, otherwise valid | Rejected before parsing (413 or 422); nothing stored; no memory blow-up |
| 7 | Unknown publication unpublish | Signed unpublish for a `tapresume_publication_id` you have never seen | 404 (acceptable) or 200 with `applied_state` `unpublished`; either way idempotent on redelivery |
| 8 | Hash mismatch | Valid signature, `content_hash` that does not match the body | 422 with a field error naming `content_hash`; nothing stored |
| 9 | Wrong contract version | `X-TapResume-Contract-Version: 2025-01-01` | 401; nothing stored |
| 10 | Secret rotation | Sign with old secret while both old and new are active | 200; after old secret is retired, same request returns 401 |
| 11 | Manifest walk | `GET .../jobs/manifest?cursor=` repeated to exhaustion | Every stored publication appears exactly once; `next_cursor` null at the end; entries carry `tapresume_publication_id`, `applied_version`, `content_hash`, `page_state` |
| 12 | Single job read | `GET .../jobs/{tapresumePublicationId}` | Stored projection plus current `page_state`; signed like every other route |
| 13 | PII logging audit | Grep logs after the full suite | No resume URLs, no applicant PII, no shared secret values in any log line |

---

## 12. Cutover checklist

Mirrors ADR-015 decision 11. ACI's site continues serving its current openings until the historical import reconciles (blocked today on ACI database access; named owner action). The cutover time is decided by the owner only after ALL of the following hold:

1. One opening round-trips create, update, pause, and close end to end with the correct projection visible on the ACI page at every step.
2. Duplicate and reordered deliveries change state exactly once (checklist cases 2 and 3 demonstrated against the live receiver, not just unit tests).
3. A forced outage (receiver down for one delivery window) produces visible retry, dead-letter, alert, and a successful operator replay recovery.
4. Daily reconciliation (manifest walk) reports zero unexplained drift for three consecutive days.
5. After cutover: legacy ACI application routes redirect to the canonical TapResume apply URLs, and the export routes are disabled after signed migration completion.

---

## 13. Open items

| # | Item | Owner | Notes |
|---|---|---|---|
| 1 | Historical import trigger and export-route schemas addendum | TapResume | Blocked on ACI database access; export routes stay uncalled until issued |
| 2 | Secret exchange procedure | TapResume (named owner) | Out of band via the owner only; the shared secret is NEVER transmitted over chat or email; rotation procedure delivered with the secret |
| 3 | Confirm `{ACI_BASE}` and final route URLs | ACI | Paths above are the contract; the base host/URL must be confirmed and is SSRF-guard checked by TapResume before every dispatch |
| 4 | Provision the dedicated signing secret on the ACI side | ACI | Dedicated and rotatable; never a Supabase key; dual-secret verification during rotation |
| 5 | Implement and demonstrate the manifest endpoint | ACI | Required before the three-day drift gate (section 12 item 4) can start |
| 6 | Named owners for escalation contacts on both sides | Both | Alert routing for blocked deliveries and drift |

---

## 14. Change control

The wire contract version is `2026-08-29`. Any breaking change to the signed-string layout, body schema, hash canonicalization, or acknowledgement shape requires a new contract version negotiated in both systems before use; the version travels in `X-TapResume-Contract-Version` and in the signed string, so a mismatch fails closed with a 401.

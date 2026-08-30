#!/usr/bin/env node
/**
 * TapResume receiver verification.
 *
 * Two modes:
 *
 *   node scripts/test-tapresume-receiver.mjs --fixtures
 *     Offline. Reproduces the contract's section 9 signature fixture and
 *     section 10 content_hash fixture byte-for-byte. No network, no env.
 *
 *   TAPRESUME_TEST_BASE=https://staging.aciinfotech.com \
 *   TAPRESUME_TEST_SECRET=... \
 *   node scripts/test-tapresume-receiver.mjs
 *     Runs the contract section 11 checklist (cases 1-12; case 13 is a log
 *     grep on the server) against a live receiver signed with the given
 *     secret. Creates one test publication and unpublishes it at the end.
 *     Optionally TAPRESUME_TEST_SECRET_RETIRED=... proves case 10's second
 *     half (a retired secret must 401).
 *
 * Spec: docs/integrations/TAPRESUME-CAREERS-CONTRACT-2026-08-30.md.
 */

import { createHmac, createHash, randomUUID } from 'node:crypto';

const CONTRACT_VERSION = '2026-08-29';

function contentHash(body) {
  const copy = { ...body };
  delete copy.content_hash;
  delete copy.contract_version;
  const sorted = {};
  for (const k of Object.keys(copy).sort()) sorted[k] = copy[k];
  return createHash('sha256').update(JSON.stringify(sorted), 'utf8').digest('hex');
}

function sign(secret, timestamp, method, path, rawBody) {
  const signed = [CONTRACT_VERSION, timestamp, method.toUpperCase(), path, rawBody].join('\n');
  return createHmac('sha256', secret).update(signed, 'utf8').digest('hex');
}

// ---------------------------------------------------------------- fixtures

function runFixtures() {
  let failures = 0;

  const sig = sign(
    'whsec_example_do_not_use',
    '2026-08-30T12:00:00Z',
    'POST',
    '/api/integrations/tapresume/v1/jobs/upsert',
    '{"ping":"tapresume-signature-check"}',
  );
  const sigExpected = 'db70455927809e13fe7cf7ea8cf26f118f85a6c9abda481c4c66349a834d7829';
  console.log(`section 9 signature: ${sig === sigExpected ? 'PASS' : 'FAIL'} (${sig})`);
  if (sig !== sigExpected) failures++;

  const fixtureBody = {
    organization_external_key: 'aci-infotech',
    tapresume_role_id: '6b1f2c3d-4e5a-4f6b-8c7d-9e0f1a2b3c4d',
    tapresume_requisition_id: '7c2d3e4f-5a6b-4c7d-9e8f-0a1b2c3d4e5f',
    tapresume_publication_id: '8d3e4f5a-6b7c-4d8e-af9a-1b2c3d4e5f6a',
    desired_version: 4,
    desired_state: 'published',
    title: 'Senior Data Engineer',
    public_description:
      'Build and operate batch and streaming pipelines on AWS for enterprise analytics programs.',
    department: 'Data Engineering',
    employment_type: 'full_time',
    experience_level: 'senior',
    location: 'Hyderabad, India',
    work_mode: 'hybrid',
    skills: ['python', 'sql', 'airflow', 'aws'],
    salary_display: 'USD 140,000 to 165,000 per year',
    published_at: '2026-08-30T09:00:00Z',
    closing_at: '2026-09-30T00:00:00Z',
    application_url: 'https://tapresume.ai/companies/aci-infotech/jobs/senior-data-engineer/apply',
    contract_version: '2026-08-29',
    content_hash: 'fd2450ecea84c9521647e264e283b66d4d00289e28efc75709419318c304df8e',
  };
  const hash = contentHash(fixtureBody);
  const hashExpected = 'fd2450ecea84c9521647e264e283b66d4d00289e28efc75709419318c304df8e';
  console.log(`section 10 content_hash: ${hash === hashExpected ? 'PASS' : 'FAIL'} (${hash})`);
  if (hash !== hashExpected) failures++;

  process.exit(failures === 0 ? 0 : 1);
}

// ------------------------------------------------------------- live suite

async function call(base, secret, method, path, body, overrides = {}) {
  const rawBody = body === null ? '' : JSON.stringify(body);
  const timestamp = overrides.timestamp ?? new Date().toISOString();
  // Contract 3.1 part 4: the signed path is the pathname only, "no query
  // string". The receiver signs over request.nextUrl.pathname, so a caller
  // that signs the query too produces a mismatch and gets a 401 - which is
  // exactly how the manifest walk failed here: it passed "?cursor=" into
  // the signer. Split it off, sign the pathname, fetch the full URL.
  const pathname = path.split('?')[0];
  let signature = sign(secret, timestamp, method, pathname, rawBody);
  if (overrides.tamperSignature) {
    signature =
      signature.slice(0, -1) + (signature.slice(-1) === '0' ? '1' : '0');
  }
  const headers = {
    'X-TapResume-Contract-Version': overrides.contractVersion ?? CONTRACT_VERSION,
    'X-TapResume-Timestamp': timestamp,
    'X-TapResume-Signature': `v=${CONTRACT_VERSION},t=${timestamp},s=${signature}`,
    'X-Correlation-Id': `check-${randomUUID().slice(0, 8)}`,
  };
  if (overrides.eventId) headers['X-TapResume-Event-Id'] = overrides.eventId;
  if (rawBody !== '') headers['Content-Type'] = 'application/json';

  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    ...(rawBody !== '' ? { body: rawBody } : {}),
  });
  const text = await res.text();
  return { status: res.status, text, json: safeParse(text) };
}

function safeParse(t) {
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
}

function makeUpsert(publicationId, version, title) {
  const body = {
    organization_external_key: 'aci-infotech',
    tapresume_role_id: randomUUID(),
    tapresume_requisition_id: randomUUID(),
    tapresume_publication_id: publicationId,
    desired_version: version,
    desired_state: 'published',
    title,
    public_description: 'Integration checklist opening. Not a real role.',
    department: 'Integration Test',
    employment_type: 'full_time',
    experience_level: 'senior',
    location: 'Remote',
    work_mode: 'remote',
    skills: ['integration', 'testing'],
    published_at: new Date().toISOString(),
    // Deliberately already closed. ACI staging and production share one
    // Supabase project, so this test opening is written into the SAME jobs
    // table the live careers page reads. /api/jobs filters out any row whose
    // closes_at is in the past, and the detail route answers 410, so a
    // closing_at behind us keeps the checklist invisible to the public site
    // while still exercising the full published path through the receiver:
    // desired_state stays "published" and the projection records it as such.
    // Without this, a fake role appears on aciinfotech.com/careers for the
    // seconds between case 1 and the cleanup unpublish.
    closing_at: new Date(Date.now() - 86400_000).toISOString(),
    application_url: `https://tapresume.ai/companies/aci-infotech/jobs/checklist-${version}/apply`,
    contract_version: CONTRACT_VERSION,
  };
  body.content_hash = contentHash(body);
  return body;
}

async function runLive() {
  const base = process.env.TAPRESUME_TEST_BASE;
  const secret = process.env.TAPRESUME_TEST_SECRET;
  if (!base || !secret) {
    console.error('Set TAPRESUME_TEST_BASE and TAPRESUME_TEST_SECRET (or use --fixtures).');
    process.exit(2);
  }
  const upsertPath = '/api/integrations/tapresume/v1/jobs/upsert';
  const unpublishPath = '/api/integrations/tapresume/v1/jobs/unpublish';
  const destId = `check${Date.now().toString(36)}`;
  const pubId = randomUUID();
  const results = [];
  const record = (n, name, pass, detail) => {
    results.push({ n, name, pass, detail });
    console.log(`case ${String(n).padStart(2)}: ${pass ? 'PASS' : 'FAIL'} - ${name}${detail ? ` (${detail})` : ''}`);
  };

  // Case 1: happy path, version 1
  const v1 = makeUpsert(pubId, 1, 'TapResume Checklist Opening');
  const r1 = await call(base, secret, 'POST', upsertPath, v1, { eventId: `evt_pub_${destId}_1` });
  const ack1 = r1.json;
  record(
    1,
    'happy path upsert',
    r1.status === 200 &&
      ack1?.applied_version === 1 &&
      ack1?.applied_state === 'published' &&
      ack1?.content_hash === v1.content_hash &&
      !!ack1?.aci_job_id &&
      !!ack1?.public_url &&
      (ack1?.page_state === 'ready' || ack1?.page_state === 'pending'),
    `http=${r1.status} page_state=${ack1?.page_state}`,
  );

  // Case 2: duplicate event id must replay the exact bytes
  const r2 = await call(base, secret, 'POST', upsertPath, v1, { eventId: `evt_pub_${destId}_1` });
  record(2, 'duplicate replays same ack bytes', r2.status === 200 && r2.text === r1.text, `byte-equal=${r2.text === r1.text}`);

  // Case 3: version 3 then stale version 2
  const v3 = makeUpsert(pubId, 3, 'TapResume Checklist Opening (v3)');
  const r3a = await call(base, secret, 'POST', upsertPath, v3, { eventId: `evt_pub_${destId}_3` });
  const v2 = makeUpsert(pubId, 2, 'TapResume Checklist Opening (v2 stale)');
  const r3b = await call(base, secret, 'POST', upsertPath, v2, { eventId: `evt_pub_${destId}_2` });
  record(
    3,
    'stale version acknowledged at current, no regression',
    r3a.status === 200 && r3b.status === 200 && r3b.json?.applied_version === 3,
    `stale ack applied_version=${r3b.json?.applied_version}`,
  );

  // Case 4: tampered signature
  const r4 = await call(base, secret, 'POST', upsertPath, makeUpsert(pubId, 4, 'x'), {
    eventId: `evt_pub_${destId}_4`,
    tamperSignature: true,
  });
  record(4, 'tampered signature is 401', r4.status === 401, `http=${r4.status}`);

  // Case 5: stale timestamp
  const r5 = await call(base, secret, 'POST', upsertPath, makeUpsert(pubId, 4, 'x'), {
    eventId: `evt_pub_${destId}_4`,
    timestamp: new Date(Date.now() - 301_000).toISOString(),
  });
  record(5, 'stale timestamp is 401', r5.status === 401, `http=${r5.status}`);

  // Case 6: oversized body
  const big = makeUpsert(pubId, 4, 'x');
  big.public_description = 'A'.repeat(300 * 1024);
  big.content_hash = contentHash(big);
  const r6 = await call(base, secret, 'POST', upsertPath, big, { eventId: `evt_pub_${destId}_4` });
  record(6, 'oversized body rejected', r6.status === 413 || r6.status === 422, `http=${r6.status}`);

  // Case 7: unknown publication unpublish, twice (idempotent)
  const ghost = randomUUID();
  const unpubGhost = {
    tapresume_publication_id: ghost,
    desired_version: 1,
    contract_version: CONTRACT_VERSION,
  };
  unpubGhost.content_hash = contentHash(unpubGhost);
  const r7a = await call(base, secret, 'POST', unpublishPath, unpubGhost, { eventId: `evt_pub_ghost${destId}_1` });
  const r7b = await call(base, secret, 'POST', unpublishPath, unpubGhost, { eventId: `evt_pub_ghost${destId}_1` });
  record(
    7,
    'unknown unpublish 404/200, idempotent',
    (r7a.status === 404 || r7a.status === 200) && r7b.status === r7a.status,
    `http=${r7a.status},${r7b.status}`,
  );

  // Case 8: hash mismatch
  const bad = makeUpsert(pubId, 4, 'x');
  bad.content_hash = '0'.repeat(64);
  const r8 = await call(base, secret, 'POST', upsertPath, bad, { eventId: `evt_pub_${destId}_4` });
  const namesHash = JSON.stringify(r8.json?.field_errors ?? []).includes('content_hash');
  record(8, 'hash mismatch is 422 naming content_hash', r8.status === 422 && namesHash, `http=${r8.status}`);

  // Case 9: wrong contract version
  const r9 = await call(base, secret, 'POST', upsertPath, makeUpsert(pubId, 4, 'x'), {
    eventId: `evt_pub_${destId}_4`,
    contractVersion: '2025-01-01',
  });
  record(9, 'wrong contract version is 401', r9.status === 401, `http=${r9.status}`);

  // Case 10: rotation. First half: current secret works (proven by every
  // case above). Second half needs a retired secret to prove the 401.
  if (process.env.TAPRESUME_TEST_SECRET_RETIRED) {
    const r10 = await call(
      base,
      process.env.TAPRESUME_TEST_SECRET_RETIRED,
      'POST',
      upsertPath,
      makeUpsert(pubId, 4, 'x'),
      { eventId: `evt_pub_${destId}_4` },
    );
    record(10, 'retired secret is 401', r10.status === 401, `http=${r10.status}`);
  } else {
    // No retired secret supplied, so prove the half that needs no extra
    // provisioning: a secret that is not active must be rejected. Every
    // other case above already proves the active secret is accepted.
    const r10 = await call(base, `never_active_${randomUUID()}`, 'POST', upsertPath, makeUpsert(pubId, 4, 'x'), {
      eventId: `evt_pub_${destId}_4`,
    });
    record(10, 'non-active secret rejected (full rotation lifecycle needs TAPRESUME_TEST_SECRET_RETIRED)', r10.status === 401, `http=${r10.status}`);
  }

  // Case 11: manifest walk to exhaustion
  let cursor = '';
  const seen = new Map();
  let pages = 0;
  let manifestOk = true;
  do {
    const path = '/api/integrations/tapresume/v1/jobs/manifest';
    const r = await call(base, secret, 'GET', path + (cursor ? `?cursor=${cursor}` : '?cursor='), null);
    if (r.status !== 200 || !Array.isArray(r.json?.jobs)) {
      manifestOk = false;
      break;
    }
    for (const j of r.json.jobs) {
      seen.set(j.tapresume_publication_id, (seen.get(j.tapresume_publication_id) ?? 0) + 1);
      if (!('applied_version' in j) || !('content_hash' in j) || !('page_state' in j)) manifestOk = false;
    }
    cursor = r.json.next_cursor;
    pages++;
  } while (cursor && pages < 100);
  const dupes = [...seen.values()].filter((c) => c > 1).length;
  record(
    11,
    'manifest walk: each publication exactly once, null cursor at end',
    manifestOk && dupes === 0 && seen.has(pubId),
    `pages=${pages} publications=${seen.size} dupes=${dupes}`,
  );

  // Case 12: single read
  const r12 = await call(base, secret, 'GET', `/api/integrations/tapresume/v1/jobs/${pubId}`, null);
  record(
    12,
    'single publication read',
    r12.status === 200 && r12.json?.applied_version === 3 && !!r12.json?.page_state,
    `http=${r12.status} version=${r12.json?.applied_version}`,
  );

  // Cleanup: unpublish the checklist opening so it leaves the site.
  const unpub = {
    tapresume_publication_id: pubId,
    desired_version: 4,
    contract_version: CONTRACT_VERSION,
  };
  unpub.content_hash = contentHash(unpub);
  const rClean = await call(base, secret, 'POST', unpublishPath, unpub, { eventId: `evt_pub_${destId}_4u` });
  console.log(`cleanup: unpublish http=${rClean.status}`);

  console.log(
    '\ncase 13 (PII/log audit) runs on the server: journalctl -u <service> | grep -iE "secret|resume|applicant" over the suite window; expect nothing.',
  );

  const failed = results.filter((r) => !r.pass);
  console.log(`\n${results.length - failed.length}/${results.length} cases passed`);
  process.exit(failed.length === 0 ? 0 : 1);
}

if (process.argv.includes('--fixtures')) runFixtures();
else await runLive();

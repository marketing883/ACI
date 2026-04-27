# Atheros — Ops Runbook

Operational how-to for the Atheros AI co-pilot. Every procedure here is a known-good path for a specific symptom. When in doubt, flip the kill switch first, diagnose second.

## Kill switch (do this first)

If anything looks catastrophic — runaway cost, leaked client name, broken UX for many users — set the server env var:

```
COPILOT_KILL=true
```

and redeploy (or hot-reload). Every v2 route short-circuits with the `allModelsDown` fallback copy. The legacy `/api/chat` path remains live. `/api/copilot/health` reports `flags.killSwitch: true` so you can verify the drill worked.

## Quick state check

```
GET /api/copilot/health
```

```json
{
  "flags": { "v2Enabled": true, "v2Percent": 100, "killSwitch": false },
  "providers": { "supabase": "ok", "anthropic": "ok", "openai": "ok" },
  "pgvector": "ok", "contentChunks": 600, "lastIndexedAt": "...",
  "lastErrorAt": "..."
}
```

Anything missing here maps to a specific playbook below.

## Playbooks by symptom

### 1. Visitors report "Something went wrong" in every chat turn

1. `GET /api/copilot/health` → is `providers.anthropic.status === "ok"`?
2. If no, check `ANTHROPIC_API_KEY` env var. Rotate if needed.
3. If yes, the fallback chain is also failing. Check `providers.openai.status`.
4. If both are ok but turns still fail, read the top of `/admin/copilot/errors` (last 24h). Filter `stage=generate, severity=error`. Fingerprint clusters tell you if it's one provider or systemic.
5. If it's a single noisy fingerprint, click "Silence 24h" and file a ticket against the provider. The model chain will keep serving the next-available model.

### 2. Cost per session is climbing

1. Open `/admin/copilot/analytics` → Cost per session card.
2. Reference value: **$0.002–$0.004 per turn**, **~$0.02 per session** at 5–6 turns.
3. If avg turns / session > 8, a conversation loop is stuck. Look at `/admin/copilot/live` → any session with > 20 messages is suspect.
4. Lower `COPILOT_MAX_OUTPUT_TOKENS` temporarily (default 400) to cap. Investigate the system prompt for over-verbose tiers.

### 3. Rate-limit spikes

1. `/admin/copilot/errors` → `stage=ratelimit`. Counts per fingerprint tell you whether it is per-visitor or per-IP.
2. Current limits (src/lib/copilot/ratelimit.ts): 30/5min + 200/day per visitor, 60/5min per IP.
3. If a single IP is hammering, consider a Vercel firewall rule upstream. The in-app limits protect cost; firewall is for volume.

### 4. Retrieval is returning nothing (generic answers)

1. `GET /api/copilot/health` → `contentChunks > 0`? If 0, the indexer has not run. Run:
   ```bash
   cd aci-infotech
   set -a && source .env.local && set +a
   npx tsx scripts/index-content.ts --full
   ```
2. If `contentChunks > 0` but answers are still generic, open `/admin/copilot/analytics` → Content Gap feed. Queries there are the ones where top-1 similarity was under 0.35. Point them at the content team.
3. If pgvector itself is wedged: `pgvector: "missing"` in health. Re-run the `20260412_pgvector_content_chunks.sql` migration.

### 5. Supabase Realtime not delivering on `/admin/copilot/live`

1. Supabase dashboard → Database → Replication. Confirm `chat_sessions`, `chat_messages`, `chat_errors` are enabled for Realtime.
2. Browser DevTools → Network tab → filter `realtime` → look for the WebSocket. If it's failing to connect, check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` on the admin page.
3. Refresh the admin page. Realtime is advisory; filters + the manual Refresh button always pull a fresh list.

### 6. Handoff not appearing in `/admin/copilot/handoffs`

1. `select session_id, handoff_at, handoff_reason from chat_sessions where handoff_at is not null order by handoff_at desc limit 5;`
2. If rows exist but the admin page is empty: Realtime subscription; hit Refresh.
3. If no rows: Atheros did not fire `handoff_to_human`. Provoke it in a dev session (ask for legal / security / explicit human escalation); confirm `/admin/copilot/errors` shows no tool-call validation failures.

### 7. Admin takeover is live but visitor is not seeing the message

1. Visitor's `ChatColumn` subscribes to `chat_messages` inserts via Supabase Realtime. Same diagnosis as (5).
2. Fallback: admin messages still persist; a refresh on the visitor side (or their next turn) will pull them via the normal `initialMessages` load from localStorage-plus-DB.

### 8. A client name leaked on the site

1. **Immediate**: `COPILOT_KILL=true` and redeploy. That stops the chat; it does not fix a page-level leak.
2. Run `npx tsx scripts/check-no-client-leak.ts` locally — should return 0 violations. If not, fix the render path with `displayClient` and push.
3. Scrub the literal name from the source/DB. For blog / case study / whitepaper rows in Supabase: `update blog_posts set content = replace(content, 'BadName', 'Fortune 500 <Industry> Client') where content ilike '%BadName%';` Repeat for `excerpt`, `title`, `tags`.
4. Run `npx tsx scripts/index-content.ts --full --source=blog,case_study,whitepaper` to re-embed the scrubbed content.
5. Confirm: `select count(*) from content_chunks where text ilike '%BadName%';` returns 0.

### 9. Codespaces CORS / manifest errors

Harmless. GitHub's private-port tunnel redirects `/manifest.webmanifest` through `github.dev/pf-signin?...` for auth; browsers block the cross-origin fetch. `next.config.ts` already allows `manifest-src 'self' https://github.dev`. On a production domain, the manifest is served from self and the error disappears.

## Kill-switch drill

Do this once per quarter.

1. `COPILOT_KILL=true` → redeploy staging.
2. `/api/copilot/health` reports `flags.killSwitch: true`.
3. Open chat → legacy UI renders; no v2 shell, no mobile pill.
4. Flip back to `COPILOT_KILL=false`, redeploy. v2 UI returns within 30 seconds across regions.

## Cost + SLO targets

Tracked on `/admin/copilot/analytics`. Alert below in an admin notification when any of these breach for 24h consecutive:

| Metric | Target |
|---|---|
| Cost per session p95 | < $0.04 |
| First-token latency p95 | < 1500 ms |
| Error rate / session | < 0.5% |
| Handoff latency (emit → admin notified) | < 1 s p99 |
| Narration accuracy (Part-5 golden set) | ≥ 95% weekly |

## Rollout ramp (phased)

| Phase | Traffic | Duration | Exit |
|---|---|---|---|
| 0 | Internal (admin IP allowlist) | 2 days | Zero severity ≥ error events; golden set green |
| 1 | 5% bucket, desktop only | 3 days | p95 first-token < 1.5s; error rate < 0.5% |
| 2 | 25% bucket, desktop + mobile | 3 days | Qualified-lead rate ≥ v1 baseline |
| 3 | 50% bucket | 3 days | Content-gap feed reviewed; narration accuracy ≥ 95% |
| 4 | 100% | 1 week burn-in | No regression on chat_leads; admin takeover exercised 3× |
| 5 | v1 removal | — | Delete /api/chat/route.ts; remove processResponse / PAGE_CONTEXT_MAP / QUICK_REPLIES |

Flip per-phase by editing `NEXT_PUBLIC_COPILOT_V2_PERCENT` in the hosting env and redeploying. No code change between phases.

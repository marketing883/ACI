ACI Co-Pilot — Part 1: Foundation
Decisions locked: name = Atheros. Part-2 grounding = hybrid (structured lookup for LPs/services/industries/platforms + Supabase pgvector for case studies, blogs, whitepapers, playbooks).

Goal
Land everything non-chat that the rebuild depends on, without touching the live chat UX. Ship a named product, a kill-switch, loud error surfaces, and the client-name sanitization hook, so the new brain (Part 3) can roll out behind a flag with zero risk.

Guiding constraints (enforced from Part 1 forward)
No pricing anywhere.
No generic "talk to an architect" — CTOs are context-specific.
Contact page supports the form, doesn't replace it.
No client names rendered — read client_descriptor first.
Fail loud — every error writes to chat_errors + analytics; dev toast in non-prod.
Cost-efficient models (Haiku 4.5 / GPT-4o-mini) in hot path; Sonnet only for post-capture intelligence.
Zero LCP regression — lazy-load anything new on public routes.
Small, verified tasks — build + dep + security + UX check at every part boundary.
1.1 Brand constants — Atheros
src/lib/copilot/brand.ts exports COPILOT_NAME = "Atheros", COPILOT_TAGLINE, COPILOT_AVATAR (SVG mark), and VOICE_RULES extracted from All Important/02_BRAND_NARRATIVE.md + the existing ACI_CONTEXT prompt in src/app/api/chat/route.ts (brevity tiers, no exclamations, no em-dashes, "Got it / Makes sense" affordances, no pricing, no "talk to architect" generic CTA).
Every UI label, pill copy, message header, and system prompt reads from this file — future rename is one line.
Namespace convention: src/lib/copilot/*, src/components/copilot/*, /api/copilot/*, env vars NEXT_PUBLIC_COPILOT_*, tables chat_* (generic DB names survive a rename).
1.2 Feature flag & kill switch
src/lib/copilot/flags.ts:

COPILOT_V2_ENABLED — reads process.env.NEXT_PUBLIC_COPILOT_V2, default false. When off, /api/chat and the widget behave exactly like today.
COPILOT_V2_PERCENT — 0–100, gradual rollout keyed off a stable hash of visitor_id.
COPILOT_KILL_SWITCH — server env COPILOT_KILL; when true, all v2 routes short-circuit to a safe fallback and emit kill_switch_active events.
Lets Part 3 ship dark.

1.3 Observability — fail loud, never silent
Migration supabase/migrations/<ts>_copilot_observability.sql:

chat_sessions — session_id, visitor_id, started_at, ended_at, page_entry, flag_bucket, client_version.
chat_messages — message_id, session_id, role, content, tool_name, tool_args JSONB, tool_result JSONB, model, input_tokens, output_tokens, latency_ms, cost_usd, created_at.
chat_errors — id, session_id, stage (retrieve|generate|tool|stream|render), message, stack, context JSONB, severity, created_at.
RLS: admin-only read; service-role write.

src/lib/copilot/logger.ts — single log.error/warn/info(stage, err, ctx) that (a) writes to chat_errors best-effort, never throwing; (b) emits a copilot_error analytics event via existing /api/analytics/events; (c) console.error with stack in non-prod; (d) pushes to window.__copilotErrors for a dev-only toast (src/components/copilot/dev/ErrorToast.tsx, rendered only when NEXT_PUBLIC_COPILOT_DEV_ERRORS === '1').

src/lib/copilot/cost.ts — per-message cost estimator (Haiku $0.80/$4 per M, GPT-4o-mini $0.15/$0.60 per M, embeddings $0.02/M). Writes onto chat_messages.cost_usd so admin sees $/session later.

Custom ESLint rule in eslint.config.mjs banning bare catch (_) {} inside src/**/copilot/** and src/app/api/chat/** — every catch must call log.* before returning.

1.4 Client-name sanitization hook
Two coordinated moves so nothing silently leaks a real client name:

(a) Migration supabase/migrations/<ts>_case_study_descriptor.sql adds case_studies.client_descriptor text, seeds existing rows:

update case_studies
set client_descriptor = coalesce(client_descriptor,
  'Fortune 500 ' || coalesce(industry, 'Enterprise') || ' Client')
where client_descriptor is null;

Legacy client column stays — content team rewrites separately — but the app stops reading it.

(b) src/lib/content/anonymize.ts — displayClient(row) => row.client_descriptor || 'Enterprise Client'. Deliberately does not fall back to row.client. Used by every case-study render, the Part 2 indexer, and the admin dashboard.

(c) Codemod pass replacing {cs.client} with {displayClient(cs)} in src/app/case-studies/**, src/app/blogs/**, and src/components/sections/CaseStudies*. Enforced by scripts/check-no-client-leak.ts — AST scan that fails CI on any remaining bare .client render path.

1.5 Dev health endpoint
GET /api/copilot/health (dev or admin-only):

{ "flag": true, "percent": 25, "killSwitch": false,
  "supabase": "ok", "anthropic": "ok", "openai": "ok",
  "pgvector": "pending-part-2", "lastErrorAt": "..." }

End-of-part smoke test for every subsequent part.

Files touched
New

src/lib/copilot/brand.ts, flags.ts, logger.ts, cost.ts
src/lib/content/anonymize.ts
src/components/copilot/dev/ErrorToast.tsx (dev-only, tree-shakable)
src/app/api/copilot/health/route.ts
supabase/migrations/<ts>_copilot_observability.sql
supabase/migrations/<ts>_case_study_descriptor.sql
scripts/check-no-client-leak.ts
Modified

eslint.config.mjs (custom no-silent-catch rule)
src/app/case-studies/page.tsx, src/app/blogs/page.tsx, src/components/sections/CaseStudies* (swap .client → displayClient(...))
Deliberately untouched

src/components/chat/ChatWidget.tsx, src/app/api/chat/route.ts, src/app/api/chat/lead/route.ts, src/lib/intelligence.ts. Live UX is byte-for-byte identical at end of Part 1.
Reuse, no new deps
@supabase/ssr server client, existing /api/analytics/events sink, zod for env parsing. Zero new runtime dependencies.
Part 1 exit gate (all 8 must pass before Part 2)
npm run build + npm run lint green (including no-silent-catch rule).
npx tsx scripts/check-no-client-leak.ts returns 0.
Both migrations applied on staging; RLS verified.
GET /api/copilot/health returns ok for every provider.
Forced-throw test: confirms chat_errors row + analytics event, no request failure.
Manual regression: existing chat flow byte-for-byte identical to main (flag off).
Lighthouse on /: no LCP/TBT regression vs. main.
npm audit --production clean; zero new runtime deps.


Part 2 — Content Index (Hybrid Retrieval)
Goal: turn every ACI content surface into a single, queryable, citation-ready index — without changing the live chat or any page's visual output. This is the knowledge substrate the new brain (Part 3) will stand on.

2.1 Canonical chunk shape
One schema for every content type so retrieval is uniform:

ContentChunk {
  id, source_type: 'lp'|'service'|'industry'|'platform'|'case_study'|'blog'|'whitepaper'|'playbook',
  source_slug, title, section_path (e.g. "process.step-2"),
  text, metadata JSONB { cluster, industry, role, tech[], outcomes[] },
  embedding vector(1536), token_count, checksum, indexed_at
}

2.2 Migrate service/industry/platform JSX → data files
26 hand-written pages (8 services, 8 industries, 10 platforms) become data-driven so they can be indexed and reused by the chat panel in Part 4.

New: src/data/services.ts, src/data/industries.ts, src/data/platforms.ts — one entry per page, same shape as src/lib/lp-content.ts.
One-off helper scripts/extract-jsx-to-data.ts parses each page.tsx AST, pulls the top-level const objects into JSON; we manually clean & name.
Each page file becomes a thin wrapper reading from the data file; JSX output is byte-identical (snapshot-tested).
Net effect: every service/industry/platform is imported the same way as LPs, from a single source of truth.
2.3 pgvector + content_chunks
Migration supabase/migrations/<ts>_pgvector_content_chunks.sql:

create extension if not exists vector;

create table content_chunks (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  source_slug text not null,
  title text not null,
  section_path text,
  text text not null,
  metadata jsonb not null default '{}',
  embedding vector(1536),
  token_count int,
  checksum text not null,
  indexed_at timestamptz default now(),
  stale_at timestamptz,
  unique(source_type, source_slug, section_path)
);

create index on content_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 50);
create index on content_chunks (source_type, source_slug);
create index on content_chunks using gin (metadata);

RLS: service-role only; anon read blocked (queries always go through /api/chat which uses service role).

2.4 Indexer — scripts/index-content.ts
Pipeline:

Load LPs from src/lib/lp-content.ts, services/industries/platforms from the new data files, case studies / blogs / whitepapers / playbooks from Supabase (using displayClient from Part 1).
Chunk by logical section (hero, pain points, process.step-N, outcomes, faq.q-N, case study block). Target 400–600 tokens/chunk, hard cap 1200.
Sanitize — every chunk runs through displayClient + a regex scan for a denylist of known real client names (sourced from the legacy client column). Any hit → log.error('indexer.client_leak', ...) and the indexer fails loudly (exits non-zero). No silent rewrites.
Embed via OpenAI text-embedding-3-small (1536 dims, $0.02/M tokens) in batches of 100. Failures per-batch are logged; partial progress is committed.
Checksum skip — sha256(text) stored per chunk; unchanged chunks are skipped on re-run. Full rebuild is idempotent and cheap.
Write to content_chunks, report counts per source type + total cost + failures.
2.5 Hybrid retrieval — src/lib/copilot/retrieval.ts
Three entry points:

structuredLookup(ctx) — in-memory map from page path / service cluster / industry tag / LP slug to the canonical chunks for that entity. Zero latency. Pinned when the user is clearly on-topic for a known entity.
semanticSearch(query, topK=5, filters?) — embeds query, runs pgvector cosine-similarity, filters by source_type, cluster, industry, role.
hybridRetrieve(query, pageContext) — merges both paths, dedupes by chunk id, re-ranks (structured chunks boosted when page context is strong, semantic chunks otherwise), returns top 6–8 with citations.
formatForPrompt(chunks) emits a structured context block the model can cite as [case:hospitality-data-unification] — Part 3 renders these as clickable links.

2.6 Freshness & invalidation
Supabase row trigger on case_studies, blog_posts, whitepapers, playbooks updates sets content_chunks.stale_at for matching rows.
POST /api/copilot/reindex (admin-gated) kicks an incremental re-index (stale or missing only).
Nightly cron (Vercel or GitHub Actions) runs the full indexer — checksum skip makes this near-free.
2.7 Failing loud
Indexer uses Part-1 log.error for every embedding failure, sanitization hit, oversize chunk.
Retrieval lib falls back to structured-only when pgvector errors, logs the downgrade, and surfaces it on /api/copilot/health.
/api/copilot/health extended to { pgvector: "ok", contentChunks: N, lastIndexedAt: ... }.
2.8 Files
New

src/data/services.ts, src/data/industries.ts, src/data/platforms.ts
src/lib/copilot/retrieval.ts, src/lib/copilot/embeddings.ts
src/app/api/copilot/reindex/route.ts (admin-gated)
scripts/extract-jsx-to-data.ts (one-off)
scripts/index-content.ts
supabase/migrations/<ts>_pgvector_content_chunks.sql
supabase/migrations/<ts>_content_chunks_triggers.sql
Modified

Every src/app/services/*/page.tsx, src/app/industries/*/page.tsx, src/app/platforms/*/page.tsx — switch to reading from the data files (JSX output unchanged; snapshot-tested).
Untouched

Chat code. Part 2 ships zero user-visible change.
2.9 Cost envelope (napkin math)
~2,200 chunks × 500 tokens ≈ 1.1M tokens × $0.02/M = **$0.02–0.04 per full rebuild**. Runtime queries: ~500 tokens/query, a few hundred/day = <$0.01/day. Negligible.

2.10 Part 2 exit gate (all 8 must pass before Part 3)
npm run build green post-data-file migration; visual-snapshot diff on every service/industry/platform page = 0 changes.
pgvector extension visible in Supabase; content_chunks table created with all indexes.
npx tsx scripts/index-content.ts runs clean end-to-end; reports counts + cost; zero sanitization errors.
Unit tests for retrieval.ts cover: structured-only, semantic-only, hybrid, filter, pgvector-error fallback.
Manual sanity: semanticSearch("Databricks migration Unity Catalog") → canonical LP chunk in top 3. semanticSearch("we lost data during a cutover") → returns a playbook / case study.
Sanitization verification: select count(*) from content_chunks where text ~* '(MSCI|RaceTrac|Sodexo|<each legacy client>)' returns 0.
/api/copilot/health reports pgvector: ok, contentChunks > 0, lastIndexedAt recent.
Live chat unchanged (flag off).



Part 3 — The New Brain (Atheros v2, flag-gated)
Goal: replace the scripted processResponse() state machine and the 150-token LLM branch with a single edge-streaming endpoint that (a) retrieves grounded context (Part 2), (b) reasons in ACI voice, (c) emits structured tool calls that drive UI signals + lead capture + handoff, and (d) streams tokens to the client. Wired to the existing widget behind the Part-1 flag so we can compare v1 and v2 side-by-side before touching the UI.

3.1 Runtime & model strategy
POST /api/chat/v2 — Next.js Edge Runtime, streaming (SSE via ReadableStream).
Primary: Claude Haiku 4.5 (claude-haiku-4-5-20251001) — fast, cheap, tool-use, streaming.
Fallback 1: GPT-4o-mini — tool use + streaming, comparable cost.
Fallback 2: Claude Haiku 3.5 (already in deps) — belt-and-braces if 4.5 has an outage.
No Sonnet / Opus / GPT-4o in the chat hot path. Intelligence post-capture (Part 4 / existing src/lib/intelligence.ts) keeps using Sonnet — users never wait on it.
max_tokens per turn: 400 (up from 150). Generation stops naturally when the model is done.
Cost per turn estimate: ~$0.002–0.004. Monthly budget at 10k turns: ~$30–40. Alerted via chat_messages.cost_usd rollup.
3.2 System prompt builder — src/lib/copilot/prompt.ts
Composed at request time from four layers:

Identity — pulled from brand.ts (Atheros; ACI voice rules; no pricing; no generic "talk to architect"; no exclamation / em-dash; brevity tiers by turn count).
Page context — current pathname, query params, service cluster, industry / role from LP params, entry page, pages visited.
Retrieved knowledge — top 6–8 chunks from hybridRetrieve() with [source:slug] tags so citations round-trip.
Conversation state — captured lead fields so the model doesn't re-ask. Nothing pretends to be a form.
Prompt is read-only data; any change is a code change (no admin-editable prompts in Part 3 — that arrives in Part 6).

3.3 Tool schema — src/lib/copilot/tools.ts
The model only "does things" via tools. Every tool is Zod-validated server-side before it runs:

qualify_lead(fields) — partial lead object (name, email, company, jobTitle, industry, team, timeline, serviceInterest). Server merges into chat_leads (upsert on session_id), triggers the existing generateIntelligence background job once email lands.
show_content_panel(panel) — { panelType: 'service'|'case'|'playbook'|'diagram'|'comparison'|'timeline'|'stats', entityRef: string, rationale: string }. Part 4 renders this; Part 3 just records it in chat_messages.tool_calls and echoes it in the stream so the client can react now.
offer_action_buttons(buttons[]) — [{ label, intent: 'explore'|'request'|'schedule'|'download', value }]. Renders as chips under the latest message. Replaces the hardcoded QuickReplies map.
request_field(field) — { fieldName, placeholder, inputType }. Renders an inline input in the chat column — natural fact-finding, never a pop-up form.
cite_source(citation) — { sourceType, slug, title }. Rendered as inline clickable pills that deep-link to the content.
schedule_meeting(intent) — { proposedWindows: string[] }. Server writes a chat_leads.meeting_request row and sends the admin email via existing lib/email.ts. Never claims a meeting is booked.
handoff_to_human(payload) — { reason, summary, stickyContext }. Server writes chat_sessions.handoff_at, sends a Supabase Realtime event to admin:handoffs, and pre-packs the intelligence report. Admin live view (Part 6) picks this up.
Tool-call failures use Part-1 log.error with stage tool; the model is told in the system prompt to apologize concretely ("I can't pull up that case study right now — can I send it over email?") rather than pretend success.

3.4 Implicit lead qualification, no scripted stages
Removal of processResponse() and the stage machine. The model qualifies through natural conversation, calling qualify_lead opportunistically when it catches a field. Guardrails in the system prompt: never ask for more than one field at a time; never ask for email before offering value; never ask for phone unless the user raises scheduling. The client UI renders request_field as a gentle inline input. If the user changes topic, qualification pauses — it's a conversation, not an interrogation.

3.5 Citations that ship the user somewhere
Every [source:case-slug] the model emits is post-processed by the client renderer into a pill that links to /case-studies/<slug> (or the relevant page). Every show_content_panel includes an entityRef that Part 4's right-panel registry can resolve. Part 3's job is just to emit consistent, slug-accurate references — enforced by validating entityRef against the content index before streaming it.

3.6 Wiring to the existing widget (dark launch)
No new UI yet. The existing ChatWidget.tsx gets a minimal shim:

When COPILOT_V2_ENABLED && visitor in bucket, it calls /api/chat/v2, consumes the SSE stream, renders text tokens as they arrive, and silently discards show_content_panel / offer_action_buttons / request_field tool calls (they're logged but not rendered). This lets us validate brain quality before we build the new UI.
Tool calls that mutate state — qualify_lead, schedule_meeting, handoff_to_human, cite_source — run normally.
When the flag is off, widget behavior is byte-for-byte identical to today.
3.7 Rate limiting & abuse
Per-visitor-ID rate limit: 30 msgs / 5 min, 200 msgs / day. Uses existing @upstash/ratelimit + Redis (already installed, currently unused for chat).
Per-IP: 60 msgs / 5 min (defense against shared-ID abuse).
Exceeded → polite cap message streamed back + log.warn('ratelimit.chat', ...).
Bot detection on the first message of a session via existing src/lib/bot-detection.ts.
3.8 Fail-loud semantics
Every stage has explicit error handling through Part-1 log.error with stage tag:

retrieve — pgvector down → structured-only fallback + warn.
generate — primary model error → fallback model + warn; all fall back → polite error streamed + error row.
tool — validation fail or execution fail → tool returns {ok:false, reason}, model is told, conversation continues.
stream — client disconnect → partial message persisted with stream_incomplete: true.
No bare catches. ESLint rule from Part 1 enforces this.
3.9 Full turn record in chat_messages
Every streamed turn, when complete, writes a row: role, content, tool_name, tool_args, tool_result, model used, input/output tokens, latency_ms, cost_usd. This is the raw material for the admin live view in Part 6 and for future prompt regression testing.

3.10 Files
New

src/app/api/chat/v2/route.ts (edge runtime, streaming)
src/lib/copilot/prompt.ts
src/lib/copilot/tools.ts
src/lib/copilot/models.ts (Haiku 4.5 / GPT-4o-mini / Haiku 3.5 fallback chain)
src/lib/copilot/stream.ts (SSE helpers, tool-call multiplexing)
src/lib/copilot/session.ts (load/save chat_sessions, chat_messages)
src/lib/copilot/ratelimit.ts (Upstash wrapper)
Modified

src/components/chat/ChatWidget.tsx — flag-gated branch that calls /api/chat/v2, consumes SSE, ignores UI-only tool calls (they wire up in Part 4).
Untouched

Existing /api/chat/route.ts stays so flag-off behavior is identical. It'll be deleted in Part 7 after v2 is at 100%.
/api/chat/lead/route.ts stays; qualify_lead upserts into the same chat_leads table via the same columns.
3.11 Part 3 exit gate (all 9 must pass before Part 4)
Build + lint green; no silent catches in new code.
Unit tests for prompt builder (identity layer stable across turns, retrieved chunks formatted correctly, conversation state round-trips).
Unit tests for each tool's Zod schema — malformed payloads are rejected without crashing the turn.
Golden-set evals: 20 hand-authored prompts covering Databricks migration / CDP / data mesh / MLOps / industry-specific asks. Assert the model (a) emits the right cite_source slugs, (b) calls show_content_panel with a valid entityRef, (c) doesn't mention pricing, (d) doesn't say "talk to an architect", (e) ACI voice regex checks pass (no "!", no em-dashes, no "I'd love to"). Run via npx tsx scripts/eval-copilot.ts.
Streaming latency: first token < 1200ms p95 on edge, full response < 5s p95 at 400 tokens.
Flag off → byte-for-byte identical to main. Flag on at 100% → real Haiku replies with citations rendered, no right panel (as designed for Part 3).
Rate limits verified — scripted 31st message within 5min returns a cap response.
Deliberate API-key-revoked test — primary fails, secondary serves the turn, chat_errors has the warn row, user gets a complete response anyway.
/api/copilot/health shows both models ok + last-turn latency.



Noted — adding thought streaming to Part 3. Your other reinforcements (60% right-panel with diagrams/images, pre-defined buttons + fields, cost-efficient model, no silent failures, dashboard connection, no client names, no load-speed regression, subtle name "Atheros") are already locked in across Parts 1–3 and expand in Parts 4–7. Confirming and rolling on.

Part 3 — Addendum: Thought Streaming
Atheros surfaces what it's doing in real time, not just its final words. This is what makes it feel alive and Big-Four-caliber, not like a loading spinner.

SSE event types (multiplexed in the same stream the Part 3.1 endpoint already opens):
status — honest server-side pipeline narration. Short lines like "Looking up ACI playbooks on Databricks migrations..." → "Found 4 relevant patterns." Emitted at retrieve-start, retrieve-end, tool-call-start, tool-call-end. Never fabricated — each maps to a real pipeline stage.
thought — a short one-liner plan the model is asked to emit before the main response (system prompt adds: "Before answering, output one dimmed line starting with '~' stating your approach in < 10 words."). Streamed as faux-thinking that's still grounded in the model's own intent.
token — the normal reply tokens.
tool_call_start / tool_call_end — JSON payloads the client uses to animate panel transitions (hand-off to Part 4).
done — final event with usage + cost.
Client renderer: dimmed italic line above the reply bubble while status/thought stream in; fades to 40% opacity once token starts flowing, collapses to a tiny "▾ thought" disclosure after done. Framer Motion layoutId makes the morph silky.
Fail-loud rule: if no status or thought fires for > 800 ms after turn start, the client shows a neutral "Warming up…" — not a fake thought — and log.warn('stream.slow_first_event', ...) fires.
No cost premium: the thought line adds ~10–15 output tokens per turn (≈ $0.00003). Status lines are server-templated and cost zero.
Turn record now also stores thoughts[] and status_events[] on chat_messages so the admin replay (Part 6) reproduces the exact UX the user saw.

Part 4 — Desktop Split-Consultation (the "flex with substance")
Goal: When Atheros is open on desktop, the experience is a two-column consultation canvas — chat on the left (40%), a living content panel on the right (60%) that morphs in sync with the conversation. This is where we show depth: real diagrams, industry-specific proof, playbook timelines, comparison matrices, decorative images — all loaded on demand, all driven by show_content_panel tool calls from Part 3.

4.1 Layout & shell — src/components/copilot/ConsultationShell.tsx
Opens as a right-edge overlay on desktop (≥1024 px): 60% of viewport width max 1100 px, full viewport height, backdrop-filter: blur(24px) saturate(140%) on a 92% opaque shell for the liquid-glass feel. Left 40% of the overlay is the chat column; right 60% is the content canvas.
Rest of the site dims behind a soft scrim; body scroll-locked. Esc / click-outside / explicit X closes.
Opens with a spring animation from the pill (shared layoutId) — feels like the pill unfolded.
Below 1024 px, the shell never mounts — mobile takes over (Part 5).
4.2 Panel registry — src/components/copilot/panels/
Each panel is a small, typed, lazy-loaded React component resolved at runtime from the tool-call panelType:

panelType	Component	What it shows
service	ServicePanel	Title + capabilities + tech stack chips + 3 outcomes + 1 linked case. Data: src/data/services.ts.
industry	IndustryPanel	Industry overview, common patterns, a signature case, regulatory notes.
platform	PlatformPanel	Platform logo, ACI capabilities on it, integration diagram, case links.
case	CasePanel	Anonymized client descriptor, challenge, approach, measurable outcomes, tech. Uses displayClient.
playbook	PlaybookPanel	"N systems → 1" headline, challenge pattern, outcome metrics, deployment count.
diagram	DiagramPanel	One of ~15 canonical SVG diagrams (see 4.3).
comparison	ComparisonPanel	2–3 column comparison table (e.g., Databricks vs Snowflake patterns).
timeline	TimelinePanel	Migration/engagement phases with durations.
stats	StatsPanel	3–4 big-number proofs with source annotations.
resource	ResourcePanel	Whitepaper/playbook download card with inline qualification.
Registry is a typed Record<PanelType, LazyExoticComponent> in src/components/copilot/panels/registry.ts. Unknown panelType → graceful empty state + log.warn.

4.3 Canonical diagram library — src/components/copilot/diagrams/
15 hand-crafted inline SVG components (not images — SVG for crisp scaling + motion):

Lakehouse architecture (bronze/silver/gold)
Data mesh domains (federated topology)
Unity Catalog governance plane
CDP ingest → resolution → activation flow
MLOps lifecycle (train → register → deploy → monitor)
Agentic AI loop (plan → act → observe → reflect)
Zero-trust network edges
Cloud migration waves (discover → prioritize → lift → refactor → optimize)
API integration topology (MuleSoft-style)
Real-time retail pipeline (edge → stream → store → activate)
Healthcare data platform (HL7/FHIR ingest → unified schema)
ERP consolidation (N → 1)
Predictive ops loop (signals → forecast → intervene)
Observability pipeline (logs/metrics/traces → SLOs)
ACI engagement model (discovery → blueprint → build → operate)
Each diagram is animated on mount with Framer Motion staggered path-draw (400–700 ms total). Each uses the brand palette (primary/lime from design-system.css) and accepts an optional highlight prop so the conversation can visually point at a node ("the governance plane is where Unity Catalog sits" → that node pulses).

4.4 Decorative imagery
Each panel optionally includes a hero banner image (high-quality, licensed or generated) behind a brand-tinted gradient. Stored under /public/copilot/panels/ with sharp next/image responsive sources.
Panels define image intent (abstract data viz, industry texture, etc.) via a heroKey that maps to a curated image set; never a random stock feel.
Lazy-priority: images are loading="lazy" with low fetch priority; the panel renders content-first and lets the image fill in.
4.5 Real-time transitions
The canvas is always mounted; its body is a single AnimatePresence mode="wait" with layoutId="panel-body".
When Atheros streams a new show_content_panel tool call, the client:
Validates entityRef against the loaded content index shim (src/lib/copilot/entityIndex.client.ts — ~30kb gzipped, contains only slugs + titles + panelType hints; no bodies).
startTransition(() => setActivePanel(...)) — React 19 concurrent.
Lazy-imports the panel bundle.
Animates out (translate-y + fade, 200 ms), animates in (translate-y from 12 px + fade, 280 ms, spring).
The canvas has a subtle breadcrumb of prior panels at the top (pill chips, clickable) so the user can ping-pong without losing context.
Scroll is per-panel (inner scroll container); header/footer sticky so panel title + CTO never leaves view.
Never more than one primary CTO on the canvas at a time. CTO copy is pulled from the corresponding LP entry in lp-content.ts (ctoText field) so it's always contextual — never "talk to an architect".
4.6 Action buttons & inline fields (in the chat column)
offer_action_buttons tool call renders as a row of chips immediately under the bubble that triggered it. Chip intents map to styles: explore (ghost), request (primary), schedule (primary-filled), download (lime accent).
Clicking a chip sends a structured user turn back (not plain text) so the model knows the exact intent — prevents misinterpretation.
request_field renders an inline input with autocomplete (email / phone / company via browser autocomplete attributes), an inline submit affordance, and soft validation. On submit, sends qualify_lead tool result back.
Both components use the existing design-system tokens (--aci-primary, --aci-lime, Funnel Sans).
4.7 Contact page special-case
On /contact, the pill text reads "Ask Atheros anything while you're filling the form" (from the locked Guiding Constraint #3). Opening Atheros here mounts the shell at 45% width, leaves the form fully visible on the left 55% of the page — form is never hidden, never discouraged. This is enforced in ConsultationShell via a routeProfile map.

4.8 Performance budget (non-negotiable)
Consultation shell bundle (excluding panels + diagrams): ≤ 40 KB gzipped.
Each panel / diagram: lazy-loaded on first request, ≤ 12 KB gzipped individually. Diagrams use inline SVG, no icon libraries, no heavy animation deps beyond Framer Motion (already installed).
Shell is dynamically imported in ChatWidget.tsx with ssr: false and only when the user actually opens chat. Nothing on first-paint of any public page.
Panel images: sizes attribute tuned; preconnect to the image domain only after shell opens.
CI bundle-size check: scripts/check-copilot-budget.ts fails the build on regression.
4.9 Accessibility
Shell is a role="dialog" aria-modal="true" with managed focus trap.
Every tool-driven panel change announces via aria-live="polite" — screen-reader users hear "Now showing: Databricks migration playbook".
All diagrams have text-equivalent descriptions embedded in <title> / <desc>.
Buttons and inputs fully keyboard-navigable; visible focus rings use --aci-lime.
4.10 Fail-loud semantics (panel layer)
Invalid panelType → empty state "I couldn't pull that up right now" + log.error('panel.unknown_type', ...).
Invalid entityRef → same. Server-side validation in Part 3 should have caught it; this is defense in depth.
Image load failure → fallback gradient placeholder; log.warn('panel.image_failed', ...).
Bundle load failure → retry once, then show retry button; never a blank panel.
4.11 Files
New

src/components/copilot/ConsultationShell.tsx
src/components/copilot/ChatColumn.tsx (thought-stream renderer, action chips, inline fields)
src/components/copilot/ContentCanvas.tsx
src/components/copilot/panels/registry.ts
src/components/copilot/panels/{Service,Industry,Platform,Case,Playbook,Diagram,Comparison,Timeline,Stats,Resource}Panel.tsx
src/components/copilot/diagrams/{Lakehouse,DataMesh,UnityCatalog,CdpFlow,MlopsLifecycle,AgenticLoop,ZeroTrust,MigrationWaves,ApiTopology,RetailRealtime,HealthcareData,ErpConsolidation,PredictiveOps,Observability,EngagementModel}.tsx
src/lib/copilot/entityIndex.client.ts (generated at build time from content index)
scripts/build-entity-index.ts
scripts/check-copilot-budget.ts
public/copilot/panels/* (curated hero images)
Modified

src/components/chat/ChatWidget.tsx — behind flag, renders ConsultationShell on desktop instead of the old floating popout; ignored UI-only tool calls from Part 3.6 are now wired in here.
4.12 Part 4 exit gate (all 10 must pass before Part 5)
Build + lint + bundle-budget check all green.
All 10 panels + 15 diagrams render standalone (Storybook-style dev routes under /admin/copilot-lab/*, dev-only).
20-prompt golden set from Part 3 extended: assert each produces a coherent panel state and visually correct transitions (screenshot tests via Playwright).
Panel switching under heavy conversation: 10 rapid tool calls in a row don't stutter, don't leak Framer Motion listeners.
Image loads never block the panel content (LCP of the panel itself < 400 ms on mid-tier laptop).
Contact page: form is fully usable with Atheros open; no click interception.
Keyboard-only walkthrough of the full flow succeeds (tab, arrow, Enter, Esc).
Screen reader announces panel changes; diagrams have titles/descriptions.
Flag off → zero bytes of Part-4 code in the initial bundle (verified via next build analyzer).
Chat agent still streams thoughts + tokens smoothly; Part-3 exit gates still pass.



Part 5 (revised v3) — Narration lives in the Peek state
Key change: during an auto-nav, the Converse sheet collapses to Pill as the new page loads, then the Peek state auto-raises with the narration. The user sees the page clearly, Atheros hovers above it like a quiet guide, and the full conversation stays one tap away.

The revised two-beat choreography on mobile
In Converse, the user asks a question that triggers present_content(autoNavigate: true).
Beat 1 — pre-nav announcement (streamed inside Converse, 3–8 words): "Opening the consolidation playbook…" — this single message lands at the bottom of the chat transcript.
Transition (≈ 280 ms):
Converse sheet smooth-collapses down to Pill (spring, not a dismiss — the sheet stays mounted, just minimized).
router.push(resolvedUrl) under the sheet; page renders.
await document.readyState === 'complete' + 2 RAFs.
Smooth-scroll to #<section>.
Beat 2 — Peek narration auto-raises with a dedicated narration variant:
Shows a tiny page-icon glyph (signals "Atheros is pointing at the page, not proactively nudging you").
One-liner from the narration field of the tool call: "Now on the consolidation playbook. Phase 2 is your cutover window — 72 h staged."
Stays up for 15 s (cancel-on-interaction), then auto-collapses to Pill.
Tap anywhere on the Peek → opens Converse with the full transcript; the narration line is already the latest assistant message, visible at the bottom.
Swipe-down / ✕ → collapses to Pill but the message stays in the Converse transcript (nothing is ever lost).
State machine update — pillStateMachine.ts
3 states, same as the v2 revision, but transitions get smarter:

converse ──[present_content:autoNav]──▶ pill ──[nav done]──▶ peek(narration) ──[15s / ✕]──▶ pill
                                                                     │
                                                                     └─[tap]──▶ converse
peek(proactive) is still the passive 8s + 40%-scroll variant

Two peek sub-variants (proactive | narration) render distinctly. Admin replay (Part 6) captures which variant fired.

Why this is better than keeping the sheet open
The page is the content. Atheros's job post-nav is to point, not to compete for attention. Peek's slim profile makes the page readable and the guidance unambiguous.
The bottom sheet closing is a visual "handoff" — it signals "you're looking at the page now, I'm just overhead".
The conversation is not truncated: one tap brings the whole thread back, exactly where it was.
Accessibility
aria-live="polite" announces the narration when Peek raises.
Peek is focusable; Enter/Space toggles to Converse. Esc collapses to Pill.
Reduced-motion: Converse → Pill → Peek happens as instant cuts, no easing; narration still shows for 15 s; everything still works.
Screen readers on the newly-loaded page announce the section heading as normal — narration does not intercept that flow.
Throttle & contact-page rules (unchanged)
Max 1 auto-nav per 30 s/session.
/contact ignores autoNavigate entirely; form focus never stolen.
"Let Atheros open pages for you" toggle still available; off = fall back to chip-click from the v1 revision.
Files — minimal delta from v2
Modified

src/components/copilot/mobile/PillPeek.tsx — adds narrationVariant with the page-icon glyph and the longer 15 s dwell.
src/lib/copilot/pillStateMachine.ts — peek becomes peek.proactive | peek.narration; new converse → pill → peek.narration transition.
src/lib/copilot/presenter.ts — after nav success, drives the collapse + peek.narration raise; error path raises peek.narration with "Couldn't open that — tap to retry" + log.error.
No new files beyond v2.

Revised exit gate (mobile)
Build + lint + mobile idle ≤ 4 KB, converse ≤ 26 KB.
Device pass on iOS 17+ Safari, Chrome Android, Samsung Internet.
Choreography timing: Beat 1 → nav → Beat 2 in Peek end-to-end within 1.2 s p95 on a mid-tier Android.
Narration accuracy: 20 golden prompts — narration text's referenced section exists in the loaded page DOM.
Transcript continuity: narration message appears in Converse transcript whether the user opened Converse before dismissing Peek or not.
Peek dismiss UX: swipe-down, ✕, and 15 s timeout all collapse cleanly to Pill without losing the message.
Tap-to-expand Peek → Converse opens at the bottom of the transcript showing the narration as the latest message.
Throttle, contact-page immunity, and settings toggle verified.
Accessibility: narration announced once, focus handled correctly, reduced-motion variant works.
Flag off → zero mobile-specific bytes; desktop Part-3/4 unaffected.



Part 6 — Admin Live View (the nerve center)
Goal: make the Atheros conversation loop fully observable and controllable from the admin dashboard. Live transcripts as they happen, real-time handoff alerts, full session replay (desktop morphs, mobile navs, narrations, tool calls), content-gap detection, CTO overrides without a deploy, and a clean error log. All existing lead-gen & intelligence plumbing from Parts 1–3 surfaces inline — no duplicate systems.

6.1 Live Conversations — /admin/copilot/live
Two-pane layout, powered by Supabase Realtime.

Left: active session feed. Subscribes to chat_sessions + chat_messages inserts/updates. Shows every session with activity in the last 5 minutes:

Anonymized visitor ID (or lead name once qualify_lead captures one)
Current page path, flag bucket (v1 or v2), device class (desktop / mobile)
Turn count, last model used, last latency, running cost (from chat_messages.cost_usd)
Status pill: new | qualifying | engaged | handoff-requested | closed
Lead score (live, from chat_leads.intelligence)
Right: selected session transcript, streaming live. Renders the same thought-stream / tool-call / narration UI the user sees, plus admin-only overlays:

The retrieved chunk IDs + similarity scores for each turn
Tool call args & results (expandable JSON)
Model, input/output tokens, latency, cost per turn
Any chat_errors rendered inline at the moment they fired
Current pill / sheet state (for mobile) or panel in the canvas (for desktop)
Filters above the feed: device, page, has-lead, has-error, has-handoff, min-cost.

6.2 Handoff Inbox — /admin/copilot/handoffs
Wired to Part-3's handoff_to_human tool. The moment the AI emits a handoff:

chat_sessions.handoff_at is set; Supabase Realtime broadcast fires on admin:handoffs.
Every admin tab shows a toast + sidebar badge.
/admin/copilot/handoffs lists pending handoffs, newest first, with the pre-packed payload (reason, summary, stickyContext), full transcript, and the existing intelligence report inline (already generated per Part 3).
"Take it from here" button claims the session: sets chat_sessions.admin_claimed_by + writes an admin message into chat_messages. The user sees a soft banner appear above Atheros: "Pat from ACI is here →".
6.3 Live Takeover (admin-assisted mode)
When admin_claimed_by is set, Part-3's v2 route checks it on every turn and switches behavior per admin preference:
Relay: AI stops generating; admin types directly (messages sent via POST /api/admin/copilot/takeover).
Copilot mode: AI still drafts responses, but they're held in an "admin preview" pane — admin edits and clicks Send. User only sees sent messages.
New chat_messages.role = 'admin' with admin_id. Part-3 streaming handles the admin role transparently.
End-of-handoff: admin clicks "Release"; AI resumes if user keeps chatting.
Audit log entry on claim, send, release.
6.4 Per-Session Replay — /admin/copilot/sessions/[id]
Faithfully reproduces the user's exact experience:

Chronological render of messages, thoughts, status_events, tool calls (with timing), panel swaps (desktop), router.push navigations (mobile), Peek appearances (narration variant highlighted).
Timeline scrubber at the top — drag to any point to see the UI state that would have been visible at that moment (chat + pill state + page the user was on).
Qualification diff view — how lead data filled in over time (name at T+12s, email at T+2m, industry at T+3m…).
Device emulation toggle (mobile / desktop) so admins can replay the other surface if needed.
Quick actions: export JSON, flag for review, re-generate intelligence, send transcript to sales email.
6.5 CTO Overrides — /admin/copilot/cto-overrides
Admin-editable copy without a redeploy.

New table cto_overrides:

route_pattern text,           -- '/services/data-engineering', '/lp/databricks-migration*'
surface text,                 -- 'idle' | 'peek.proactive' | 'peek.narration' | 'panel.primary_cta' | 'chip'
variant_key text,             -- e.g. 'cio', 'hospitality' (optional)
text text,                    -- the override copy
is_active boolean,
updated_by uuid, updated_at timestamptz

pillCopy.ts resolver now consults this table first (cached in Vercel KV or Supabase edge cache with 60 s TTL — cheap, not user-critical).
entityToRoute.ts + Part-4 panels read panel.primary_cta overrides the same way.
Guardrails: an admin save lints the text through a client-side check — no price mentions, no "talk to an architect" phrase, no em-dashes, no exclamations. Violations block the save with a readable explanation.
Preview mode: see the resolved copy on any route before saving.
6.6 Chat Error Log — /admin/copilot/errors
Feed from chat_errors with:

Filter by stage (retrieve | generate | tool | stream | render | panel | pill), severity, time range, session_id.
Fingerprint grouping: sha256(stage + normalized message) clusters same-root errors. Count + last-seen per fingerprint.
Silence fingerprint for 24 h button (stored in chat_error_silences), with an audit entry.
Per-error "jump to session" link that lands on the replay timeline scrubbed to that moment.
Sparkline of error rate per hour for the last 7 days.
6.7 Analytics & Content Gaps — /admin/copilot/analytics
Top cards: sessions today, qualified leads, handoffs, avg turns, avg cost/session, avg first-token latency, conversion (qualified / sessions).
Charts: top pages Atheros is invoked from, top tools called, top cited sources, top auto-nav destinations, auto-nav throttle-drops (indicates brain is too eager somewhere).
Content Gap feed — the highest-value output of Atheros for the content team:
Queries where hybridRetrieve top-1 similarity < threshold, OR where the model emitted low-confidence generic answers (detected via a lightweight regex + length heuristic on post-hoc transcripts).
Surfaced as: the user's original question, the (weak) chunks retrieved, the AI's reply, and a one-click "Draft a content brief" that opens a prefilled admin task on the content team queue.
Cost dashboard: $/day, $/session, $/lead, cost heatmap by hour-of-day.
6.8 Main Admin Dashboard integration
src/app/admin/page.tsx adds an Atheros row:

Live sessions count (clickable → 6.1)
Handoffs pending (clickable → 6.2)
Errors last 24 h (clickable → 6.6)
Qualified leads today (clickable → existing /admin/chat-leads)
Avg cost / session last 7 days
/admin/chat-leads (existing page) gains a "Live session" pill next to any lead whose session is still active, linking to the replay.

6.9 Lead & intelligence wiring — no new system
qualify_lead (Part 3) already upserts into existing chat_leads.
generateIntelligence (existing src/lib/intelligence.ts) runs once email captured, writes to chat_leads.intelligence JSONB.
Admin live view + replay + handoff pre-pack all read from the same source of truth. Zero duplicate pipelines.
6.10 Permissions & audit
RLS on all new tables (cto_overrides, chat_error_silences): admin-role only; "takeover" requires elevated role.
admin_audit_log (already exists) gets entries for: handoff claim/release, admin-sent message, CTO override save, error silence, session flag, intelligence regeneration.
Service-role keys stay server-side; no Supabase direct writes from the admin browser bundle except through route handlers.
6.11 Files
New

src/app/admin/copilot/live/page.tsx
src/app/admin/copilot/handoffs/page.tsx
src/app/admin/copilot/sessions/[id]/page.tsx
src/app/admin/copilot/cto-overrides/page.tsx
src/app/admin/copilot/errors/page.tsx
src/app/admin/copilot/analytics/page.tsx
src/components/admin/copilot/* (TranscriptViewer, SessionList, TimelineScrubber, CtoEditor, ErrorTable, GapFeed)
src/app/api/admin/copilot/takeover/route.ts
src/app/api/admin/copilot/cto-overrides/route.ts
src/app/api/admin/copilot/session/[id]/route.ts (flag, export, regen-intelligence)
src/app/api/admin/copilot/errors/silence/route.ts
src/lib/copilot/realtime.ts (Supabase Realtime client helper)
supabase/migrations/<ts>_cto_overrides.sql
supabase/migrations/<ts>_chat_error_silences.sql
supabase/migrations/<ts>_chat_sessions_handoff_and_claim.sql (adds handoff_at, admin_claimed_by, admin_mode)
Modified

src/lib/copilot/pillCopy.ts — consults cto_overrides first.
src/app/api/chat/v2/route.ts — honors admin_claimed_by + admin mode (relay / copilot).
src/app/admin/page.tsx — Atheros summary row.
src/app/admin/chat-leads/page.tsx — "Live session" pills.
6.12 Part 6 exit gate
Build + lint green; RLS verified on every new table; service-role usage audited.
Realtime pipeline: open live view, trigger a chat from a second browser, see it appear within 1 s.
End-to-end handoff: AI emits handoff_to_human → admin toast fires → admin claims → user's Atheros shows banner → admin types a relay message → user receives it → admin releases → AI resumes.
Replay fidelity spot-check: 10 randomly-selected sessions, scrub to 3 timestamps each — UI state matches chat_messages log exactly.
CTO override round-trip: save an override on /services/data-engineering idle pill → pill on the live site reflects it within the cache TTL.
CTO lint: attempts to save copy containing "$" or "architect" or "!" are blocked with a readable message.
Error log: force a generate error → row appears with stack → "silence fingerprint" suppresses it → silenced row excluded from feed + audit entry written.
Content Gap feed: a low-similarity query appears in the feed; "Draft a content brief" creates a prefilled task.
Cost dashboard: numbers tie out to chat_messages.cost_usd sum for the period.
Admin bundle stays off public routes (verified via analyzer).

Two important corrections noted. Adjusting:

Correction 1: "CTO" as acronym is ambiguous — renaming
In my plan I've been using CTO as shorthand for your original term "Call-to-Outcome" — which collides horribly with Chief Technology Officer. Bad choice on my part. Renaming across all parts:

Old: CTO (Call-to-Outcome)
New: Outcome Copy (OC) — or just "outcome copy" in prose.
Affected places:

Part 4.5 "primary CTO" per canvas → "primary outcome copy"
Part 5 "CTO framing" → "outcome copy"
Part 6.5 page is renamed: /admin/copilot/outcome-copy (route + outcome_copy_overrides table + OutcomeCopyEditor component). All copy-overrides terminology in Part 6 follows.
Part 6.5 surface enum stays the same (idle | peek.proactive | peek.narration | panel.primary_oc | chip) with panel.primary_cta renamed to panel.primary_oc.
Zero behavior change — just removing the acronym collision before it lands in the codebase and the admin UI, where the real CIO/CTO/CDO variants will live.

Correction 2: Target audience is the full C-suite, not just CTOs
The target readers Atheros should tailor to are CIO, CDO, CTO, CISO, CEO, CMO (MarTech/CDP). This was under-specified in Parts 3–6. Fixing.

Part 2 — content index (already supports this; no change): lp-content.ts exposes roleVariants keyed by arbitrary role strings. We standardize the keys to: cio | cdo | cto | ciso | ceo | cmo. The content team can drop variants for any role under any LP. Missing variant → falls back gracefully (base copy).

Part 3 — Atheros brain: the system prompt gets an explicit Audience section listing all six roles with 1-line concerns each:

CIO — consolidation, vendor rationalization, modernization sequencing, run-rate
CDO — data mesh / lakehouse, governance, Unity Catalog, analytics self-service
CTO — platform architecture, build vs. buy, SRE, developer velocity
CISO — zero trust, data residency, auditability, identity / entitlements
CEO — outcomes, timelines, risk, board-level proof
CMO (MarTech/CDP) — identity resolution, activation, campaign velocity, attribution
qualify_lead(role) schema enum becomes the exact same 6 values (plus other). When Atheros detects role, retrieval filters metadata to prefer role-matching chunks.

Part 5 — pillCopy.ts role-aware copy table expanded. Example (/services/data-engineering):

cio idle: "Rationalize your data stack without rebuilds"
cdo idle: "See the Unity Catalog rollout pattern"
cto idle: "Ask about Databricks on cost-per-query"
ciso idle: "Governance and residency patterns"
ceo idle: "See 12-month migration outcomes"
cmo idle: "Ask about CDP identity resolution" (if on MarTech page)
Role is detected from (a) LP URL param ?role=, (b) qualify_lead extraction during conversation, (c) persisted in session. Pill copy re-resolves when role changes mid-session.

Part 6 — admin:

Outcome Copy editor gains a role dimension in variants (cio | cdo | cto | ciso | ceo | cmo | any).
Analytics dashboard adds role breakdown of qualified leads, conversion-by-role, top-cited-sources-by-role — so the content team can see which personas land vs. stall.
Content Gap feed is grouped by role to reveal which persona's questions Atheros answers weakly.


Part 7 — Polish, Perf, & Production Rollout
Goal: take Parts 1–6 from "works on main" to "runs smoothly, quietly, and measurably in production, at 100% traffic, with the old v1 code gone." No new features. Every item here is about confidence, speed, and closing loops.

7.1 Bundle budgets — enforced, not aspirational
Extend scripts/check-copilot-budget.ts (Part 4) into a CI gate that fails the build on regression. Final budgets, measured gzipped:

Surface	Budget
Public first-paint (LCP-critical path) — Atheros must add 0 bytes	0 KB
Mobile idle pill (loaded on idle)	≤ 4 KB
Mobile full converse bundle (lazy)	≤ 26 KB
Desktop consultation shell (lazy)	≤ 40 KB
Each panel component	≤ 12 KB
Each diagram component	≤ 10 KB
Admin copilot bundle (public routes excluded)	off public routes entirely
Uses @next/bundle-analyzer output + a pure-JS stat walker. PR comment from CI prints the diff vs. main for every tracked bundle.

7.2 Prefetch & warming strategy
Atheros loads on requestIdleCallback(() => import(...)) after first interaction OR 2 s — whichever is first. Never before LCP.
On chat open, the client router.prefetch()es the canonical destination for each entity currently referenced in the last 3 model turns. Auto-navs are then near-instant.
Server: keep a warm embedding cache for the 200 most-recent user queries (in Redis, 5 min TTL). Repeat queries skip OpenAI embeddings — common on high-traffic LPs.
Content index is loaded once per edge region on first /api/chat/v2 hit and cached in module scope — subsequent requests pay zero load cost.
7.3 Empty, offline, rate-limit, slow-network states (fail-loud, user-graceful)
Every failure mode gets a real state, not a white screen:

Offline — pill shows a muted cloud-off glyph + tooltip "Reconnect to chat". Converse shows queued messages with a "Will retry when you're back" footer; sends on reconnect.
Rate-limited — polite cap line streamed into chat; pill dim for 60 s. log.warn('ratelimit.hit', ...) so admins can see spike patterns.
Slow first token — if no SSE event in 800 ms, chat shows "Warming up…" (not fake reasoning). After 5 s with no tokens, abort, stream the polite fallback, write a chat_errors warn row.
Content index missing — pgvector query fails → falls back to structured-only retrieval + banner in the admin /health view. User experience is unaffected for known entities; unknown-entity asks get an honest "I can point you to our services page — the full match isn't loading right now."
Auto-nav failure (mobile) — stays on current page, Peek shows "Couldn't open that page — tap to retry" + log.error.
All models down — primary + secondary + tertiary all fail → streaming fallback message streams in with a clear contact-form deep link. Session flagged as degraded. Admin dashboard shows a "degraded window" banner.
Every one of these is wired to log.* from Part 1 — admin Error Log (Part 6.6) surfaces them, fingerprinted.

7.4 E2E happy-path suite (Playwright, headless Chromium + WebKit)
Run in CI on every PR touching src/lib/copilot/, src/components/copilot/, src/app/api/chat/**. Matrix: 2 devices × 6 roles × 5 pages = 60 scenarios.

For each scenario, assert:

Atheros opens, thought-stream shows, first token < 1.5 s.
Atheros adapts to role (detected from ?role=): voice + retrieval reflect the persona.
qualify_lead fires when name/email surface naturally; row appears in chat_leads with intelligence within 10 s.
present_content either morphs the desktop canvas or auto-navs on mobile correctly; narration accurately describes the loaded section.
handoff_to_human emits a Realtime event; admin tab receives it within 1 s.
Zero [client-name-leak] occurrences in DOM or network payloads.
No console errors; no chat_errors rows with severity ≥ error.
Screenshots diffed against golden masters for the desktop canvas and mobile Peek narration.

7.5 Final copy & voice pass
Run every static string (brand.ts, pillCopy.ts base + 6 role variants, panel outcome copy, empty states, error messages) through the voice-rule linter (no !, no em-dashes, no "$", no "architect", brevity tiers respected on pill/peek).
Cross-check each of the 50 LPs' ctoText fields for the same rules; flag and hand to the content team.
Narration templates in the system prompt tightened: the golden-set eval score on narration accuracy must be ≥ 95% (page DOM contains the section referenced).
7.6 Accessibility & SEO final audit
axe-core run on every copilot surface; zero serious/critical issues.
VoiceOver (iOS/macOS) + TalkBack + NVDA manual pass on: open pill, run conversation, auto-nav + Peek narration, handoff banner appearance, admin takeover message.
Reduced-motion end-to-end pass (everything works as instant cuts).
Public page SEO check: Atheros adds zero <meta> / structured-data pollution; no new canonical conflicts; <html lang> preserved across auto-navs.
7.7 Production rollout plan
Controlled via the Part-1 flag + percent bucket.

Phase	Traffic	Duration	Exit condition
0	Internal only (COPILOT_V2_ENABLED=true behind admin IP allowlist)	2 days	Zero severity≥error events; golden set green
1	5% bucket, desktop only	3 days	p95 first-token < 1.5 s; error rate < 0.5%; no cost anomalies
2	25% bucket, desktop + mobile	3 days	Same thresholds; qualified-lead rate ≥ v1 baseline
3	50%	3 days	Content Gap feed reviewed; narration accuracy ≥ 95%
4	100%	1 week burn-in	No regression on chat_leads volume; admin takeover exercised at least 3×; cost/session within budget
5	v1 removal	—	delete /api/chat/route.ts (v1), remove hybrid processResponse() from ChatWidget.tsx, remove hardcoded PAGE_CONTEXT_MAP + QuickReplies constants
Kill switch (COPILOT_KILL=true) is tested in staging and rehearsed once in prod on the 5% ramp: flip it, confirm fallback-to-v1 within 30 s across all regions, flip it back.

7.8 Runbook & admin docs
docs/copilot/runbook.md — "what to do when": Atheros is slow, model outage, Realtime channel stuck, handoff not delivered, CTO outcome copy not updating, unexpected cost spike, suspected client-name leak.
docs/copilot/admin-guide.md — outcome copy editor, handoff takeover, replay scrubber, content gap triage, flag & rollout controls.
Every runbook step ties back to the admin screens built in Part 6.
7.9 Legacy cleanup (after Phase 5 of rollout)
Deleted in one commit with full removal verified in the analyzer:

src/app/api/chat/route.ts (v1)
Scripted processResponse() branch and stage machine in ChatWidget.tsx
PAGE_CONTEXT_MAP, PAGE_INITIAL_MESSAGES, QUICK_REPLIES, SERVICE_SPECIFIC_REPLIES, TimeSlotSuggestions
NEXT_PUBLIC_COPILOT_V2 flag reads (the v2 path becomes the only path; the percent bucket stays as a safety knob for future experiments but defaults to 100)
7.10 Cost & usage SLOs post-launch
Tracked in Part 6.7 dashboard, alerted via admin email (Resend):

Cost per session p95 < $0.04
First-token latency p95 < 1500 ms
Error rate < 0.5%
Handoff latency (AI emits → admin notified) < 1 s p99
Narration accuracy ≥ 95% weekly rolling
Content Gap feed: new unique gaps per week reviewed within 7 days
Any SLO breach for 24 h → auto-email to admins + a banner in /admin/copilot summarizing the trend.

7.11 Files
New

scripts/check-copilot-budget.ts (full CI gate)
scripts/check-voice-rules.ts (string linter)
tests/e2e/copilot/*.spec.ts (Playwright matrix)
docs/copilot/runbook.md, docs/copilot/admin-guide.md
Modified / removed

src/components/chat/ChatWidget.tsx — v1 branch deleted in Phase 5.
src/app/api/chat/route.ts — deleted in Phase 5.
eslint.config.mjs — stricter rule set (final pass).
7.12 Part 7 exit gate (the launch gate)
CI budget gate green with no manual overrides.
E2E matrix (60 scenarios) green on Chromium + WebKit for 3 consecutive runs.
Rollout Phase 4 complete: 7 days at 100% traffic with all SLOs met.
Legacy v1 deleted; bundle analyzer confirms no dead code.
Admin runbook rehearsed: at least one kill-switch drill, one takeover drill, one Content Gap triage done by a real admin.
Lighthouse on /, /services/data-engineering, /lp/databricks-migration, /contact — no regression vs. main pre-Atheros (LCP, TBT, CLS).
All Part-1 through Part-6 exit gates re-verified green (regression check).
Final sign-off from content team on outcome copy across all 50 LPs + 6 role variants.
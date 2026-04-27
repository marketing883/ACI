# Atheros — Admin Guide

How to use the `/admin/copilot/*` surfaces day-to-day. Every step references the exact admin URL.

## Opening Atheros admin

Sign in at `/admin/login`. The sidebar has an **Atheros** section with five entries:
- Live Conversations
- Handoffs
- Outcome Copy
- Errors
- Analytics

The main `/admin` dashboard also has an Atheros row with cards that deep-link into each.

## Live Conversations (`/admin/copilot/live`)

Real-time feed of every Atheros session in the last 24 hours. Four stat cards up top (Sessions / With lead / Handoffs pending / Cost in view). Filters:
- Search: visitor ID, email, name, or company (prefix, case-insensitive).
- Active in last 5 min: keeps the view focused on currently-chatting sessions.
- Handoff only: only sessions where Atheros escalated.

The list auto-refreshes on new sessions and messages via Supabase Realtime. Manual **Refresh** button forces a re-query.

Click **Open →** on any row to drill into the per-session replay.

## Per-Session Replay (`/admin/copilot/sessions/[id]`)

Full transcript viewer for a single session.

**Left column**: chronological transcript with thoughts (dim italic lines above the reply), status events, tool bubbles (with arg JSON on tool-role messages), per-turn model, latency, and cost.

**Right column**:
- **Lead** card: name / email / company / title / service / score / status when captured.
- **Session** card: started at, last activity, page, turns, tokens, cost, handoff state.
- **Intelligence** card: the AI intelligence report (score, person, company, pain points, talking points, signals). Auto-generated when an email is captured.
- **Errors** list at the bottom if any chat_errors rows are linked to this session.

If the session is currently claimed by an admin, an amber **relay composer** appears above the transcript; type here and click Send to post a message the visitor sees in real time.

## Handoff Inbox (`/admin/copilot/handoffs`)

Every session where Atheros fired `handoff_to_human`.

Each row shows:
- Lead (name / email / company).
- Reason for escalation.
- Page they were on.
- When they requested.
- State: unclaimed (rose badge) or claimed (amber badge with the mode).

Workflow:
1. Click **Take it (relay)** → writes `admin_claimed_by` + `admin_mode=relay` on the session. An amber banner ("A real person from ACI just joined this conversation.") posts automatically into the visitor's chat.
2. Click **Open →** to go to the per-session replay.
3. In the replay, use the amber relay composer to type. Messages land in real time.
4. When done, click **Release** on the handoff inbox to return control to Atheros. A "handing back" banner posts to the visitor.

## Outcome Copy (`/admin/copilot/outcome-copy`)

Edit the live copy Atheros shows — pill text, peek narrations, panel CTAs, chip labels — per route and per persona, without a deploy. Saves reflect on the live site within 60 seconds via the in-memory resolver cache.

### Editing a row

1. Click **Edit** next to an existing override OR **New override** in the top-right.
2. Fill in:
   - **Route pattern** — exact path like `/services/data-engineering` OR trailing wildcard like `/lp/*`.
   - **Surface** — one of `idle` / `peek.proactive` / `peek.narration` / `panel.primary_oc` / `chip` / `welcome`.
   - **Variant (persona)** — leave on "any" for a single override, or pick `cio` / `cdo` / `cto` / `ciso` / `ceo` / `cmo` for a persona-specific override.
   - **Text** — the actual copy. Live character counter; 280 char max.
   - **Active** — uncheck to soft-disable without deleting.
   - **Notes** — admin-only; not rendered.
3. Click **Create** (or **Update**).

### Voice rule enforcement

Every save runs through the same linter the linter CI uses:

- No `!` in the text.
- No em-dash or en-dash.
- No `$`, "pricing", or "cost per".
- No "talk to an architect".
- No AI-bot phrasing ("as an AI", "I can help you with").
- Non-empty and under 280 chars.

Save fails with a readable list of issues. Fix the text and click Create again.

### Resolver precedence

When two or more overrides match a given (route, surface, variant), longer exact matches win over wildcards; variant-specific matches win over variant-null.

## Errors (`/admin/copilot/errors`)

Grouped error log. Every `log.info` / `log.warn` / `log.error` / `log.fatal` from the Atheros stack lands in `chat_errors`.

**Columns**:
- **Fingerprint** — 16-char hash of `(stage, normalized message)`. Groups identical-shape errors across sessions.
- **Stage** — retrieve / generate / tool / stream / render / panel / pill / indexer / ratelimit / health / init / other.
- **Severity** — info / warn / error / fatal.
- **Sample message** — one line. Hover for full.
- **Count** — total occurrences in the window.
- **Last seen** — relative timestamp.

**Actions per row**:
- **Jump to session →** opens the per-session replay for the first affected session.
- **Silence 24h** → writes to `chat_error_silences`; group disappears from default view.
- **Unsilence** → removes the silence.

**Filters**: stage, severity, time window (1h / 24h / 7d), include-silenced toggle.

## Analytics (`/admin/copilot/analytics`)

At-a-glance dashboard.

**Stat cards** (12):
- Sessions · Messages · Qualified leads · Handoffs
- Conversion rate · Avg turns / session · p50 latency · p95 latency
- Total cost · Cost / session · Cost / lead · Errors / session

**Ranked lists** (3):
- Top pages (where Atheros sessions started).
- Top models (Haiku 4.5 vs GPT-4o-mini vs Haiku 3.5 usage).
- Top service interests (captured via qualify_lead).

**Content Gap feed** (reserved slot; ships as a follow-up once per-query retrieval similarities are logged).

Refreshes on Realtime session and message inserts. Window picker: 24h / 7d / 30d.

## Where Atheros writes

- `chat_sessions` — one row per visitor session.
- `chat_messages` — one row per turn (user, assistant, tool, or admin).
- `chat_errors` — structured log entries, fingerprinted.
- `chat_leads` — enriched lead row keyed by session_id. `source = 'atheros_v2'` identifies Atheros-captured leads vs. legacy form leads.
- `content_chunks` — indexed ACI content for retrieval.
- `outcome_copy_overrides` — admin-edited copy.
- `chat_error_silences` — silenced fingerprints with expiry.

Everything is reversible; the app stops reading v2 tables the moment `NEXT_PUBLIC_COPILOT_V2` flips off.

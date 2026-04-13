/**
 * Atheros system prompt builder.
 *
 * Composed at request time from four layers:
 *   1. Identity   - brand.ts VOICE_RULES + audience scope (6 C-suite roles).
 *   2. Page context - current path, query params, service cluster, industry,
 *                     role from LP params, entry page, pages visited.
 *   3. Retrieved knowledge - top-K chunks from hybridRetrieve() formatted
 *                            with [source:slug] tags so citations round-trip.
 *   4. Conversation state - captured lead fields so the model does not
 *                           re-ask. Nothing pretends to be a form.
 *
 * The prompt is read-only data at runtime; any edit is a code change.
 * Part 6 introduces admin-editable outcome copy via the cto_overrides
 * table; it flows into the widget, not this prompt.
 */

import { COPILOT_NAME, VOICE_RULES } from './brand';
import { formatForPrompt } from './retrieval';
import type { RetrievedChunk } from '@/data/types';
import type { PageContext } from './retrieval';
import type { ResolvedPanel } from './panelRouter';

export interface ConversationLeadState {
  name?: string;
  email?: string;
  company?: string;
  website?: string;
  phone?: string;
  jobTitle?: string;
  industry?: string;
  team?: string;
  timeline?: string;
  serviceInterest?: string;
  role?: string;
  budget?: string;
  priority?: string;
  intent?: string;
}

export interface PromptBuildInput {
  pageContext: PageContext;
  retrieved: RetrievedChunk[];
  leadState: ConversationLeadState;
  /** Turn index (1 = first assistant turn). Used for brevity tiers. */
  turnIndex: number;
  /** Optional free-form signal from engagement triggers. */
  engagementSignal?: string;
  /**
   * Panel the server has already emitted to the client for this turn.
   * Null when the router could not pick a valid entity; the model
   * answers without a panel reference in that case.
   */
  serverPanel?: ResolvedPanel | null;
}

const AUDIENCE_SECTION = `
AUDIENCE (tailor to the active role; fall back to generalist framing when unknown)
- CIO: consolidation, vendor rationalization, modernization sequencing, run-rate.
- CDO: data mesh, lakehouse, governance, Unity Catalog, analytics self-service.
- CTO: platform architecture, build vs. buy, SRE, developer velocity.
- CISO: zero trust, data residency, auditability, identity and entitlements.
- CEO: outcomes, timelines, risk, board-level proof.
- CMO (MarTech/CDP): identity resolution, activation, campaign velocity, attribution.
`.trim();

const TOOL_USAGE_GUIDE = `
YOUR JOB THIS TURN
The server has ALREADY picked a content panel for the right canvas and
has ALREADY emitted the panel event. You do NOT fire show_content_panel.
It is not in your tool list. Your only output is PROSE: a thought line,
one or two grounded sentences, and a focused follow-up question.

The current panel (if any) is declared in the PANEL ON THE RIGHT block.
When no panel is declared, answer in pure prose without pretending
something is on the canvas.

WEAVE THE KNOWLEDGE — EVERY DIMENSION
The <atheros-context> block carries chunks across every source we have:
- service clusters (data-engineering, applied-ai-ml, cloud-modernization,
  martech-cdp, digital-transformation, cyber-security, app-development,
  qa-testing)
- platforms (databricks, snowflake, aws, azure, salesforce, sap,
  servicenow, braze, microsoft-dynamics)
- industries (financial-services, healthcare, retail, manufacturing,
  hospitality, energy, transportation)
- case studies (anonymized by industry)
- landing-page deep dives, diagrams, playbooks, blog posts, whitepapers

When the retrieved chunks span multiple dimensions, WEAVE them. A user
asking "Dynamics 365 for manufacturing" should get a reply that reaches
across the Microsoft Dynamics platform chunk, the manufacturing industry
chunk, AND any case study tagged manufacturing if one is in retrieval.
Same for every other combination: "Databricks in healthcare" should pull
the Databricks platform, the healthcare industry, and any healthcare
case study; "Salesforce for retail" should pull Salesforce + retail +
retail cases; and so on across all 9 platforms x 7 industries x 8
service clusters x case study library.

CITE INLINE
When you reference ACI work, tag it as [source:slug] using a slug that
appears in the <atheros-context> block. Case study slugs are gold —
nothing earns trust faster than a relevant, anonymized proof point.
Examples (use real slugs from the context block, never invent):
  "We ran this for a retail client [case_study:<slug>]."
  "Same pattern lives in our manufacturing playbook
   [playbook:<slug>]."
  "The Databricks page covers cost optimisation
   [platform:databricks]."
Citations must match a slug actually present in the context block. If
you cannot find one, do not invent one.

PROSE SHAPE
- One "~" thought line stating your approach in under 10 words.
- One or two short sentences that tie the panel + retrieved knowledge
  to what the user asked. Pull from at least two dimensions when the
  retrieval supports it.
- One focused follow-up question.
- Zero em-dashes, zero en-dashes, zero exclamation points.

OTHER TOOLS
- qualify_lead: fire EVERY TIME a new field surfaces in the conversation,
  even mid-discussion. Do not wait for an explicit form moment. Examples:
    * User says "I'm Priya" -> qualify_lead({ name: "Priya" }).
    * User mentions "we're a healthcare org" -> qualify_lead({ industry: "healthcare" }).
    * User mentions "head of data" -> qualify_lead({ jobTitle: "Head of Data", role: "cdo" }).
    * User shares an email anywhere in their reply -> qualify_lead({ email: "..." }).
    * User says "we use Databricks at Acme" -> qualify_lead({ company: "Acme", serviceInterest: "data-engineering" }).
  Never guess. Never invent. But never miss a field that was stated.
- offer_action_buttons: sparingly; 1-3 specific chips tied to what you just
  said. Generic "talk to an architect" is not allowed.
- request_field: at most one field per turn, only when the natural next step
  is for the user to supply it. See LEAD QUALIFICATION CHOREOGRAPHY below
  for when to ask for which field.
- cite_source: every time you reference ACI work. No citation = generic.
- handoff_to_human: when the conversation warrants a real person.
- schedule_meeting: only when the user explicitly signals availability.

LEAD QUALIFICATION CHOREOGRAPHY (CRITICAL FOR THE BUSINESS)
You are a helpful assistant AND a lead-gen machine. Both at once. Capturing
visitor info turns this conversation into a qualified lead in the admin
pipeline. Do not be pushy, but do not be passive either. The choreography:

  Turn 1-2: pure value. Show panels, answer the substantive question.
            Do NOT ask for any personal info yet. Build trust first.

  Turn 3-4 (after delivering real substance): ask for NAME naturally.
            Example: "Out of curiosity, who am I talking to?"
            -> request_field({ fieldName: "name"... }) is OK here, OR
               just ask in prose; the next user turn often reveals it.

  Turn 4-6 (after they share a name or 1-2 substantive turns later):
            ask about COMPANY and ROLE in the same turn, briefly. Example:
            "Where are you over there, and what is your role on this?"
            -> when they answer, fire qualify_lead with both fields.

  Turn 5+ (after value + role context): if you can infer INDUSTRY from
            their company or context, capture it via qualify_lead without
            asking. Otherwise ask once: "Which industry, broadly?"

  Turn 6+ (the email moment): only after delivering clear value, offer to
            send something useful (a playbook, a summary, a follow-up):
            "Want me to send you the [playbook:slug] writeup? Just need an
            email." -> request_field({ fieldName: "email", inputType: "email" }).
            EMAIL is the gateway to the admin lead pipeline. Get it.

  Turn 7+ (the timeline question): ask once: "What is the timeframe you
            are thinking about, this quarter, half, or further out?"
            -> qualify_lead({ timeline: "..." }).

Never stack questions. Never ask for the same field twice. If the user
declines, drop it gracefully and move on. If they have shared a piece of
info anywhere in the transcript, fire qualify_lead immediately so the
admin pipeline gets it.

After EMAIL is captured, ramp up specificity: cite case studies that match
their industry, surface relevant playbooks, propose schedule_meeting if the
intent is clear ("I'd like to talk to someone").

VALUE EXCHANGE RULE (mandatory)
Never ask for an email without first offering something concrete in return.
Email is a trade, not a toll. Acceptable trades:
- "Want me to send you the [playbook:slug] writeup?"
- "I can summarise this thread and email it to you."
- "Want me to send over the [case_study:slug] teardown?"
NEVER ask "what is your email" or "can I get your email" cold. If you
have nothing substantive to offer yet, do not ask.

WEBSITE AND PHONE CAPTURE RULES
- When the user names a company, ask once, casually, for the domain:
  "acme.com, right?" -> if they confirm, qualify_lead({ website: "acme.com" }).
  Do not push if they deflect.
- Phone is requested at most once, only AFTER email is captured, AND only
  when the user signals a call preference ("I'd rather hop on a call",
  "easier to talk live"). Otherwise leave it.

MEETING OFFER RULE (critical path to conversion)
Fire schedule_meeting when ALL of the below hold:
  1. email is already captured (QUALIFICATION STATE will say so),
  2. intent === 'high' (you set this on qualify_lead when the user has
     shown clear sales-ready signal), AND
  3. the user has surfaced a concrete pain point ("our costs doubled",
     "migration is stuck", "we miss SLAs").
When firing, provide 2-3 plain-text windows:
  schedule_meeting({
    proposedWindows: ["Tomorrow morning", "Later this week", "Early next week"],
    note: "<one short sentence summarising the pain>"
  })
Do NOT promise a booking; the admin team follows up. Never fire it twice
in the same session. If the user says "let's talk" before email is in,
first trade value for email, THEN fire.

INTENT SCORING
Set the intent field on qualify_lead whenever new signal arrives:
- 'high': explicit buying signal, named budget, named timeline of this half
  or sooner, or "I want to talk to someone".
- 'medium': active evaluation, comparing vendors, specific pain named but
  no timeline yet.
- 'low': research, curiosity, student, general learning.
Re-score upward (never downward) as the conversation deepens.

BUDGET AND PRIORITY CAPTURE
When the user mentions dollars or scope implying one, set budget using
the closest band: under-100k, 100k-500k, 500k-1m, over-1m, or 'unknown'.
When they mention urgency ("this quarter", "need it by Q3", "next year",
"no rush"), set priority accordingly: this-quarter, this-half, this-year,
exploring, no-rush. Never invent. If ambiguous, omit.

CITATION SYNTAX IN PROSE
- When you mention an ACI proof point, tag it inline as [source:slug], e.g.
  "We ran this for a hospitality client [case_study:hospitality-data-unification]."
- Tags must match a slug that appears inside the <atheros-context> block.

VOICE COMPLIANCE (REPEATED FOR EMPHASIS)
- ZERO em-dashes, ZERO en-dashes. Use commas, semicolons, colons, periods.
  "It depends, mostly, on scope" - NOT "It depends - mostly - on scope".
- ZERO exclamation points.
- Speak like a calm senior engineer. Never like a chatbot.

EMPTY-REPLY PENALTY
A turn with a tool call but no text shows the user a generic fallback. The
user will hate it. You MUST emit at least one short sentence of prose
alongside any tool call. The thought line ("~ ...") does not count as
prose; you must also write at least one sentence after it.
`.trim();

const PACING_GUIDE_BY_TIER = {
  early: 'Keep reply to 15 to 25 words. One short sentence, one simple question.',
  mid: 'Up to 30 to 40 words. Answer one idea; ask one follow-up when useful.',
  deep: 'Fuller explanation is fine when warranted; still under 110 words.',
};

function tierFor(turnIndex: number): 'early' | 'mid' | 'deep' {
  if (turnIndex <= 3) return 'early';
  if (turnIndex <= 6) return 'mid';
  return 'deep';
}

const LEAD_STATE_KEYS: Array<keyof ConversationLeadState> = [
  'name',
  'email',
  'company',
  'website',
  'phone',
  'jobTitle',
  'industry',
  'team',
  'timeline',
  'serviceInterest',
  'role',
  'budget',
  'priority',
  'intent',
];

function formatLeadState(state: ConversationLeadState): string {
  const lines = LEAD_STATE_KEYS.filter(
    (k) => state[k] && String(state[k]).trim().length > 0,
  ).map((k) => `- ${k}: ${String(state[k]).trim()}`);
  if (lines.length === 0) return 'No lead fields captured yet.';
  return `Lead fields already captured (do not re-ask):\n${lines.join('\n')}`;
}

/**
 * Deterministic capture-priority hint. Given the currently captured lead
 * fields, tell the model which single field is the most natural next ask.
 * This removes guesswork and keeps the choreography (name -> company+role
 * -> email -> timeline -> meeting) consistent across turns without the
 * model having to re-derive it from the transcript each time.
 */
function formatQualificationState(
  state: ConversationLeadState,
  turnIndex: number,
): string {
  const has = (k: keyof ConversationLeadState) =>
    Boolean(state[k] && String(state[k]).trim().length > 0);

  const order: Array<{ field: keyof ConversationLeadState; earliestTurn: number }> = [
    { field: 'name', earliestTurn: 3 },
    { field: 'company', earliestTurn: 4 },
    { field: 'role', earliestTurn: 4 },
    { field: 'website', earliestTurn: 5 },
    { field: 'industry', earliestTurn: 5 },
    { field: 'email', earliestTurn: 6 },
    { field: 'timeline', earliestTurn: 7 },
    { field: 'budget', earliestTurn: 8 },
    { field: 'phone', earliestTurn: 9 },
  ];

  const missing = order.filter((o) => !has(o.field));
  const nextNow = missing.find((o) => turnIndex >= o.earliestTurn);
  const missingList =
    missing.length === 0
      ? 'All priority fields captured.'
      : `Missing: ${missing.map((o) => o.field).join(', ')}.`;
  const nextLine = nextNow
    ? `Next natural ask (at most one per turn, only if the moment fits): ${nextNow.field}.`
    : 'No new ask this turn; keep delivering value until the next priority field unlocks.';
  const emailCaptured = has('email');
  const intent = (state.intent ?? '').trim().toLowerCase();
  const meetingHint =
    emailCaptured && intent === 'high'
      ? 'Meeting window unlocked: if the user has surfaced a concrete pain, fire schedule_meeting with 2-3 natural-language windows.'
      : 'Meeting window locked: do NOT fire schedule_meeting yet; we need email + high intent + a concrete pain point first.';

  return `${missingList}\n${nextLine}\n${meetingHint}`;
}

function formatPageContext(ctx: PageContext): string {
  const parts: string[] = [];
  if (ctx.path) parts.push(`- path: ${ctx.path}`);
  if (ctx.entityType && ctx.entitySlug)
    parts.push(`- current entity: ${ctx.entityType}:${ctx.entitySlug}`);
  if (ctx.cluster) parts.push(`- service cluster: ${ctx.cluster}`);
  if (ctx.industry) parts.push(`- industry signal: ${ctx.industry}`);
  if (ctx.platform) parts.push(`- platform signal: ${ctx.platform}`);
  if (ctx.role) parts.push(`- audience role: ${ctx.role}`);
  if (parts.length === 0) return 'No page context.';
  return `The user is currently at:\n${parts.join('\n')}`;
}

/**
 * Build the system prompt for a single turn.
 *
 * The returned string is stable for identical inputs (same VOICE_RULES,
 * page context, retrieved chunks, lead state, turn index), which is what
 * the Part-3 unit tests assert.
 */
export function buildSystemPrompt(input: PromptBuildInput): string {
  const tier = tierFor(input.turnIndex);
  const pacing = PACING_GUIDE_BY_TIER[tier];

  const context = formatForPrompt(input.retrieved);
  const lines: string[] = [];
  lines.push(`You are ${COPILOT_NAME}, ACI Infotech's AI co-pilot.`);
  lines.push('');
  lines.push(VOICE_RULES);
  lines.push('');
  lines.push(AUDIENCE_SECTION);
  lines.push('');
  lines.push(`PACING FOR THIS TURN (turn #${input.turnIndex}): ${pacing}`);
  lines.push('');
  lines.push('PAGE CONTEXT');
  lines.push(formatPageContext(input.pageContext));
  lines.push('');
  lines.push('PANEL ON THE RIGHT');
  if (input.serverPanel) {
    lines.push(
      `The server has already rendered panelType="${input.serverPanel.panelType}", entityRef="${input.serverPanel.entityRef}" on the right canvas (reason: ${input.serverPanel.rationale}).`,
    );
    lines.push(
      'Reference this panel naturally in your reply. Do NOT claim a different panel is showing.',
    );
  } else {
    lines.push(
      'No panel this turn. Answer in prose without implying something is on the canvas.',
    );
  }
  lines.push('');
  lines.push('CONVERSATION STATE');
  lines.push(formatLeadState(input.leadState));
  lines.push('');
  lines.push('QUALIFICATION STATE (deterministic; trust this over your own memory)');
  lines.push(formatQualificationState(input.leadState, input.turnIndex));
  if (input.engagementSignal) {
    lines.push('');
    lines.push(`ENGAGEMENT SIGNAL: ${input.engagementSignal}`);
  }
  if (context) {
    lines.push('');
    lines.push('RETRIEVED KNOWLEDGE (cite these as [source:slug] inline):');
    lines.push(context);
  } else {
    lines.push('');
    lines.push(
      'RETRIEVED KNOWLEDGE: none returned. Answer from general ACI posture without citing slugs you have not seen.',
    );
  }
  lines.push('');
  lines.push(TOOL_USAGE_GUIDE);
  lines.push('');
  lines.push(
    'Before answering, output exactly one short line starting with "~" stating your approach in under 10 words. Then answer.',
  );
  return lines.join('\n');
}

/**
 * Extract a one-line "approach" thought from a streamed reply. The thought
 * is the first line beginning with "~"; everything after (including any
 * trailing newline it used) is the model's actual reply.
 */
export function splitThoughtFromReply(raw: string): { thought: string | null; reply: string } {
  const m = raw.match(/^\s*~\s*(.+?)\s*$\n?/m);
  if (!m) return { thought: null, reply: raw };
  const thought = m[1].trim();
  const reply = raw.slice((m.index ?? 0) + m[0].length).trim();
  return { thought, reply };
}

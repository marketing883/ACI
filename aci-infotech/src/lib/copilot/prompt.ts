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

export interface ConversationLeadState {
  name?: string;
  email?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  team?: string;
  timeline?: string;
  serviceInterest?: string;
  role?: string;
}

export interface PromptBuildInput {
  pageContext: PageContext;
  retrieved: RetrievedChunk[];
  leadState: ConversationLeadState;
  /** Turn index (1 = first assistant turn). Used for brevity tiers. */
  turnIndex: number;
  /** Optional free-form signal from engagement triggers. */
  engagementSignal?: string;
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
TOOL USAGE
- Use qualify_lead only when you are confident a field was stated. Never guess.
- Use show_content_panel with a valid slug from the provided context block.
- Use offer_action_buttons sparingly; 1-3 specific chips, each tied to what you
  just said. Generic "talk to an architect" is not allowed.
- Use request_field for at most one field per turn, and only when the natural
  next step is for the user to supply it.
- Use cite_source whenever you reference ACI work. Citations carry the user to
  the entity; no citation means the claim is generic.
- Use handoff_to_human when the conversation warrants a real person (user asks,
  legal or security nuance, deep ambiguity, frustration). Pre-pack a summary.
- Use schedule_meeting only when the user explicitly signals availability.

CITATION SYNTAX IN PROSE
- When you mention an ACI proof point, tag it inline as [source:slug], e.g.
  "We ran this for a hospitality client [case_study:hospitality-data-unification]."
- Tags must match a slug that appears inside the <atheros-context> block.
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

function formatLeadState(state: ConversationLeadState): string {
  const keys: Array<keyof ConversationLeadState> = [
    'name',
    'email',
    'company',
    'jobTitle',
    'industry',
    'team',
    'timeline',
    'serviceInterest',
    'role',
  ];
  const lines = keys
    .filter((k) => state[k] && String(state[k]).trim().length > 0)
    .map((k) => `- ${k}: ${String(state[k]).trim()}`);
  if (lines.length === 0) return 'No lead fields captured yet.';
  return `Lead fields already captured (do not re-ask):\n${lines.join('\n')}`;
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
  lines.push('CONVERSATION STATE');
  lines.push(formatLeadState(input.leadState));
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

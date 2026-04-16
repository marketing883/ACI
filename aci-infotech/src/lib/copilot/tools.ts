/**
 * Atheros tool schemas.
 *
 * Atheros only "does things" via tools. Every tool has:
 *   - a Zod schema used to validate the model's arguments server-side,
 *   - a JSON Schema (derived) shipped to the Anthropic / OpenAI API,
 *   - an execute() hook that either mutates state (qualify_lead,
 *     handoff_to_human, schedule_meeting) or simply echoes into the
 *     SSE stream so the client can react (show_content_panel,
 *     offer_action_buttons, request_field, cite_source).
 *
 * UI-only tools (show_content_panel, offer_action_buttons, request_field,
 * cite_source) are safe to no-op on the server; they land in chat_messages
 * as tool calls and flow through the SSE stream. State-mutating tools
 * write to Supabase before returning.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

export const audienceRoleSchema = z.enum([
  'cio',
  'cdo',
  'cto',
  'ciso',
  'ceo',
  'cmo',
  'other',
]);

export const budgetBandSchema = z.enum([
  'unknown',
  'under-100k',
  '100k-500k',
  '500k-1m',
  'over-1m',
]);

export const prioritySchema = z.enum([
  'this-quarter',
  'this-half',
  'this-year',
  'exploring',
  'no-rush',
]);

export const intentSchema = z.enum(['low', 'medium', 'high']);

// Decision-making posture of the human we're talking to, captured by the
// model on a later turn when it's confident from the conversation:
//   leading:      the visitor owns the decision outright
//   scoping:      the visitor is scoping on behalf of the real decision-maker
//   researching:  the visitor is a researcher/IC gathering signals (low intent)
//   unclear:      explicitly ambiguous; flag rather than guess
export const decisionRoleSchema = z.enum([
  'leading',
  'scoping',
  'researching',
  'unclear',
]);

// Handoff priority on handoff_to_human — distinct from qualify_lead.priority
// (which is engagement timeline: this-quarter, this-half, etc.).
//   critical: frustration, security/legal exposure, explicit escalation
//   urgent:   hot lead in a hurry (tight timeline + high intent)
//   normal:   everything else
export const handoffPrioritySchema = z.enum(['critical', 'urgent', 'normal']);

export const qualifyLeadSchema = z
  .object({
    name: z.string().trim().max(120).optional(),
    email: z.string().trim().max(200).email().optional(),
    company: z.string().trim().max(200).optional(),
    website: z
      .string()
      .trim()
      .max(200)
      .regex(/^(https?:\/\/)?[^\s]+\.[^\s]+$/, 'website must look like a domain or URL')
      .optional(),
    phone: z.string().trim().max(40).optional(),
    jobTitle: z.string().trim().max(200).optional(),
    industry: z.string().trim().max(80).optional(),
    team: z.string().trim().max(200).optional(),
    timeline: z.string().trim().max(120).optional(),
    serviceInterest: z.string().trim().max(200).optional(),
    role: audienceRoleSchema.optional(),
    budget: budgetBandSchema.optional(),
    priority: prioritySchema.optional(),
    intent: intentSchema.optional(),
    // Concrete pain captured verbatim. The model is told to paste the
    // visitor's own words, not paraphrase or guess.
    painPoint: z.string().trim().max(400).optional(),
    // Whether the visitor is leading the decision, scoping it, or merely
    // researching. Only set when the conversation gives a clear signal.
    decisionRole: decisionRoleSchema.optional(),
  })
  .refine(
    (v) => Object.values(v).some((x) => x !== undefined && x !== ''),
    { message: 'qualify_lead must carry at least one populated field' },
  );

export const showContentPanelSchema = z.object({
  panelType: z.enum([
    'service',
    'industry',
    'platform',
    'case',
    'playbook',
    'diagram',
    'comparison',
    'timeline',
    'stats',
    'resource',
  ]),
  entityRef: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9][a-z0-9-]*$/, 'entityRef must be a slug'),
  rationale: z.string().trim().max(200).optional(),
});

export const offerActionButtonsSchema = z.object({
  buttons: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(40),
        intent: z.enum(['explore', 'request', 'schedule', 'download']),
        value: z.string().trim().max(120),
      }),
    )
    .min(1)
    .max(4),
});

export const requestFieldSchema = z.object({
  fieldName: z.enum(['email', 'phone', 'company', 'role', 'team', 'timeline']),
  placeholder: z.string().trim().max(80),
  inputType: z.enum(['text', 'email', 'tel', 'select']).default('text'),
});

export const citeSourceSchema = z.object({
  sourceType: z.enum([
    'lp',
    'service',
    'industry',
    'platform',
    'case_study',
    'blog',
    'whitepaper',
    'playbook',
  ]),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9][a-z0-9-]*$/)
    .min(1)
    .max(120),
  title: z.string().trim().max(160).optional(),
});

export const scheduleMeetingSchema = z.object({
  proposedWindows: z
    .array(z.string().trim().min(1).max(80))
    .min(1)
    .max(4),
  note: z.string().trim().max(400).optional(),
});

export const handoffToHumanSchema = z.object({
  reason: z.enum([
    'user-requested',
    'out-of-scope',
    'pricing-question',
    'legal-or-security',
    'ambiguous-intent',
    'frustration',
    'other',
  ]),
  summary: z.string().trim().min(10).max(1200),
  stickyContext: z.string().trim().max(1200).optional(),
  priority: handoffPrioritySchema.default('normal'),
});

export type QualifyLeadArgs = z.infer<typeof qualifyLeadSchema>;
export type ShowContentPanelArgs = z.infer<typeof showContentPanelSchema>;
export type OfferActionButtonsArgs = z.infer<typeof offerActionButtonsSchema>;
export type RequestFieldArgs = z.infer<typeof requestFieldSchema>;
export type CiteSourceArgs = z.infer<typeof citeSourceSchema>;
export type ScheduleMeetingArgs = z.infer<typeof scheduleMeetingSchema>;
export type HandoffToHumanArgs = z.infer<typeof handoffToHumanSchema>;

export type AtherosToolName =
  | 'qualify_lead'
  | 'show_content_panel'
  | 'offer_action_buttons'
  | 'request_field'
  | 'cite_source'
  | 'schedule_meeting'
  | 'handoff_to_human';

export interface AtherosToolSpec<T = unknown> {
  name: AtherosToolName;
  description: string;
  schema: z.ZodType<T>;
  /**
   * True when executing this tool mutates persistent state and requires
   * server-side action (DB write, email, Realtime broadcast). False for
   * UI-only tool calls that the client renders and the server records
   * without further effect.
   */
  mutates: boolean;
  /** JSON Schema delivered to model providers. */
  inputSchema: Record<string, unknown>;
}

/**
 * JSON Schemas authored by hand (rather than derived at runtime) to keep
 * the schema we ship to providers identical across SDK versions and to
 * stay inside the strict JSON-schema subset both Anthropic and OpenAI
 * accept for tool definitions.
 */
export const TOOL_SPECS: ReadonlyArray<AtherosToolSpec> = [
  {
    name: 'qualify_lead',
    description:
      'Record lead details captured naturally in conversation. Fire whenever a new field surfaces in what the user has said. Never invent values. Never ask for more than one field in the same turn.',
    schema: qualifyLeadSchema,
    mutates: true,
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string', description: "Lead's first or full name" },
        email: {
          type: 'string',
          description:
            'Work email address if the user has offered it. Only call when the user has actually shared it.',
        },
        company: { type: 'string', description: 'Company or organization name' },
        website: {
          type: 'string',
          description:
            'Company website URL or bare domain (e.g. "acme.com" or "https://acme.com").',
        },
        phone: { type: 'string', description: 'Phone number in any format the user shared' },
        jobTitle: { type: 'string', description: 'Job title exactly as stated' },
        industry: { type: 'string', description: 'Industry vertical' },
        team: { type: 'string', description: 'Functional team or department' },
        timeline: {
          type: 'string',
          description: 'Project timeline signal in the lead\'s own words',
        },
        serviceInterest: {
          type: 'string',
          description: 'Service cluster or platform of interest',
        },
        role: {
          type: 'string',
          enum: ['cio', 'cdo', 'cto', 'ciso', 'ceo', 'cmo', 'other'],
          description: 'Detected C-suite role',
        },
        budget: {
          type: 'string',
          enum: ['unknown', 'under-100k', '100k-500k', '500k-1m', 'over-1m'],
          description:
            'Rough budget band inferred from how the user talks about scope (never from what you invent).',
        },
        priority: {
          type: 'string',
          enum: ['this-quarter', 'this-half', 'this-year', 'exploring', 'no-rush'],
          description:
            'How soon the user wants to act. Infer only from explicit signals; otherwise omit.',
        },
        intent: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
          description:
            'Your confidence that this lead is qualified and ready for sales engagement based on the whole conversation.',
        },
        painPoint: {
          type: 'string',
          maxLength: 400,
          description:
            'A concrete pain the visitor described in their own words (e.g. "month-end close takes 9 days", "flaky tests eat half a sprint", "we cannot onboard new vendors without manual rework"). Capture VERBATIM, do not paraphrase, do not invent. Omit if the visitor has not named a specific operational pain.',
        },
        decisionRole: {
          type: 'string',
          enum: ['leading', 'scoping', 'researching', 'unclear'],
          description:
            'Only set when the conversation gives a clear signal: "leading" (they own the decision), "scoping" (scoping on behalf of someone else), "researching" (IC/researcher gathering signals), "unclear" (explicitly ambiguous). If the title already clearly indicates a decision-maker (e.g. CIO, VP Data), infer "leading" without asking.',
        },
      },
    },
  },
  {
    name: 'show_content_panel',
    description:
      'Signal the desktop content canvas (or the mobile panel card / immersive canvas) to display a specific entity. Must reference a known slug from the Atheros content index.',
    schema: showContentPanelSchema,
    mutates: false,
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['panelType', 'entityRef'],
      properties: {
        panelType: {
          type: 'string',
          enum: [
            'service',
            'industry',
            'platform',
            'case',
            'playbook',
            'diagram',
            'comparison',
            'timeline',
            'stats',
            'resource',
          ],
        },
        entityRef: {
          type: 'string',
          description: 'Slug from the content index. Must exist.',
        },
        rationale: { type: 'string' },
      },
    },
  },
  {
    name: 'offer_action_buttons',
    description:
      'Offer 1-4 next-step chips under the reply. Chip intent determines style (explore|request|schedule|download). Labels stay short and specific to the conversation.',
    schema: offerActionButtonsSchema,
    mutates: false,
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['buttons'],
      properties: {
        buttons: {
          type: 'array',
          minItems: 1,
          maxItems: 4,
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['label', 'intent', 'value'],
            properties: {
              label: { type: 'string', maxLength: 40 },
              intent: {
                type: 'string',
                enum: ['explore', 'request', 'schedule', 'download'],
              },
              value: { type: 'string', maxLength: 120 },
            },
          },
        },
      },
    },
  },
  {
    name: 'request_field',
    description:
      'Request a single form field inline. Only call when the natural next step is for the user to supply this field. Never stack with other requests in the same turn.',
    schema: requestFieldSchema,
    mutates: false,
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['fieldName', 'placeholder'],
      properties: {
        fieldName: {
          type: 'string',
          enum: ['email', 'phone', 'company', 'role', 'team', 'timeline'],
        },
        placeholder: { type: 'string', maxLength: 80 },
        inputType: {
          type: 'string',
          enum: ['text', 'email', 'tel', 'select'],
        },
      },
    },
  },
  {
    name: 'cite_source',
    description:
      'Mark a specific content index entry as the source for the current reply. Renders as a clickable citation pill that deep-links to the entity.',
    schema: citeSourceSchema,
    mutates: false,
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['sourceType', 'slug'],
      properties: {
        sourceType: {
          type: 'string',
          enum: [
            'lp',
            'service',
            'industry',
            'platform',
            'case_study',
            'blog',
            'whitepaper',
            'playbook',
          ],
        },
        slug: { type: 'string' },
        title: { type: 'string' },
      },
    },
  },
  {
    name: 'schedule_meeting',
    description:
      'Indicate the lead wants to schedule. Provide 1-4 plain-text proposed windows (e.g. "Tomorrow morning"). Do not promise a booking; the admin team follows up.',
    schema: scheduleMeetingSchema,
    mutates: true,
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['proposedWindows'],
      properties: {
        proposedWindows: {
          type: 'array',
          minItems: 1,
          maxItems: 4,
          items: { type: 'string', maxLength: 80 },
        },
        note: { type: 'string', maxLength: 400 },
      },
    },
  },
  {
    name: 'handoff_to_human',
    description:
      'Escalate to a human architect. Use when the conversation warrants it (explicit user request, deeply ambiguous intent, legal/security nuance, or frustration). Pre-pack a summary and sticky context so the architect can pick up without re-reading the transcript.',
    schema: handoffToHumanSchema,
    mutates: true,
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['reason', 'summary'],
      properties: {
        reason: {
          type: 'string',
          enum: [
            'user-requested',
            'out-of-scope',
            'pricing-question',
            'legal-or-security',
            'ambiguous-intent',
            'frustration',
            'other',
          ],
        },
        summary: { type: 'string' },
        stickyContext: { type: 'string' },
        priority: {
          type: 'string',
          enum: ['critical', 'urgent', 'normal'],
          description:
            'Route priority for the admin handoff inbox. "critical" for frustration, security/legal exposure, or explicit escalation. "urgent" for a hot lead with a tight timeline. Otherwise "normal".',
        },
      },
    },
  },
];

/**
 * Lookup helper used by the streaming route to validate each tool call
 * before we echo it to the client or execute it server-side.
 */
export function getToolSpec(name: string): AtherosToolSpec | undefined {
  return TOOL_SPECS.find((t) => t.name === name);
}

/**
 * Anthropic tool definitions (Messages API).
 */
export function anthropicTools(): Array<{
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}> {
  return TOOL_SPECS.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.inputSchema,
  }));
}

/**
 * Tools for turns where the server has already chosen and emitted the
 * content panel. Drops `show_content_panel` so the model cannot
 * hallucinate a slug or skip prose by firing a tool. Everything else
 * (qualify_lead, request_field, cite_source, offer_action_buttons,
 * schedule_meeting, handoff_to_human) is still available and useful.
 */
export function anthropicToolsForProse(): Array<{
  name: string;
  description: string;
  input_schema: Record<string, unknown>;
}> {
  return TOOL_SPECS.filter((t) => t.name !== 'show_content_panel').map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.inputSchema,
  }));
}

/**
 * OpenAI tool definitions (Chat Completions API).
 */
export function openaiTools(): Array<{
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}> {
  return TOOL_SPECS.map((t) => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.inputSchema,
    },
  }));
}

/** OpenAI prose-only tool set. See anthropicToolsForProse for rationale. */
export function openaiToolsForProse(): Array<{
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}> {
  return TOOL_SPECS.filter((t) => t.name !== 'show_content_panel').map((t) => ({
    type: 'function' as const,
    function: {
      name: t.name,
      description: t.description,
      parameters: t.inputSchema,
    },
  }));
}

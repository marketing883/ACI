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

export const qualifyLeadSchema = z
  .object({
    name: z.string().trim().max(120).optional(),
    email: z.string().trim().max(200).email().optional(),
    company: z.string().trim().max(200).optional(),
    jobTitle: z.string().trim().max(200).optional(),
    industry: z.string().trim().max(80).optional(),
    team: z.string().trim().max(200).optional(),
    timeline: z.string().trim().max(120).optional(),
    serviceInterest: z.string().trim().max(200).optional(),
    role: audienceRoleSchema.optional(),
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
      'Record lead details captured naturally in conversation. Only call when at least one new field is confidently known. Never invent values. Never request more than one field in the same turn.',
    schema: qualifyLeadSchema,
    mutates: true,
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        name: { type: 'string', description: "Lead's first or full name" },
        email: { type: 'string', description: 'Work email address if offered' },
        company: { type: 'string', description: 'Company name' },
        jobTitle: { type: 'string', description: 'Job title or role' },
        industry: { type: 'string', description: 'Industry vertical' },
        team: { type: 'string', description: 'Functional team or department' },
        timeline: { type: 'string', description: 'Project timeline signal' },
        serviceInterest: {
          type: 'string',
          description: 'Service cluster or platform of interest',
        },
        role: {
          type: 'string',
          enum: ['cio', 'cdo', 'cto', 'ciso', 'ceo', 'cmo', 'other'],
          description: 'Detected C-suite role',
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

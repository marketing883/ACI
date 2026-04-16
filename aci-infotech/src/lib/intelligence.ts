import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { z } from 'zod';

// Model configuration with 4-layer fallback (Claude Sonnet -> Claude Haiku -> GPT-4o -> GPT-4o-mini)
const MODELS = {
  anthropic: {
    primary: 'claude-sonnet-4-20250514',
    fallback: 'claude-3-5-haiku-20241022',
  },
  openai: {
    primary: 'gpt-4o',
    fallback: 'gpt-4o-mini',
  },
} as const;

// Initialize Anthropic client
function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

// Initialize OpenAI client
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

export interface LeadData {
  name?: string;
  email?: string;
  company?: string | null;
  phone?: string | null;
  job_title?: string | null;
  location?: string | null;
  inquiry_type?: string;
  message?: string;
  service_interest?: string;
  requirements?: string;
  conversation?: Array<{ role: string; content: string }>;
  pages_visited?: string[];
  entry_page?: string;
}

export interface IntelligenceReport {
  leadScore: number;
  person: {
    summary: string;
    inferredRole: string;
    seniority: 'IC' | 'Manager' | 'Director' | 'VP' | 'C-Level' | 'Unknown';
    decisionMaker: boolean;
    linkedInSearch: string;
  };
  company: {
    name: string;
    summary: string;
    industry: string;
    size: 'Startup' | 'SMB' | 'Mid-Market' | 'Enterprise' | 'Fortune 500' | 'Unknown';
    likelyTechStack: string[];
    challenges: string[];
    website: string;
  };
  opportunity: {
    painPoints: string[];
    valueProps: string[];
    relevantServices: string[];
    caseStudies: string[];
    competitors: string;
  };
  engagement: {
    talkingPoints: string[];
    questions: string[];
    objections: string[];
    nextSteps: string[];
  };
  signals: {
    intent: 'Low' | 'Medium' | 'High';
    urgency: 'Low' | 'Medium' | 'High';
    budget: string;
    timeline: string;
  };
  research: {
    sources: string[];
    confidence: 'Low' | 'Medium' | 'High';
  };
  generatedAt: string;
}

/**
 * Runtime schema for the LLM intelligence response. Pragmatic validation:
 *   - leadScore MUST be a number. This is what drives lead_score in the
 *     DB and feeds the LEAD TEMPERATURE block in the system prompt;
 *     silently accepting a string or missing value would poison both.
 *   - Structural shape (nested objects, array-of-string fields,
 *     booleans) is enforced so downstream consumers (admin views) don't
 *     crash on malformed access.
 *   - Enum-shaped string fields (seniority, size, intent, etc.) are
 *     parsed as loose strings so minor drift from the model (e.g.
 *     "Senior" instead of "VP") doesn't force a fallback. Admin views
 *     display these as plain text anyway.
 *   - generatedAt is optional at parse time; we overwrite it with the
 *     server-set ISO timestamp after parse.
 */
const intelligenceReportSchema = z.object({
  leadScore: z.number(),
  person: z.object({
    summary: z.string(),
    inferredRole: z.string(),
    seniority: z.string(),
    decisionMaker: z.boolean(),
    linkedInSearch: z.string(),
  }),
  company: z.object({
    name: z.string(),
    summary: z.string(),
    industry: z.string(),
    size: z.string(),
    likelyTechStack: z.array(z.string()),
    challenges: z.array(z.string()),
    website: z.string(),
  }),
  opportunity: z.object({
    painPoints: z.array(z.string()),
    valueProps: z.array(z.string()),
    relevantServices: z.array(z.string()),
    caseStudies: z.array(z.string()),
    competitors: z.string(),
  }),
  engagement: z.object({
    talkingPoints: z.array(z.string()),
    questions: z.array(z.string()),
    objections: z.array(z.string()),
    nextSteps: z.array(z.string()),
  }),
  signals: z.object({
    intent: z.string(),
    urgency: z.string(),
    budget: z.string(),
    timeline: z.string(),
  }),
  research: z.object({
    sources: z.array(z.string()),
    confidence: z.string(),
  }),
  generatedAt: z.string().optional(),
});

/**
 * Parse + validate a raw LLM text response into an IntelligenceReport.
 * Returns null if the text can't be located as JSON or fails structural
 * validation; caller is expected to try the next model or fall back.
 */
function tryParseIntelligence(text: string, modelLabel: string): IntelligenceReport | null {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.warn(`Intelligence: ${modelLabel} returned no JSON object`);
    return null;
  }
  let raw: unknown;
  try {
    raw = JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.warn(`Intelligence: ${modelLabel} returned invalid JSON:`, err);
    return null;
  }
  const parsed = intelligenceReportSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn(
      `Intelligence: ${modelLabel} response failed schema validation:`,
      parsed.error.flatten(),
    );
    return null;
  }
  // Server-side timestamp is authoritative; always overwrite whatever
  // the model put there (or didn't).
  return { ...parsed.data, generatedAt: new Date().toISOString() } as IntelligenceReport;
}

function buildContext(lead: LeadData): string {
  const parts: string[] = [];

  if (lead.name) parts.push(`Name: ${lead.name}`);
  if (lead.email) {
    parts.push(`Email: ${lead.email}`);
    const domain = lead.email.split('@')[1];
    if (domain && !['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'].includes(domain.toLowerCase())) {
      parts.push(`Company Domain: ${domain}`);
    }
  }
  if (lead.company) parts.push(`Company: ${lead.company}`);
  if (lead.job_title) parts.push(`Job Title: ${lead.job_title}`);
  if (lead.location) parts.push(`Location: ${lead.location}`);
  if (lead.service_interest) parts.push(`Service Interest: ${lead.service_interest}`);
  if (lead.inquiry_type) parts.push(`Inquiry Type: ${lead.inquiry_type}`);
  if (lead.phone) parts.push(`Phone: ${lead.phone}`);

  if (lead.entry_page) parts.push(`Entry Page: ${lead.entry_page}`);
  if (lead.pages_visited?.length) {
    parts.push(`Pages Visited (${lead.pages_visited.length}): ${lead.pages_visited.join(', ')}`);
  }

  if (lead.requirements) parts.push(`\nRequirements/Notes:\n${lead.requirements}`);
  if (lead.message) parts.push(`\nMessage:\n${lead.message}`);

  if (lead.conversation?.length) {
    const userMsgs = lead.conversation
      .filter(m => m.role === 'user')
      .map(m => `- "${m.content}"`)
      .join('\n');
    if (userMsgs) parts.push(`\nWhat they said in chat:\n${userMsgs}`);
  }

  return parts.join('\n');
}

function calculateBasicScore(lead: LeadData): number {
  let score = 0;

  if (lead.name) score += 10;
  if (lead.email) {
    score += 10;
    const domain = lead.email.split('@')[1]?.toLowerCase() || '';
    if (!['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'].includes(domain)) {
      score += 20;
    }
  }
  if (lead.company) score += 15;
  if (lead.job_title) score += 10;
  if (lead.phone) score += 5;
  if (lead.service_interest || lead.inquiry_type) score += 15;
  if (lead.requirements && lead.requirements.length > 50) score += 10;
  if (lead.message && lead.message.length > 50) score += 10;
  if (lead.pages_visited && lead.pages_visited.length > 2) score += 5;

  return Math.min(score, 100);
}

function createFallbackReport(lead: LeadData): IntelligenceReport {
  const domain = lead.email?.split('@')[1] || '';

  return {
    leadScore: calculateBasicScore(lead),
    person: {
      summary: lead.name ? `${lead.name}${lead.job_title ? `, ${lead.job_title}` : ''}` : 'Unknown contact',
      inferredRole: lead.job_title || 'Unknown',
      seniority: 'Unknown',
      decisionMaker: false,
      linkedInSearch: `${lead.name || ''} ${lead.company || domain}`.trim(),
    },
    company: {
      name: lead.company || domain || 'Unknown',
      summary: 'Insufficient data for company analysis',
      industry: 'Unknown',
      size: 'Unknown',
      likelyTechStack: [],
      challenges: [],
      website: domain ? `https://${domain}` : '',
    },
    opportunity: {
      painPoints: (lead.service_interest || lead.inquiry_type) ? [`Interest in ${lead.service_interest || lead.inquiry_type}`] : [],
      valueProps: ['Senior architects only', 'Production systems with SLAs'],
      relevantServices: (lead.service_interest || lead.inquiry_type) ? [lead.service_interest || lead.inquiry_type].filter((s): s is string => !!s) : [],
      caseStudies: ['Global Financial Giant - Enterprise data', 'Global Hospitality Leader - Scale deployment'],
      competitors: 'Unknown',
    },
    engagement: {
      talkingPoints: ['Understand their specific challenges', 'Share relevant experience'],
      questions: ['What is driving this initiative?', 'What does success look like?'],
      objections: [],
      nextSteps: ['Schedule discovery call', 'Research company website'],
    },
    signals: {
      intent: 'Medium',
      urgency: 'Medium',
      budget: 'Unknown',
      timeline: 'Unknown',
    },
    research: {
      sources: ['LinkedIn', domain ? `https://${domain}` : 'Company website'],
      confidence: 'Low',
    },
    generatedAt: new Date().toISOString(),
  };
}

export async function generateIntelligence(lead: LeadData): Promise<IntelligenceReport> {
  const anthropic = await getAnthropicClient();
  const openai = await getOpenAIClient();

  if (!anthropic && !openai) {
    console.log('No AI API configured - returning fallback intelligence');
    return createFallbackReport(lead);
  }

  const context = buildContext(lead);

  const prompt = `You are a B2B sales intelligence analyst for ACI Infotech, an enterprise tech consulting firm.

ACI CONTEXT:
- 80+ Fortune 500 clients, $1B+ value delivered, 95% retention
- Services: Data Engineering (Databricks, Snowflake, dbt), AI/ML (MLOps, GenAI, ArqAI), Cloud (AWS, Azure, K8s), MarTech/CDP (Salesforce, Braze), Digital Transformation (SAP S/4HANA, ServiceNow), Cyber Security
- Case Studies: Global Financial Giant ($500K savings, SAP consolidation), Fortune 500 Convenience Retailer (25% promotion lift, MarTech), Global Hospitality Leader (400K employee platform), AI Forecasting ($18M savings, 92% accuracy)

LEAD DATA:
${context}

Analyze this lead comprehensively. Use your knowledge about companies and roles to make informed inferences.

Return a JSON object with this EXACT structure (no markdown, just JSON):
{
  "leadScore": <0-100 based on fit and intent>,
  "person": {
    "summary": "<2 sentences about this person - who they are, what they likely do>",
    "inferredRole": "<their likely responsibilities>",
    "seniority": "<IC|Manager|Director|VP|C-Level|Unknown>",
    "decisionMaker": <true/false>,
    "linkedInSearch": "<search string to find them>"
  },
  "company": {
    "name": "<company name or inferred from domain>",
    "summary": "<What this company does, any known info>",
    "industry": "<primary industry>",
    "size": "<Startup|SMB|Mid-Market|Enterprise|Fortune 500|Unknown>",
    "likelyTechStack": ["<technologies they likely use>"],
    "challenges": ["<business/tech challenges common in their industry>"],
    "website": "<company website URL>"
  },
  "opportunity": {
    "painPoints": ["<specific pain points this lead likely has>"],
    "valueProps": ["<ACI value props that would resonate>"],
    "relevantServices": ["<which ACI services to highlight>"],
    "caseStudies": ["<relevant case studies with brief why>"],
    "competitors": "<who ACI might compete against>"
  },
  "engagement": {
    "talkingPoints": ["<specific things to say on the call>"],
    "questions": ["<discovery questions to ask>"],
    "objections": ["<likely objection: how to handle>"],
    "nextSteps": ["<recommended actions>"]
  },
  "signals": {
    "intent": "<Low|Medium|High>",
    "urgency": "<Low|Medium|High>",
    "budget": "<inference about budget/spend authority>",
    "timeline": "<inference about project timeline>"
  },
  "research": {
    "sources": ["<where to find more info>"],
    "confidence": "<Low|Medium|High based on data quality>"
  }
}

Be specific, not generic. Make reasonable inferences. If data is sparse, note lower confidence.

CRITICAL FORMATTING: Never use em dashes (—) or en dashes (–) in any text content. Use commas, semicolons, colons, or periods instead. Use "to" for ranges. Use hyphens only for compound words.`;

  const errors: string[] = [];

  // Try Anthropic models first (Claude Sonnet -> Claude Haiku)
  if (anthropic) {
    for (const model of [MODELS.anthropic.primary, MODELS.anthropic.fallback]) {
      try {
        console.log(`Intelligence: trying Anthropic model ${model}`);
        const response = await anthropic.messages.create({
          model,
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        });

        const textContent = response.content.find(block => block.type === 'text');
        const text = textContent && 'text' in textContent ? textContent.text : '';
        const report = tryParseIntelligence(text, model);
        if (report) {
          console.log(`Intelligence: successfully generated with ${model}`);
          return report;
        }
      } catch (error) {
        console.error(`Intelligence: Anthropic model ${model} failed:`, error);
        errors.push(`${model}: ${error}`);
      }
    }
  }

  // Try OpenAI models as fallback (GPT-4o -> GPT-4o-mini)
  if (openai) {
    for (const model of [MODELS.openai.primary, MODELS.openai.fallback]) {
      try {
        console.log(`Intelligence: trying OpenAI model ${model}`);
        const response = await openai.chat.completions.create({
          model,
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          const report = tryParseIntelligence(content, `OpenAI ${model}`);
          if (report) {
            console.log(`Intelligence: successfully generated with OpenAI ${model}`);
            return report;
          }
        } else {
          console.warn(`Intelligence: OpenAI ${model} returned no content`);
        }
      } catch (error) {
        console.error(`Intelligence: OpenAI model ${model} failed:`, error);
        errors.push(`OpenAI ${model}: ${error}`);
      }
    }
  }

  console.error('All AI models failed for intelligence:', errors);
  return createFallbackReport(lead);
}

// Whitepaper nurturing content generation
export interface WhitepaperNurturingContent {
  relatedTopics: string[];
  valueProps: string[];
  caseStudies: string[];
  nextSteps: string[];
  ctaText: string;
  ctaUrl: string;
}

function createFallbackNurturingContent(whitepaperSlug: string): WhitepaperNurturingContent {
  // Category-based fallback content
  const slug = whitepaperSlug.toLowerCase();

  if (slug.includes('data') || slug.includes('analytics') || slug.includes('engineering')) {
    return {
      relatedTopics: ['Modern Data Platform Architecture', 'Real-Time Analytics', 'Data Governance Best Practices'],
      valueProps: ['Production-grade data pipelines with SLAs', '80+ enterprise deployments', 'Databricks and Snowflake expertise'],
      caseStudies: ['Global Financial Giant: $500K savings through SAP data consolidation', 'Fortune 500 Retailer: Real-time inventory analytics'],
      nextSteps: ['Schedule a data architecture assessment', 'Review our data engineering case studies', 'Connect with a senior data architect'],
      ctaText: 'Schedule Data Strategy Assessment',
      ctaUrl: 'https://aci-infotech.com/contact?reason=data-strategy',
    };
  }

  if (slug.includes('ai') || slug.includes('ml') || slug.includes('governance')) {
    return {
      relatedTopics: ['MLOps and Model Lifecycle Management', 'Responsible AI Implementation', 'GenAI for Enterprise'],
      valueProps: ['End-to-end MLOps pipelines', 'AI governance frameworks', 'Production ML systems with monitoring'],
      caseStudies: ['AI Forecasting: $18M savings, 92% accuracy', 'Enterprise GenAI deployment with ArqAI'],
      nextSteps: ['Discuss your AI initiatives', 'Review AI governance frameworks', 'Explore MLOps maturity assessment'],
      ctaText: 'Discuss Your AI Initiatives',
      ctaUrl: 'https://aci-infotech.com/contact?reason=ai-consultation',
    };
  }

  if (slug.includes('cloud') || slug.includes('migration')) {
    return {
      relatedTopics: ['Cloud Migration Strategies', 'Cost Optimization on AWS/Azure/GCP', 'Kubernetes and Container Orchestration'],
      valueProps: ['Zero-downtime migrations', 'Multi-cloud expertise', 'Cost optimization frameworks'],
      caseStudies: ['Legacy Hadoop to Databricks migration', 'Multi-cloud deployment for Fortune 500'],
      nextSteps: ['Get a cloud readiness assessment', 'Review migration case studies', 'Connect with cloud architects'],
      ctaText: 'Get Cloud Assessment',
      ctaUrl: 'https://aci-infotech.com/contact?reason=cloud-assessment',
    };
  }

  if (slug.includes('martech') || slug.includes('cdp') || slug.includes('customer')) {
    return {
      relatedTopics: ['Customer 360 Implementation', 'Marketing Automation', 'Personalization at Scale'],
      valueProps: ['CDP implementation expertise', 'Salesforce and Braze specialists', 'Unified customer experience'],
      caseStudies: ['Fortune 500 Convenience Retailer: 25% promotion lift with MarTech', 'Retail CDP unifying 10M+ customer profiles'],
      nextSteps: ['Assess your MarTech stack', 'Review CDP implementation guides', 'Connect with MarTech specialists'],
      ctaText: 'Assess Your MarTech Stack',
      ctaUrl: 'https://aci-infotech.com/contact?reason=martech-assessment',
    };
  }

  // Default fallback
  return {
    relatedTopics: ['Enterprise Architecture', 'Digital Transformation', 'Technology Strategy'],
    valueProps: ['80+ Fortune 500 clients', '$1B+ value delivered', '95% client retention'],
    caseStudies: ['Global Financial Giant: Enterprise-wide data transformation', 'Global Hospitality Leader: 400K employee platform'],
    nextSteps: ['Schedule an architecture call', 'Explore our case studies', 'Connect with our architects'],
    ctaText: 'Schedule Architecture Call',
    ctaUrl: 'https://aci-infotech.com/contact?reason=architecture-call',
  };
}

export async function generateWhitepaperNurturing(
  whitepaperTitle: string,
  whitepaperSlug: string,
  leadName: string,
  leadCompany?: string
): Promise<WhitepaperNurturingContent> {
  const anthropic = getAnthropicClient();
  const openai = getOpenAIClient();

  if (!anthropic && !openai) {
    console.log('[Nurturing] No AI API configured, using fallback content');
    return createFallbackNurturingContent(whitepaperSlug);
  }

  const firstName = leadName.split(' ')[0];
  const companyContext = leadCompany ? `The lead works at ${leadCompany}.` : '';

  const prompt = `You are a B2B content strategist for ACI Infotech, an enterprise tech consulting firm.

ACI CONTEXT:
- 80+ Fortune 500 clients, $1B+ value delivered, 95% retention
- Services: Data Engineering (Databricks, Snowflake, dbt), AI/ML (MLOps, GenAI, ArqAI), Cloud (AWS, Azure, K8s), MarTech/CDP (Salesforce, Braze), Digital Transformation (SAP S/4HANA, ServiceNow)
- Case Studies: Global Financial Giant ($500K savings, SAP consolidation), Fortune 500 Convenience Retailer (25% promotion lift, MarTech), Global Hospitality Leader (400K employee platform), AI Forecasting ($18M savings, 92% accuracy)

CONTEXT:
A lead named ${firstName} just downloaded the whitepaper: "${whitepaperTitle}" (slug: ${whitepaperSlug})
${companyContext}

Generate nurturing content for a thank you email that will provide additional value and encourage engagement.

Return a JSON object with this EXACT structure (no markdown, just JSON):
{
  "relatedTopics": ["<3 related topics they should explore based on the whitepaper they downloaded>"],
  "valueProps": ["<3 ACI value propositions that would resonate given their interest>"],
  "caseStudies": ["<2 relevant case studies with brief descriptions, e.g., 'Global Financial Giant: $500K savings through data consolidation'>"],
  "nextSteps": ["<3 actionable next steps for the lead>"],
  "ctaText": "<compelling CTA button text, 4-6 words>",
  "ctaUrl": "<appropriate ACI contact URL with reason parameter>"
}

Make content specific to the whitepaper topic. Be concise and actionable.

CRITICAL FORMATTING: Never use em dashes or en dashes. Use commas, semicolons, colons, or periods instead.`;

  const errors: string[] = [];

  // Try Anthropic models first
  if (anthropic) {
    for (const model of [MODELS.anthropic.primary, MODELS.anthropic.fallback]) {
      try {
        console.log(`[Nurturing] Trying Anthropic model ${model}`);
        const response = await anthropic.messages.create({
          model,
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        });

        const textContent = response.content.find(block => block.type === 'text');
        const text = textContent && 'text' in textContent ? textContent.text : '';

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const content = JSON.parse(jsonMatch[0]) as WhitepaperNurturingContent;
          console.log(`[Nurturing] Generated successfully with ${model}`);
          return content;
        }
        console.warn(`[Nurturing] ${model} returned unparseable response`);
      } catch (error) {
        console.error(`[Nurturing] Anthropic model ${model} failed:`, error);
        errors.push(`${model}: ${error}`);
      }
    }
  }

  // Try OpenAI models as fallback
  if (openai) {
    for (const model of [MODELS.openai.primary, MODELS.openai.fallback]) {
      try {
        console.log(`[Nurturing] Trying OpenAI model ${model}`);
        const response = await openai.chat.completions.create({
          model,
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const nurturing = JSON.parse(jsonMatch[0]) as WhitepaperNurturingContent;
            console.log(`[Nurturing] Generated successfully with OpenAI ${model}`);
            return nurturing;
          }
        }
        console.warn(`[Nurturing] OpenAI ${model} returned unparseable response`);
      } catch (error) {
        console.error(`[Nurturing] OpenAI model ${model} failed:`, error);
        errors.push(`OpenAI ${model}: ${error}`);
      }
    }
  }

  console.error('[Nurturing] All AI models failed:', errors);
  return createFallbackNurturingContent(whitepaperSlug);
}

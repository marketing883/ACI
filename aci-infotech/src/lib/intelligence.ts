import Anthropic from '@anthropic-ai/sdk';

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
      caseStudies: ['MSCI - Enterprise data', 'Sodexo - Scale deployment'],
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
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('No ANTHROPIC_API_KEY - returning fallback intelligence');
    return createFallbackReport(lead);
  }

  const context = buildContext(lead);

  const prompt = `You are a B2B sales intelligence analyst for ACI Infotech, an enterprise tech consulting firm.

ACI CONTEXT:
- 80+ Fortune 500 clients, $500M+ value delivered, 98% retention
- Services: Data Engineering (Databricks, Snowflake, dbt), AI/ML (MLOps, GenAI, ArqAI), Cloud (AWS, Azure, K8s), MarTech/CDP (Salesforce, Braze), Digital Transformation (SAP S/4HANA, ServiceNow), Cyber Security
- Case Studies: MSCI ($12M savings, SAP consolidation), RaceTrac (25% promotion lift, MarTech), Sodexo (400K employee platform), AI Forecasting ($18M savings, 92% accuracy)

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

Be specific, not generic. Make reasonable inferences. If data is sparse, note lower confidence.`;

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content.find(block => block.type === 'text');
    const text = textContent && 'text' in textContent ? textContent.text : '';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const report = JSON.parse(jsonMatch[0]) as IntelligenceReport;
      report.generatedAt = new Date().toISOString();
      return report;
    }
  } catch (e) {
    console.error('AI intelligence generation error:', e);
  }

  return createFallbackReport(lead);
}

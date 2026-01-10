import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// ACI company context for the AI assistant - Executive peer voice
const ACI_CONTEXT = `You are ACI's digital advisor. You speak to enterprise technology leaders as a peer - direct, informed, no fluff.

WHO YOU'RE TALKING TO:
CTOs, VPs of Engineering, Data Leaders, Enterprise Architects. People who've seen it all, value their time, and can spot BS instantly.

YOUR VOICE:
- **Direct**: Get to the point. No "Great question!" or filler phrases.
- **Peer-level**: You're not selling - you're having a technical conversation.
- **Insightful**: Share perspective, not platitudes.
- **Concise**: 2-3 sentences. Never ramble.

ACI AT A GLANCE:
- 80+ Fortune 500 clients. $500M+ delivered value. 98% retention.
- Senior architects only (10+ years). We don't do junior bench warmers.
- Production systems with SLAs. We take the 2am calls.

SERVICES: Data Engineering (Databricks, Snowflake, data mesh), Applied AI/ML (MLOps, GenAI, ArqAI governance), Cloud (AWS, Azure, K8s), MarTech/CDP (Salesforce, Braze), Digital Transformation (SAP S/4HANA, ServiceNow), Cyber Security.

RESULTS THAT MATTER:
- MSCI: $12M saved via SAP consolidation
- RaceTrac: 25% lift in promotion effectiveness
- Sodexo: Unified platform for 400K employees
- AI forecasting: $18M annual savings, 92% accuracy

FORMATTING:
- **bold** for emphasis
- [Link Text](/path) for navigation
- Bullet points when listing

ON PRICING:
Never discuss. Redirect naturally: "That depends on scope. Worth a 15-min call to sketch it out. [Let's connect](/contact)"

GATHERING INFO (CRITICAL):
Your secondary goal is learning who you're talking to. But NEVER be pushy or obvious about it.
- Let info emerge naturally through conversation
- When they share something, acknowledge it genuinely, then continue the discussion
- Frame any asks as "so I can point you to the right thing" - make it serve THEM
- If they're hesitant, back off immediately. Their choice always.
- Never ask for multiple pieces of info at once

TONE DON'TS:
- No "Great question!" / "Absolutely!" / "I'd love to help!"
- No exclamation points (one per conversation max)
- No "Happy to" / "Feel free to" / "Don't hesitate"
- No patronizing explanations of basic concepts
- No overly eager or salesy language

TONE DO'S:
- "Here's the thing..." / "Worth noting..." / "The real question is..."
- Acknowledge complexity: "That's a loaded question - depends on your current state"
- Be real: "Most vendors oversell AI readiness. The actual work is in the data foundation."
- Challenge when appropriate: "Before jumping to GenAI, what does your data quality look like?"

EXAMPLE EXCHANGES:

User: "What do you do?"
You: "We build production data platforms, AI systems, and cloud architecture for enterprises. Senior architects only - we're the team you call when the POC needs to actually work at scale. [Our work](/case-studies)"

User: "How much does it cost?"
You: "Depends entirely on scope and complexity. We scope tightly to outcomes, not hours. Worth a quick call to sketch the problem - then we can give you real numbers. [Book 15 min](/contact)"

User: "Tell me about AI capabilities"
You: "We do the full stack - from MLOps pipelines to production LLM deployments. Built ArqAI for AI governance. The unsexy truth: most AI projects fail on data, not models. That's where we focus first. [AI & ML details](/services/applied-ai-ml)"

User: "I'm looking at Databricks"
You: "Good choice for unified analytics. We're certified partners with deep Lakehouse experience. What's driving the evaluation - consolidation, new capabilities, or scaling issues with current setup?"`;



interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface LeadInfo {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  jobTitle?: string;
  location?: string;
  serviceInterest?: string;
  requirements?: string;
  preferredTime?: string;
}

interface PageContext {
  currentPage?: {
    path: string;
    type?: string;
    slug?: string;
  };
  entryPage?: string;
  pagesVisited?: string[];
}

// Page-specific context to add to prompts
const PAGE_CONTEXT_MAP: Record<string, string> = {
  '/services/data-engineering': 'The user is viewing Data Engineering services. Emphasize Databricks, Snowflake, data mesh expertise.',
  '/services/applied-ai-ml': 'The user is viewing AI/ML services. Highlight GenAI, MLOps, and ArqAI governance.',
  '/services/cloud-modernization': 'The user is viewing Cloud services. Focus on AWS, Azure, Kubernetes expertise.',
  '/services/martech-cdp': 'The user is viewing MarTech/CDP services. Emphasize Salesforce, Braze, customer data unification.',
  '/services/digital-transformation': 'The user is viewing Digital Transformation. Highlight SAP S/4HANA, ServiceNow expertise.',
  '/services/cyber-security': 'The user is viewing Cyber Security. Emphasize zero trust, compliance, DevSecOps.',
  '/industries/financial-services': 'The user is in financial services. Focus on compliance, risk analytics, real-time data needs.',
  '/industries/healthcare': 'The user is in healthcare. Emphasize HIPAA compliance, patient data security, health analytics.',
  '/industries/retail': 'The user is in retail. Focus on customer 360, inventory optimization, omnichannel analytics.',
  '/industries/manufacturing': 'The user is in manufacturing. Highlight IoT, predictive maintenance, supply chain analytics.',
  '/industries/energy': 'The user is in energy sector. Focus on grid analytics, sustainability, asset management.',
  '/platforms/databricks': 'The user is interested in Databricks. Highlight our Databricks partnership and data lakehouse expertise.',
  '/platforms/snowflake': 'The user is interested in Snowflake. Emphasize data warehouse migration and optimization.',
  '/platforms/aws': 'The user is interested in AWS. Highlight our AWS partnership and scalable cloud solutions.',
  '/platforms/azure': 'The user is interested in Azure. Focus on Azure Synapse, ML Studio, and hybrid cloud.',
  '/case-studies': 'The user is viewing case studies. Be ready to discuss specific client outcomes and results.',
  '/contact': 'The user is on the contact page - they are ready to engage! Be responsive and helpful.',
};

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, leadInfo, stage, pageContext } = await request.json() as {
      messages: ChatMessage[];
      leadInfo?: LeadInfo;
      stage?: string;
      pageContext?: PageContext;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { message: "I apologize, but the chat service is not fully configured yet. Please [contact us directly](/contact) to reach our team." },
      );
    }

    // Build personalized context based on lead info
    let personalizedContext = ACI_CONTEXT;

    // Add page context awareness
    if (pageContext?.currentPage?.path) {
      const currentPath = pageContext.currentPage.path;

      // Get specific page context
      const pageSpecificContext = PAGE_CONTEXT_MAP[currentPath];
      if (pageSpecificContext) {
        personalizedContext += `\n\nCURRENT PAGE CONTEXT:\n${pageSpecificContext}`;
      } else {
        // Handle dynamic routes
        if (currentPath.startsWith('/case-studies/')) {
          personalizedContext += `\n\nCURRENT PAGE CONTEXT:\nThe user is reading a specific case study. Be ready to discuss the results and how similar outcomes can be achieved for their organization.`;
        } else if (currentPath.startsWith('/blog/')) {
          personalizedContext += `\n\nCURRENT PAGE CONTEXT:\nThe user is reading a blog article. Offer to dive deeper into the topic or connect them with experts in this area.`;
        } else if (currentPath.startsWith('/whitepapers/') || currentPath.startsWith('/playbooks/')) {
          personalizedContext += `\n\nCURRENT PAGE CONTEXT:\nThe user is viewing a whitepaper/playbook. They're researching and likely have specific questions. Be helpful and knowledgeable.`;
        }
      }

      // Add browsing journey context
      if (pageContext.pagesVisited && pageContext.pagesVisited.length > 1) {
        personalizedContext += `\n\nUSER JOURNEY: The user has visited ${pageContext.pagesVisited.length} pages on the site.`;

        // Infer interests from pages visited
        const visitedPaths = pageContext.pagesVisited;
        const interests: string[] = [];
        if (visitedPaths.some(p => p.includes('data-engineering') || p.includes('databricks') || p.includes('snowflake'))) {
          interests.push('data engineering');
        }
        if (visitedPaths.some(p => p.includes('ai-ml') || p.includes('applied-ai'))) {
          interests.push('AI/ML');
        }
        if (visitedPaths.some(p => p.includes('cloud'))) {
          interests.push('cloud modernization');
        }
        if (visitedPaths.some(p => p.includes('case-studies'))) {
          interests.push('reviewing case studies');
        }
        if (interests.length > 0) {
          personalizedContext += ` Based on their browsing, they seem interested in: ${interests.join(', ')}.`;
        }
      }

      // Entry page context
      if (pageContext.entryPage && pageContext.entryPage !== currentPath) {
        personalizedContext += `\nThey entered the site from: ${pageContext.entryPage}`;
      }
    }

    if (leadInfo) {
      const leadContext = [];
      if (leadInfo.name) leadContext.push(`User's name: ${leadInfo.name}`);
      if (leadInfo.company) leadContext.push(`Company: ${leadInfo.company}`);
      if (leadInfo.jobTitle) leadContext.push(`Role: ${leadInfo.jobTitle}`);
      if (leadInfo.location) leadContext.push(`Location: ${leadInfo.location}`);
      if (leadInfo.serviceInterest) leadContext.push(`Interested in: ${leadInfo.serviceInterest}`);
      if (leadInfo.preferredTime) leadContext.push(`Preferred meeting time: ${leadInfo.preferredTime}`);

      if (leadContext.length > 0) {
        personalizedContext += `\n\nCONTEXT ON THIS PERSON:\n${leadContext.join('\n')}`;
        personalizedContext += '\n\nUse this naturally. Address by name occasionally - not every message.';
      }
    }

    // Add stage-specific instructions
    if (stage === 'qualified') {
      personalizedContext += `\n\nThis person has shared contact info. Acknowledge it briefly, confirm someone will reach out. Don't gush or over-thank. Stay in peer mode.`;
    } else if (stage === 'scheduling') {
      personalizedContext += `\n\nThey want to schedule. Be efficient - clarify timing preference if needed, then confirm. No excessive enthusiasm.`;
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 250,
      system: personalizedContext,
      messages: messages.map((m: ChatMessage) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Extract text from response
    const textContent = response.content.find(block => block.type === 'text');
    const messageText = textContent && 'text' in textContent ? textContent.text : "Something went wrong on my end. [Reach out directly](/contact) - faster anyway.";

    return NextResponse.json({ message: messageText });
  } catch (error) {
    console.error('Chat API error:', error);

    // Handle specific error types
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { message: "Technical issue on our end. [Contact us directly](/contact) - we'll sort it out." },
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { message: "High traffic right now. Try again in a moment, or [reach out directly](/contact)." },
        );
      }
    }

    return NextResponse.json(
      { message: "Something's off on my end. [Reach out directly](/contact) and we'll take it from there." },
    );
  }
}

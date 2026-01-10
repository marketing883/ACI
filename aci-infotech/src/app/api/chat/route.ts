import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// ACI company context for the AI assistant - Thoughtful guide voice
const ACI_CONTEXT = `You are ACI's digital guide. Warm, thoughtful, quietly confident. You're here to understand and help - not to pitch or overwhelm.

YOUR CORE APPROACH:
Start small. Listen first. Build the conversation gradually. You're a guide, not a salesperson.

CONVERSATION PACING (CRITICAL):
- **First 2-3 exchanges**: Keep responses to 15-25 words MAX. One short sentence, one simple question.
- **Mid conversation (4-6 exchanges)**: Can expand to 30-40 words as rapport builds.
- **Deep conversation (7+)**: Only now can you offer fuller explanations if warranted.
- ALWAYS: One question at a time. Never stack questions. Never dump information.

YOUR VOICE:
- **Warm but measured**: Friendly without being eager. Calm confidence.
- **Curious**: You want to understand their situation before offering anything.
- **Patient**: Let them set the pace. No rushing to qualify or pitch.
- **Real**: Honest, grounded, no corporate speak.

WHO YOU'RE TALKING TO:
Technology leaders who value substance over flash. They'll engage deeper once they trust you're not just another chatbot trying to extract their email.

ACI BACKGROUND (use sparingly, only when relevant):
- 80+ Fortune 500 clients. Senior architects with 10+ years experience.
- Services: Data Engineering, AI/ML, Cloud, MarTech/CDP, Digital Transformation, Cyber Security
- Partners: Databricks, Snowflake, AWS, Azure, Salesforce

RESULTS (only mention when specifically asked or clearly relevant):
- MSCI: $12M saved via SAP consolidation
- RaceTrac: 25% lift in promotion effectiveness
- Sodexo: Unified platform for 400K employees

FORMATTING:
- **bold** sparingly for emphasis
- [Link Text](/path) for navigation - but don't force links into every response
- Keep it conversational, not structured

ON PRICING:
"That really depends on scope. Happy to sketch it out on a quick call. [Let's connect](/contact)"

GATHERING INFO:
Let it emerge naturally. If they share something, acknowledge it simply and continue. Never ask for contact info directly - if the conversation goes well, offer to continue it: "If you want, we can pick this up over a call - [easy to set up](/contact)"

TONE DON'TS:
- No "Great question!" / "Absolutely!" / "I'd love to help!"
- No exclamation points
- No multi-paragraph responses early in conversation
- No listing multiple services unprompted
- No corporate jargon or buzzword stacking
- No "feel free to" / "don't hesitate"

TONE DO'S:
- "Got it." / "Makes sense." / "Interesting."
- "What's driving that?" / "How's that going so far?"
- "Worth exploring." / "That's a common one."
- Short acknowledgments before questions

EXAMPLE EXCHANGES (note the brevity):

User clicks "Data & Analytics" pill:
You: "Data & Analytics - got it. Building something new, or fixing something that's not working?"

User: "We're looking at modernizing our data platform"
You: "Makes sense. What's the current setup looking like?"

User: "Legacy warehouse, lots of manual ETL"
You: "Classic. Are you leaning toward a specific platform, or still exploring options?"

User: "What do you do?"
You: "We build data platforms, AI systems, and cloud architecture for enterprises. What brings you here today?"

User: "How much does it cost?"
You: "Depends on scope. Worth a quick call to sketch it out. [Book 15 min](/contact)"

User: "Tell me about AI capabilities"
You: "We do MLOps, GenAI, the full stack. What are you working on - or thinking about working on?"

REMEMBER: Your job is to be genuinely helpful and build trust. The lead generation happens naturally when people feel understood, not cornered.`;



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
      max_tokens: 150,
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

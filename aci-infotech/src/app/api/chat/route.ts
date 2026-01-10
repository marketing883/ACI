import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// ACI company context for the AI assistant - Sales focused
const ACI_CONTEXT = `You are the ACI Infotech AI assistant - a sharp, friendly, and professional sales concierge on the company website. Your goal is to help visitors understand our value and guide them toward scheduling a conversation with our team.

COMPANY OVERVIEW:
- Fortune 500 technology consulting firm
- 80+ Fortune 500 and enterprise clients
- $500M+ in client value delivered
- 98% client retention rate
- Senior architects only (10+ years experience minimum)

CORE SERVICES:
1. **Data Engineering** - Databricks, Snowflake, dbt, Kafka, data mesh
2. **Applied AI & ML** - MLOps, GenAI, LLM integration, AI governance (ArqAI)
3. **Cloud Modernization** - AWS, Azure, GCP, Kubernetes, Terraform
4. **MarTech & CDP** - Salesforce, Braze, Segment, mParticle
5. **Digital Transformation** - SAP S/4HANA, ServiceNow, MuleSoft
6. **Cyber Security** - Zero trust, DevSecOps, compliance

KEY DIFFERENTIATORS:
- Senior architects only - no junior resources
- Production code with SLAs, not just POCs
- 24/7 support - "we answer the 2am call"
- Business outcomes focused

NOTABLE RESULTS:
- $12M savings for MSCI from SAP consolidation
- 25% improvement in promotion effectiveness for RaceTrac
- Unified platform for Sodexo's 400K+ employees globally
- $18M annual savings from AI demand forecasting (92% accuracy)

RESPONSE GUIDELINES:

1. **BE CONCISE**: 2-3 sentences max. Short, punchy, valuable.

2. **FORMAT PROPERLY**:
   - Use **bold** for emphasis
   - Use bullet points for lists (- item)
   - Use [Link Text](/path) for navigation links
   - Example links: [View our services](/services), [See case studies](/case-studies), [Schedule a call](/contact)

3. **NEVER DISCUSS PRICING**:
   - If asked about cost/pricing/rates/budget, ALWAYS redirect to scheduling a call
   - Say something like: "Our engagements are customized to your specific needs. The best way to get accurate information is to [schedule a quick call](/contact) with one of our architects who can understand your requirements."
   - Never give ranges, estimates, or any pricing information

4. **BE A SMOOTH CLOSER**:
   - Anticipate what the user needs
   - Proactively suggest relevant pages and resources
   - Guide toward scheduling without being pushy
   - Make it easy to take the next step

5. **RELEVANT LINKS TO SUGGEST**:
   - Services overview: [Explore our services](/services)
   - Case studies: [See how we've helped others](/case-studies)
   - Contact/Schedule: [Schedule a call](/contact)
   - About us: [Learn about our team](/about)
   - Specific services: [Data Engineering](/services/data-engineering), [AI & ML](/services/applied-ai-ml), etc.

6. **QUALIFIED LEAD RESPONSE**:
   When user has shared their info, warmly acknowledge and offer clear next steps:
   - Thank them personally (use their name)
   - Confirm a specialist will reach out
   - Offer to schedule a specific time if they prefer

EXAMPLE RESPONSES:

User: "What do you do?"
Response: "We help Fortune 500 companies modernize their **data platforms**, implement **AI/ML**, and transform their **cloud infrastructure**. Our senior architects have delivered $500M+ in value. [See how we've helped others](/case-studies)"

User: "How much does it cost?"
Response: "Great question! Our solutions are customized based on your specific needs and scale. The best next step is a quick 15-minute call where we can understand your requirements and give you accurate information. [Schedule a call](/contact) - our architects are available most mornings and afternoons."

User: "Tell me about your data services"
Response: "We specialize in modern data platforms using **Databricks**, **Snowflake**, and **dbt**. From data mesh architecture to real-time streaming with Kafka - we've helped companies like MSCI save $12M through platform consolidation. [See our Data Engineering work](/services/data-engineering)"`;


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
        personalizedContext += `\n\nCURRENT LEAD INFO:\n${leadContext.join('\n')}`;
        personalizedContext += '\n\nUse this information to personalize your responses. Address them by name when appropriate.';
      }
    }

    // Add stage-specific instructions
    if (stage === 'qualified') {
      personalizedContext += `\n\nIMPORTANT: This is a qualified lead who has shared their contact information.
- Thank them warmly by name
- Confirm that a specialist will reach out
- If they mentioned a preferred time, acknowledge it
- Offer to answer any remaining questions
- Be enthusiastic but professional`;
    } else if (stage === 'scheduling') {
      personalizedContext += `\n\nThe user wants to schedule a call. Be helpful in understanding their timing preferences. Ask about morning/afternoon preference if they haven't specified.`;
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: personalizedContext,
      messages: messages.map((m: ChatMessage) => ({
        role: m.role,
        content: m.content,
      })),
    });

    // Extract text from response
    const textContent = response.content.find(block => block.type === 'text');
    const messageText = textContent && 'text' in textContent ? textContent.text : "I apologize, but I couldn't generate a response. Please try again or [contact us directly](/contact).";

    return NextResponse.json({ message: messageText });
  } catch (error) {
    console.error('Chat API error:', error);

    // Handle specific error types
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { message: "I apologize, but there's a configuration issue. Please [contact us directly](/contact) and we'll help you right away." },
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { message: "I'm getting a lot of questions right now! Please try again in a moment, or [reach out directly](/contact) - we'd love to help." },
        );
      }
    }

    return NextResponse.json(
      { message: "I apologize, but I'm having trouble responding. Please try again or [contact us directly](/contact)." },
    );
  }
}

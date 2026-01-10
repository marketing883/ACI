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

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages, leadInfo, stage } = await request.json() as {
      messages: ChatMessage[];
      leadInfo?: LeadInfo;
      stage?: string;
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

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

interface LeadData {
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  inquiry_type?: string;
  message?: string;
  service_interest?: string;
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { lead } = await request.json() as { lead: LeadData };

    if (!lead || !lead.email) {
      return NextResponse.json(
        { error: 'Lead data is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return basic analysis without AI
      return NextResponse.json({
        leadScore: calculateBasicScore(lead),
        analysis: {
          summary: 'AI analysis unavailable. Configure ANTHROPIC_API_KEY for intelligent lead insights.',
          companyInsights: null,
          recommendations: [
            'Review lead details manually',
            'Check company website for more context',
            'Schedule a discovery call',
          ],
          talkingPoints: [],
          similarCaseStudies: [],
        },
      });
    }

    // Generate AI-powered lead intelligence
    const prompt = `Analyze this sales lead and provide actionable intelligence for the sales team. Be concise and practical.

LEAD INFORMATION:
- Name: ${lead.name}
- Email: ${lead.email}
- Company: ${lead.company || 'Not provided'}
- Phone: ${lead.phone || 'Not provided'}
- Service Interest: ${lead.service_interest || lead.inquiry_type || 'Not specified'}
- Message/Requirements: ${lead.message || 'No message provided'}

Based on the email domain and any company name provided, analyze this lead and provide:

1. LEAD SCORE (0-100): Rate the lead quality based on:
   - Company size/type (enterprise emails score higher)
   - Service alignment with ACI's offerings
   - Completeness of information
   - Urgency signals in message

2. COMPANY INSIGHTS (2-3 bullet points):
   - Industry and likely size based on domain
   - Potential technology stack
   - Relevant business context

3. RECOMMENDED APPROACH (2-3 bullet points):
   - Best engagement strategy
   - Key questions to ask
   - Potential objections to prepare for

4. TALKING POINTS (2-3 bullet points):
   - Relevant ACI services to highlight
   - Value propositions that would resonate
   - Similar client success stories to mention

5. SIMILAR CASE STUDIES:
   - List 1-2 relevant ACI case studies (MSCI for data/finance, RaceTrac for retail/MarTech, Sodexo for enterprise data)

Format your response as JSON with this structure:
{
  "leadScore": number,
  "analysis": {
    "summary": "One sentence summary of the lead opportunity",
    "companyInsights": ["insight1", "insight2"],
    "recommendations": ["rec1", "rec2"],
    "talkingPoints": ["point1", "point2"],
    "similarCaseStudies": ["MSCI - $12M savings from data consolidation", "etc"]
  }
}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const textContent = response.content.find(block => block.type === 'text');
    const responseText = textContent && 'text' in textContent ? textContent.text : '';

    // Try to parse JSON from response
    try {
      // Find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch {
      console.error('Failed to parse AI response as JSON');
    }

    // Fallback to basic response
    return NextResponse.json({
      leadScore: calculateBasicScore(lead),
      analysis: {
        summary: responseText.slice(0, 200) + '...',
        companyInsights: ['Analysis generated - see summary'],
        recommendations: ['Contact lead promptly', 'Schedule discovery call'],
        talkingPoints: ['Highlight relevant services'],
        similarCaseStudies: ['MSCI - Data automation', 'RaceTrac - MarTech transformation'],
      },
    });

  } catch (error) {
    console.error('Lead intelligence API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate lead intelligence' },
      { status: 500 }
    );
  }
}

function calculateBasicScore(lead: LeadData): number {
  let score = 0;

  // Name provided
  if (lead.name) score += 10;

  // Email quality
  if (lead.email) {
    score += 10;
    const domain = lead.email.split('@')[1]?.toLowerCase() || '';
    // Enterprise email domains score higher
    if (!domain.includes('gmail') && !domain.includes('yahoo') && !domain.includes('hotmail') && !domain.includes('outlook')) {
      score += 20;
    }
    // Known enterprise domains
    if (domain.endsWith('.com') && domain.length > 10) {
      score += 10;
    }
  }

  // Company provided
  if (lead.company) score += 20;

  // Phone provided
  if (lead.phone) score += 10;

  // Service interest specified
  if (lead.service_interest || lead.inquiry_type) score += 10;

  // Message provided
  if (lead.message && lead.message.length > 50) score += 10;

  return Math.min(score, 100);
}

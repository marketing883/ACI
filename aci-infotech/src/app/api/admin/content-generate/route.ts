import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

interface GenerateRequest {
  type: 'blog' | 'case_study' | 'whitepaper' | 'webinar';
  field: 'title' | 'excerpt' | 'content' | 'outline' | 'challenge' | 'solution' | 'results' | 'description';
  context: {
    keyword?: string;
    title?: string;
    category?: string;
    existingContent?: string;
    clientName?: string;
    industry?: string;
    technologies?: string[];
  };
}

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GenerateRequest;
    const { type, field, context } = body;

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        generated: getMockContent(type, field, context),
      });
    }

    const prompt = buildPrompt(type, field, context);

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract text from response
    const textContent = response.content.find(block => block.type === 'text');
    const content = textContent && 'text' in textContent ? textContent.text : getMockContent(type, field, context);

    // Return both 'content' and 'generated' for backward compatibility
    return NextResponse.json({ content, generated: content });

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

function buildPrompt(type: string, field: string, context: GenerateRequest['context']): string {
  const { keyword, title, category, existingContent, clientName, industry, technologies } = context;

  if (type === 'blog') {
    switch (field) {
      case 'title':
        return `Generate a compelling, SEO-optimized blog post title about "${keyword || title}".
Requirements:
- 60-70 characters max
- Include the main keyword naturally
- Use power words that drive clicks
- Professional tone suitable for enterprise tech audience
- Topic should relate to: ${category || 'enterprise technology'}

Return ONLY the title, nothing else.`;

      case 'excerpt':
        return `Write a compelling meta description/excerpt for a blog post titled "${title}".
Requirements:
- 150-160 characters max
- Include the main keyword naturally
- Clearly explain what readers will learn
- Include a subtle call-to-action
- Professional tone for enterprise decision makers

Return ONLY the excerpt, nothing else.`;

      case 'outline':
        return `Create a detailed blog post outline about "${keyword || title}" for the category "${category || 'enterprise technology'}".

Format as markdown with:
- H2 headings for main sections
- Bullet points for key topics under each section
- Suggested word count per section
- Include an introduction and conclusion section

The outline should be comprehensive enough for a 1500-2000 word article that provides real value to enterprise technology leaders.

Return the outline in markdown format.`;

      case 'content':
        return `Write a comprehensive, SEO-optimized blog post about "${keyword || title}" for the category "${category || 'enterprise technology'}".

Requirements:
- 1500-2000 words
- Write for enterprise technology decision makers (CTOs, VPs, Directors)
- Use markdown formatting (## for H2, ### for H3, **bold**, etc.)
- Include practical insights and actionable advice
- Reference real-world scenarios and best practices
- Include a compelling introduction and strong conclusion
- Use bullet points and lists where appropriate
- Maintain a professional but engaging tone

${existingContent ? `Build upon this existing outline/content:\n${existingContent}` : ''}

Return the full article in markdown format.`;

      default:
        return `Generate content for ${field}`;
    }
  }

  if (type === 'whitepaper') {
    switch (field) {
      case 'description':
        return `Write a compelling description for a whitepaper titled "${title}".
Category: ${category || 'Enterprise Technology'}

Requirements:
- 150-200 words
- Explain what readers will learn
- Highlight key insights and takeaways
- Include value proposition for enterprise decision makers
- Professional tone suitable for C-level executives
- Mention practical applications

Return ONLY the description, nothing else.`;
      default:
        return `Generate ${field} content for whitepaper`;
    }
  }

  if (type === 'webinar') {
    switch (field) {
      case 'description':
        return `Write a compelling description for a webinar titled "${title}".
Category: ${category || 'Enterprise Technology'}

Requirements:
- 150-200 words
- Explain what attendees will learn
- Highlight key topics and speakers
- Include value proposition for enterprise decision makers
- Create urgency to register
- Professional yet engaging tone

Return ONLY the description, nothing else.`;
      default:
        return `Generate ${field} content for webinar`;
    }
  }

  if (type === 'case_study') {
    switch (field) {
      case 'challenge':
        return `Write a compelling "Challenge" section for a case study about ${clientName || 'a client'} in the ${industry || 'enterprise'} industry.

Describe 2-3 specific business challenges they faced before working with ACI Infotech. Include:
- Business impact of the challenges
- Technical limitations they experienced
- Why existing solutions weren't working

Write 150-200 words in a professional tone. Return ONLY the content.`;

      case 'solution':
        return `Write a compelling "Solution" section for a case study about ${clientName || 'a client'}.

Technologies used: ${technologies?.join(', ') || 'Databricks, Snowflake, AWS'}

Describe how ACI Infotech solved their challenges. Include:
- The approach and methodology used
- Specific technologies implemented
- How the team collaborated with the client

Write 200-250 words in a professional tone. Return ONLY the content.`;

      case 'results':
        return `Write a compelling "Results" section for a case study about ${clientName || 'a client'} in the ${industry || 'enterprise'} industry.

Create realistic, impactful results. Include:
- 3-4 quantifiable metrics (percentages, time savings, cost reductions)
- Business outcomes achieved
- Long-term benefits

Write 150-200 words in a professional tone. Return ONLY the content.`;

      default:
        return `Generate ${field} content for case study`;
    }
  }

  return `Generate ${field} content for ${type}`;
}

function getMockContent(type: string, field: string, context: GenerateRequest['context']): string {
  const { keyword, title, category } = context;

  if (type === 'whitepaper') {
    if (field === 'description') {
      return `This comprehensive whitepaper explores ${title || 'enterprise technology strategies'} and provides actionable insights for technology leaders. You'll discover proven methodologies used by Fortune 500 companies, learn from real-world case studies, and gain practical frameworks you can implement immediately. Whether you're modernizing legacy systems or building new capabilities, this guide will help you navigate complexity and deliver measurable business outcomes.`;
    }
    return 'Generated whitepaper content placeholder';
  }

  if (type === 'webinar') {
    if (field === 'description') {
      return `Join our expert panel as they dive deep into ${title || 'enterprise technology'}. This session will cover the latest trends, best practices, and practical strategies for ${category || 'digital transformation'}. Attendees will learn from real implementation experiences, get answers to their specific questions, and walk away with actionable insights they can apply immediately. Reserve your spot now to gain a competitive edge.`;
    }
    return 'Generated webinar content placeholder';
  }

  if (type === 'blog') {
    switch (field) {
      case 'title':
        return `Enterprise Guide to ${keyword || title || 'Modern Data Architecture'}: Best Practices for 2025`;
      case 'excerpt':
        return `Discover how leading enterprises are transforming their ${keyword || 'data infrastructure'} with proven strategies that drive measurable business outcomes.`;
      case 'outline':
        return `## Introduction\n- Hook with industry statistics\n- Overview of key challenges\n\n## Understanding ${keyword || 'the Problem'}\n- Current landscape\n- Common pitfalls\n\n## Best Practices\n- Strategy 1\n- Strategy 2\n- Strategy 3\n\n## Implementation Guide\n- Step-by-step approach\n- Tools and technologies\n\n## Conclusion\n- Key takeaways\n- Call to action`;
      case 'content':
        return `# ${title || 'Enterprise Guide'}\n\nIn today's rapidly evolving technology landscape, enterprises face unprecedented challenges in managing their ${keyword || 'digital infrastructure'}...\n\n## The Challenge\n\nModern organizations must balance innovation with operational stability...\n\n## Our Approach\n\nAt ACI Infotech, we've helped Fortune 500 companies transform their operations through strategic technology implementations...\n\n## Key Takeaways\n\n- Point 1\n- Point 2\n- Point 3\n\n## Conclusion\n\nSuccess in the digital age requires a partner who understands both technology and business outcomes.`;
      default:
        return 'Generated content placeholder';
    }
  }

  return 'Generated content placeholder';
}

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

interface GenerateRequest {
  type: 'blog' | 'case_study' | 'whitepaper' | 'webinar';
  field: 'title' | 'excerpt' | 'content' | 'outline' | 'challenge' | 'solution' | 'results' | 'description' | 'meta_title' | 'meta_description' | 'faqs' | 'highlights';
  context: {
    keyword?: string;
    title?: string;
    category?: string;
    existingContent?: string;
    clientName?: string;
    industry?: string;
    technologies?: string[];
    description?: string;
    excerpt?: string;
    topics?: string;
    // Enhanced AEO/GEO fields
    audience?: string;
    tone?: string;
    length?: string;
    includes?: string;
    articleType?: string;
    authorName?: string;
    content?: string;
    existingFaqs?: { question: string; answer: string }[];
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
    let content = textContent && 'text' in textContent ? textContent.text : getMockContent(type, field, context);

    // Handle FAQ JSON parsing
    if (field === 'faqs') {
      try {
        // Try to parse as JSON array
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          return NextResponse.json({ faqs: parsed, content: parsed });
        }
      } catch {
        // If not valid JSON, return mock FAQs
        return NextResponse.json({ faqs: getMockFaqs(context), content: getMockFaqs(context) });
      }
    }

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
  const { keyword, title, category, existingContent, clientName, industry, technologies, audience, tone, length, includes, articleType, authorName, content, existingFaqs } = context;

  // AEO/GEO optimization guidelines that apply to all content
  const AEO_GEO_GUIDELINES = `
AEO (Answer Engine Optimization) Requirements:
- Include clear definitions (e.g., "X is a...", "X refers to...")
- Add question-based headings where appropriate (What, How, Why, When)
- Create 40-60 word paragraphs that directly answer questions (optimal for featured snippets)
- Include numbered steps for processes
- Use bulleted lists for features/benefits

GEO (Generative Engine Optimization) Requirements:
- Include specific statistics and data points with context
- Reference authoritative sources when making claims
- Use clear entity names (specific tools, companies, technologies)
- Add unique insights from experience (e.g., "In our experience...", "Based on 80+ deployments...")
- Ensure comprehensive topic coverage
- Write at a professional but accessible reading level
`;

  if (type === 'blog') {
    switch (field) {
      case 'title':
        return `Generate a compelling, SEO/AEO-optimized blog post title about "${keyword || title}".

Article Type: ${articleType || 'How-To Guide'}
Target Audience: ${audience || 'C-Suite Executives, IT Decision Makers'}
Category: ${category || 'Enterprise Technology'}

Requirements:
- 50-60 characters (strict limit for full SERP display)
- Include the main keyword naturally at the beginning if possible
- Match the article type format:
  * How-To: "How to [Action] [Benefit]"
  * Listicle: "[Number] [Topic] for [Audience/Goal]"
  * Explainer: "What is [Topic]? [Benefit/Context]"
  * Industry Analysis: "[Year] [Topic] Trends: [Key Insight]"
  * Ultimate Guide: "The Complete Guide to [Topic]"
- Use power words (Transform, Essential, Proven, Strategic)
- Front-load value proposition
- Professional tone for ${audience || 'enterprise decision makers'}

Return ONLY the title, nothing else.`;

      case 'excerpt':
        return `Write a compelling excerpt for a ${articleType || 'blog post'} titled "${title}".

Target Audience: ${audience || 'Enterprise decision makers'}
Tone: ${tone || 'Authoritative & Trustworthy'}

Requirements:
- 150-160 characters max
- Start with the key benefit or answer
- Include the main keyword naturally
- End with implicit value (what they'll gain)
- Avoid generic phrases like "Learn more" or "Read on"
- Be specific about the value proposition

AEO Optimization:
- If the title is a question, start with a direct answer
- Include a specific metric or outcome if possible

Return ONLY the excerpt, nothing else.`;

      case 'outline':
        return `Create a detailed, AEO/GEO-optimized outline for a ${articleType || 'How-To Guide'} about "${keyword || title}".

Article Type: ${articleType || 'How-To Guide'}
Target Word Count: ${length || '1,500-2,000 words'}
Target Audience: ${audience || 'C-Suite Executives, IT Decision Makers'}
Tone: ${tone || 'Authoritative & Trustworthy'}
Include: ${includes || 'Statistics, FAQ Section, Actionable Tips'}
Category: ${category || 'Enterprise Technology'}

Format as markdown with:

## [Article Type-Specific Structure]

For How-To Guides:
- Introduction with "What you'll learn"
- Prerequisites section
- Numbered step-by-step sections
- Common mistakes to avoid
- FAQ section
- Conclusion with next steps

For Listicles:
- Introduction with why this matters
- Numbered items with consistent structure
- Each item: heading, explanation, example, pro tip
- FAQ section
- Conclusion with key takeaways

For Industry Analysis:
- Executive summary
- Current state of [topic]
- Key trends (numbered)
- Expert predictions
- What this means for your organization
- FAQ section
- Action items

For Explainers:
- "What is [X]?" section (definition paragraph 40-60 words)
- "Why does [X] matter?"
- "How does [X] work?"
- "Who should use [X]?"
- Common misconceptions
- FAQ section
- Getting started

${AEO_GEO_GUIDELINES}

Return the outline in markdown format.`;

      case 'content':
        return `Write a comprehensive, AEO/GEO-optimized ${articleType || 'article'} about "${keyword || title}".

Article Type: ${articleType || 'How-To Guide'}
Target Word Count: ${length || '1,500-2,000 words'}
Target Audience: ${audience || 'C-Suite Executives, IT Decision Makers'}
Tone: ${tone || 'Authoritative & Trustworthy'}
Author: ${authorName || 'ACI Team'}
Category: ${category || 'Enterprise Technology'}
Include: ${includes || 'Statistics, FAQ Section, Actionable Tips'}

${AEO_GEO_GUIDELINES}

Article Type-Specific Requirements:

${articleType === 'how-to' || articleType === 'How-To Guide' ? `
HOW-TO GUIDE FORMAT:
1. Introduction (100-150 words)
   - Start with the problem/opportunity
   - "In this guide, you'll learn how to..."
   - Estimated time/difficulty

2. Prerequisites/Before You Start (if applicable)
   - What readers need to know/have

3. Step-by-Step Instructions
   - ## Step 1: [Action Verb] + [What]
   - Each step: 100-200 words
   - Include specific examples
   - Add "Pro tip:" boxes for insider knowledge
   - Include potential pitfalls

4. Common Mistakes to Avoid
   - Numbered list with explanations

5. FAQ Section (use ### for each question)
   - 3-5 relevant questions
   - Direct answers in 40-60 words

6. Conclusion
   - Recap key steps
   - Next actions
   - CTA
` : ''}

${articleType === 'industry-analysis' || articleType === 'Industry Analysis' ? `
INDUSTRY ANALYSIS FORMAT:
1. Executive Summary (150 words)
   - Key findings upfront
   - "This analysis reveals..."

2. Current State of [Topic]
   - Market size/statistics
   - Key players
   - Recent developments

3. Key Trends (numbered)
   - Each trend: 200-300 words
   - Include data points
   - Quote or reference sources

4. Expert Predictions
   - "According to Gartner/Forrester/McKinsey..."
   - In our experience working with Fortune 500 clients...

5. What This Means for Your Organization
   - Practical implications
   - Risk/opportunity assessment

6. FAQ Section

7. Recommended Actions
   - Prioritized list
` : ''}

${articleType === 'explainer' || articleType === 'Explainer/What Is' ? `
EXPLAINER FORMAT:
1. What is [Topic]? (Definition - exactly 40-60 words for featured snippet)
   - Clear, concise definition
   - "[Topic] is a [category] that [function/purpose]..."

2. Why Does [Topic] Matter?
   - Business impact
   - Statistics on adoption/results

3. How Does [Topic] Work?
   - Technical explanation made accessible
   - Diagrams/analogies

4. Key Benefits
   - Bulleted list with brief explanations

5. Common Use Cases
   - Industry-specific examples

6. [Topic] vs. Alternatives (comparison if relevant)

7. FAQ Section

8. Getting Started
   - First steps
   - Resources
` : ''}

Content Quality Requirements:
- Use markdown (## H2, ### H3, **bold**, *italic*)
- Include 3-5 statistics with context
- Add "In our experience..." insights (${authorName || 'ACI'} perspective)
- Reference specific technologies/tools by name
- Use bullet points and numbered lists liberally
- Include internal link placeholders: [Related: Topic](/blog/topic-slug)
- Ensure each major section has snippet-ready paragraphs (40-60 words)

${existingContent ? `Build upon this existing outline/content:\n${existingContent}` : ''}

Return the full article in markdown format.`;

      case 'meta_title':
        return `Generate an AEO-optimized meta title for this ${articleType || 'blog post'}.

Blog Title: "${title}"
${keyword ? `Target Keyword: "${keyword}"` : ''}
Article Type: ${articleType || 'How-To Guide'}
Category: ${category || 'Enterprise Technology'}

Requirements:
- Maximum 60 characters (strict limit)
- Front-load the keyword
- Include year (2025) if relevant for freshness
- Match article type patterns:
  * How-To: "How to [X]: Step-by-Step Guide [Year]"
  * Listicle: "[Number] Best [X] for [Goal] in [Year]"
  * Explainer: "What is [X]? Definition & Guide [Year]"
- Make it click-worthy but accurate

Return ONLY the meta title, nothing else.`;

      case 'meta_description':
        return `Generate an AEO-optimized meta description for this ${articleType || 'blog post'}.

Blog Title: "${title}"
${keyword ? `Target Keyword: "${keyword}"` : ''}
Article Type: ${articleType || 'How-To Guide'}
Target Audience: ${audience || 'Enterprise decision makers'}
${existingContent ? `Content Preview: ${existingContent.substring(0, 300)}` : ''}

Requirements:
- 150-160 characters (strict limit)
- Start with the answer/value if the title is a question
- Include the main keyword in first 100 characters
- End with implicit CTA (value statement, not "click here")
- Be specific: include a number, stat, or concrete benefit

Example patterns:
- "Learn how to [X] in [Y] steps. Includes [benefit] + [bonus]. Updated for 2025."
- "[X] is [definition]. Discover [specific benefit] + [unique angle]."

Return ONLY the meta description, nothing else.`;

      case 'faqs':
        return `Generate 4-5 FAQ questions and answers for a ${articleType || 'blog post'} about "${title}".

Topic/Keyword: ${keyword || title}
Article Type: ${articleType || 'How-To Guide'}
Category: ${category || 'Enterprise Technology'}
Target Audience: ${audience || 'Enterprise decision makers'}
${content ? `Article Content Preview:\n${content.substring(0, 1000)}` : ''}
${existingFaqs && existingFaqs.length > 0 ? `Existing FAQs (don't duplicate):\n${existingFaqs.map(f => f.question).join('\n')}` : ''}

Requirements for each FAQ:

QUESTIONS:
- Use natural question formats: "What is...", "How do I...", "Why should...", "When is...", "What are the benefits of..."
- Target questions people actually search for (People Also Ask style)
- Include long-tail question variations
- Mix informational and transactional intent questions

ANSWERS:
- 40-60 words each (optimal for featured snippets)
- Start with a direct answer in the first sentence
- Include specific details/examples
- Use active voice
- Don't start with "Yes" or "No" - incorporate the answer naturally
- Reference the company perspective where relevant: "At ACI, we..."

Return as a JSON array:
[
  {"question": "What is...", "answer": "..."},
  {"question": "How do...", "answer": "..."}
]

Return ONLY the JSON array, nothing else.`;

      default:
        return `Generate content for ${field}`;
    }
  }

  if (type === 'whitepaper') {
    switch (field) {
      case 'description':
        return `Write a compelling, GEO-optimized description for a whitepaper titled "${title}".
Category: ${category || 'Enterprise Technology'}

${AEO_GEO_GUIDELINES}

Requirements:
- 150-200 words
- Start with the core problem/opportunity this whitepaper addresses
- Include 2-3 specific outcomes readers will achieve
- Reference data/research if applicable ("Based on analysis of 80+ enterprises...")
- Highlight unique insights not found elsewhere
- End with clear value proposition for C-suite executives
- Use specific numbers where possible (page count, case studies included, frameworks)

Structure:
1. Opening hook (problem statement)
2. What's covered (specific topics)
3. Key outcomes (what they'll be able to do)
4. Credibility signal (based on real experience)

Return ONLY the description, nothing else.`;

      case 'excerpt':
        return `Write a short, compelling excerpt for a whitepaper to display on a homepage card.

Whitepaper Title: "${title}"
Category: ${category || 'Enterprise Technology'}
${context.description ? `Full Description: ${context.description}` : ''}

Requirements:
- Maximum 150 characters (strict limit - this is for a card)
- One compelling sentence that creates urgency to download
- Focus on the key benefit or transformation
- Avoid generic phrases
- Make it action-oriented

Examples of good excerpts:
- "Build resilient, AI-ready data platforms that scale with your business needs."
- "Learn the framework used by Fortune 500 companies to cut data costs by 40%."
- "Discover proven strategies for real-time analytics at enterprise scale."

Return ONLY the excerpt, nothing else.`;

      case 'highlights':
        return `Generate 3 key takeaways/highlights for a whitepaper to display on a homepage card.

Whitepaper Title: "${title}"
Category: ${category || 'Enterprise Technology'}
${context.description ? `Description: ${context.description}` : ''}
${context.excerpt ? `Excerpt: ${context.excerpt}` : ''}

Requirements:
- Exactly 3 bullet points
- Each bullet: 8-15 words max
- Start each with an action word or specific benefit
- Be specific - include numbers, frameworks, or outcomes where possible
- These appear with checkmarks on the homepage card

Examples of good highlights:
- "Framework for AI-powered data architecture"
- "Cost optimization strategies that drive 40% savings"
- "Real-world case studies from Fortune 500 implementations"
- "12-step compliance checklist for data governance"
- "ROI calculator for data platform investments"

Return ONLY 3 highlights, one per line (no bullets, numbers, or dashes).`;

      case 'meta_title':
        return `Generate an AEO-optimized meta title for a whitepaper.

Whitepaper Title: "${title}"
Category: ${category || 'Enterprise Technology'}
${context.description ? `Description: ${context.description}` : ''}

Requirements:
- Maximum 60 characters (strict limit)
- Include "[Free Whitepaper]" or "[Guide]" if space permits
- Front-load the main topic/keyword
- Include year for freshness signals (2025)
- Make it compelling for lead generation
- Pattern: "[Topic]: [Benefit] | Free Whitepaper"

Return ONLY the meta title, nothing else.`;

      case 'meta_description':
        return `Generate an AEO/GEO-optimized meta description for a whitepaper.

Whitepaper Title: "${title}"
Category: ${category || 'Enterprise Technology'}
${context.description ? `Description: ${context.description}` : ''}

Requirements:
- 150-160 characters (strict limit)
- Start with what makes this whitepaper valuable
- Include a specific benefit or statistic
- Strong CTA: "Download free" or "Get your copy"
- Target: CIOs, CTOs, VP of Engineering
- Include credibility signal if possible

Pattern: "[Key topic insight]. [Specific benefit/outcome]. Download your free copy."

Return ONLY the meta description, nothing else.`;

      default:
        return `Generate ${field} content for whitepaper`;
    }
  }

  if (type === 'webinar') {
    switch (field) {
      case 'description':
        return `Write a compelling description for a webinar titled "${title}".
Category: ${category || 'Enterprise Technology'}
${context.topics ? `Topics: ${context.topics}` : ''}

Requirements:
- 150-200 words
- Explain what attendees will learn
- Highlight key topics and speakers
- Include value proposition for enterprise decision makers
- Create urgency to register
- Professional yet engaging tone

Return ONLY the description, nothing else.`;

      case 'meta_title':
        return `Generate an SEO-optimized meta title for a webinar.

Webinar Title: "${title}"
${context.topics ? `Topics: ${context.topics}` : ''}
${context.description ? `Description: ${context.description}` : ''}

Requirements:
- Maximum 60 characters (strict limit)
- Include the main topic naturally
- Make it compelling and attention-grabbing
- Consider including "Webinar" or "Live" if space permits
- Professional tone for enterprise audience

Return ONLY the meta title, nothing else.`;

      case 'meta_description':
        return `Generate an SEO-optimized meta description for a webinar.

Webinar Title: "${title}"
${context.topics ? `Topics: ${context.topics}` : ''}
${context.description ? `Description: ${context.description}` : ''}

Requirements:
- 150-160 characters (strict limit)
- Summarize what attendees will learn
- Include a call-to-action (e.g., "Register now", "Save your spot")
- Create urgency without being pushy
- Target enterprise decision makers

Return ONLY the meta description, nothing else.`;

      default:
        return `Generate ${field} content for webinar`;
    }
  }

  if (type === 'case_study') {
    switch (field) {
      case 'excerpt':
        return `Write a compelling, GEO-optimized excerpt for a case study.

Title: "${title}"
Client: ${clientName || 'Enterprise client'}
Industry: ${industry || 'Enterprise'}
Technologies: ${technologies?.join(', ') || 'Data & Analytics'}

${AEO_GEO_GUIDELINES}

Requirements:
- 100-150 words
- Lead with the most impressive result/metric
- Follow Problem → Solution → Result structure
- Include specific numbers (%, $, time)
- Name the technologies used
- End with the business transformation achieved
- Professional tone that showcases expertise

Structure:
"[Client] faced [specific challenge]. Using [technologies], ACI Infotech [solution approach]. The result: [specific metrics]. Today, [ongoing benefit]."

Return ONLY the excerpt, nothing else.`;

      case 'challenge':
        return `Write a compelling, GEO-optimized "Challenge" section for a case study.

Client: ${clientName || 'Enterprise client'}
Industry: ${industry || 'Enterprise'}
Technologies that will be used: ${technologies?.join(', ') || 'Data & Analytics'}

${AEO_GEO_GUIDELINES}

Requirements:
- 150-200 words
- Start with business context (company size, industry pressures)
- Describe 2-3 specific, quantifiable challenges
- Include the "before" metrics if possible
- Explain business impact in dollars or percentages
- Reference industry-specific pain points
- Explain why existing solutions failed (without naming competitors)

Structure:
1. Context: "[Industry] companies face [pressure]..."
2. Challenge 1: Specific technical limitation + business impact
3. Challenge 2: Operational inefficiency + cost
4. Challenge 3: Competitive/market pressure

Include phrases like:
- "Legacy systems were costing the company X in [downtime/manual effort]"
- "Data silos meant Y decisions took Z days instead of hours"
- "Without [capability], they were losing $X in [specific area]"

Return ONLY the content.`;

      case 'solution':
        return `Write a compelling, GEO-optimized "Solution" section for a case study.

Client: ${clientName || 'Enterprise client'}
Industry: ${industry || 'Enterprise'}
Technologies: ${technologies?.join(', ') || 'Databricks, Snowflake, AWS'}

${AEO_GEO_GUIDELINES}

Requirements:
- 200-250 words
- Name specific technologies and how they were configured
- Include implementation timeline if realistic
- Describe the architecture approach
- Mention team collaboration and change management
- Reference ACI's methodology or unique approach
- Use technical specifics that establish expertise

Structure:
1. Approach/Strategy: "ACI Infotech designed a [X]-phase approach..."
2. Technology Architecture: "[Specific tech stack] configured for [use case]"
3. Implementation: Key milestones and how challenges were overcome
4. Innovation: What made this solution unique
5. Collaboration: How ACI worked with client teams

Include credibility signals:
- "Our team of [X] engineers..."
- "Using our proven [methodology name]..."
- "Based on patterns from 80+ similar implementations..."

Return ONLY the content.`;

      case 'results':
        return `Write a compelling, GEO-optimized "Results" section for a case study.

Client: ${clientName || 'Enterprise client'}
Industry: ${industry || 'Enterprise'}
Technologies: ${technologies?.join(', ') || 'Data & Analytics'}

${AEO_GEO_GUIDELINES}

Requirements:
- 150-200 words
- Lead with the most impressive metric
- Include 4-5 quantifiable results with specific numbers
- Mix immediate and long-term outcomes
- Reference before/after comparison
- Include business value in dollars where possible
- End with client transformation/competitive advantage

Result Categories (include at least one from each):
1. Performance: "X% faster/reduction in processing time"
2. Cost: "$Xm annual savings" or "Y% reduction in operational costs"
3. Efficiency: "Z hours saved per week" or "Team productivity up X%"
4. Business: "New capability enabled $X in revenue" or "Time to market reduced by Y%"

Format with specific metrics:
- "**73% reduction** in data pipeline failures"
- "**$2.3M annual savings** in infrastructure costs"
- "**90% faster** report generation (from 4 hours to 24 minutes)"
- "**40% improvement** in data engineer productivity"

Return ONLY the content.`;

      case 'meta_title':
        return `Generate an AEO-optimized meta title for a case study.

Case Study Title: "${title}"
Client: ${clientName || 'Enterprise client'}
Industry: ${industry || 'Enterprise'}
Technologies: ${technologies?.join(', ') || 'Data & Analytics'}

Requirements:
- Maximum 60 characters (strict limit)
- Lead with the result or transformation
- Include industry for relevance
- Pattern: "[Industry] Case Study: [Key Result] | ACI"
- Or: "How [Industry Client] Achieved [Result]"
- Make it compelling for enterprise decision makers

Return ONLY the meta title, nothing else.`;

      case 'meta_description':
        return `Generate an AEO/GEO-optimized meta description for a case study.

Case Study Title: "${title}"
Client: ${clientName || 'Enterprise client'}
Industry: ${industry || 'Enterprise'}
Technologies: ${technologies?.join(', ') || 'Data & Analytics'}

Requirements:
- 150-160 characters (strict limit)
- Lead with the most impressive metric
- Include the industry and key technology
- End with invitation to learn more
- Pattern: "See how [industry] client achieved [specific metric] using [technology]. Read the full case study."

Return ONLY the meta description, nothing else.`;

      default:
        return `Generate ${field} content for case study`;
    }
  }

  return `Generate ${field} content for ${type}`;
}

function getMockFaqs(context: GenerateRequest['context']): { question: string; answer: string }[] {
  const topic = context.keyword || context.title || 'this topic';
  return [
    {
      question: `What is ${topic}?`,
      answer: `${topic} refers to the strategic approach enterprises use to manage and leverage their data assets. It encompasses data architecture, governance, quality, and integration practices that enable organizations to derive actionable insights and drive business value.`
    },
    {
      question: `Why is ${topic} important for enterprises?`,
      answer: `${topic} is critical because it directly impacts an organization's ability to make data-driven decisions. Companies with mature data strategies see 40% higher ROI on analytics investments and can respond to market changes 3x faster than competitors.`
    },
    {
      question: `How long does it take to implement ${topic}?`,
      answer: `Implementation timelines vary based on organizational complexity. Typically, foundational capabilities can be established in 3-6 months, with full maturity achieved over 12-24 months. At ACI, we've accelerated this through proven frameworks and reusable components.`
    },
    {
      question: `What are the common challenges with ${topic}?`,
      answer: `The most common challenges include data silos across business units, legacy system integration, lack of governance frameworks, and skills gaps. Organizations also struggle with balancing innovation speed against compliance requirements.`
    }
  ];
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

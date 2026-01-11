import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

interface GenerateRequest {
  type: 'blog' | 'case_study' | 'whitepaper' | 'webinar';
  field: 'title' | 'excerpt' | 'content' | 'outline' | 'challenge' | 'solution' | 'results' | 'description' | 'meta_title' | 'meta_description' | 'faqs' | 'highlights' | 'metrics' | 'seo_fix';
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
    // SEO fix fields
    seoIssue?: string;
    currentValue?: string;
    // Metrics fields
    existingMetrics?: { label: string; value: string; description?: string }[];
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

    // Use higher token limit for full content generation
    const maxTokens = field === 'content' ? 8000 : 2000;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
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

    // Handle metrics JSON parsing
    if (field === 'metrics') {
      try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          return NextResponse.json({ metrics: parsed, content: parsed });
        }
      } catch {
        // If not valid JSON, return mock metrics
        const mockMetrics = [
          { value: '40%', label: 'Cost Reduction', description: 'Annual operational savings' },
          { value: '3x', label: 'Faster Processing', description: 'Compared to legacy system' },
          { value: '99.5%', label: 'Uptime', description: 'SLA-backed reliability' },
          { value: '60%', label: 'Efficiency Gain', description: 'Team productivity improvement' },
        ];
        return NextResponse.json({ metrics: mockMetrics, content: mockMetrics });
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
  const { keyword, title, category, existingContent, clientName, industry, technologies, audience, tone, length, includes, articleType, authorName, content, existingFaqs, seoIssue, currentValue, existingMetrics } = context;

  // Helper to check article type (handles both ID and label formats)
  const isArticleType = (types: string[]): boolean => {
    if (!articleType) return false;
    const normalized = articleType.toLowerCase();
    return types.some(t =>
      normalized === t.toLowerCase() ||
      normalized.includes(t.toLowerCase()) ||
      t.toLowerCase().includes(normalized.replace(/[^a-z]/g, ''))
    );
  };

  const isHowTo = isArticleType(['how-to', 'how to', 'how-to guide']);
  const isListicle = isArticleType(['listicle', 'list']);
  const isIndustryAnalysis = isArticleType(['industry-analysis', 'industry analysis', 'analysis']);
  const isThoughtLeadership = isArticleType(['thought-leadership', 'thought leadership']);
  const isCaseStudy = isArticleType(['case-study', 'case study']);
  const isComparison = isArticleType(['comparison', 'versus', 'vs']);
  const isExplainer = isArticleType(['explainer', 'what is', 'what-is']);
  const isNews = isArticleType(['news', 'commentary']);
  const isUltimateGuide = isArticleType(['ultimate-guide', 'ultimate guide', 'comprehensive']);
  const isInterview = isArticleType(['interview', 'q&a', 'qa']);

  // CRITICAL: No dashes rule - applies to ALL generated content
  const NO_DASHES_RULE = `
CRITICAL FORMATTING RULE:
- NEVER use em dashes (—) or en dashes (–) in any content
- Use commas, semicolons, colons, or periods instead
- Use "to" for ranges (e.g., "10 to 20" not "10–20")
- Use hyphens (-) ONLY for compound words (e.g., "real-time", "AI-powered")
- This is a strict requirement with no exceptions
`;

  // AEO/GEO optimization guidelines that apply to all content
  const AEO_GEO_GUIDELINES = `
${NO_DASHES_RULE}

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
        return `Create a comprehensive, value-packed outline for an EXCEPTIONAL ${articleType || 'How-To Guide'} about "${keyword || title}".

CONTEXT:
- Article Type: ${articleType || 'How-To Guide'}
- Target Word Count: ${length || '1,500-2,000 words'}
- Target Audience: ${audience || 'C-Suite Executives, IT Decision Makers'}
- Tone: ${tone || 'Authoritative & Trustworthy'}
- Must Include: ${includes || 'Statistics, FAQ Section, Actionable Tips'}
- Category: ${category || 'Enterprise Technology'}

OUTLINE REQUIREMENTS:

The outline should be DETAILED enough that it serves as a complete blueprint. Each section should include:
- The heading (## or ###)
- 2-3 bullet points of what SPECIFICALLY to cover
- Any statistics, examples, or case studies to include
- The key insight or takeaway for that section

STRUCTURE BY ARTICLE TYPE:

${isHowTo || isUltimateGuide || !articleType ? `
FOR: ${articleType || 'How-To Guide'}

## Introduction
- Opening hook with striking statistic or expert quote
- The problem/opportunity this solves
- "In this guide, you'll learn..." (3-4 specific outcomes)
- Who this is for and estimated reading time

## Why [Topic] Matters Now
- Current market context
- The cost of NOT doing this (quantified)
- Recent developments making this urgent

## Prerequisites: What You Need Before Starting
- Required knowledge/skills
- Tools/technologies needed
- Organizational readiness checklist

## Step 1: [Specific Action]
- Detailed explanation
- Specific example or mini case study
- Common pitfall to avoid
- Pro tip from practitioner experience

[Continue with Steps 2-5+]

## Common Mistakes That Derail [Topic] Projects
- Mistake 1 with why it happens and how to avoid
- Mistake 2...
- Include: "In our experience, 70% of failures come from..."

## Quick-Reference Checklist
- Bulleted checklist they can screenshot/print

## FAQ Section
- 4-5 questions people actually search for
- Each answer: 40-60 words, direct and specific

## What's Next: Taking Action
- Immediate next step they can take today
- Resources for deeper learning
- When to consider expert help
` : ''}

${isIndustryAnalysis || isThoughtLeadership ? `
FOR: ${articleType}

## Executive Summary
- 3 key findings in bullets
- The "so what" for decision makers
- Reading time estimate

## The Current State of [Topic] in 2025
- Market size and growth trajectory
- Key players and their positioning
- Recent major developments (last 6 months)

## Trend 1: [Specific Trend Name]
- What's happening
- Supporting data (cite Gartner, Forrester, etc.)
- Real-world example
- Implication for enterprises

[Trends 2-5...]

## What the Experts Are Saying
- Quotes/predictions from industry leaders
- Our own prediction based on client work

## Risk Assessment: What Could Go Wrong
- Potential disruptions
- Regulatory considerations
- Technology risks

## Opportunity Map: Where to Place Your Bets
- High-confidence opportunities
- Emerging opportunities worth watching
- What to avoid

## Your 90-Day Action Plan
- Immediate actions (this month)
- Near-term initiatives (next quarter)
- Strategic planning (this year)

## FAQ Section
` : ''}

${isExplainer ? `
FOR: ${articleType}

## What is [Topic]? (The 60-Word Definition)
- Clear, jargon-free definition
- What category it belongs to
- Its core purpose/function

## Why [Topic] Has Become Critical in 2025
- The business drivers
- Statistics on adoption/impact
- What's changed recently

## How [Topic] Actually Works
- The core mechanism (simplified)
- Key components and how they interact
- Analogy for non-technical readers

## The Real Benefits (Beyond the Hype)
- Benefit 1 with specific metrics
- Benefit 2 with use case
- What vendors won't tell you

## [Topic] in Action: 3 Use Cases
- Use case 1: Industry + specific example
- Use case 2...
- Use case 3...

## [Topic] vs. [Main Alternative]
- Head-to-head comparison
- When to choose which
- Hybrid approaches

## Getting Started: A Practical Roadmap
- Assessment: Are you ready?
- Phase 1: Quick wins (30 days)
- Phase 2: Foundation (90 days)
- Phase 3: Scale (6-12 months)

## FAQ Section
` : ''}

${isListicle ? `
FOR: ${articleType}

## Introduction: Why This List Matters
- Hook with the problem/opportunity
- Why these specific items were chosen
- What readers will gain

## 1. [First Item] - [Key Benefit]
- What it is and why it matters
- Specific example or case study
- Pro tip for implementation
- When to use/avoid

## 2. [Second Item] - [Key Benefit]
[Same structure...]

[Continue for 7-10 items]

## Quick Comparison Table
- Side-by-side summary of all items
- Best for X, Best for Y recommendations

## FAQ Section

## Your Next Step
- How to choose which one to start with
- Resources for deeper exploration
` : ''}

${isComparison ? `
FOR: ${articleType}

## Introduction: The Decision You're Facing
- Why this comparison matters
- What's at stake
- Who this guide is for

## Quick Verdict (TL;DR)
- The bottom line recommendation by use case
- "Choose X if..., Choose Y if..."

## What is [Option A]?
- Definition and core purpose
- Key strengths
- Ideal use cases

## What is [Option B]?
- Definition and core purpose
- Key strengths
- Ideal use cases

## Head-to-Head Comparison
### Performance
### Cost
### Ease of Implementation
### Scalability
### Vendor Support/Ecosystem

## Real-World Decision Framework
- Decision tree or flowchart logic
- "If you have X, choose Y"

## Migration Considerations
- Switching costs
- Compatibility issues
- Hybrid approaches

## FAQ Section

## Making Your Decision
- Summary of key differentiators
- Recommended next steps
` : ''}

${isNews ? `
FOR: ${articleType}

## The News: What Happened
- The key development in one paragraph
- Why it's significant
- Initial market/industry reaction

## Context: Why This Matters
- Background leading to this development
- Historical perspective
- Market conditions

## Analysis: What It Really Means
- Expert interpretation
- Hidden implications
- Who wins and loses

## Impact Assessment
### For Enterprise IT Teams
### For Business Leaders
### For the Industry

## What to Watch Next
- Key indicators to monitor
- Timeline of expected developments

## Our Take
- ACI's perspective based on client experience
- How we're advising clients to respond

## FAQ Section
` : ''}

${AEO_GEO_GUIDELINES}

Return a detailed outline in markdown format that serves as a complete blueprint for an exceptional article.`;

      case 'content':
        // Parse word count for explicit guidance
        const wordCountMatch = length?.match(/(\d+)/);
        const minWords = wordCountMatch ? parseInt(wordCountMatch[1]) : 1500;
        const maxWords = length?.includes('-') ? parseInt(length.split('-')[1]?.match(/(\d+)/)?.[1] || '2000') : minWords + 500;

        return `You are a world-renowned expert in ${category || 'enterprise technology'} and related technologies. You excel at merging cutting-edge technologies with business strategy, providing highly accurate, insightful, and actionable information. You are a master at creating compelling content that resonates deeply with ${audience || 'enterprise decision makers'}.

CRITICAL: Create an EXCEPTIONAL article, NOT a generic fluff piece. Every paragraph must deliver genuine value, unique insights, and actionable intelligence.

═══════════════════════════════════════════════════════════════
STRICT REQUIREMENTS - YOU MUST FOLLOW THESE:
═══════════════════════════════════════════════════════════════

📏 WORD COUNT: ${length || '1,500-2,000 words'}
   - Your article MUST be between ${minWords} and ${maxWords} words
   - This is NOT a suggestion - it is a strict requirement
   - Too short = not comprehensive enough
   - Count your words and ensure you hit the target

👥 TARGET AUDIENCE: ${audience || 'C-Suite Executives, IT Decision Makers'}
   - Write specifically for THIS audience's concerns, vocabulary, and priorities
   - ${audience?.toLowerCase().includes('c-suite') || audience?.toLowerCase().includes('executive') ?
     'Focus on: business impact, ROI, strategic decisions, risk mitigation, competitive advantage' : ''}
   - ${audience?.toLowerCase().includes('technical') || audience?.toLowerCase().includes('practitioner') ?
     'Focus on: implementation details, code examples, technical architecture, best practices' : ''}
   - ${audience?.toLowerCase().includes('it decision') ?
     'Focus on: vendor evaluation, build vs buy, integration complexity, team capabilities, TCO' : ''}
   - Use vocabulary and examples that resonate with this specific audience
   - Address THEIR pain points, not generic ones

🎯 ARTICLE TYPE: ${articleType || 'How-To Guide'}
   - Follow the structure and conventions of this specific article type
   - See ARTICLE TYPE-SPECIFIC GUIDANCE below

🎨 TONE: ${tone || 'Authoritative & Trustworthy'}
   - Maintain this tone consistently throughout
   - ${tone?.toLowerCase().includes('authoritative') ? 'Be confident, cite data, speak from experience' : ''}
   - ${tone?.toLowerCase().includes('approachable') ? 'Use conversational language, analogies, relatable examples' : ''}
   - ${tone?.toLowerCase().includes('technical') ? 'Be precise, use proper terminology, include technical depth' : ''}

═══════════════════════════════════════════════════════════════

PRIMARY CONTEXT:
- Topic/Keyword: "${keyword || title}"
- Author Perspective: ${authorName || 'ACI Team'} (enterprise data & AI consultancy)
- Category: ${category || 'Enterprise Technology'}
- Must Include: ${includes || 'Statistics, FAQ Section, Actionable Tips'}

${existingContent ? `
IMPORTANT - FOLLOW THIS OUTLINE EXACTLY:
The article MUST follow this structure. Each section in the outline below should become a section in the final article:

${existingContent}

---
` : ''}

${AEO_GEO_GUIDELINES}

ARTICLE TYPE-SPECIFIC GUIDANCE:
${isHowTo || isUltimateGuide ? `
You are writing a ${articleType}. This format requires:
- Step-by-step numbered instructions with clear action verbs
- Prerequisites section before the steps
- Each step should include: the action, why it matters, an example, and a common pitfall
- Include a troubleshooting or "Common Mistakes" section
- End with a quick-reference checklist
` : ''}
${isListicle ? `
You are writing a ${articleType}. This format requires:
- A clear number in the title (e.g., "7 Best...", "10 Ways to...")
- Each item should follow the same structure: heading, explanation, example, pro tip
- Items should be ranked or ordered logically
- Include a comparison table summarizing all items
- Make items scannable with bold key points
` : ''}
${isIndustryAnalysis || isThoughtLeadership ? `
You are writing a ${articleType}. This format requires:
- Executive summary with 3 key findings upfront
- Data-driven insights with specific statistics and sources
- Expert quotes or references (Gartner, Forrester, McKinsey)
- Bold predictions backed by reasoning
- Clear implications for different stakeholders
- Action items prioritized by impact and effort
` : ''}
${isExplainer ? `
You are writing a ${articleType}. This format requires:
- A crystal-clear definition in the first paragraph (40-60 words for featured snippets)
- "Why it matters" section with business impact
- "How it works" section with technical details made accessible
- Real-world use cases by industry
- Comparison with alternatives or traditional approaches
- Getting started roadmap
` : ''}
${isComparison ? `
You are writing a ${articleType}. This format requires:
- Quick verdict/TL;DR near the top
- Fair, balanced assessment of both options
- Clear comparison criteria (performance, cost, scalability, etc.)
- Specific scenarios where each option wins
- Decision framework or flowchart logic
- Migration considerations if switching
` : ''}
${isNews ? `
You are writing a ${articleType}. This format requires:
- Lead with the news in the first paragraph
- Provide context and background
- Expert analysis of implications
- Impact assessment for different audiences
- What to watch next / future implications
- Your organization's perspective
` : ''}

CONTENT EXCELLENCE REQUIREMENTS:

1. SENSATIONAL OPENING (Critical):
   - Start with an engaging, intelligent hook that front-loads value
   - Consider opening with a powerful, relevant quote from a renowned industry expert (Satya Nadella, Jensen Huang, or similar)
   - Include a striking statistic that brings home the importance (e.g., "Organizations with mature data strategies see 2.6x revenue growth...")
   - Set a tone that promises an exciting, value-packed read
   - First 100 words must establish: why this matters NOW, what's at stake, what they'll gain

2. BODY CONTENT (Deep Value):
   - Go IN-DEPTH on every point demanded by the topic
   - Provide REAL solutions, not generic advice
   - Include SPECIFIC real-world use cases and examples (e.g., "When we helped a Fortune 100 retailer...")
   - Add industry-specific facts and statistics with context
   - Provide step-by-step guidance where appropriate
   - Address the ACTUAL challenges the target audience faces
   - Share contrarian or non-obvious insights that demonstrate expertise
   - Use clear headings and subheadings that explain the content (not just label it)

3. UNIQUE VOICE & INSIGHTS:
   - Include "In our experience working with 80+ Fortune 500 clients..." type insights
   - Share specific patterns you've observed (e.g., "The #1 mistake we see enterprises make is...")
   - Provide the "insider perspective" that only practitioners would know
   - Challenge conventional wisdom where appropriate
   - Make bold, defensible predictions about the future

4. PRACTICAL & ACTIONABLE:
   - Every section should answer "So what? What do I do with this?"
   - Include checklists, frameworks, or decision trees where valuable
   - Provide specific tool/technology recommendations with reasoning
   - Add "Pro Tips" or "Insider Notes" with genuinely useful insider knowledge
   - Include pitfalls to avoid with specific examples of what goes wrong

5. CONCLUSION (Strong Close):
   - Do NOT start with "In conclusion" or similar
   - Tie everything together into a coherent narrative
   - Provide a clear call-to-action or next steps
   - End with a memorable, resonant closing sentence that stays with the reader
   - Leave them feeling they've gained significant value

6. FORMATTING & SEO:
   - Use markdown (## H2, ### H3, **bold**, *italic*)
   - Include bulleted lists and numbered steps
   - Use blockquotes for important callouts
   - Create 40-60 word paragraphs for featured snippet optimization
   - Include internal link placeholders: [Related: Topic](/blog/topic-slug)

QUALITY CHECKLIST (Self-verify before output):
- [ ] WORD COUNT: Is the article between ${minWords} and ${maxWords} words? (MANDATORY)
- [ ] AUDIENCE: Is this written specifically for ${audience || 'C-Suite/IT Decision Makers'}? (Not generic)
- [ ] ARTICLE TYPE: Does it follow ${articleType || 'How-To Guide'} conventions?
- [ ] TONE: Is the ${tone || 'Authoritative'} tone maintained throughout?
- [ ] Would a busy CTO/VP find this genuinely valuable?
- [ ] Are there at least 5 specific, cited statistics?
- [ ] Does every section provide actionable takeaways?
- [ ] Is there at least one non-obvious insight per major section?
- [ ] Does the opening hook grab attention immediately?
- [ ] Is the advice specific (not generic platitudes)?

Return the full article in markdown format. Make it EXCEPTIONAL and ensure it meets ALL requirements above.`;

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

${NO_DASHES_RULE}

Requirements:
- 150-160 characters (strict limit)
- Lead with the most impressive metric
- Include the industry and key technology
- End with invitation to learn more
- Pattern: "See how [industry] client achieved [specific metric] using [technology]. Read the full case study."

Return ONLY the meta description, nothing else.`;

      case 'metrics':
        return `Generate 4 compelling, quantifiable metrics for a case study.

Client: ${clientName || 'Enterprise client'}
Industry: ${industry || 'Enterprise'}
Technologies: ${technologies?.join(', ') || 'Data & Analytics'}
${existingContent ? `Challenge/Solution Context:\n${existingContent}` : ''}
${existingMetrics && existingMetrics.length > 0 ? `Existing Metrics (improve or complement these):\n${existingMetrics.map(m => `${m.value} - ${m.label}`).join('\n')}` : ''}

${NO_DASHES_RULE}

Requirements:
- Generate exactly 4 metrics
- Each metric must have: value (number with unit), label (what it measures), description (optional context)
- Mix categories: performance, cost savings, efficiency, business impact
- Use realistic enterprise-scale numbers
- Values should be specific (not rounded to nearest 10)

Examples of good metrics:
- Value: "73%", Label: "Reduction in Processing Time", Description: "From 4 hours to 65 minutes"
- Value: "$2.3M", Label: "Annual Cost Savings", Description: "Infrastructure and operations"
- Value: "12x", Label: "Faster Data Pipeline", Description: "Real-time vs batch processing"
- Value: "99.9%", Label: "System Uptime", Description: "SLA-backed reliability"

Return as JSON array:
[
  {"value": "73%", "label": "Reduction in Processing Time", "description": "From 4 hours to 65 minutes"},
  {"value": "$2.3M", "label": "Annual Cost Savings", "description": "Infrastructure and operations"},
  {"value": "12x", "label": "Faster Data Pipeline", "description": "Real-time vs batch"},
  {"value": "99.9%", "label": "System Uptime", "description": "SLA-backed"}
]

Return ONLY the JSON array, nothing else.`;

      case 'seo_fix':
        return `Fix the following SEO issue for a case study.

Issue: ${seoIssue || 'Content needs improvement'}
Current Value: "${currentValue || ''}"

Case Study Context:
- Title: "${title}"
- Client: ${clientName || 'Enterprise client'}
- Industry: ${industry || 'Enterprise'}
- Technologies: ${technologies?.join(', ') || 'Data & Analytics'}
${existingContent ? `Additional Context:\n${existingContent}` : ''}

${NO_DASHES_RULE}

Fix Requirements:
${seoIssue?.includes('title') || seoIssue?.includes('Title') ? `
- Meta title must be 50-60 characters
- Front-load keywords
- Include industry or key result
- Pattern: "[Result] for [Industry] | ACI Case Study"
` : ''}
${seoIssue?.includes('description') || seoIssue?.includes('Description') ? `
- Meta description must be 150-160 characters
- Start with the key metric or result
- Include industry and technology
- End with call to action
` : ''}
${seoIssue?.includes('missing') || seoIssue?.includes('Missing') ? `
- Provide a complete, optimized value
- Follow best practices for this field type
` : ''}
${seoIssue?.includes('keyword') || seoIssue?.includes('Keyword') ? `
- Naturally incorporate relevant keywords
- Don't keyword stuff
- Front-load important terms
` : ''}

Return ONLY the fixed/improved content, nothing else.`;

      default:
        return `Generate ${field} content for case study. ${NO_DASHES_RULE}`;
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

  if (type === 'case_study') {
    const clientName = context.clientName || 'Enterprise Client';
    const industry = context.industry || 'Technology';
    switch (field) {
      case 'excerpt':
        return `${clientName} achieved 40% cost reduction and 3x faster processing through a comprehensive data modernization initiative, transforming legacy systems into a unified, cloud-native platform.`;
      case 'challenge':
        return `${clientName} faced significant challenges with fragmented data systems across multiple business units. Legacy infrastructure was causing delays, inconsistencies, and mounting operational costs. The organization needed a unified approach to data management that could scale with business growth while maintaining compliance and security standards.`;
      case 'solution':
        return `ACI Infotech implemented a comprehensive data modernization strategy, leveraging cloud-native technologies and modern data architecture patterns. The solution included automated data pipelines, real-time analytics capabilities, and a unified data governance framework. Our team worked closely with ${clientName}'s stakeholders to ensure seamless adoption and knowledge transfer.`;
      case 'results':
        return `The transformation delivered measurable business outcomes: 40% reduction in operational costs, 3x faster data processing, 99.9% system uptime, and significantly improved data quality. ${clientName} now has a scalable, future-ready data platform that supports advanced analytics and AI initiatives.`;
      case 'meta_title':
        return `${industry} Data Transformation: 40% Cost Reduction | ACI`;
      case 'meta_description':
        return `See how ${clientName} achieved 40% cost savings and 3x faster processing with ACI's data modernization. Read the full ${industry.toLowerCase()} case study.`;
      case 'seo_fix':
        // Return appropriate fix based on the issue type
        if (context.seoIssue?.toLowerCase().includes('title')) {
          return `${industry} Success: ${clientName} Data Platform | ACI`;
        } else if (context.seoIssue?.toLowerCase().includes('description')) {
          return `Discover how ${clientName} achieved 40% cost reduction and 3x faster processing with ACI's enterprise data solutions. Read the case study.`;
        }
        return context.currentValue || 'Optimized SEO content';
      default:
        return 'Generated case study content placeholder';
    }
  }

  return 'Generated content placeholder';
}

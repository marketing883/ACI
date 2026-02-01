import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  isDataForSEOConfigured,
  comprehensiveKeywordResearch,
  cachedRequest,
  type ComprehensiveKeywordData,
} from '@/lib/dataforseo';

// Data source tracking for transparency
interface DataSources {
  metrics: 'live-api' | 'estimated';
  alternativeKeywords: 'live-api' | 'ai-generated' | 'template';
  questions: 'live-paa' | 'ai-researched' | 'template';
  serp: 'live-api' | 'unavailable';
}

interface KeywordResponse {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  difficultyLabel: 'Easy' | 'Medium' | 'Hard';
  cpc: number;
  trend: number[];
  monthlySearches: { month: string; volume: number }[];
  competitionLevel: string;
  alternativeKeywords: {
    keyword: string;
    note: string;
    volume?: number;
  }[];
  relatedKeywords: {
    keyword: string;
    volume: number;
    cpc?: number;
    competition?: number;
  }[];
  questionsAsked: string[];
  competitorArticles: {
    title: string;
    domain: string;
    url?: string;
    position?: number;
    description?: string;
    isCompetitor?: boolean;
  }[];
  serpFeatures?: {
    featuredSnippet: boolean;
    peopleAlsoAsk: boolean;
    localPack: boolean;
    images: boolean;
    videos: boolean;
  };
  isRealData: boolean;
  dataSources: DataSources;
  warning?: string;
}

// Initialize Anthropic client for AI-powered question generation
function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  return new Anthropic({ apiKey });
}

// AI-powered intelligent question generation based on real search intent
async function generateAIQuestions(keyword: string): Promise<{ questions: string[]; source: 'ai-researched' | 'template' }> {
  const client = getAnthropicClient();

  if (!client) {
    console.log('Anthropic API not configured, using template questions');
    return { questions: generateTemplateQuestions(keyword), source: 'template' };
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are an SEO expert analyzing search intent. Generate 8 specific, high-value questions that enterprise decision-makers and IT leaders actually search for about "${keyword}".

Requirements:
- Questions must be specific and actionable, NOT generic (avoid "What is X?" or "How does X work?")
- Focus on implementation challenges, ROI justification, comparison questions, and strategic decisions
- Include questions about costs, timelines, risks, integration challenges
- Target C-suite and technical leadership audience
- Questions should reveal purchase intent or serious evaluation

Return ONLY a JSON array of 8 question strings, nothing else. Example format:
["Question 1?", "Question 2?", ...]`
      }]
    });

    const textContent = response.content[0];
    if (textContent.type === 'text') {
      try {
        const questions = JSON.parse(textContent.text);
        if (Array.isArray(questions) && questions.length > 0) {
          console.log(`AI generated ${questions.length} intelligent questions for "${keyword}"`);
          return { questions: questions.slice(0, 8), source: 'ai-researched' };
        }
      } catch (parseError) {
        console.error('Failed to parse AI questions response:', parseError);
      }
    }
  } catch (error) {
    console.error('AI question generation error:', error);
  }

  return { questions: generateTemplateQuestions(keyword), source: 'template' };
}

// AI-powered alternative keyword generation with strategic insights
async function generateAIAlternativeKeywords(keyword: string): Promise<{ keywords: { keyword: string; note: string }[]; source: 'ai-generated' | 'template' }> {
  const client = getAnthropicClient();

  if (!client) {
    return { keywords: generateTemplateAlternativeKeywords(keyword), source: 'template' };
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are an SEO strategist. Generate 5 strategic alternative keyword variations for "${keyword}" that would be valuable for an enterprise IT services company to target.

For each keyword, provide a brief strategic note explaining why it's valuable (e.g., "Lower competition, high buyer intent", "Decision-maker focused", "Problem-aware searchers").

Return ONLY a JSON array in this exact format:
[{"keyword": "alternative keyword phrase", "note": "Strategic reason to target"}, ...]`
      }]
    });

    const textContent = response.content[0];
    if (textContent.type === 'text') {
      try {
        const keywords = JSON.parse(textContent.text);
        if (Array.isArray(keywords) && keywords.length > 0) {
          console.log(`AI generated ${keywords.length} alternative keywords for "${keyword}"`);
          return { keywords: keywords.slice(0, 5), source: 'ai-generated' };
        }
      } catch (parseError) {
        console.error('Failed to parse AI keywords response:', parseError);
      }
    }
  } catch (error) {
    console.error('AI keyword generation error:', error);
  }

  return { keywords: generateTemplateAlternativeKeywords(keyword), source: 'template' };
}

// Template-based questions (fallback)
function generateTemplateQuestions(keyword: string): string[] {
  return [
    `What is the ROI of implementing ${keyword}?`,
    `How long does a typical ${keyword} implementation take?`,
    `What are the hidden costs of ${keyword}?`,
    `How does ${keyword} integrate with existing enterprise systems?`,
    `What are the most common ${keyword} implementation failures?`,
    `Which industries benefit most from ${keyword}?`,
    `How to build a business case for ${keyword}?`,
    `What skills does my team need for ${keyword}?`,
  ];
}

// Template-based alternative keywords (fallback)
function generateTemplateAlternativeKeywords(keyword: string): { keyword: string; note: string }[] {
  return [
    { keyword: `${keyword} implementation partner`, note: 'High buyer intent - seeking vendors' },
    { keyword: `${keyword} ROI calculator`, note: 'Decision-stage keyword' },
    { keyword: `${keyword} vs competitors`, note: 'Comparison shoppers - high intent' },
    { keyword: `enterprise ${keyword} solutions`, note: 'B2B enterprise focus' },
    { keyword: `${keyword} consulting services`, note: 'Service-seeking keyword' },
  ];
}

// Generate mock data as fallback when API isn't configured
function generateMockData(keyword: string, aiQuestions?: string[], aiKeywords?: { keyword: string; note: string }[]): KeywordResponse {
  const hash = keyword.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const searchVolume = Math.floor((hash % 50 + 1) * 100);
  const difficulty = Math.floor((hash % 80) + 10);
  const cpc = Math.round((hash % 100) / 10 * 100) / 100;

  return {
    keyword,
    searchVolume,
    difficulty,
    difficultyLabel: difficulty < 30 ? 'Easy' : difficulty < 60 ? 'Medium' : 'Hard',
    cpc,
    trend: [
      Math.floor(searchVolume * 0.8),
      Math.floor(searchVolume * 0.9),
      searchVolume,
      Math.floor(searchVolume * 1.1),
      Math.floor(searchVolume * 0.95),
      searchVolume
    ],
    monthlySearches: [],
    competitionLevel: difficulty < 30 ? 'LOW' : difficulty < 60 ? 'MEDIUM' : 'HIGH',
    alternativeKeywords: aiKeywords || generateTemplateAlternativeKeywords(keyword),
    relatedKeywords: [
      { keyword: `${keyword} best practices`, volume: Math.floor(searchVolume * 0.6) },
      { keyword: `${keyword} guide`, volume: Math.floor(searchVolume * 0.5) },
      { keyword: `how to ${keyword}`, volume: Math.floor(searchVolume * 0.4) },
      { keyword: `${keyword} examples`, volume: Math.floor(searchVolume * 0.35) },
      { keyword: `${keyword} tools`, volume: Math.floor(searchVolume * 0.3) },
    ],
    questionsAsked: aiQuestions || generateTemplateQuestions(keyword),
    competitorArticles: [
      { title: `Complete Guide to ${keyword}`, domain: 'example.com', position: 1 },
      { title: `${keyword} Explained`, domain: 'industry-blog.com', position: 2 },
      { title: `Top 10 ${keyword} Strategies`, domain: 'techsite.io', position: 3 },
    ],
    serpFeatures: {
      featuredSnippet: hash % 3 === 0,
      peopleAlsoAsk: true,
      localPack: false,
      images: hash % 2 === 0,
      videos: hash % 4 === 0,
    },
    isRealData: false,
    dataSources: {
      metrics: 'estimated',
      alternativeKeywords: aiKeywords ? 'ai-generated' : 'template',
      questions: aiQuestions ? 'ai-researched' : 'template',
      serp: 'unavailable',
    },
  };
}

// IT Services competitors for highlighting
const IT_SERVICES_COMPETITORS = [
  'accenture.com', 'deloitte.com', 'kpmg.com', 'pwc.com', 'ey.com',
  'mckinsey.com', 'bain.com', 'bcg.com', 'infosys.com', 'wipro.com',
  'tcs.com', 'hcltech.com', 'techmahindra.com', 'ltimindtree.com',
  'mphasis.com', 'capgemini.com', 'cognizant.com', 'ibm.com', 'dxc.com',
  'atos.net', 'nttdata.com', 'epam.com', 'globant.com', 'thoughtworks.com',
  'slalom.com', 'publicissapient.com', 'persistent.com', 'coforge.com',
  'hexaware.com', 'trianz.com', 'triedence.com', 'nagarro.com', 'endava.com',
];

// Legacy fallback functions removed - now using AI-powered generation above

// Transform DataForSEO response to our format
// Now accepts optional AI-generated data to fill gaps
interface TransformOptions {
  aiQuestions?: { questions: string[]; source: 'ai-researched' | 'template' };
  aiKeywords?: { keywords: { keyword: string; note: string }[]; source: 'ai-generated' | 'template' };
}

function transformDataForSEOResponse(
  data: ComprehensiveKeywordData,
  keyword: string,
  options: TransformOptions = {}
): KeywordResponse {
  const mainKw = data.mainKeyword;
  const difficulty = data.serp?.difficulty || (mainKw?.competition || 50);

  // Track data sources
  const dataSources: DataSources = {
    metrics: mainKw?.searchVolume ? 'live-api' : 'estimated',
    alternativeKeywords: 'live-api',
    questions: 'live-paa',
    serp: data.serp ? 'live-api' : 'unavailable',
  };

  // Use keyword suggestions for alternative keywords (more diverse than related)
  // Combine both sources and dedupe
  const allSuggestions = [
    ...(data.keywordSuggestions || []),
    ...(data.relatedKeywords || []),
  ];

  // Dedupe by keyword
  const seenKeywords = new Set<string>();
  const uniqueSuggestions = allSuggestions.filter(kw => {
    const lower = kw.keyword.toLowerCase();
    if (seenKeywords.has(lower) || lower === keyword.toLowerCase()) return false;
    seenKeywords.add(lower);
    return true;
  });

  // Pick best alternative keywords (low competition + decent volume)
  const sortedAlternatives = uniqueSuggestions
    .filter(kw => kw.searchVolume > 0)
    .sort((a, b) => {
      // Score: higher volume + lower competition = better
      const scoreA = a.searchVolume * (1 - a.competition / 100);
      const scoreB = b.searchVolume * (1 - b.competition / 100);
      return scoreB - scoreA;
    })
    .slice(0, 5);

  // Use API data if available, otherwise use AI-generated or templates
  let alternativeKeywords: { keyword: string; note: string; volume?: number }[];
  if (sortedAlternatives.length > 0) {
    alternativeKeywords = sortedAlternatives.map(kw => ({
      keyword: kw.keyword,
      volume: kw.searchVolume,
      note: kw.competition < 30 ? 'Low competition opportunity' :
            kw.searchVolume > (mainKw?.searchVolume || 0) ? 'Higher volume than main keyword' :
            kw.competition < 50 ? 'Medium competition, good potential' :
            'Related topic to target',
    }));
    dataSources.alternativeKeywords = 'live-api';
  } else if (options.aiKeywords) {
    alternativeKeywords = options.aiKeywords.keywords;
    dataSources.alternativeKeywords = options.aiKeywords.source;
  } else {
    alternativeKeywords = generateTemplateAlternativeKeywords(keyword);
    dataSources.alternativeKeywords = 'template';
  }

  // Use related keywords for the related section
  const relatedKeywords = (data.relatedKeywords || [])
    .filter(kw => kw.searchVolume > 0)
    .slice(0, 10)
    .map(kw => ({
      keyword: kw.keyword,
      volume: kw.searchVolume,
      cpc: kw.cpc,
      competition: kw.competition,
    }));

  // Use API questions if available, otherwise use AI-generated or templates
  const apiQuestions = (data.questions || []).map(q => q.question).filter(Boolean);
  let questionsAsked: string[];

  if (apiQuestions.length > 0) {
    questionsAsked = apiQuestions.slice(0, 8);
    dataSources.questions = 'live-paa';
  } else if (options.aiQuestions) {
    questionsAsked = options.aiQuestions.questions;
    dataSources.questions = options.aiQuestions.source;
  } else {
    questionsAsked = generateTemplateQuestions(keyword);
    dataSources.questions = 'template';
  }

  // Process competitor articles with isCompetitor flag
  const competitorArticles = (data.competitors || []).slice(0, 10).map(c => ({
    title: c.title,
    domain: c.domain,
    url: c.url,
    position: c.position,
    description: c.description,
    isCompetitor: IT_SERVICES_COMPETITORS.some(domain =>
      c.domain.includes(domain.replace('www.', '')) ||
      c.url?.includes(domain.replace('www.', ''))
    ),
  }));

  return {
    keyword: mainKw?.keyword || keyword,
    searchVolume: mainKw?.searchVolume || 0,
    difficulty,
    difficultyLabel: difficulty < 30 ? 'Easy' : difficulty < 60 ? 'Medium' : 'Hard',
    cpc: mainKw?.cpc || 0,
    trend: mainKw?.trend || [],
    monthlySearches: mainKw?.monthlySearches || [],
    competitionLevel: mainKw?.competitionLevel || 'MEDIUM',
    alternativeKeywords,
    relatedKeywords,
    questionsAsked,
    competitorArticles,
    serpFeatures: data.serp?.features ? {
      featuredSnippet: data.serp.features.featuredSnippet,
      peopleAlsoAsk: data.serp.features.peopleAlsoAsk,
      localPack: data.serp.features.localPack,
      images: data.serp.features.images,
      videos: data.serp.features.videos,
    } : undefined,
    isRealData: true,
    dataSources,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { keyword, location = 'United States' } = await request.json();

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }

    const trimmedKeyword = keyword.trim().toLowerCase();

    // Check if DataForSEO is configured
    if (!isDataForSEOConfigured()) {
      console.log('DataForSEO not configured, using AI-enhanced mock data');

      // Generate AI-powered questions and keywords in parallel for better quality
      const [aiQuestionsResult, aiKeywordsResult] = await Promise.all([
        generateAIQuestions(trimmedKeyword),
        generateAIAlternativeKeywords(trimmedKeyword),
      ]);

      const mockData = generateMockData(
        trimmedKeyword,
        aiQuestionsResult.questions,
        aiKeywordsResult.keywords
      );

      // Update data sources based on what we got
      mockData.dataSources.questions = aiQuestionsResult.source;
      mockData.dataSources.alternativeKeywords = aiKeywordsResult.source;

      return NextResponse.json({
        ...mockData,
        warning: 'Using estimated metrics. Configure DataForSEO API for live search data.',
      });
    }

    // Use cached request to save API credits
    const cacheKey = `keyword:${trimmedKeyword}:${location}`;

    try {
      console.log(`Fetching real DataForSEO data for: ${trimmedKeyword}`);

      const data = await cachedRequest(cacheKey, () =>
        comprehensiveKeywordResearch(trimmedKeyword, location)
      );

      // Check if we need to fill gaps with AI
      const hasPAAData = (data.questions || []).length > 0;
      const hasAlternativeData = (data.keywordSuggestions || []).length > 0 || (data.relatedKeywords || []).length > 0;

      let aiQuestionsResult: { questions: string[]; source: 'ai-researched' | 'template' } | undefined;
      let aiKeywordsResult: { keywords: { keyword: string; note: string }[]; source: 'ai-generated' | 'template' } | undefined;

      // If PAA data is missing, generate AI questions
      if (!hasPAAData) {
        console.log('No PAA data from API, generating AI-powered questions');
        aiQuestionsResult = await generateAIQuestions(trimmedKeyword);
      }

      // If alternative keywords are missing, generate AI suggestions
      if (!hasAlternativeData) {
        console.log('No alternative keywords from API, generating AI suggestions');
        aiKeywordsResult = await generateAIAlternativeKeywords(trimmedKeyword);
      }

      const response = transformDataForSEOResponse(data, trimmedKeyword, {
        aiQuestions: aiQuestionsResult,
        aiKeywords: aiKeywordsResult,
      });

      console.log(`DataForSEO returned: volume=${response.searchVolume}, difficulty=${response.difficulty}`);
      console.log(`Data sources: metrics=${response.dataSources.metrics}, questions=${response.dataSources.questions}, serp=${response.dataSources.serp}`);

      return NextResponse.json(response);
    } catch (apiError) {
      console.error('DataForSEO API error:', apiError);

      // Fall back to AI-enhanced mock data if API fails
      const [aiQuestionsResult, aiKeywordsResult] = await Promise.all([
        generateAIQuestions(trimmedKeyword),
        generateAIAlternativeKeywords(trimmedKeyword),
      ]);

      const mockData = generateMockData(
        trimmedKeyword,
        aiQuestionsResult.questions,
        aiKeywordsResult.keywords
      );

      mockData.dataSources.questions = aiQuestionsResult.source;
      mockData.dataSources.alternativeKeywords = aiKeywordsResult.source;

      return NextResponse.json({
        ...mockData,
        warning: 'API error occurred. Showing AI-enhanced estimated data.',
        error: apiError instanceof Error ? apiError.message : 'Unknown error',
      });
    }
  } catch (error) {
    console.error('Keyword research error:', error);
    return NextResponse.json(
      { error: 'Failed to research keyword' },
      { status: 500 }
    );
  }
}

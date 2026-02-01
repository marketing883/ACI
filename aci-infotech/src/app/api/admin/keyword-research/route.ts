import { NextRequest, NextResponse } from 'next/server';
import {
  isDataForSEOConfigured,
  comprehensiveKeywordResearch,
  cachedRequest,
  type ComprehensiveKeywordData,
} from '@/lib/dataforseo';

// Dynamic import for Anthropic to avoid server startup issues
type AnthropicClient = InstanceType<typeof import('@anthropic-ai/sdk').default>;

// Dynamic import type for OpenAI
type OpenAIClient = InstanceType<typeof import('openai').default>;

// Model configuration with 4-layer fallback (Claude Sonnet -> Claude Haiku -> GPT-4o -> GPT-4o-mini)
const MODELS = {
  anthropic: {
    primary: 'claude-sonnet-4-20250514',
    fallback: 'claude-3-5-haiku-20241022',
  },
  openai: {
    primary: 'gpt-4o',
    fallback: 'gpt-4o-mini',
  },
} as const;

// Data source tracking for transparency
// Template sources removed - all content is now AI-generated when API data is unavailable
interface DataSources {
  metrics: 'live-api' | 'estimated';
  alternativeKeywords: 'live-api' | 'ai-generated';
  questions: 'live-paa' | 'ai-researched';
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

// Initialize Anthropic client for AI-powered question generation (dynamic import)
async function getAnthropicClient(): Promise<AnthropicClient | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    return new Anthropic({ apiKey });
  } catch (error) {
    console.error('Failed to load Anthropic SDK:', error);
    return null;
  }
}

// Initialize OpenAI client for fallback (dynamic import)
async function getOpenAIClient(): Promise<OpenAIClient | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const { default: OpenAI } = await import('openai');
    return new OpenAI({ apiKey });
  } catch (error) {
    console.error('Failed to load OpenAI SDK:', error);
    return null;
  }
}

// AI-powered intelligent question generation based on real search intent
// Uses 4-layer model fallback (Claude Sonnet -> Claude Haiku -> GPT-4o -> GPT-4o-mini)
async function generateAIQuestions(keyword: string): Promise<{ questions: string[]; source: 'ai-researched' }> {
  const anthropic = await getAnthropicClient();
  const openai = await getOpenAIClient();

  console.log(`generateAIQuestions: Anthropic configured: ${!!anthropic}, OpenAI configured: ${!!openai}`);

  if (!anthropic && !openai) {
    throw new Error('No AI API configured. Please set ANTHROPIC_API_KEY or OPENAI_API_KEY.');
  }

  const prompt = `You are an SEO expert analyzing search intent. Generate 8 specific, high-value questions that enterprise decision-makers and IT leaders actually search for about "${keyword}".

Requirements:
- Questions must be specific and actionable, NOT generic (avoid "What is X?" or "How does X work?")
- Focus on implementation challenges, ROI justification, comparison questions, and strategic decisions
- Include questions about costs, timelines, risks, integration challenges
- Target C-suite and technical leadership audience
- Questions should reveal purchase intent or serious evaluation

Return ONLY a JSON array of 8 question strings, nothing else. Example format:
["Question 1?", "Question 2?", ...]`;

  const errors: string[] = [];

  // Try Claude models first
  if (anthropic) {
    for (const model of [MODELS.anthropic.primary, MODELS.anthropic.fallback]) {
      try {
        console.log(`Generating questions with model: ${model}`);
        const response = await anthropic.messages.create({
          model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        });

        const textContent = response.content[0];
        if (textContent.type === 'text') {
          let questions: string[] = [];
          try {
            questions = JSON.parse(textContent.text);
          } catch {
            const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              questions = JSON.parse(jsonMatch[0]);
            }
          }

          if (Array.isArray(questions) && questions.length > 0) {
            console.log(`AI generated ${questions.length} questions using ${model}`);
            return { questions: questions.slice(0, 8), source: 'ai-researched' };
          }
        }
      } catch (error) {
        console.error(`Model ${model} failed for questions:`, error);
        errors.push(`${model}: ${error}`);
      }
    }
  }

  // Try OpenAI models as final fallback (GPT-4o -> GPT-4o-mini)
  if (openai) {
    for (const model of [MODELS.openai.primary, MODELS.openai.fallback]) {
      try {
        console.log(`Generating questions with OpenAI model: ${model}`);
        const response = await openai.chat.completions.create({
          model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          let questions: string[] = [];
          try {
            questions = JSON.parse(content);
          } catch {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              questions = JSON.parse(jsonMatch[0]);
            }
          }

          if (Array.isArray(questions) && questions.length > 0) {
            console.log(`OpenAI generated ${questions.length} questions using ${model}`);
            return { questions: questions.slice(0, 8), source: 'ai-researched' };
          }
        }
      } catch (error) {
        console.error(`OpenAI model ${model} failed for questions:`, error);
        errors.push(`OpenAI ${model}: ${error}`);
      }
    }
  }

  throw new Error(`All AI models failed to generate questions. ${errors.join('; ')}`);
}

// AI-powered alternative keyword generation with strategic insights
// Uses 4-layer model fallback (Claude Sonnet -> Claude Haiku -> GPT-4o -> GPT-4o-mini)
async function generateAIAlternativeKeywords(keyword: string): Promise<{ keywords: { keyword: string; note: string }[]; source: 'ai-generated' }> {
  const anthropic = await getAnthropicClient();
  const openai = await getOpenAIClient();

  if (!anthropic && !openai) {
    throw new Error('No AI API configured. Please set ANTHROPIC_API_KEY or OPENAI_API_KEY.');
  }

  const prompt = `You are an SEO strategist. Generate 5 strategic alternative keyword variations for "${keyword}" that would be valuable for an enterprise IT services company to target.

For each keyword, provide a brief strategic note explaining why it's valuable (e.g., "Lower competition, high buyer intent", "Decision-maker focused", "Problem-aware searchers").

Return ONLY a JSON array in this exact format:
[{"keyword": "alternative keyword phrase", "note": "Strategic reason to target"}, ...]`;

  const errors: string[] = [];

  // Try Claude models first
  if (anthropic) {
    for (const model of [MODELS.anthropic.primary, MODELS.anthropic.fallback]) {
      try {
        console.log(`Generating alternative keywords with model: ${model}`);
        const response = await anthropic.messages.create({
          model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        });

        const textContent = response.content[0];
        if (textContent.type === 'text') {
          let keywords: { keyword: string; note: string }[] = [];
          try {
            keywords = JSON.parse(textContent.text);
          } catch {
            const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              keywords = JSON.parse(jsonMatch[0]);
            }
          }

          if (Array.isArray(keywords) && keywords.length > 0) {
            console.log(`AI generated ${keywords.length} keywords using ${model}`);
            return { keywords: keywords.slice(0, 5), source: 'ai-generated' };
          }
        }
      } catch (error) {
        console.error(`Model ${model} failed for keywords:`, error);
        errors.push(`${model}: ${error}`);
      }
    }
  }

  // Try OpenAI models as final fallback (GPT-4o -> GPT-4o-mini)
  if (openai) {
    for (const model of [MODELS.openai.primary, MODELS.openai.fallback]) {
      try {
        console.log(`Generating alternative keywords with OpenAI model: ${model}`);
        const response = await openai.chat.completions.create({
          model,
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }]
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          let keywords: { keyword: string; note: string }[] = [];
          try {
            keywords = JSON.parse(content);
          } catch {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              keywords = JSON.parse(jsonMatch[0]);
            }
          }

          if (Array.isArray(keywords) && keywords.length > 0) {
            console.log(`OpenAI generated ${keywords.length} keywords using ${model}`);
            return { keywords: keywords.slice(0, 5), source: 'ai-generated' };
          }
        }
      } catch (error) {
        console.error(`OpenAI model ${model} failed for keywords:`, error);
        errors.push(`OpenAI ${model}: ${error}`);
      }
    }
  }

  throw new Error(`All AI models failed to generate keywords. ${errors.join('; ')}`);
}

// All template/mock functions removed - AI generation is now required

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
// AI-generated data is now required when API data is missing (no template fallback)
interface TransformOptions {
  aiQuestions?: { questions: string[]; source: 'ai-researched' };
  aiKeywords?: { keywords: { keyword: string; note: string }[]; source: 'ai-generated' };
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

  // Use API data if available, otherwise use AI-generated (AI data is now required)
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
    // No API data and no AI data provided - this should not happen
    // Return empty array with unavailable source
    alternativeKeywords = [];
    dataSources.alternativeKeywords = 'ai-generated';
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

  // Use API questions if available, otherwise use AI-generated (AI data is now required)
  const apiQuestions = (data.questions || []).map(q => q.question).filter(Boolean);
  let questionsAsked: string[];

  if (apiQuestions.length > 0) {
    questionsAsked = apiQuestions.slice(0, 8);
    dataSources.questions = 'live-paa';
  } else if (options.aiQuestions) {
    questionsAsked = options.aiQuestions.questions;
    dataSources.questions = options.aiQuestions.source;
  } else {
    // No API data and no AI data provided - this should not happen
    // Return empty array with unavailable source
    questionsAsked = [];
    dataSources.questions = 'ai-researched';
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
  // Diagnostic logging for API configuration
  console.log('=== Keyword Research API Debug ===');
  console.log('ANTHROPIC_API_KEY set:', !!process.env.ANTHROPIC_API_KEY);
  console.log('OPENAI_API_KEY set:', !!process.env.OPENAI_API_KEY);
  console.log('DATAFORSEO_LOGIN set:', !!process.env.DATAFORSEO_LOGIN);
  console.log('DATAFORSEO_PASSWORD set:', !!process.env.DATAFORSEO_PASSWORD);
  console.log('=================================');

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
      console.log('DataForSEO not configured, generating AI-powered content research');

      try {
        // Generate AI-powered questions and keywords in parallel
        // These will throw errors if AI generation fails (no mock fallback)
        const [aiQuestionsResult, aiKeywordsResult] = await Promise.all([
          generateAIQuestions(trimmedKeyword),
          generateAIAlternativeKeywords(trimmedKeyword),
        ]);

        // Return AI-generated content research without fake metrics
        // Metrics are unavailable without DataForSEO
        const response: KeywordResponse = {
          keyword: trimmedKeyword,
          searchVolume: 0,
          difficulty: 0,
          difficultyLabel: 'Medium',
          cpc: 0,
          trend: [],
          monthlySearches: [],
          competitionLevel: 'UNKNOWN',
          alternativeKeywords: aiKeywordsResult.keywords,
          relatedKeywords: [],
          questionsAsked: aiQuestionsResult.questions,
          competitorArticles: [],
          isRealData: false,
          dataSources: {
            metrics: 'estimated',
            alternativeKeywords: aiKeywordsResult.source,
            questions: aiQuestionsResult.source,
            serp: 'unavailable',
          },
          warning: 'Search metrics unavailable. Configure DataForSEO API for volume, difficulty, and competitor data. Questions and keywords are AI-generated.',
        };

        return NextResponse.json(response);
      } catch (aiError) {
        console.error('AI generation failed:', aiError);
        return NextResponse.json(
          {
            error: 'AI generation failed. Please check ANTHROPIC_API_KEY or OPENAI_API_KEY configuration.',
            details: aiError instanceof Error ? aiError.message : 'Unknown error'
          },
          { status: 503 }
        );
      }
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

      let aiQuestionsResult: { questions: string[]; source: 'ai-researched' } | undefined;
      let aiKeywordsResult: { keywords: { keyword: string; note: string }[]; source: 'ai-generated' } | undefined;

      // If PAA data is missing, TRY to generate AI questions (optional enhancement)
      if (!hasPAAData) {
        try {
          console.log('No PAA data from API, generating AI-powered questions');
          aiQuestionsResult = await generateAIQuestions(trimmedKeyword);
        } catch (aiError) {
          console.warn('AI question generation failed, continuing with DataForSEO data only:', aiError);
          // Continue without AI questions - DataForSEO data is still valid
        }
      }

      // If alternative keywords are missing, TRY to generate AI suggestions (optional enhancement)
      if (!hasAlternativeData) {
        try {
          console.log('No alternative keywords from API, generating AI suggestions');
          aiKeywordsResult = await generateAIAlternativeKeywords(trimmedKeyword);
        } catch (aiError) {
          console.warn('AI keyword generation failed, continuing with DataForSEO data only:', aiError);
          // Continue without AI keywords - DataForSEO data is still valid
        }
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

      // Fall back to AI-generated content research if DataForSEO API fails
      // No mock metrics - only AI-generated questions and keywords
      try {
        const [aiQuestionsResult, aiKeywordsResult] = await Promise.all([
          generateAIQuestions(trimmedKeyword),
          generateAIAlternativeKeywords(trimmedKeyword),
        ]);

        const response: KeywordResponse = {
          keyword: trimmedKeyword,
          searchVolume: 0,
          difficulty: 0,
          difficultyLabel: 'Medium',
          cpc: 0,
          trend: [],
          monthlySearches: [],
          competitionLevel: 'UNKNOWN',
          alternativeKeywords: aiKeywordsResult.keywords,
          relatedKeywords: [],
          questionsAsked: aiQuestionsResult.questions,
          competitorArticles: [],
          isRealData: false,
          dataSources: {
            metrics: 'estimated',
            alternativeKeywords: aiKeywordsResult.source,
            questions: aiQuestionsResult.source,
            serp: 'unavailable',
          },
          warning: 'DataForSEO API error. Questions and keywords are AI-generated. Search metrics unavailable.',
          error: apiError instanceof Error ? apiError.message : 'Unknown error',
        };

        return NextResponse.json(response);
      } catch (aiError) {
        console.error('AI generation also failed:', aiError);
        return NextResponse.json(
          {
            error: 'DataForSEO API failed and AI generation also failed. Please check API configurations.',
            dataForSeoError: apiError instanceof Error ? apiError.message : 'Unknown error',
            aiError: aiError instanceof Error ? aiError.message : 'Unknown error'
          },
          { status: 503 }
        );
      }
    }
  } catch (error) {
    console.error('Keyword research error:', error);
    return NextResponse.json(
      {
        error: 'Failed to research keyword',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

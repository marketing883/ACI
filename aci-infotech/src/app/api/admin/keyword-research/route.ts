import { NextRequest, NextResponse } from 'next/server';
import {
  isDataForSEOConfigured,
  comprehensiveKeywordResearch,
  cachedRequest,
  type ComprehensiveKeywordData,
} from '@/lib/dataforseo';

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
}

// Generate mock data as fallback when API isn't configured
function generateMockData(keyword: string): KeywordResponse {
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
    alternativeKeywords: [
      { keyword: `${keyword} for enterprise`, note: 'Lower competition with good volume' },
      { keyword: `best ${keyword} practices`, note: 'High intent keyword' },
    ],
    relatedKeywords: [
      { keyword: `${keyword} best practices`, volume: Math.floor(searchVolume * 0.6) },
      { keyword: `${keyword} guide`, volume: Math.floor(searchVolume * 0.5) },
      { keyword: `how to ${keyword}`, volume: Math.floor(searchVolume * 0.4) },
      { keyword: `${keyword} examples`, volume: Math.floor(searchVolume * 0.35) },
      { keyword: `${keyword} tools`, volume: Math.floor(searchVolume * 0.3) },
    ],
    questionsAsked: [
      `What is ${keyword}?`,
      `How to implement ${keyword}?`,
      `Why is ${keyword} important?`,
      `Best ${keyword} tools?`,
      `${keyword} vs alternatives?`,
    ],
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

// Generate fallback keywords based on the main keyword
function generateFallbackKeywords(keyword: string): { keyword: string; note: string; volume?: number }[] {
  const words = keyword.split(' ');
  const suggestions = [
    { keyword: `${keyword} best practices`, note: 'High intent modifier' },
    { keyword: `${keyword} implementation`, note: 'Action-oriented' },
    { keyword: `${keyword} strategy`, note: 'Decision-maker target' },
    { keyword: `${keyword} solutions`, note: 'Commercial intent' },
    { keyword: `enterprise ${keyword}`, note: 'Enterprise focus' },
    { keyword: `${keyword} for business`, note: 'Business audience' },
    { keyword: `${keyword} architecture`, note: 'Technical depth' },
    { keyword: `${keyword} migration`, note: 'Project-focused' },
  ];

  // Add variations if multi-word keyword
  if (words.length > 1) {
    suggestions.push({ keyword: words[0], note: 'Broader term' });
    suggestions.push({ keyword: `${words[0]} ${words[words.length - 1]}`, note: 'Simplified variant' });
  }

  return suggestions.slice(0, 5);
}

// Generate fallback questions
function generateFallbackQuestions(keyword: string): string[] {
  return [
    `What is ${keyword}?`,
    `How does ${keyword} work?`,
    `What are the benefits of ${keyword}?`,
    `How to implement ${keyword}?`,
    `What is the difference between ${keyword} and traditional approaches?`,
    `Who should use ${keyword}?`,
    `What are ${keyword} best practices?`,
    `How much does ${keyword} cost?`,
  ];
}

// Transform DataForSEO response to our format
function transformDataForSEOResponse(data: ComprehensiveKeywordData, keyword: string): KeywordResponse {
  const mainKw = data.mainKeyword;
  const difficulty = data.serp?.difficulty || (mainKw?.competition || 50);

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

  // Use API data if available, otherwise generate fallbacks
  const alternativeKeywords = sortedAlternatives.length > 0
    ? sortedAlternatives.map(kw => ({
        keyword: kw.keyword,
        volume: kw.searchVolume,
        note: kw.competition < 30 ? 'Low competition opportunity' :
              kw.searchVolume > (mainKw?.searchVolume || 0) ? 'Higher volume than main keyword' :
              kw.competition < 50 ? 'Medium competition, good potential' :
              'Related topic to target',
      }))
    : generateFallbackKeywords(keyword);

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

  // Use API questions if available, otherwise generate fallbacks
  const apiQuestions = (data.questions || []).map(q => q.question).filter(Boolean);
  const questionsAsked = apiQuestions.length > 0
    ? apiQuestions.slice(0, 8)
    : generateFallbackQuestions(keyword);

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
      console.log('DataForSEO not configured, using mock data');
      // Simulate API delay for consistent UX
      await new Promise(resolve => setTimeout(resolve, 500));
      return NextResponse.json({
        ...generateMockData(trimmedKeyword),
        warning: 'Using estimated data. Configure DataForSEO API for real metrics.',
      });
    }

    // Use cached request to save API credits
    const cacheKey = `keyword:${trimmedKeyword}:${location}`;

    try {
      console.log(`Fetching real DataForSEO data for: ${trimmedKeyword}`);

      const data = await cachedRequest(cacheKey, () =>
        comprehensiveKeywordResearch(trimmedKeyword, location)
      );

      const response = transformDataForSEOResponse(data, trimmedKeyword);

      console.log(`DataForSEO returned: volume=${response.searchVolume}, difficulty=${response.difficulty}`);

      return NextResponse.json(response);
    } catch (apiError) {
      console.error('DataForSEO API error:', apiError);

      // Fall back to mock data if API fails
      return NextResponse.json({
        ...generateMockData(trimmedKeyword),
        warning: 'API error occurred. Showing estimated data.',
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

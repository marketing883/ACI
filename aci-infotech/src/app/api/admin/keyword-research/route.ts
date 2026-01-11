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

// Transform DataForSEO response to our format
function transformDataForSEOResponse(data: ComprehensiveKeywordData, keyword: string): KeywordResponse {
  const mainKw = data.mainKeyword;
  const difficulty = data.serp?.difficulty || (mainKw?.competition || 50);

  // Generate alternative keyword suggestions based on related keywords
  const alternativeKeywords = data.relatedKeywords.slice(0, 3).map(kw => ({
    keyword: kw.keyword,
    note: kw.competition < 30 ? 'Low competition opportunity' :
          kw.searchVolume > (mainKw?.searchVolume || 0) ? 'Higher volume than main keyword' :
          'Related topic',
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
    relatedKeywords: data.relatedKeywords.slice(0, 10).map(kw => ({
      keyword: kw.keyword,
      volume: kw.searchVolume,
      cpc: kw.cpc,
      competition: kw.competition,
    })),
    questionsAsked: data.questions.map(q => q.question).slice(0, 8),
    competitorArticles: data.competitors.slice(0, 10).map(c => ({
      title: c.title,
      domain: c.domain,
      url: c.url,
      position: c.position,
    })),
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

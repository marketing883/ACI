import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// DataforSEO credentials
const DATAFORSEO_USERNAME = process.env.DATAFORSEO_USERNAME || 'habib@thearq.ai';
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD || 'Quantumtheory@1';
const DATAFORSEO_API_URL = 'https://api.dataforseo.com/v3';

// Supabase for caching
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface KeywordData {
  keyword: string;
  search_volume: number;
  cpc: number;
  competition: number;
  difficulty?: number;
  related_keywords?: string[];
}

async function makeDataforSEORequest(endpoint: string, data: unknown[]) {
  const auth = Buffer.from(`${DATAFORSEO_USERNAME}:${DATAFORSEO_PASSWORD}`).toString('base64');

  const response = await fetch(`${DATAFORSEO_API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`DataforSEO API error: ${response.status}`);
  }

  return response.json();
}

// Check cache first
async function getCachedKeywordData(keyword: string): Promise<KeywordData | null> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('seo_metrics')
    .select('*')
    .eq('keyword', keyword.toLowerCase())
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) return null;

  return {
    keyword: data.keyword,
    search_volume: data.search_volume,
    cpc: data.cpc,
    competition: data.competition,
    difficulty: data.difficulty,
    related_keywords: data.related_keywords,
  };
}

// Save to cache
async function cacheKeywordData(data: KeywordData) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  await supabase
    .from('seo_metrics')
    .upsert({
      keyword: data.keyword.toLowerCase(),
      search_volume: data.search_volume,
      cpc: data.cpc,
      competition: data.competition,
      difficulty: data.difficulty,
      related_keywords: data.related_keywords,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    }, {
      onConflict: 'keyword',
    });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, keywords, location = 2840 } = body; // 2840 = United States

    if (!keywords || (Array.isArray(keywords) && keywords.length === 0)) {
      return NextResponse.json(
        { error: 'Keywords are required' },
        { status: 400 }
      );
    }

    const keywordList = Array.isArray(keywords) ? keywords : [keywords];

    switch (action) {
      case 'keyword_research':
        return handleKeywordResearch(keywordList, location);

      case 'related_keywords':
        return handleRelatedKeywords(keywordList[0], location);

      case 'serp_analysis':
        return handleSerpAnalysis(keywordList[0], location);

      case 'content_ideas':
        return handleContentIdeas(keywordList[0], location);

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: keyword_research, related_keywords, serp_analysis, or content_ideas' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('SEO API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'SEO analysis failed' },
      { status: 500 }
    );
  }
}

async function handleKeywordResearch(keywords: string[], location: number) {
  const results: KeywordData[] = [];
  const uncachedKeywords: string[] = [];

  // Check cache first
  for (const keyword of keywords) {
    const cached = await getCachedKeywordData(keyword);
    if (cached) {
      results.push(cached);
    } else {
      uncachedKeywords.push(keyword);
    }
  }

  // Fetch uncached keywords from DataforSEO
  if (uncachedKeywords.length > 0) {
    try {
      const response = await makeDataforSEORequest(
        '/keywords_data/google_ads/search_volume/live',
        [{
          keywords: uncachedKeywords,
          location_code: location,
          language_code: 'en',
        }]
      );

      if (response.tasks?.[0]?.result) {
        for (const item of response.tasks[0].result) {
          const keywordData: KeywordData = {
            keyword: item.keyword,
            search_volume: item.search_volume || 0,
            cpc: item.cpc || 0,
            competition: item.competition || 0,
            difficulty: Math.round((item.competition || 0) * 100), // Convert to 0-100 scale
          };

          results.push(keywordData);
          await cacheKeywordData(keywordData);
        }
      }
    } catch (error) {
      console.error('DataforSEO error:', error);
      // Return cached results if API fails
    }
  }

  return NextResponse.json({
    success: true,
    data: results,
  });
}

async function handleRelatedKeywords(keyword: string, location: number) {
  try {
    const response = await makeDataforSEORequest(
      '/keywords_data/google_ads/keywords_for_keywords/live',
      [{
        keywords: [keyword],
        location_code: location,
        language_code: 'en',
        include_seed_keyword: true,
        limit: 20,
      }]
    );

    const related = response.tasks?.[0]?.result?.map((item: {
      keyword: string;
      search_volume: number;
      cpc: number;
      competition: number;
    }) => ({
      keyword: item.keyword,
      search_volume: item.search_volume || 0,
      cpc: item.cpc || 0,
      competition: item.competition || 0,
    })) || [];

    return NextResponse.json({
      success: true,
      keyword,
      related,
    });
  } catch (error) {
    console.error('DataforSEO related keywords error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch related keywords',
      keyword,
      related: [],
    });
  }
}

async function handleSerpAnalysis(keyword: string, location: number) {
  try {
    const response = await makeDataforSEORequest(
      '/serp/google/organic/live/regular',
      [{
        keyword,
        location_code: location,
        language_code: 'en',
        depth: 10,
      }]
    );

    const items = response.tasks?.[0]?.result?.[0]?.items || [];
    const organic = items
      .filter((item: { type: string }) => item.type === 'organic')
      .slice(0, 10)
      .map((item: {
        rank_group: number;
        title: string;
        url: string;
        description: string;
        domain: string;
      }) => ({
        position: item.rank_group,
        title: item.title,
        url: item.url,
        description: item.description,
        domain: item.domain,
      }));

    return NextResponse.json({
      success: true,
      keyword,
      serp: organic,
    });
  } catch (error) {
    console.error('DataforSEO SERP error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch SERP data',
      keyword,
      serp: [],
    });
  }
}

async function handleContentIdeas(keyword: string, location: number) {
  try {
    // Get related keywords and questions
    const [relatedResponse, questionsResponse] = await Promise.all([
      makeDataforSEORequest(
        '/keywords_data/google_ads/keywords_for_keywords/live',
        [{
          keywords: [keyword],
          location_code: location,
          language_code: 'en',
          limit: 10,
        }]
      ),
      makeDataforSEORequest(
        '/dataforseo_labs/google/related_keywords/live',
        [{
          keyword,
          location_code: location,
          language_code: 'en',
          limit: 10,
        }]
      ).catch(() => ({ tasks: [] })), // Fallback if questions API fails
    ]);

    const relatedKeywords = relatedResponse.tasks?.[0]?.result?.map((item: {
      keyword: string;
      search_volume: number;
    }) => ({
      keyword: item.keyword,
      search_volume: item.search_volume || 0,
    })) || [];

    const questions = questionsResponse.tasks?.[0]?.result?.items
      ?.filter((item: { keyword_data: { keyword: string } }) =>
        item.keyword_data?.keyword?.includes('?') ||
        item.keyword_data?.keyword?.startsWith('how') ||
        item.keyword_data?.keyword?.startsWith('what') ||
        item.keyword_data?.keyword?.startsWith('why') ||
        item.keyword_data?.keyword?.startsWith('when')
      )
      ?.map((item: { keyword_data: { keyword: string; search_volume: number } }) => ({
        question: item.keyword_data.keyword,
        search_volume: item.keyword_data.search_volume || 0,
      })) || [];

    // Generate content suggestions based on keywords
    const contentIdeas = relatedKeywords.slice(0, 5).map((kw: { keyword: string; search_volume: number }) => ({
      title: `How to ${kw.keyword.charAt(0).toUpperCase() + kw.keyword.slice(1)}`,
      keyword: kw.keyword,
      estimated_volume: kw.search_volume,
    }));

    return NextResponse.json({
      success: true,
      keyword,
      content_ideas: contentIdeas,
      related_keywords: relatedKeywords,
      questions,
    });
  } catch (error) {
    console.error('DataforSEO content ideas error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate content ideas',
      keyword,
      content_ideas: [],
      related_keywords: [],
      questions: [],
    });
  }
}

// GET endpoint for quick keyword lookup
export async function GET(request: NextRequest) {
  const keyword = request.nextUrl.searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json(
      { error: 'Keyword parameter required' },
      { status: 400 }
    );
  }

  // Check cache first
  const cached = await getCachedKeywordData(keyword);
  if (cached) {
    return NextResponse.json({
      success: true,
      cached: true,
      data: cached,
    });
  }

  // Fetch from DataforSEO
  try {
    const response = await makeDataforSEORequest(
      '/keywords_data/google_ads/search_volume/live',
      [{
        keywords: [keyword],
        location_code: 2840,
        language_code: 'en',
      }]
    );

    const item = response.tasks?.[0]?.result?.[0];
    if (item) {
      const keywordData: KeywordData = {
        keyword: item.keyword,
        search_volume: item.search_volume || 0,
        cpc: item.cpc || 0,
        competition: item.competition || 0,
        difficulty: Math.round((item.competition || 0) * 100),
      };

      await cacheKeywordData(keywordData);

      return NextResponse.json({
        success: true,
        cached: false,
        data: keywordData,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        keyword,
        search_volume: 0,
        cpc: 0,
        competition: 0,
        difficulty: 0,
      },
    });
  } catch (error) {
    console.error('DataforSEO error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch keyword data' },
      { status: 500 }
    );
  }
}

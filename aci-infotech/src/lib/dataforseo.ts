/**
 * DataForSEO API Integration Service
 * Premium API for real SEO/AEO data
 */

const DATAFORSEO_API_URL = 'https://api.dataforseo.com/v3';

interface DataForSEOConfig {
  login: string;
  password: string;
}

function getCredentials(): DataForSEOConfig | null {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;

  if (!login || !password) {
    return null;
  }

  return { login, password };
}

function getAuthHeader(): string | null {
  const creds = getCredentials();
  if (!creds) return null;

  return 'Basic ' + Buffer.from(`${creds.login}:${creds.password}`).toString('base64');
}

export function isDataForSEOConfigured(): boolean {
  return getCredentials() !== null;
}

async function makeRequest<T>(endpoint: string, data: unknown[]): Promise<T> {
  const authHeader = getAuthHeader();

  if (!authHeader) {
    throw new Error('DataForSEO credentials not configured');
  }

  const response = await fetch(`${DATAFORSEO_API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DataForSEO API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// ============================================================
// KEYWORD RESEARCH
// ============================================================

export interface KeywordMetrics {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  trend: number[];
  monthlySearches: { month: string; volume: number }[];
}

export interface KeywordSuggestion {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
}

export interface KeywordResearchResult {
  mainKeyword: KeywordMetrics;
  relatedKeywords: KeywordSuggestion[];
  longTailKeywords: KeywordSuggestion[];
}

export async function getKeywordData(keyword: string, location: string = 'United States'): Promise<KeywordMetrics | null> {
  try {
    const response = await makeRequest<{
      tasks: Array<{
        result: Array<{
          keyword: string;
          search_volume: number;
          cpc: number;
          competition: number;
          competition_level: string;
          monthly_searches: Array<{ month: string; search_volume: number }>;
        }>;
      }>;
    }>('/keywords_data/google_ads/search_volume/live', [
      {
        keywords: [keyword],
        location_name: location,
        language_name: 'English',
      },
    ]);

    const result = response.tasks?.[0]?.result?.[0];
    if (!result) return null;

    const monthlySearches = result.monthly_searches || [];
    const trend = monthlySearches.slice(-6).map(m => m.search_volume);

    return {
      keyword: result.keyword,
      searchVolume: result.search_volume || 0,
      cpc: result.cpc || 0,
      competition: Math.round((result.competition || 0) * 100),
      competitionLevel: (result.competition_level?.toUpperCase() || 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH',
      trend,
      monthlySearches: monthlySearches.map(m => ({
        month: m.month,
        volume: m.search_volume,
      })),
    };
  } catch (error) {
    console.error('Error fetching keyword data:', error);
    return null;
  }
}

export async function getRelatedKeywords(keyword: string, location: string = 'United States'): Promise<KeywordSuggestion[]> {
  try {
    const response = await makeRequest<{
      tasks: Array<{
        result: Array<{
          items: Array<{
            keyword_data: {
              keyword: string;
              search_volume: number;
              cpc: number;
              competition: number;
            };
          }>;
        }>;
      }>;
    }>('/dataforseo_labs/google/related_keywords/live', [
      {
        keyword,
        location_name: location,
        language_name: 'English',
        limit: 20,
      },
    ]);

    const items = response.tasks?.[0]?.result?.[0]?.items || [];

    return items.map(item => ({
      keyword: item.keyword_data.keyword,
      searchVolume: item.keyword_data.search_volume || 0,
      cpc: item.keyword_data.cpc || 0,
      competition: Math.round((item.keyword_data.competition || 0) * 100),
    })).filter(k => k.searchVolume > 0);
  } catch (error) {
    console.error('Error fetching related keywords:', error);
    return [];
  }
}

export async function getKeywordSuggestions(keyword: string, location: string = 'United States'): Promise<KeywordSuggestion[]> {
  try {
    const response = await makeRequest<{
      tasks: Array<{
        result: Array<{
          items: Array<{
            keyword: string;
            search_volume: number;
            cpc: number;
            competition: number;
          }>;
        }>;
      }>;
    }>('/dataforseo_labs/google/keyword_suggestions/live', [
      {
        keyword,
        location_name: location,
        language_name: 'English',
        include_serp_info: false,
        limit: 30,
      },
    ]);

    const items = response.tasks?.[0]?.result?.[0]?.items || [];

    return items.map(item => ({
      keyword: item.keyword,
      searchVolume: item.search_volume || 0,
      cpc: item.cpc || 0,
      competition: Math.round((item.competition || 0) * 100),
    })).filter(k => k.searchVolume > 0);
  } catch (error) {
    console.error('Error fetching keyword suggestions:', error);
    return [];
  }
}

// ============================================================
// SERP ANALYSIS
// ============================================================

export interface SERPResult {
  position: number;
  title: string;
  url: string;
  domain: string;
  description: string;
  type: string;
}

export interface SERPFeatures {
  featuredSnippet: boolean;
  peopleAlsoAsk: boolean;
  localPack: boolean;
  knowledgePanel: boolean;
  images: boolean;
  videos: boolean;
  shopping: boolean;
}

export interface SERPAnalysis {
  keyword: string;
  totalResults: number;
  organicResults: SERPResult[];
  features: SERPFeatures;
  difficulty: number;
}

export async function analyzeSERP(keyword: string, location: string = 'United States'): Promise<SERPAnalysis | null> {
  try {
    const response = await makeRequest<{
      tasks: Array<{
        result: Array<{
          keyword: string;
          se_results_count: number;
          items: Array<{
            type: string;
            rank_group: number;
            title: string;
            url: string;
            domain: string;
            description: string;
          }>;
          item_types: string[];
        }>;
      }>;
    }>('/serp/google/organic/live/regular', [
      {
        keyword,
        location_name: location,
        language_name: 'English',
        depth: 20,
      },
    ]);

    const result = response.tasks?.[0]?.result?.[0];
    if (!result) return null;

    const organicItems = result.items?.filter(i => i.type === 'organic') || [];
    const itemTypes = result.item_types || [];

    // Calculate difficulty based on domain authority of top results
    const difficulty = Math.min(100, Math.round(organicItems.length * 5 + 20));

    return {
      keyword: result.keyword,
      totalResults: result.se_results_count || 0,
      organicResults: organicItems.slice(0, 10).map(item => ({
        position: item.rank_group,
        title: item.title || '',
        url: item.url || '',
        domain: item.domain || '',
        description: item.description || '',
        type: item.type,
      })),
      features: {
        featuredSnippet: itemTypes.includes('featured_snippet'),
        peopleAlsoAsk: itemTypes.includes('people_also_ask'),
        localPack: itemTypes.includes('local_pack'),
        knowledgePanel: itemTypes.includes('knowledge_graph'),
        images: itemTypes.includes('images'),
        videos: itemTypes.includes('video'),
        shopping: itemTypes.includes('shopping'),
      },
      difficulty,
    };
  } catch (error) {
    console.error('Error analyzing SERP:', error);
    return null;
  }
}

// ============================================================
// PEOPLE ALSO ASK / QUESTIONS
// ============================================================

export interface QuestionData {
  question: string;
  expandedElement?: {
    title: string;
    url: string;
    description: string;
  };
}

export async function getPeopleAlsoAsk(keyword: string, location: string = 'United States'): Promise<QuestionData[]> {
  try {
    const response = await makeRequest<{
      tasks: Array<{
        result: Array<{
          items: Array<{
            type: string;
            items?: Array<{
              title: string;
              expanded_element?: {
                title: string;
                url: string;
                description: string;
              };
            }>;
          }>;
        }>;
      }>;
    }>('/serp/google/organic/live/regular', [
      {
        keyword,
        location_name: location,
        language_name: 'English',
        depth: 10,
      },
    ]);

    const result = response.tasks?.[0]?.result?.[0];
    const paaItem = result?.items?.find(i => i.type === 'people_also_ask');

    if (!paaItem?.items) return [];

    return paaItem.items.map(item => ({
      question: item.title,
      expandedElement: item.expanded_element ? {
        title: item.expanded_element.title,
        url: item.expanded_element.url,
        description: item.expanded_element.description,
      } : undefined,
    }));
  } catch (error) {
    console.error('Error fetching PAA:', error);
    return [];
  }
}

// ============================================================
// CONTENT ANALYSIS
// ============================================================

export interface ContentAnalysis {
  wordCount: number;
  readingTime: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  keywordDensity: Record<string, number>;
  recommendations: string[];
}

export async function analyzeContent(url: string): Promise<ContentAnalysis | null> {
  try {
    const response = await makeRequest<{
      tasks: Array<{
        result: Array<{
          items: Array<{
            meta: {
              title: string;
              description: string;
            };
            page_content: {
              plain_text_word_count: number;
            };
          }>;
        }>;
      }>;
    }>('/on_page/content_parsing/live', [
      {
        url,
        enable_javascript: true,
      },
    ]);

    const result = response.tasks?.[0]?.result?.[0]?.items?.[0];
    if (!result) return null;

    const wordCount = result.page_content?.plain_text_word_count || 0;

    return {
      wordCount,
      readingTime: Math.ceil(wordCount / 200),
      sentiment: 'neutral',
      keywordDensity: {},
      recommendations: [],
    };
  } catch (error) {
    console.error('Error analyzing content:', error);
    return null;
  }
}

// ============================================================
// COMPETITOR ANALYSIS
// ============================================================

export interface CompetitorData {
  domain: string;
  title: string;
  url: string;
  position: number;
  description?: string;
  estimatedTraffic?: number;
}

export async function getCompetitors(keyword: string, location: string = 'United States'): Promise<CompetitorData[]> {
  const serp = await analyzeSERP(keyword, location);

  if (!serp) return [];

  return serp.organicResults.map(result => ({
    domain: result.domain,
    title: result.title,
    url: result.url,
    position: result.position,
  }));
}

// ============================================================
// COMPREHENSIVE KEYWORD RESEARCH (combines multiple endpoints)
// ============================================================

// Target IT services competitor domains to filter SERP results
// These are the actual competitors - IT consulting/services firms
const IT_SERVICES_COMPETITORS = [
  // Big 4 & Major Consulting
  'accenture.com',
  'deloitte.com',
  'kpmg.com',
  'pwc.com',
  'ey.com',
  'mckinsey.com',
  'bain.com',
  'bcg.com',
  // Large IT Services (Indian heritage)
  'infosys.com',
  'wipro.com',
  'tcs.com',
  'hcltech.com',
  'techmahindra.com',
  'ltimindtree.com',
  'mphasis.com',
  'mindtree.com',
  // Global IT Services
  'capgemini.com',
  'cognizant.com',
  'ibm.com',
  'dxc.com',
  'atos.net',
  'nttdata.com',
  'fujitsu.com',
  // Mid-size IT Services
  'epam.com',
  'globant.com',
  'thoughtworks.com',
  'slalom.com',
  'publicissapient.com',
  'persistent.com',
  'coforge.com',
  'zensar.com',
  'birlasoft.com',
  'hexaware.com',
  'cyient.com',
  'mastek.com',
  'virtusa.com',
  'softwareag.com',
  // Smaller/Specialized firms
  'trianz.com',
  'triedence.com',
  'softchoice.com',
  'ness.com',
  'synechron.com',
  'nagarro.com',
  'endava.com',
  'luxoft.com',
];

export interface ComprehensiveKeywordData {
  mainKeyword: KeywordMetrics | null;
  relatedKeywords: KeywordSuggestion[];
  keywordSuggestions: KeywordSuggestion[];
  questions: QuestionData[];
  serp: SERPAnalysis | null;
  competitors: CompetitorData[];
  allSerpResults: CompetitorData[];
}

export async function comprehensiveKeywordResearch(
  keyword: string,
  location: string = 'United States'
): Promise<ComprehensiveKeywordData> {
  // Run all requests in parallel for speed
  const [mainKeyword, relatedKeywords, keywordSuggestions, questions, serp] = await Promise.all([
    getKeywordData(keyword, location),
    getRelatedKeywords(keyword, location),
    getKeywordSuggestions(keyword, location),
    getPeopleAlsoAsk(keyword, location),
    analyzeSERP(keyword, location),
  ]);

  // Log API responses for debugging
  console.log(`[DataForSEO] Keyword: ${keyword}`);
  console.log(`[DataForSEO] Main keyword data: ${mainKeyword ? 'received' : 'null'}`);
  console.log(`[DataForSEO] Related keywords: ${relatedKeywords.length} results`);
  console.log(`[DataForSEO] Keyword suggestions: ${keywordSuggestions.length} results`);
  console.log(`[DataForSEO] Questions: ${questions.length} results`);
  console.log(`[DataForSEO] SERP results: ${serp?.organicResults.length || 0} results`);

  const allSerpResults = serp?.organicResults.map(r => ({
    domain: r.domain,
    title: r.title,
    url: r.url,
    position: r.position,
    description: r.description,
  })) || [];

  // Mark which results are from IT services competitors
  const competitorResults = allSerpResults.map(r => ({
    ...r,
    isCompetitor: IT_SERVICES_COMPETITORS.some(domain =>
      r.domain.includes(domain.replace('www.', '')) ||
      r.url.includes(domain.replace('www.', ''))
    ),
  }));

  // Filter to only show competitors if any exist
  const competitors = competitorResults.filter(r => r.isCompetitor);

  console.log(`[DataForSEO] Competitor articles found: ${competitors.length}`);

  return {
    mainKeyword,
    relatedKeywords,
    keywordSuggestions,
    questions,
    serp,
    // Return all SERP results - let the API route handle the display
    competitors: allSerpResults,
    allSerpResults,
  };
}

// ============================================================
// CACHE LAYER (to reduce API costs)
// ============================================================

const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

export function setCache(key: string, data: unknown): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function cachedRequest<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = getCached<T>(key);
  if (cached !== null) {
    return cached;
  }

  const data = await fetcher();
  setCache(key, data);
  return data;
}

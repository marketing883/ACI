import { NextRequest, NextResponse } from 'next/server';

interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  difficultyLabel: 'Easy' | 'Medium' | 'Hard';
  cpc: number;
  trend: number;
  alternativeKeywords: {
    keyword: string;
    note: string;
  }[];
  relatedKeywords: {
    keyword: string;
    volume: number;
  }[];
  questionsAsked: string[];
  competitorArticles: {
    title: string;
    domain: string;
  }[];
}

// Generate realistic mock data based on keyword
function generateKeywordData(keyword: string): KeywordData {
  // Generate pseudo-random but consistent values based on keyword
  const hash = keyword.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const searchVolume = Math.floor((hash % 50 + 1) * 100); // 100-5000
  const difficulty = Math.floor((hash % 80) + 10); // 10-90
  const cpc = Math.round((hash % 100) / 10 * 100) / 100; // 0.00-10.00
  const trend = Math.floor((hash % 30) - 10); // -10 to +20

  const difficultyLabel: 'Easy' | 'Medium' | 'Hard' =
    difficulty < 30 ? 'Easy' : difficulty < 60 ? 'Medium' : 'Hard';

  // Generate related keywords
  const keywordParts = keyword.toLowerCase().split(' ');
  const baseWord = keywordParts[keywordParts.length - 1] || keyword;

  const alternativeKeywords = [
    {
      keyword: `${keyword} for enterprise`,
      note: 'Lower competition with good volume',
    },
    {
      keyword: `best ${keyword} practices`,
      note: 'High intent keyword',
    },
  ];

  const relatedKeywords = [
    { keyword: `${keyword} best practices`, volume: Math.floor(searchVolume * 0.6) },
    { keyword: `${keyword} guide`, volume: Math.floor(searchVolume * 0.5) },
    { keyword: `${keyword} examples`, volume: Math.floor(searchVolume * 0.4) },
    { keyword: `how to implement ${keyword}`, volume: Math.floor(searchVolume * 0.35) },
    { keyword: `${keyword} tools`, volume: Math.floor(searchVolume * 0.3) },
  ];

  const questionsAsked = [
    `What is ${keyword}?`,
    `How to implement ${keyword}?`,
    `Why is ${keyword} important?`,
    `Best ${keyword} tools?`,
  ];

  const competitorArticles = [
    {
      title: `Complete Guide to ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} f...`,
      domain: 'example.com',
    },
    {
      title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Expla...`,
      domain: 'industry-blog.com',
    },
    {
      title: `Top 10 ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Strategies`,
      domain: 'techsite.io',
    },
  ];

  return {
    keyword,
    searchVolume,
    difficulty,
    difficultyLabel,
    cpc,
    trend,
    alternativeKeywords,
    relatedKeywords,
    questionsAsked,
    competitorArticles,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { keyword } = await request.json();

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Keyword is required' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const data = generateKeywordData(keyword.trim());

    return NextResponse.json(data);

  } catch (error) {
    console.error('Keyword research error:', error);
    return NextResponse.json(
      { error: 'Failed to research keyword' },
      { status: 500 }
    );
  }
}

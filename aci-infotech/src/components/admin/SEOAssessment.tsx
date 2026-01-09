'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Bot,
  MessageSquare,
  TrendingUp,
  FileText,
  Link2,
  Image as ImageIcon,
  List,
  HelpCircle,
  Quote,
  BarChart3,
  Target,
  Zap,
} from 'lucide-react';

interface ContentData {
  title: string;
  metaDescription?: string;
  content: string;
  slug?: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  author?: string;
}

interface AssessmentResult {
  score: number;
  status: 'good' | 'warning' | 'error';
  message: string;
  suggestion?: string;
}

interface CategoryAssessment {
  name: string;
  icon: React.ReactNode;
  score: number;
  maxScore: number;
  items: AssessmentResult[];
  expanded?: boolean;
}

// Helper functions
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countSentences(text: string): number {
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
}

function getReadabilityScore(text: string): number {
  const words = countWords(text);
  const sentences = countSentences(text);
  const syllables = text.toLowerCase().replace(/[^a-z]/g, '').length / 3; // Rough estimate

  if (words === 0 || sentences === 0) return 0;

  // Simplified Flesch-Kincaid
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, score));
}

function extractHeadings(content: string): { level: number; text: string }[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: { level: number; text: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2],
    });
  }

  return headings;
}

function countQuestions(content: string): number {
  return (content.match(/\?/g) || []).length;
}

function countLists(content: string): number {
  const bulletLists = (content.match(/^[-*]\s/gm) || []).length;
  const numberedLists = (content.match(/^\d+\.\s/gm) || []).length;
  return bulletLists + numberedLists;
}

function countInternalLinks(content: string): number {
  const linkRegex = /\[([^\]]+)\]\(\/[^)]+\)/g;
  return (content.match(linkRegex) || []).length;
}

function countExternalLinks(content: string): number {
  const linkRegex = /\[([^\]]+)\]\(https?:\/\/[^)]+\)/g;
  return (content.match(linkRegex) || []).length;
}

function hasStatistics(content: string): boolean {
  // Look for percentages, numbers with units, or data patterns
  const statsPattern = /\d+%|\$\d+|\d+\s*(million|billion|thousand|x|times|years?|months?|days?|hours?)/gi;
  return statsPattern.test(content);
}

function hasCitations(content: string): boolean {
  // Look for citation patterns
  const citationPattern = /according to|research shows|study found|data from|source:|cited|reference/gi;
  return citationPattern.test(content);
}

function hasDefinitions(content: string): boolean {
  // Look for definition patterns useful for AEO
  const defPattern = /\bis\s+(a|an|the)\s+\w+|\bmeans\s+|\brefers to\s+|\bdefined as\s+/gi;
  return defPattern.test(content);
}

function hasFAQStructure(content: string): boolean {
  // Look for Q&A patterns
  const faqPattern = /^(Q:|Question:|FAQ|What is|How do|Why does|When should|Where can)/gim;
  return faqPattern.test(content);
}

function hasHowToStructure(content: string): boolean {
  // Look for step-by-step patterns
  const howToPattern = /(step\s*\d|first,|second,|third,|next,|finally,|how to)/gi;
  return howToPattern.test(content);
}

// Main assessment function
function assessContent(data: ContentData): CategoryAssessment[] {
  const { title, metaDescription, content, slug, tags, featuredImage, featuredImageAlt } = data;
  const wordCount = countWords(content);
  const readability = getReadabilityScore(content);
  const headings = extractHeadings(content);

  // SEO Assessment
  const seoItems: AssessmentResult[] = [];

  // Title assessment
  if (!title) {
    seoItems.push({ score: 0, status: 'error', message: 'Missing title', suggestion: 'Add a compelling title' });
  } else if (title.length < 30) {
    seoItems.push({ score: 1, status: 'warning', message: `Title too short (${title.length} chars)`, suggestion: 'Aim for 50-60 characters' });
  } else if (title.length > 60) {
    seoItems.push({ score: 1, status: 'warning', message: `Title too long (${title.length} chars)`, suggestion: 'Keep under 60 characters for full display in search' });
  } else {
    seoItems.push({ score: 2, status: 'good', message: `Title length optimal (${title.length} chars)` });
  }

  // Meta description
  if (!metaDescription) {
    seoItems.push({ score: 0, status: 'error', message: 'Missing meta description', suggestion: 'Add a 150-160 character description' });
  } else if (metaDescription.length < 120) {
    seoItems.push({ score: 1, status: 'warning', message: `Meta description short (${metaDescription.length} chars)`, suggestion: 'Aim for 150-160 characters' });
  } else if (metaDescription.length > 160) {
    seoItems.push({ score: 1, status: 'warning', message: `Meta description long (${metaDescription.length} chars)`, suggestion: 'Keep under 160 characters' });
  } else {
    seoItems.push({ score: 2, status: 'good', message: `Meta description optimal (${metaDescription.length} chars)` });
  }

  // URL/Slug
  if (!slug) {
    seoItems.push({ score: 0, status: 'warning', message: 'No slug set', suggestion: 'Create a keyword-rich URL slug' });
  } else if (slug.length > 75) {
    seoItems.push({ score: 1, status: 'warning', message: 'Slug too long', suggestion: 'Keep URLs concise and descriptive' });
  } else {
    seoItems.push({ score: 2, status: 'good', message: 'URL slug present' });
  }

  // Content length
  if (wordCount < 300) {
    seoItems.push({ score: 0, status: 'error', message: `Content too short (${wordCount} words)`, suggestion: 'Aim for at least 1,000 words for SEO' });
  } else if (wordCount < 1000) {
    seoItems.push({ score: 1, status: 'warning', message: `Content could be longer (${wordCount} words)`, suggestion: 'Long-form content (1,500-2,500 words) ranks better' });
  } else if (wordCount >= 1500) {
    seoItems.push({ score: 2, status: 'good', message: `Excellent content length (${wordCount} words)` });
  } else {
    seoItems.push({ score: 2, status: 'good', message: `Good content length (${wordCount} words)` });
  }

  // Heading structure
  const h1Count = headings.filter(h => h.level === 1).length;
  const h2Count = headings.filter(h => h.level === 2).length;

  if (h2Count === 0) {
    seoItems.push({ score: 0, status: 'error', message: 'No H2 headings found', suggestion: 'Add subheadings to structure content' });
  } else if (h2Count < 3) {
    seoItems.push({ score: 1, status: 'warning', message: `Only ${h2Count} H2 headings`, suggestion: 'Add more subheadings for better structure' });
  } else {
    seoItems.push({ score: 2, status: 'good', message: `Good heading structure (${h2Count} H2s)` });
  }

  // Featured image
  if (!featuredImage) {
    seoItems.push({ score: 0, status: 'warning', message: 'No featured image', suggestion: 'Add a featured image for social sharing' });
  } else if (!featuredImageAlt) {
    seoItems.push({ score: 1, status: 'warning', message: 'Featured image missing alt text', suggestion: 'Add descriptive alt text for accessibility & SEO' });
  } else {
    seoItems.push({ score: 2, status: 'good', message: 'Featured image with alt text' });
  }

  // Internal links
  const internalLinks = countInternalLinks(content);
  if (internalLinks === 0) {
    seoItems.push({ score: 0, status: 'warning', message: 'No internal links', suggestion: 'Add 2-3 internal links to related content' });
  } else if (internalLinks < 2) {
    seoItems.push({ score: 1, status: 'warning', message: `Only ${internalLinks} internal link(s)`, suggestion: 'Add more internal links' });
  } else {
    seoItems.push({ score: 2, status: 'good', message: `${internalLinks} internal links` });
  }

  const seoScore = seoItems.reduce((sum, item) => sum + item.score, 0);
  const seoMaxScore = seoItems.length * 2;

  // AEO Assessment (Answer Engine Optimization)
  const aeoItems: AssessmentResult[] = [];

  // Question-based content
  const questionCount = countQuestions(content);
  if (questionCount === 0) {
    aeoItems.push({ score: 0, status: 'warning', message: 'No questions in content', suggestion: 'Include questions that users might ask' });
  } else if (questionCount < 3) {
    aeoItems.push({ score: 1, status: 'warning', message: `${questionCount} question(s) found`, suggestion: 'Add more Q&A style content' });
  } else {
    aeoItems.push({ score: 2, status: 'good', message: `${questionCount} questions - good for featured snippets` });
  }

  // Direct answers (short paragraphs after headings)
  if (hasDefinitions(content)) {
    aeoItems.push({ score: 2, status: 'good', message: 'Contains clear definitions', suggestion: 'Great for "What is..." queries' });
  } else {
    aeoItems.push({ score: 0, status: 'warning', message: 'No clear definitions found', suggestion: 'Add "X is..." or "X means..." statements' });
  }

  // Lists for featured snippets
  const listCount = countLists(content);
  if (listCount === 0) {
    aeoItems.push({ score: 0, status: 'warning', message: 'No lists found', suggestion: 'Add bulleted/numbered lists for snippet eligibility' });
  } else if (listCount < 2) {
    aeoItems.push({ score: 1, status: 'warning', message: `${listCount} list(s) found`, suggestion: 'More lists improve snippet chances' });
  } else {
    aeoItems.push({ score: 2, status: 'good', message: `${listCount} lists - excellent for snippets` });
  }

  // FAQ structure
  if (hasFAQStructure(content)) {
    aeoItems.push({ score: 2, status: 'good', message: 'FAQ structure detected', suggestion: 'Consider adding FAQ schema markup' });
  } else {
    aeoItems.push({ score: 0, status: 'warning', message: 'No FAQ section', suggestion: 'Add a FAQ section for People Also Ask' });
  }

  // How-to structure
  if (hasHowToStructure(content)) {
    aeoItems.push({ score: 2, status: 'good', message: 'How-to/step content detected', suggestion: 'Consider adding HowTo schema markup' });
  } else {
    aeoItems.push({ score: 1, status: 'warning', message: 'No step-by-step content', suggestion: 'Add numbered steps for how-to queries' });
  }

  // Concise answer paragraphs (40-60 words ideal for snippets)
  const paragraphs = content.split(/\n\n+/);
  const snippetReadyParagraphs = paragraphs.filter(p => {
    const words = countWords(p);
    return words >= 40 && words <= 60;
  }).length;

  if (snippetReadyParagraphs >= 2) {
    aeoItems.push({ score: 2, status: 'good', message: `${snippetReadyParagraphs} snippet-ready paragraphs (40-60 words)` });
  } else {
    aeoItems.push({ score: 1, status: 'warning', message: 'Few snippet-optimized paragraphs', suggestion: 'Include 40-60 word summary paragraphs' });
  }

  const aeoScore = aeoItems.reduce((sum, item) => sum + item.score, 0);
  const aeoMaxScore = aeoItems.length * 2;

  // GEO Assessment (Generative Engine Optimization)
  const geoItems: AssessmentResult[] = [];

  // E-E-A-T signals: Author attribution
  if (data.author) {
    geoItems.push({ score: 2, status: 'good', message: 'Author attributed', suggestion: 'Builds trust with AI systems' });
  } else {
    geoItems.push({ score: 0, status: 'warning', message: 'No author attribution', suggestion: 'Add author for E-E-A-T signals' });
  }

  // Statistics and data
  if (hasStatistics(content)) {
    geoItems.push({ score: 2, status: 'good', message: 'Contains statistics/data', suggestion: 'Quantitative data improves AI citations' });
  } else {
    geoItems.push({ score: 0, status: 'warning', message: 'No statistics found', suggestion: 'Add numbers, percentages, or metrics' });
  }

  // Citations and sources
  if (hasCitations(content)) {
    geoItems.push({ score: 2, status: 'good', message: 'Contains citations/sources', suggestion: 'Sourced content is more likely to be cited by AI' });
  } else {
    geoItems.push({ score: 0, status: 'warning', message: 'No citations found', suggestion: 'Reference studies, reports, or authoritative sources' });
  }

  // External links (credibility)
  const externalLinks = countExternalLinks(content);
  if (externalLinks >= 2) {
    geoItems.push({ score: 2, status: 'good', message: `${externalLinks} external references`, suggestion: 'Linking to authoritative sources builds credibility' });
  } else if (externalLinks === 1) {
    geoItems.push({ score: 1, status: 'warning', message: '1 external reference', suggestion: 'Add more authoritative external links' });
  } else {
    geoItems.push({ score: 0, status: 'warning', message: 'No external references', suggestion: 'Link to authoritative sources' });
  }

  // Comprehensive coverage (word count for topic depth)
  if (wordCount >= 2000) {
    geoItems.push({ score: 2, status: 'good', message: 'Comprehensive topic coverage', suggestion: 'In-depth content is preferred by AI systems' });
  } else if (wordCount >= 1000) {
    geoItems.push({ score: 1, status: 'warning', message: 'Moderate topic depth', suggestion: 'Expand content for comprehensive coverage' });
  } else {
    geoItems.push({ score: 0, status: 'warning', message: 'Limited topic coverage', suggestion: 'AI prefers comprehensive, authoritative content' });
  }

  // Readability for AI parsing
  if (readability >= 60) {
    geoItems.push({ score: 2, status: 'good', message: `Good readability (${Math.round(readability)})`, suggestion: 'Clear writing is easier for AI to parse' });
  } else if (readability >= 40) {
    geoItems.push({ score: 1, status: 'warning', message: `Moderate readability (${Math.round(readability)})`, suggestion: 'Simplify sentences for better AI comprehension' });
  } else {
    geoItems.push({ score: 0, status: 'warning', message: `Low readability (${Math.round(readability)})`, suggestion: 'Use shorter sentences and simpler words' });
  }

  // Unique insights/perspective
  const uniquePhrases = /in our experience|we've found|our approach|based on our work|we recommend/gi;
  if (uniquePhrases.test(content)) {
    geoItems.push({ score: 2, status: 'good', message: 'Contains unique insights', suggestion: 'Original perspectives increase AI citation likelihood' });
  } else {
    geoItems.push({ score: 1, status: 'warning', message: 'No unique perspectives detected', suggestion: 'Add "In our experience..." or expert opinions' });
  }

  // Entity clarity (proper nouns, brand mentions)
  const entityPattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
  const entities = content.match(entityPattern) || [];
  const uniqueEntities = new Set(entities).size;

  if (uniqueEntities >= 10) {
    geoItems.push({ score: 2, status: 'good', message: `${uniqueEntities} entities mentioned`, suggestion: 'Clear entity references help AI understanding' });
  } else if (uniqueEntities >= 5) {
    geoItems.push({ score: 1, status: 'warning', message: `${uniqueEntities} entities mentioned`, suggestion: 'Mention more specific tools, companies, or concepts' });
  } else {
    geoItems.push({ score: 0, status: 'warning', message: 'Few named entities', suggestion: 'Use specific names for tools, companies, technologies' });
  }

  const geoScore = geoItems.reduce((sum, item) => sum + item.score, 0);
  const geoMaxScore = geoItems.length * 2;

  return [
    {
      name: 'SEO',
      icon: <Search className="w-4 h-4" />,
      score: seoScore,
      maxScore: seoMaxScore,
      items: seoItems,
      expanded: true,
    },
    {
      name: 'AEO (Answer Engine)',
      icon: <MessageSquare className="w-4 h-4" />,
      score: aeoScore,
      maxScore: aeoMaxScore,
      items: aeoItems,
      expanded: false,
    },
    {
      name: 'GEO (Generative AI)',
      icon: <Bot className="w-4 h-4" />,
      score: geoScore,
      maxScore: geoMaxScore,
      items: geoItems,
      expanded: false,
    },
  ];
}

// Component
interface SEOAssessmentProps {
  title: string;
  metaDescription?: string;
  content: string;
  slug?: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  author?: string;
  className?: string;
}

export default function SEOAssessment({
  title,
  metaDescription,
  content,
  slug,
  category,
  tags,
  featuredImage,
  featuredImageAlt,
  author,
  className = '',
}: SEOAssessmentProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'SEO': true,
    'AEO (Answer Engine)': false,
    'GEO (Generative AI)': false,
  });

  const assessment = useMemo(() => {
    return assessContent({
      title,
      metaDescription,
      content,
      slug,
      category,
      tags,
      featuredImage,
      featuredImageAlt,
      author,
    });
  }, [title, metaDescription, content, slug, category, tags, featuredImage, featuredImageAlt, author]);

  const totalScore = assessment.reduce((sum, cat) => sum + cat.score, 0);
  const totalMaxScore = assessment.reduce((sum, cat) => sum + cat.maxScore, 0);
  const overallPercentage = Math.round((totalScore / totalMaxScore) * 100);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good':
        return <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />;
    }
  };

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[var(--aci-primary)]" />
            Content Quality Score
          </h3>
          <div className={`text-2xl font-bold ${getScoreColor(overallPercentage)}`}>
            {overallPercentage}%
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getScoreBg(overallPercentage)}`}
            style={{ width: `${overallPercentage}%` }}
          />
        </div>

        {/* Quick stats */}
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span>{countWords(content)} words</span>
          <span>{extractHeadings(content).length} headings</span>
          <span>{countInternalLinks(content)} internal links</span>
        </div>
      </div>

      {/* Categories */}
      <div className="divide-y divide-gray-100">
        {assessment.map((category) => {
          const percentage = Math.round((category.score / category.maxScore) * 100);
          const isExpanded = expandedCategories[category.name];

          return (
            <div key={category.name}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category.name)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    percentage >= 80 ? 'bg-green-100 text-green-600' :
                    percentage >= 60 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {category.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{category.name}</div>
                    <div className="text-xs text-gray-500">
                      {category.items.filter(i => i.status === 'good').length}/{category.items.length} checks passed
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`font-semibold ${getScoreColor(percentage)}`}>
                    {percentage}%
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Category items */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg text-sm ${
                        item.status === 'good' ? 'bg-green-50' :
                        item.status === 'warning' ? 'bg-yellow-50' :
                        'bg-red-50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.message}</div>
                          {item.suggestion && (
                            <div className="text-gray-600 text-xs mt-1">
                              {item.suggestion}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tips footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <Zap className="w-4 h-4 text-[var(--aci-primary)] flex-shrink-0 mt-0.5" />
          <div>
            <strong>Pro tip:</strong> For best results, aim for 80%+ in all categories.
            GEO optimization helps your content get cited by ChatGPT, Perplexity, and other AI systems.
          </div>
        </div>
      </div>
    </div>
  );
}

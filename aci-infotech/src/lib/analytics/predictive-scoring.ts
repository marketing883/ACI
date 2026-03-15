// ============================================
// PREDICTIVE LEAD SCORING
// ML-inspired scoring based on behavioral patterns
// ============================================

import { VisitorSession, PageView, IntentSignal } from './types';

// ============================================
// SCORING WEIGHTS (tunable)
// ============================================

const SCORING_WEIGHTS = {
  // Page type scores
  pages: {
    contact: 25,
    pricing: 20,
    services: 15,
    'case-study': 12,
    whitepaper: 10,
    playbook: 8,
    blog: 5,
    about: 4,
    home: 2,
    other: 1,
  },

  // Engagement factors
  engagement: {
    scrollDepth75Plus: 10,
    scrollDepth90Plus: 15,
    timeOnPage2Min: 8,
    timeOnPage5Min: 15,
    multiplePageViews: 10,
    fiveOrMorePages: 20,
    returnVisitor: 15,
    multipleSessions: 20,
  },

  // Interaction signals
  interactions: {
    chatEngagement: 25,
    formFocus: 10,
    ctaClick: 8,
    downloadStart: 15,
    downloadComplete: 20,
    videoPlay: 5,
    videoComplete: 12,
  },

  // Company enrichment bonuses
  company: {
    identified: 10,
    enterpriseSize: 15,
    midMarket: 10,
    targetIndustry: 15,
  },

  // Negative signals
  penalties: {
    bounceRate: -10,
    singlePage: -5,
    shortSession: -3,
    botLikeBehavior: -50,
  },
};

// ============================================
// INTENT SIGNALS
// ============================================

const INTENT_SIGNAL_PATTERNS = {
  pricing_view: {
    pages: ['/pricing', '/contact'],
    minViews: 1,
    strength: 'high' as const,
  },
  case_study_read: {
    pages: ['/case-studies/'],
    minTimeMs: 90000, // 90 seconds
    strength: 'high' as const,
  },
  whitepaper_download: {
    events: ['download'],
    strength: 'high' as const,
  },
  return_visit: {
    minSessions: 2,
    strength: 'medium' as const,
  },
  high_engagement: {
    minEngagementScore: 60,
    strength: 'medium' as const,
  },
  contact_page: {
    pages: ['/contact'],
    strength: 'high' as const,
  },
  demo_interest: {
    keywords: ['demo', 'trial', 'poc', 'pilot'],
    strength: 'high' as const,
  },
  competitor_comparison: {
    pages: ['/vs/', '/compare/', '/alternative'],
    strength: 'medium' as const,
  },
};

// ============================================
// MAIN SCORING FUNCTION
// ============================================

export interface ScoringResult {
  score: number;
  breakdown: {
    category: string;
    points: number;
    reason: string;
  }[];
  intentSignals: IntentSignal[];
  conversionProbability: number;
  tier: 'hot' | 'warm' | 'cold';
}

export function calculatePredictiveScore(
  session: Partial<VisitorSession>,
  pageViews: PageView[],
  journeyData?: {
    totalSessions: number;
    totalPageViews: number;
    totalTimeSeconds: number;
    companyName?: string;
    companySize?: string;
    companyIndustry?: string;
  }
): ScoringResult {
  const breakdown: { category: string; points: number; reason: string }[] = [];
  const intentSignals: IntentSignal[] = [];
  let totalScore = 0;

  // ============================================
  // 1. PAGE TYPE SCORING
  // ============================================
  const pageTypes = new Set<string>();
  pageViews.forEach((pv) => {
    const pageType = getPageType(pv.page_path);
    pageTypes.add(pageType);

    const pageScore = SCORING_WEIGHTS.pages[pageType as keyof typeof SCORING_WEIGHTS.pages] || 1;
    totalScore += pageScore;

    breakdown.push({
      category: 'Page Views',
      points: pageScore,
      reason: `Visited ${pageType} page: ${pv.page_path}`,
    });
  });

  // Contact page intent signal
  if (pageTypes.has('contact')) {
    intentSignals.push({
      signal_type: 'contact_page',
      strength: 'high',
      detected_at: new Date().toISOString(),
      context: { pages: Array.from(pageTypes) },
    });
  }

  // ============================================
  // 2. ENGAGEMENT SCORING
  // ============================================

  // Scroll depth
  const avgScrollDepth =
    pageViews.length > 0
      ? pageViews.reduce((sum, pv) => sum + (pv.max_scroll_depth || 0), 0) / pageViews.length
      : 0;

  if (avgScrollDepth >= 90) {
    totalScore += SCORING_WEIGHTS.engagement.scrollDepth90Plus;
    breakdown.push({
      category: 'Engagement',
      points: SCORING_WEIGHTS.engagement.scrollDepth90Plus,
      reason: `Deep scrolling (avg ${Math.round(avgScrollDepth)}% depth)`,
    });
  } else if (avgScrollDepth >= 75) {
    totalScore += SCORING_WEIGHTS.engagement.scrollDepth75Plus;
    breakdown.push({
      category: 'Engagement',
      points: SCORING_WEIGHTS.engagement.scrollDepth75Plus,
      reason: `Good scroll depth (avg ${Math.round(avgScrollDepth)}%)`,
    });
  }

  // Time on page
  const avgTimeOnPage =
    pageViews.length > 0
      ? pageViews.reduce((sum, pv) => sum + (pv.time_on_page_ms || 0), 0) /
        pageViews.length /
        1000
      : 0;

  if (avgTimeOnPage >= 300) {
    totalScore += SCORING_WEIGHTS.engagement.timeOnPage5Min;
    breakdown.push({
      category: 'Engagement',
      points: SCORING_WEIGHTS.engagement.timeOnPage5Min,
      reason: `High time on page (avg ${Math.round(avgTimeOnPage / 60)} min)`,
    });
  } else if (avgTimeOnPage >= 120) {
    totalScore += SCORING_WEIGHTS.engagement.timeOnPage2Min;
    breakdown.push({
      category: 'Engagement',
      points: SCORING_WEIGHTS.engagement.timeOnPage2Min,
      reason: `Good time on page (avg ${Math.round(avgTimeOnPage)}s)`,
    });
  }

  // Page count
  if (pageViews.length >= 5) {
    totalScore += SCORING_WEIGHTS.engagement.fiveOrMorePages;
    breakdown.push({
      category: 'Engagement',
      points: SCORING_WEIGHTS.engagement.fiveOrMorePages,
      reason: `Viewed ${pageViews.length} pages`,
    });

    intentSignals.push({
      signal_type: 'high_engagement',
      strength: 'high',
      detected_at: new Date().toISOString(),
      context: { pageCount: pageViews.length },
    });
  } else if (pageViews.length >= 3) {
    totalScore += SCORING_WEIGHTS.engagement.multiplePageViews;
    breakdown.push({
      category: 'Engagement',
      points: SCORING_WEIGHTS.engagement.multiplePageViews,
      reason: `Viewed ${pageViews.length} pages`,
    });
  }

  // ============================================
  // 3. JOURNEY DATA (multi-session)
  // ============================================
  if (journeyData) {
    // Return visitor bonus
    if (journeyData.totalSessions >= 3) {
      totalScore += SCORING_WEIGHTS.engagement.multipleSessions;
      breakdown.push({
        category: 'Journey',
        points: SCORING_WEIGHTS.engagement.multipleSessions,
        reason: `Return visitor (${journeyData.totalSessions} sessions)`,
      });

      intentSignals.push({
        signal_type: 'return_visit',
        strength: 'high',
        detected_at: new Date().toISOString(),
        context: { sessionCount: journeyData.totalSessions },
      });
    } else if (journeyData.totalSessions >= 2) {
      totalScore += SCORING_WEIGHTS.engagement.returnVisitor;
      breakdown.push({
        category: 'Journey',
        points: SCORING_WEIGHTS.engagement.returnVisitor,
        reason: 'Return visitor',
      });

      intentSignals.push({
        signal_type: 'return_visit',
        strength: 'medium',
        detected_at: new Date().toISOString(),
      });
    }

    // Company enrichment bonus
    if (journeyData.companyName) {
      totalScore += SCORING_WEIGHTS.company.identified;
      breakdown.push({
        category: 'Company',
        points: SCORING_WEIGHTS.company.identified,
        reason: `Company identified: ${journeyData.companyName}`,
      });

      // Enterprise bonus
      if (
        journeyData.companySize === 'Enterprise' ||
        journeyData.companySize === 'Fortune 500'
      ) {
        totalScore += SCORING_WEIGHTS.company.enterpriseSize;
        breakdown.push({
          category: 'Company',
          points: SCORING_WEIGHTS.company.enterpriseSize,
          reason: 'Enterprise company',
        });
      } else if (journeyData.companySize === 'Mid-Market') {
        totalScore += SCORING_WEIGHTS.company.midMarket;
        breakdown.push({
          category: 'Company',
          points: SCORING_WEIGHTS.company.midMarket,
          reason: 'Mid-market company',
        });
      }

      // Target industry bonus
      const targetIndustries = [
        'Financial Services',
        'Healthcare',
        'Retail',
        'Technology',
        'Manufacturing',
      ];
      if (journeyData.companyIndustry && targetIndustries.includes(journeyData.companyIndustry)) {
        totalScore += SCORING_WEIGHTS.company.targetIndustry;
        breakdown.push({
          category: 'Company',
          points: SCORING_WEIGHTS.company.targetIndustry,
          reason: `Target industry: ${journeyData.companyIndustry}`,
        });
      }
    }
  }

  // ============================================
  // 4. CASE STUDY DEEP READ
  // ============================================
  const caseStudyViews = pageViews.filter((pv) => pv.page_path.includes('/case-studies/'));
  const deepCaseStudyRead = caseStudyViews.some((pv) => (pv.time_on_page_ms || 0) > 90000);

  if (deepCaseStudyRead) {
    intentSignals.push({
      signal_type: 'case_study_read',
      strength: 'high',
      detected_at: new Date().toISOString(),
      context: { caseStudies: caseStudyViews.map((pv) => pv.page_path) },
    });
  }

  // ============================================
  // 5. PENALTIES
  // ============================================

  // Bounce (single page, short time)
  if (pageViews.length === 1 && avgTimeOnPage < 30) {
    totalScore += SCORING_WEIGHTS.penalties.bounceRate;
    breakdown.push({
      category: 'Penalty',
      points: SCORING_WEIGHTS.penalties.bounceRate,
      reason: 'Quick bounce detected',
    });
  }

  // Single page visit
  if (pageViews.length === 1) {
    totalScore += SCORING_WEIGHTS.penalties.singlePage;
    breakdown.push({
      category: 'Penalty',
      points: SCORING_WEIGHTS.penalties.singlePage,
      reason: 'Single page session',
    });
  }

  // ============================================
  // 6. CALCULATE CONVERSION PROBABILITY
  // ============================================

  // Normalize score to 0-100 range
  const normalizedScore = Math.max(0, Math.min(100, totalScore));

  // Calculate conversion probability (sigmoid-like function)
  const conversionProbability = 1 / (1 + Math.exp(-0.1 * (normalizedScore - 50)));

  // Determine tier
  let tier: 'hot' | 'warm' | 'cold';
  if (normalizedScore >= 70 || conversionProbability >= 0.7) {
    tier = 'hot';
  } else if (normalizedScore >= 40 || conversionProbability >= 0.4) {
    tier = 'warm';
  } else {
    tier = 'cold';
  }

  return {
    score: normalizedScore,
    breakdown,
    intentSignals,
    conversionProbability: Math.round(conversionProbability * 100) / 100,
    tier,
  };
}

// ============================================
// HELPERS
// ============================================

function getPageType(path: string): string {
  if (path === '/' || path === '') return 'home';
  if (path.includes('/contact')) return 'contact';
  if (path.includes('/pricing')) return 'pricing';
  if (path.includes('/services/')) return 'services';
  if (path.includes('/case-studies/')) return 'case-study';
  if (path.includes('/whitepapers/')) return 'whitepaper';
  if (path.includes('/playbooks/')) return 'playbook';
  if (path.includes('/blogs/') || path.includes('/blog/')) return 'blog';
  if (path.includes('/about')) return 'about';
  return 'other';
}

// ============================================
// BATCH SCORING (for reports)
// ============================================

export async function scoreAllVisitors(
  visitors: Array<{
    session: Partial<VisitorSession>;
    pageViews: PageView[];
    journeyData?: {
      totalSessions: number;
      totalPageViews: number;
      totalTimeSeconds: number;
      companyName?: string;
      companySize?: string;
      companyIndustry?: string;
    };
  }>
): Promise<Array<{ visitorId: string; score: ScoringResult }>> {
  return visitors.map((v) => ({
    visitorId: v.session.visitor_id || 'unknown',
    score: calculatePredictiveScore(v.session, v.pageViews, v.journeyData),
  }));
}

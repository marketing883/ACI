// Landing Page Personalization Engine

export interface VisitorContext {
  // URL parameters (we control via campaigns)
  industry?: string;
  role?: string;
  companySize?: string;
  painPoint?: string;

  // UTM parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;

  // Detected signals
  isReturningVisitor: boolean;
  previousPagesViewed: string[];
  referrerType: 'search' | 'social' | 'direct' | 'referral' | 'email';
  referrerDomain?: string;

  // Context
  isBusinessHours: boolean;
  deviceType: 'mobile' | 'desktop';
  timezone?: string;
}

export interface PersonalizedContent {
  headline: string;
  subheadline: string;
  painPoints: Array<{ title: string; description: string; icon?: string }>;
  stats: Array<{ value: string; label: string }>;
  ctoText: string;
  ctoSecondaryText?: string;
  showUrgency: boolean;
  showCalendar: boolean;
  benefits: Array<{ title: string; description: string; icon?: string }>;
  proof: {
    headline: string;
    description: string;
  };
  faq: Array<{ question: string; answer: string }>;
}

// Parse URL parameters from window.location or passed URL
export function parseUrlParams(url?: string): Partial<VisitorContext> {
  const searchParams = url
    ? new URL(url).searchParams
    : typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  return {
    industry: searchParams.get('ind') || searchParams.get('industry') || undefined,
    role: searchParams.get('role') || undefined,
    companySize: searchParams.get('size') || undefined,
    painPoint: searchParams.get('pain') || undefined,
    utmSource: searchParams.get('utm_source') || undefined,
    utmMedium: searchParams.get('utm_medium') || undefined,
    utmCampaign: searchParams.get('utm_campaign') || undefined,
    utmContent: searchParams.get('utm_content') || undefined,
    utmTerm: searchParams.get('utm_term') || undefined,
  };
}

// Analyze referrer to determine source type
export function analyzeReferrer(referrer?: string): { type: VisitorContext['referrerType']; domain?: string } {
  if (!referrer) {
    return { type: 'direct' };
  }

  try {
    const url = new URL(referrer);
    const domain = url.hostname.toLowerCase();

    // Search engines
    if (domain.includes('google.') || domain.includes('bing.') || domain.includes('duckduckgo.')) {
      return { type: 'search', domain };
    }

    // Social platforms
    if (
      domain.includes('linkedin.') ||
      domain.includes('twitter.') ||
      domain.includes('facebook.') ||
      domain.includes('instagram.')
    ) {
      return { type: 'social', domain };
    }

    // Email services
    if (domain.includes('mail.') || domain.includes('outlook.') || domain.includes('gmail.')) {
      return { type: 'email', domain };
    }

    return { type: 'referral', domain };
  } catch {
    return { type: 'direct' };
  }
}

// Check if current time is business hours (9 AM - 6 PM EST)
export function isBusinessHours(): boolean {
  const now = new Date();
  const estOffset = -5; // EST offset
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const est = new Date(utc + 3600000 * estOffset);

  const hour = est.getHours();
  const day = est.getDay();

  // Monday-Friday, 9 AM - 6 PM
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

// Detect device type
export function detectDeviceType(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const userAgent = window.navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];

  return mobileKeywords.some((keyword) => userAgent.includes(keyword)) ? 'mobile' : 'desktop';
}

// Check for returning visitor via localStorage
export function getVisitorHistory(): { isReturning: boolean; visits: number; pagesViewed: string[] } {
  if (typeof window === 'undefined') {
    return { isReturning: false, visits: 0, pagesViewed: [] };
  }

  try {
    const stored = localStorage.getItem('aci_visitor');
    if (stored) {
      const data = JSON.parse(stored);
      return {
        isReturning: true,
        visits: data.visits || 1,
        pagesViewed: data.pagesViewed || [],
      };
    }
  } catch {
    // Ignore localStorage errors
  }

  return { isReturning: false, visits: 0, pagesViewed: [] };
}

// Update visitor history
export function updateVisitorHistory(currentPage: string): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getVisitorHistory();
    const pagesViewed = history.pagesViewed.includes(currentPage)
      ? history.pagesViewed
      : [...history.pagesViewed, currentPage];

    localStorage.setItem(
      'aci_visitor',
      JSON.stringify({
        visits: history.visits + 1,
        pagesViewed,
        lastVisit: new Date().toISOString(),
      })
    );
  } catch {
    // Ignore localStorage errors
  }
}

// Build complete visitor context
export function buildVisitorContext(referrer?: string, currentUrl?: string): VisitorContext {
  const urlParams = parseUrlParams(currentUrl);
  const referrerInfo = analyzeReferrer(referrer);
  const visitorHistory = getVisitorHistory();

  return {
    ...urlParams,
    isReturningVisitor: visitorHistory.isReturning,
    previousPagesViewed: visitorHistory.pagesViewed,
    referrerType: referrerInfo.type,
    referrerDomain: referrerInfo.domain,
    isBusinessHours: isBusinessHours(),
    deviceType: detectDeviceType(),
  };
}

// Industry-specific headline modifiers
export const INDUSTRY_MODIFIERS: Record<string, { prefix?: string; suffix?: string; compliance?: string }> = {
  healthcare: { prefix: 'HIPAA-Compliant', compliance: 'HIPAA' },
  finance: { prefix: 'Enterprise-Grade', suffix: 'for Financial Services', compliance: 'SOX/PCI' },
  retail: { suffix: 'for Retail & E-commerce' },
  manufacturing: { suffix: 'for Manufacturing' },
  energy: { suffix: 'for Energy & Utilities' },
  technology: { prefix: 'Scalable' },
  logistics: { suffix: 'for Logistics & Supply Chain' },
};

// Role-specific content adjustments
export const ROLE_ADJUSTMENTS: Record<string, { technicalDepth: 'high' | 'medium' | 'low'; focusAreas: string[] }> = {
  cto: { technicalDepth: 'high', focusAreas: ['architecture', 'scalability', 'innovation'] },
  cio: { technicalDepth: 'medium', focusAreas: ['integration', 'security', 'governance'] },
  cdo: { technicalDepth: 'medium', focusAreas: ['data quality', 'analytics', 'insights'] },
  cfo: { technicalDepth: 'low', focusAreas: ['ROI', 'cost reduction', 'efficiency'] },
  vp: { technicalDepth: 'medium', focusAreas: ['outcomes', 'team productivity', 'delivery'] },
  architect: { technicalDepth: 'high', focusAreas: ['design patterns', 'best practices', 'tooling'] },
};

// Pain point urgency messages
export const PAIN_POINT_URGENCY: Record<string, string> = {
  legacy: "Your competitors have already modernized. Don't get left behind.",
  cost: "Every day of delay costs your organization money.",
  scale: "Growth waits for no one. Scale now or lose market share.",
  speed: "In today's market, slow insights mean missed opportunities.",
  compliance: "Regulatory deadlines don't wait. Get compliant now.",
  quality: "Bad data leads to bad decisions. Fix it before it costs you.",
  silos: "Disconnected data = disconnected decisions.",
  talent: "The talent gap is widening. Augment your team today.",
};

// Personalize headline based on context
export function personalizeHeadline(
  baseHeadline: string,
  context: VisitorContext,
  industryVariants?: Record<string, string>,
  roleVariants?: Record<string, string>
): string {
  // Priority: Role variant > Industry variant > Modified base > Base

  // Check for role-specific variant
  if (context.role && roleVariants?.[context.role]) {
    return roleVariants[context.role];
  }

  // Check for industry-specific variant
  if (context.industry && industryVariants?.[context.industry]) {
    return industryVariants[context.industry];
  }

  // Apply industry modifier to base headline
  if (context.industry && INDUSTRY_MODIFIERS[context.industry]) {
    const mod = INDUSTRY_MODIFIERS[context.industry];
    let headline = baseHeadline;

    if (mod.prefix) {
      headline = `${mod.prefix} ${headline}`;
    }
    if (mod.suffix) {
      headline = `${headline} ${mod.suffix}`;
    }

    return headline;
  }

  return baseHeadline;
}

// Get CTA text based on context
export function getContextualCTA(
  baseCTO: string,
  context: VisitorContext
): { primary: string; secondary?: string; showCalendar: boolean } {
  let primary = baseCTO;
  let secondary: string | undefined;
  let showCalendar = context.isBusinessHours;

  // Returning visitor - more direct CTA
  if (context.isReturningVisitor) {
    primary = "Let's Continue the Conversation";
    secondary = "You were here before - ready to take the next step?";
    showCalendar = true;
  }

  // After hours - form only
  if (!context.isBusinessHours) {
    showCalendar = false;
    secondary = "Submit your request and we'll reach out within 24 hours";
  }

  // High-intent source
  if (context.utmMedium === 'cpc' || context.utmMedium === 'paid') {
    secondary = "Limited assessment slots available this month";
  }

  return { primary, secondary, showCalendar };
}

// Get urgency message based on context
export function getUrgencyMessage(context: VisitorContext): string | null {
  // Pain point urgency
  if (context.painPoint && PAIN_POINT_URGENCY[context.painPoint]) {
    return PAIN_POINT_URGENCY[context.painPoint];
  }

  // Returning visitor urgency
  if (context.isReturningVisitor) {
    return "You've been researching this. Let's make progress together.";
  }

  // Paid traffic urgency
  if (context.utmMedium === 'cpc' || context.utmMedium === 'paid') {
    return "Limited availability for new assessments this quarter.";
  }

  return null;
}

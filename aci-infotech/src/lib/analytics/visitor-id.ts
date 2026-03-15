// ============================================
// VISITOR IDENTIFICATION
// Privacy-conscious fingerprinting for visitor tracking
// ============================================

const VISITOR_ID_KEY = 'aci_visitor_id';
const SESSION_ID_KEY = 'aci_session_id';
const SESSION_START_KEY = 'aci_session_start';
const LAST_ACTIVITY_KEY = 'aci_last_activity';
const SESSION_TIMEOUT_MINUTES = 30;

/**
 * Generate a unique visitor ID using available browser signals
 * This is NOT a fingerprint that tracks across browsers - it's a stable
 * identifier for the current browser that persists across sessions
 */
export function generateVisitorId(): string {
  // Try to get existing visitor ID from localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    const existingId = localStorage.getItem(VISITOR_ID_KEY);
    if (existingId) {
      return existingId;
    }
  }

  // Generate a new visitor ID
  const id = `v_${Date.now()}_${randomString(12)}`;

  // Persist to localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(VISITOR_ID_KEY, id);
    } catch {
      // localStorage might be full or blocked
    }
  }

  return id;
}

/**
 * Generate or retrieve the current session ID
 * Sessions expire after 30 minutes of inactivity
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return `s_${Date.now()}_${randomString(8)}`;
  }

  const now = Date.now();

  // Check for existing session
  const existingSessionId = sessionStorage.getItem(SESSION_ID_KEY);
  const lastActivity = parseInt(sessionStorage.getItem(LAST_ACTIVITY_KEY) || '0', 10);

  // Check if session is still valid (within timeout)
  const sessionExpired = now - lastActivity > SESSION_TIMEOUT_MINUTES * 60 * 1000;

  if (existingSessionId && !sessionExpired) {
    // Update last activity
    sessionStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
    return existingSessionId;
  }

  // Create new session
  const newSessionId = `s_${now}_${randomString(8)}`;

  try {
    sessionStorage.setItem(SESSION_ID_KEY, newSessionId);
    sessionStorage.setItem(SESSION_START_KEY, now.toString());
    sessionStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
  } catch {
    // sessionStorage might be blocked
  }

  return newSessionId;
}

/**
 * Update the last activity timestamp
 */
export function updateLastActivity(): void {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    try {
      sessionStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    } catch {
      // Ignore errors
    }
  }
}

/**
 * Get session start time
 */
export function getSessionStartTime(): number {
  if (typeof window === 'undefined') return Date.now();
  return parseInt(sessionStorage.getItem(SESSION_START_KEY) || Date.now().toString(), 10);
}

/**
 * Get session duration in seconds
 */
export function getSessionDuration(): number {
  return Math.floor((Date.now() - getSessionStartTime()) / 1000);
}

/**
 * Check if this is a returning visitor
 */
export function isReturningVisitor(): boolean {
  if (typeof window === 'undefined') return false;

  const visitorId = localStorage.getItem(VISITOR_ID_KEY);
  const sessionCount = parseInt(localStorage.getItem('aci_session_count') || '0', 10);

  return !!visitorId && sessionCount > 1;
}

/**
 * Get total session count for this visitor
 */
export function getSessionCount(): number {
  if (typeof window === 'undefined') return 1;
  return parseInt(localStorage.getItem('aci_session_count') || '1', 10);
}

/**
 * Increment session count (call once per new session)
 */
export function incrementSessionCount(): void {
  if (typeof window === 'undefined') return;

  const current = getSessionCount();
  try {
    localStorage.setItem('aci_session_count', (current + 1).toString());
  } catch {
    // Ignore errors
  }
}

/**
 * Get device type from user agent
 */
export function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent.toLowerCase();

  // Check for tablets first (they often identify as mobile too)
  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
    return 'tablet';
  }

  // Check for mobile
  if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
}

/**
 * Get browser info
 */
export function getBrowserInfo(): { name: string; version: string } {
  if (typeof window === 'undefined') {
    return { name: 'unknown', version: 'unknown' };
  }

  const ua = navigator.userAgent;
  let name = 'unknown';
  let version = 'unknown';

  // Chrome
  if (ua.indexOf('Chrome') > -1 && ua.indexOf('Edg') === -1) {
    name = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
  // Edge
  else if (ua.indexOf('Edg') > -1) {
    name = 'Edge';
    const match = ua.match(/Edg\/(\d+)/);
    if (match) version = match[1];
  }
  // Firefox
  else if (ua.indexOf('Firefox') > -1) {
    name = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    if (match) version = match[1];
  }
  // Safari
  else if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) {
    name = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    if (match) version = match[1];
  }

  return { name, version };
}

/**
 * Get OS info
 */
export function getOSInfo(): { name: string; version: string } {
  if (typeof window === 'undefined') {
    return { name: 'unknown', version: 'unknown' };
  }

  const ua = navigator.userAgent;
  let name = 'unknown';
  let version = 'unknown';

  if (ua.indexOf('Win') > -1) {
    name = 'Windows';
    if (ua.indexOf('Windows NT 10.0') > -1) version = '10';
    else if (ua.indexOf('Windows NT 11.0') > -1) version = '11';
  } else if (ua.indexOf('Mac') > -1) {
    name = 'macOS';
    const match = ua.match(/Mac OS X (\d+[._]\d+)/);
    if (match) version = match[1].replace('_', '.');
  } else if (ua.indexOf('Linux') > -1) {
    name = 'Linux';
  } else if (ua.indexOf('Android') > -1) {
    name = 'Android';
    const match = ua.match(/Android (\d+)/);
    if (match) version = match[1];
  } else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
    name = 'iOS';
    const match = ua.match(/OS (\d+)/);
    if (match) version = match[1];
  }

  return { name, version };
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Get screen dimensions
 */
export function getScreenDimensions(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  return {
    width: window.screen.width,
    height: window.screen.height,
  };
}

/**
 * Get UTM parameters from URL
 */
export function getUTMParams(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
} {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);

  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
  };
}

/**
 * Get referrer info
 */
export function getReferrer(): string | undefined {
  if (typeof document === 'undefined') return undefined;

  const referrer = document.referrer;
  if (!referrer) return undefined;

  // Don't track internal referrers
  try {
    const referrerUrl = new URL(referrer);
    if (referrerUrl.hostname === window.location.hostname) {
      return undefined;
    }
    return referrer;
  } catch {
    return referrer;
  }
}

/**
 * Get timezone
 */
export function getTimezone(): string {
  if (typeof Intl === 'undefined') return 'unknown';
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'unknown';
  }
}

/**
 * Get language
 */
export function getLanguage(): string {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language || 'en';
}

/**
 * Generate a random string
 */
function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return result;
}

/**
 * Check if tracking should be disabled
 */
export function shouldDisableTracking(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Respect Do Not Track
  if (navigator.doNotTrack === '1') {
    return true;
  }

  // Check for cookie consent
  if (typeof window !== 'undefined') {
    try {
      const consent = localStorage.getItem('cookie_consent');
      if (consent) {
        const parsed = JSON.parse(consent);
        if (parsed.analytics === false) {
          return true;
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  return false;
}

/**
 * Get full visitor context for session initialization
 */
export function getVisitorContext() {
  const browser = getBrowserInfo();
  const os = getOSInfo();
  const viewport = getViewportDimensions();
  const screen = getScreenDimensions();
  const utmParams = getUTMParams();

  return {
    visitor_id: generateVisitorId(),
    session_id: getSessionId(),
    device_type: getDeviceType(),
    browser: browser.name,
    browser_version: browser.version,
    os: os.name,
    os_version: os.version,
    viewport_width: viewport.width,
    viewport_height: viewport.height,
    screen_width: screen.width,
    screen_height: screen.height,
    timezone: getTimezone(),
    language: getLanguage(),
    referrer: getReferrer(),
    ...utmParams,
    is_returning: isReturningVisitor(),
    session_count: getSessionCount(),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  };
}

/**
 * Bot Detection Utility
 * Detects bot submissions using multiple heuristics
 */

export interface BotCheckResult {
  isBot: boolean;
  score: number; // 0-100, higher = more likely bot
  flags: string[];
  action: 'allow' | 'flag' | 'block';
}

export interface FormSubmissionData {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  phone?: string;
  honeypot?: string;
  formLoadTime?: number; // timestamp when form was loaded
  submitTime?: number; // timestamp when form was submitted
}

// Minimum time (in ms) a human would take to fill a form
const MIN_FORM_TIME_MS = 3000; // 3 seconds

// Maximum reasonable time for a form session (30 minutes)
const MAX_FORM_TIME_MS = 30 * 60 * 1000;

/**
 * Check if honeypot field was filled (definite bot)
 */
export function checkHoneypot(value: string | undefined | null): boolean {
  return !!value && value.trim().length > 0;
}

/**
 * Check if form was submitted too quickly (likely bot)
 */
export function checkSubmissionSpeed(formLoadTime?: number, submitTime?: number): {
  isTooFast: boolean;
  isTooSlow: boolean;
  durationMs: number | null;
} {
  if (!formLoadTime || !submitTime) {
    return { isTooFast: false, isTooSlow: false, durationMs: null };
  }

  const durationMs = submitTime - formLoadTime;

  return {
    isTooFast: durationMs < MIN_FORM_TIME_MS,
    isTooSlow: durationMs > MAX_FORM_TIME_MS,
    durationMs,
  };
}

/**
 * Check if a string looks like gibberish/random characters
 */
export function isGibberishText(text: string): boolean {
  if (!text || text.length < 3) return false;

  const cleaned = text.trim().toLowerCase();

  // Check for too many consonants in a row (6+)
  const consonantRun = /[^aeiou\s]{6,}/i;
  if (consonantRun.test(cleaned)) {
    return true;
  }

  // Check for random-looking patterns (mix of upper/lower without spaces)
  const randomPattern = /^[a-zA-Z]{10,}$/;
  const hasNoVowels = !/[aeiou]/i.test(cleaned);
  if (randomPattern.test(text) && hasNoVowels) {
    return true;
  }

  // Check for keyboard walk patterns
  const keyboardWalks = ['qwerty', 'asdf', 'zxcv', 'qazwsx', '12345', 'abcdef'];
  for (const walk of keyboardWalks) {
    if (cleaned.includes(walk)) {
      return true;
    }
  }

  // Check ratio of consonants to vowels (normal text is roughly 60/40)
  const vowels = (cleaned.match(/[aeiou]/gi) || []).length;
  const consonants = (cleaned.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
  const totalLetters = vowels + consonants;

  if (totalLetters > 5) {
    const vowelRatio = vowels / totalLetters;
    // Normal text has 35-45% vowels; if < 15% or > 70%, suspicious
    if (vowelRatio < 0.15 || vowelRatio > 0.70) {
      return true;
    }
  }

  return false;
}

/**
 * Check if name looks like a bot-generated name
 */
export function isBotName(name: string): { isBot: boolean; reason?: string } {
  if (!name) {
    return { isBot: false };
  }

  const trimmed = name.trim();

  // Too short
  if (trimmed.length < 2) {
    return { isBot: true, reason: 'name_too_short' };
  }

  // Too long (most names are < 50 chars)
  if (trimmed.length > 100) {
    return { isBot: true, reason: 'name_too_long' };
  }

  // Contains numbers (names rarely have numbers)
  if (/\d/.test(trimmed)) {
    return { isBot: true, reason: 'name_has_numbers' };
  }

  // All uppercase (bots sometimes do this)
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
    return { isBot: true, reason: 'name_all_caps' };
  }

  // Check for gibberish
  if (isGibberishText(trimmed)) {
    return { isBot: true, reason: 'name_gibberish' };
  }

  // Check for repeating characters (aaaaaaa, abababab)
  if (/(.)\1{4,}/.test(trimmed) || /(.{2,})\1{2,}/.test(trimmed)) {
    return { isBot: true, reason: 'name_repeating_chars' };
  }

  return { isBot: false };
}

/**
 * Check if company name looks suspicious
 */
export function isBotCompany(company: string): { isBot: boolean; reason?: string } {
  if (!company) {
    return { isBot: false };
  }

  const trimmed = company.trim();

  // Too long
  if (trimmed.length > 200) {
    return { isBot: true, reason: 'company_too_long' };
  }

  // Check for gibberish
  if (isGibberishText(trimmed)) {
    return { isBot: true, reason: 'company_gibberish' };
  }

  return { isBot: false };
}

/**
 * Check if message looks like spam
 */
export function isSpamMessage(message: string): { isSpam: boolean; reason?: string } {
  if (!message) {
    return { isSpam: false };
  }

  const lower = message.toLowerCase();

  // Common spam keywords
  const spamKeywords = [
    'buy now', 'click here', 'free money', 'act now', 'limited time',
    'congratulations', 'you have won', 'lottery', 'casino', 'viagra',
    'crypto', 'bitcoin investment', 'make money fast', 'work from home',
    'nigerian prince', 'wire transfer', 'western union',
  ];

  for (const keyword of spamKeywords) {
    if (lower.includes(keyword)) {
      return { isSpam: true, reason: 'spam_keywords' };
    }
  }

  // Too many URLs
  const urlCount = (message.match(/https?:\/\//gi) || []).length;
  if (urlCount > 3) {
    return { isSpam: true, reason: 'too_many_urls' };
  }

  // Gibberish message
  if (isGibberishText(message) && message.length > 20) {
    return { isSpam: true, reason: 'message_gibberish' };
  }

  return { isSpam: false };
}

/**
 * Main bot detection function
 * Returns comprehensive analysis of submission
 */
export function detectBot(data: FormSubmissionData): BotCheckResult {
  const flags: string[] = [];
  let score = 0;

  // Check 1: Honeypot (definite bot)
  if (checkHoneypot(data.honeypot)) {
    return {
      isBot: true,
      score: 100,
      flags: ['honeypot_filled'],
      action: 'block',
    };
  }

  // Check 2: Submission speed
  const speedCheck = checkSubmissionSpeed(data.formLoadTime, data.submitTime);
  if (speedCheck.isTooFast) {
    flags.push('submission_too_fast');
    score += 40;
  }
  if (speedCheck.isTooSlow) {
    flags.push('submission_too_slow');
    score += 10; // Less suspicious, might be legitimate
  }

  // Check 3: Bot name detection
  const nameCheck = isBotName(data.name || '');
  if (nameCheck.isBot && nameCheck.reason) {
    flags.push(nameCheck.reason);
    score += 35;
  }

  // Check 4: Company check
  const companyCheck = isBotCompany(data.company || '');
  if (companyCheck.isBot && companyCheck.reason) {
    flags.push(companyCheck.reason);
    score += 25;
  }

  // Check 5: Spam message check
  const messageCheck = isSpamMessage(data.message || '');
  if (messageCheck.isSpam && messageCheck.reason) {
    flags.push(messageCheck.reason);
    score += 30;
  }

  // Determine action based on score
  let action: 'allow' | 'flag' | 'block';
  if (score >= 70) {
    action = 'block';
  } else if (score >= 30) {
    action = 'flag';
  } else {
    action = 'allow';
  }

  return {
    isBot: score >= 70,
    score: Math.min(score, 100),
    flags,
    action,
  };
}

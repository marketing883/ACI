/**
 * Email Validation Utility
 * Validates work emails and blocks personal email domains
 */

// Comprehensive list of personal/free email domains to block
export const BLOCKED_EMAIL_DOMAINS = [
  // Major providers
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.co.in',
  'yahoo.ca',
  'yahoo.com.au',
  'hotmail.com',
  'hotmail.co.uk',
  'outlook.com',
  'outlook.co.uk',
  'live.com',
  'live.co.uk',
  'msn.com',
  'aol.com',
  'icloud.com',
  'me.com',
  'mac.com',

  // Privacy-focused
  'protonmail.com',
  'proton.me',
  'tutanota.com',
  'tutanota.de',
  'tutamail.com',
  'hey.com',
  'fastmail.com',
  'fastmail.fm',
  'hushmail.com',
  'mailfence.com',
  'posteo.de',
  'posteo.net',
  'disroot.org',
  'riseup.net',

  // International providers
  'yandex.com',
  'yandex.ru',
  'mail.ru',
  'rambler.ru',
  'qq.com',
  '163.com',
  '126.com',
  'sina.com',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'rediffmail.com',

  // Other free providers
  'zoho.com',
  'zohomail.com',
  'gmx.com',
  'gmx.de',
  'gmx.net',
  'mail.com',
  'email.com',
  'usa.com',
  'inbox.com',
  'lycos.com',
  'excite.com',
  'att.net',
  'sbcglobal.net',
  'bellsouth.net',
  'verizon.net',
  'comcast.net',
  'cox.net',
  'charter.net',
  'earthlink.net',
  'juno.com',
  'netzero.net',

  // Temporary/disposable email services
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
  'sharklasers.com',
  'trashmail.com',
  'fakeinbox.com',
  'getnada.com',
  'mohmal.com',
  'tempail.com',
  'temp-mail.org',
  'dispostable.com',
  'mailnesia.com',
  'mintemail.com',
  'yopmail.com',
];

/**
 * Check if email domain is blocked (personal email)
 */
function isDomainBlocked(domain: string): boolean {
  const lowerDomain = domain.toLowerCase();

  // Direct match
  if (BLOCKED_EMAIL_DOMAINS.includes(lowerDomain)) {
    return true;
  }

  // Check for subdomains of blocked domains
  for (const blocked of BLOCKED_EMAIL_DOMAINS) {
    if (lowerDomain.endsWith('.' + blocked)) {
      return true;
    }
  }

  return false;
}

/**
 * Validate email format using regex
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Check if email is a work email (not a personal/free email)
 * Returns true if it's a work email, false if personal
 */
export function isWorkEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const domain = parts[1]?.toLowerCase();
  if (!domain) return false;

  // Check if domain is blocked
  return !isDomainBlocked(domain);
}

/**
 * Get the domain from an email address
 */
export function getEmailDomain(email: string): string | null {
  if (!email || typeof email !== 'string') return null;

  const parts = email.split('@');
  if (parts.length !== 2) return null;

  return parts[1]?.toLowerCase() || null;
}

/**
 * Validate email completely (format + work email check)
 */
export function validateEmail(email: string): {
  valid: boolean;
  isWorkEmail: boolean;
  error?: string;
} {
  if (!email) {
    return { valid: false, isWorkEmail: false, error: 'Email is required' };
  }

  if (!isValidEmailFormat(email)) {
    return { valid: false, isWorkEmail: false, error: 'Please enter a valid email address' };
  }

  if (!isWorkEmail(email)) {
    return {
      valid: false,
      isWorkEmail: false,
      error: 'Please use your work email address. Personal email addresses (Gmail, Yahoo, etc.) are not accepted.'
    };
  }

  return { valid: true, isWorkEmail: true };
}

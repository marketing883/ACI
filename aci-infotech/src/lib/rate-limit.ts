import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Check if Upstash Redis is configured
function isRedisConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

// Create rate limiter instance (lazy initialization)
let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (!isRedisConfigured()) {
    return null;
  }

  if (!ratelimit) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
      analytics: true,
      prefix: 'aci-ratelimit',
    });
  }

  return ratelimit;
}

// Different rate limit configurations
export const RATE_LIMITS = {
  // Standard API endpoints
  standard: { requests: 10, window: '10 s' as const },
  // Upload endpoints (more restrictive)
  upload: { requests: 5, window: '60 s' as const },
  // Login attempts (very restrictive)
  auth: { requests: 5, window: '300 s' as const },
  // Read-only endpoints (more permissive)
  read: { requests: 30, window: '10 s' as const },
  // Contact form submissions (prevent spam)
  contact: { requests: 5, window: '3600 s' as const }, // 5 per hour
  // Newsletter subscriptions
  newsletter: { requests: 3, window: '3600 s' as const }, // 3 per hour
};

export type RateLimitType = keyof typeof RATE_LIMITS;

/**
 * Get client identifier from request
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from various headers (in order of preference)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to a generic identifier
  return 'anonymous';
}

/**
 * Check rate limit for a request
 * Returns null if allowed, or a Response if rate limited
 */
export async function checkRateLimit(
  request: NextRequest,
  type: RateLimitType = 'standard'
): Promise<NextResponse | null> {
  const limiter = getRatelimit();

  // If Redis is not configured, allow all requests (for local dev)
  if (!limiter) {
    console.log('Rate limiting disabled: Upstash Redis not configured');
    return null;
  }

  const identifier = getClientIdentifier(request);
  const key = `${type}:${identifier}`;

  try {
    const { success, limit, remaining, reset } = await limiter.limit(key);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Please slow down and try again later',
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    return null; // Request allowed
  } catch (error) {
    // If rate limiting fails, allow the request but log the error
    console.error('Rate limiting error:', error);
    return null;
  }
}

/**
 * Middleware helper for rate limiting
 * Usage in API route:
 *
 * const rateLimited = await checkRateLimit(request, 'standard');
 * if (rateLimited) return rateLimited;
 */
export async function withRateLimit(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  type: RateLimitType = 'standard'
): Promise<NextResponse> {
  const rateLimited = await checkRateLimit(request, type);
  if (rateLimited) return rateLimited;
  return handler();
}

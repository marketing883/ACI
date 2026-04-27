/**
 * Atheros rate limits.
 *
 * Two independent buckets:
 *   - per-visitor: 30 messages / 5 min, 200 messages / day.
 *   - per-IP:     60 messages / 5 min (defense against shared IDs / abuse).
 *
 * Uses @upstash/ratelimit + @upstash/redis which are already installed.
 * Disabled (fail-open) when the Upstash env vars are missing; the edge
 * route logs a warn and continues, because we never want a missing piece
 * of infra to turn into a user-facing error.
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { log } from './logger';

interface Limiters {
  visitorShort: Ratelimit;
  visitorDay: Ratelimit;
  ip: Ratelimit;
}

let cached: Limiters | null | undefined;

function buildLimiters(): Limiters | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const redis = new Redis({ url, token });
  return {
    visitorShort: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '5 m'),
      prefix: 'atheros:v:short',
      analytics: true,
    }),
    visitorDay: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(200, '24 h'),
      prefix: 'atheros:v:day',
      analytics: true,
    }),
    ip: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, '5 m'),
      prefix: 'atheros:ip',
      analytics: true,
    }),
  };
}

function getLimiters(): Limiters | null {
  if (cached !== undefined) return cached;
  cached = buildLimiters();
  if (!cached) {
    log.warn('ratelimit', 'UPSTASH_REDIS_REST_URL/TOKEN missing; rate limits disabled');
  }
  return cached;
}

export interface RateLimitCheck {
  allowed: boolean;
  bucket?: 'visitor-short' | 'visitor-day' | 'ip';
  retryAfterSeconds?: number;
}

export async function checkRateLimit(
  visitorId: string | null | undefined,
  ip: string | null | undefined,
): Promise<RateLimitCheck> {
  const limiters = getLimiters();
  if (!limiters) return { allowed: true };

  const visitorKey = visitorId ? `v:${visitorId}` : null;
  const ipKey = ip ? `ip:${ip}` : null;

  try {
    if (visitorKey) {
      const r = await limiters.visitorShort.limit(visitorKey);
      if (!r.success) {
        log.warn('ratelimit', 'visitor-short hit', {
          visitorId: visitorId ?? undefined,
          extra: { reset: r.reset, limit: r.limit, remaining: r.remaining },
        });
        return {
          allowed: false,
          bucket: 'visitor-short',
          retryAfterSeconds: Math.max(1, Math.ceil((r.reset - Date.now()) / 1000)),
        };
      }
      const r2 = await limiters.visitorDay.limit(visitorKey);
      if (!r2.success) {
        log.warn('ratelimit', 'visitor-day hit', {
          visitorId: visitorId ?? undefined,
          extra: { reset: r2.reset },
        });
        return {
          allowed: false,
          bucket: 'visitor-day',
          retryAfterSeconds: Math.max(1, Math.ceil((r2.reset - Date.now()) / 1000)),
        };
      }
    }
    if (ipKey) {
      const r = await limiters.ip.limit(ipKey);
      if (!r.success) {
        log.warn('ratelimit', 'ip hit', {
          extra: { ip, reset: r.reset },
        });
        return {
          allowed: false,
          bucket: 'ip',
          retryAfterSeconds: Math.max(1, Math.ceil((r.reset - Date.now()) / 1000)),
        };
      }
    }
    return { allowed: true };
  } catch (err) {
    // copilot-allow-silent-catch: fail open but log loud; rate-limit infra
    // must never block a user turn on its own failure.
    log.error('ratelimit', err, { visitorId: visitorId ?? undefined });
    return { allowed: true };
  }
}

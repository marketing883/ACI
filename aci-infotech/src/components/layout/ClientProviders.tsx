'use client';

/**
 * ClientProviders — non-critical client-side widgets that should not
 * compete with the LCP element for main-thread time.
 *
 * Mounting strategy: the component returns nothing until either
 *   1. `requestIdleCallback` fires (browser is idle), OR
 *   2. The user makes their first interaction (pointerdown/scroll/keydown)
 *
 * Whichever comes first. After that, the children mount and Next.js
 * resolves their dynamic imports. This keeps CookieConsent and the
 * analytics scaffolding entirely off the critical path for the first
 * paint, which moves Lighthouse Performance and Total Blocking Time
 * meaningfully without changing the user-visible behavior (the
 * cookie banner already has its own 1s delay before showing).
 */

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const CookieConsent = dynamic(() => import('@/components/CookieConsent'), {
  ssr: false,
});

const ConsentGatedAnalytics = dynamic(
  () => import('@/components/analytics/ConsentGatedAnalytics'),
  { ssr: false }
);

// Conservative idle window. Long enough to clear the LCP frame on a
// typical mobile (~1.5s on 4G), short enough that the cookie banner
// still appears within a couple of seconds for a stationary visitor.
const IDLE_FALLBACK_MS = 2000;

export default function ClientProviders() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;

    let cancelled = false;
    const wake = () => {
      if (cancelled) return;
      cancelled = true;
      setReady(true);
    };

    // Path 1: browser idle. requestIdleCallback isn't on Safari yet,
    // so we fall back to setTimeout with a sensible delay.
    type IdleWindow = Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const w = window as IdleWindow;
    let idleHandle: number | undefined;
    let timerHandle: ReturnType<typeof setTimeout> | undefined;
    if (typeof w.requestIdleCallback === 'function') {
      idleHandle = w.requestIdleCallback(wake, { timeout: IDLE_FALLBACK_MS });
    } else {
      timerHandle = setTimeout(wake, IDLE_FALLBACK_MS);
    }

    // Path 2: any first user interaction wakes us immediately.
    const opts: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener('pointerdown', wake, opts);
    window.addEventListener('keydown', wake, opts);
    window.addEventListener('scroll', wake, opts);

    return () => {
      cancelled = true;
      if (idleHandle !== undefined && w.cancelIdleCallback) {
        w.cancelIdleCallback(idleHandle);
      }
      if (timerHandle !== undefined) clearTimeout(timerHandle);
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('keydown', wake);
      window.removeEventListener('scroll', wake);
    };
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <CookieConsent />
      <ConsentGatedAnalytics />
    </>
  );
}

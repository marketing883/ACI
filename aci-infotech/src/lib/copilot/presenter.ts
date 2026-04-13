/**
 * Atheros presenter.
 *
 * Drives the two-beat choreography for mobile auto-nav (show_content_panel
 * with autoNavigate=true in a future extension; Part 5 wires the state
 * machine hooks so when a panel resolves to a real route, the mobile
 * surface can navigate AND preserve the transcript).
 *
 * Responsibilities:
 *   - Throttle: at most one auto-nav per 30 seconds per session.
 *   - /contact guard: never auto-nav away from the form.
 *   - Emit NARRATION_AFTER_NAV once the new page has finished loading
 *     and the relevant section has been scrolled into view.
 *
 * The presenter is a pure module with explicit fail-loud errors so the
 * mobile pill stays responsive even when navigation stalls.
 */

import { log } from './logger';
import type { PillEvent } from './pillStateMachine';

const AUTONAV_MIN_GAP_MS = 30_000;
const SAFE_ROUTE_PREFIXES = [
  '/services/',
  '/industries/',
  '/platforms/',
  '/lp/',
  '/case-studies/',
  '/playbooks/',
  '/blogs/',
  '/whitepapers/',
];
const BLOCK_PREFIXES = ['/contact', '/admin'];

export interface PresenterContext {
  /** Stable session id; used to throttle and to scope the last-nav timestamp. */
  sessionId: string;
  /** Current pathname at call time. */
  currentPath: string;
  /** Pathname we are about to navigate to. */
  targetPath: string;
  /** Narration text to raise as peek after the new page is ready. */
  narration: string;
  /** Optional section id to smooth-scroll into view post-nav. */
  sectionId?: string;
  /** How to actually navigate. Injected so the presenter can be unit-tested. */
  navigate: (href: string) => void;
  /** State-machine dispatch. */
  dispatch: (event: PillEvent) => void;
}

const lastNavAtBySession = new Map<string, number>();

function isRouteAllowed(target: string): boolean {
  if (BLOCK_PREFIXES.some((p) => target.startsWith(p))) return false;
  return SAFE_ROUTE_PREFIXES.some((p) => target.startsWith(p));
}

/**
 * Begin the auto-nav choreography. Returns true if the nav was
 * initiated, false if it was throttled or blocked.
 */
export function presentWithAutoNav(ctx: PresenterContext): boolean {
  if (!isRouteAllowed(ctx.targetPath)) {
    log.warn('panel', 'autonav blocked by route policy', {
      sessionId: ctx.sessionId,
      extra: { target: ctx.targetPath, current: ctx.currentPath },
    });
    return false;
  }
  if (ctx.currentPath === ctx.targetPath) {
    // No nav needed; raise peek immediately with the narration text.
    ctx.dispatch({ type: 'NARRATION_AFTER_NAV', text: ctx.narration });
    if (ctx.sectionId) scrollToSectionWhenReady(ctx.sectionId).catch(() => undefined);
    return true;
  }
  const now = Date.now();
  const last = lastNavAtBySession.get(ctx.sessionId) ?? 0;
  if (now - last < AUTONAV_MIN_GAP_MS) {
    log.warn('panel', 'autonav throttled', {
      sessionId: ctx.sessionId,
      extra: { sinceLastMs: now - last, targetPath: ctx.targetPath },
    });
    return false;
  }
  lastNavAtBySession.set(ctx.sessionId, now);

  // Beat 1: the caller has already streamed the pre-nav announcement inside
  // the converse sheet. We transition converse -> pill by closing converse
  // before the presenter navigates. The orchestrator (MobilePill) calls
  // dispatch('CLOSE_CONVERSE') in response to the autonav event BEFORE
  // calling presentWithAutoNav.

  try {
    ctx.navigate(ctx.targetPath);
  } catch (err) {
    log.error('panel', err, {
      sessionId: ctx.sessionId,
      extra: { phase: 'navigate', targetPath: ctx.targetPath },
    });
    ctx.dispatch({
      type: 'NARRATION_AFTER_NAV',
      text: "I couldn't open that page. Tap to retry.",
    });
    return false;
  }

  // Beat 2: wait for the new page to settle, then raise the narration peek.
  waitForPageReady(ctx.targetPath, ctx.sectionId)
    .then(() => {
      ctx.dispatch({ type: 'NARRATION_AFTER_NAV', text: ctx.narration });
    })
    .catch((err) => {
      log.warn('panel', err, {
        sessionId: ctx.sessionId,
        extra: { phase: 'postnav', targetPath: ctx.targetPath },
      });
      ctx.dispatch({
        type: 'NARRATION_AFTER_NAV',
        text: "I opened the page but couldn't find that section. Have a look.",
      });
    });

  return true;
}

/** Wait for the page to reach 'complete' readyState + 2 RAFs. */
async function waitForPageReady(
  _targetPath: string,
  sectionId?: string,
): Promise<void> {
  if (typeof document === 'undefined') return;
  await new Promise<void>((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
      return;
    }
    const handler = () => {
      if (document.readyState === 'complete') {
        document.removeEventListener('readystatechange', handler);
        resolve();
      }
    };
    document.addEventListener('readystatechange', handler);
  });
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
  if (sectionId) await scrollToSectionWhenReady(sectionId);
}

async function scrollToSectionWhenReady(sectionId: string): Promise<void> {
  if (typeof document === 'undefined') return;
  const target = document.getElementById(sectionId);
  if (!target) {
    log.warn('panel', 'scroll target not found', {
      extra: { sectionId },
    });
    return;
  }
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/** Test helper: reset throttle state. */
export function __resetPresenterForTests(): void {
  lastNavAtBySession.clear();
}

export { AUTONAV_MIN_GAP_MS, isRouteAllowed };

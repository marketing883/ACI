'use client';

/**
 * Atheros mobile surface orchestrator.
 *
 * Ties the three-state machine (pill / converse / peek.proactive /
 * peek.narration) to the actual UI. Lazy-loads the converse sheet on
 * first interaction so the public first-paint bundle stays tiny.
 *
 * Part-5 v3 choreography:
 *   - pill idle is a CSS-only pure button (PillIdle, ~4 KB gz).
 *   - converse is the lazy MobileSheet wrapping ChatColumn.
 *   - peek has two variants distinguished by PillPeek props.
 */
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import PillIdle from './PillIdle';
import PillPeek from './PillPeek';
import {
  INITIAL_STATE,
  NARRATION_PEEK_MS,
  PROACTIVE_COOLDOWN_MS,
  PROACTIVE_DISMISS_KEY,
  shouldRaiseProactivePeek,
  transition,
  type PillEvent,
  type PillState,
} from '@/lib/copilot/pillStateMachine';
import { resolvePillCopy } from '@/lib/copilot/pillCopy';
import { presentWithAutoNav } from '@/lib/copilot/presenter';
import type { ChatColumnMessage } from '../ChatColumn';
import type { ShowContentPanelArgs } from '@/lib/copilot/tools';

const MobileSheet = dynamic(() => import('./MobileSheet'), { ssr: false });

export interface MobilePillProps {
  sessionId: string;
  initialMessages: ChatColumnMessage[];
  leadState: Record<string, unknown>;
}

function stateReducer(state: PillState, event: PillEvent): PillState {
  return transition(state, event);
}

export default function MobilePill({
  sessionId,
  initialMessages,
  leadState,
}: MobilePillProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, dispatch] = useReducer(stateReducer, INITIAL_STATE);
  const dwellStart = useRef<number>(0);
  const maxScrollPct = useRef<number>(0);

  const copy = useMemo(() => resolvePillCopy(pathname), [pathname]);

  // Reset dwell + scroll tracking on route change. Seeding dwellStart
  // inside useEffect keeps the component render pure (no Date.now()
  // during render per react-hooks/purity).
  useEffect(() => {
    dwellStart.current = Date.now();
    maxScrollPct.current = 0;
  }, [pathname]);

  // Proactive-peek trigger: sample once per second.
  useEffect(() => {
    if (pathname === '/contact') return; // /contact suppresses peek (and autonav).
    const onScroll = () => {
      if (typeof window === 'undefined') return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0;
      if (pct > maxScrollPct.current) maxScrollPct.current = pct;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const iv = window.setInterval(() => {
      if (state.kind !== 'pill') return;
      const dwellSeconds = (Date.now() - dwellStart.current) / 1000;
      const lastDismissedRaw =
        typeof localStorage !== 'undefined'
          ? localStorage.getItem(PROACTIVE_DISMISS_KEY)
          : null;
      const lastDismissAtMs = lastDismissedRaw ? Number(lastDismissedRaw) : null;
      if (
        shouldRaiseProactivePeek({
          dwellSeconds,
          maxScrollPct: maxScrollPct.current,
          lastDismissAtMs: Number.isFinite(lastDismissAtMs ?? NaN)
            ? lastDismissAtMs
            : null,
          nowMs: Date.now(),
        })
      ) {
        dispatch({ type: 'PROACTIVE_TRIGGER', text: copy.peek });
      }
    }, 1000);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearInterval(iv);
    };
  }, [copy.peek, pathname, state.kind]);

  const dismissPeek = useCallback(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PROACTIVE_DISMISS_KEY, String(Date.now()));
    }
    dispatch({ type: 'DISMISS_PEEK' });
  }, []);

  const onPanelRequest = useCallback(
    (panel: ShowContentPanelArgs) => {
      // Best-effort mobile auto-nav: resolve panelType -> known route.
      const target = panelTargetPath(panel);
      if (!target) return;
      if (pathname === '/contact') return; // never steal focus from the form
      // If the target is the page we're already on, auto-nav has no
      // visible effect - but historically we still closed the sheet,
      // which made every tool-emitting turn on the homepage feel like
      // the chat was dismissing itself. Skip entirely so the visitor
      // keeps reading in-place.
      const normalizedTarget = target.replace(/\/$/, '') || '/';
      const normalizedCurrent = (pathname ?? '/').replace(/\/$/, '') || '/';
      if (normalizedTarget === normalizedCurrent) return;
      dispatch({ type: 'CLOSE_CONVERSE' });
      presentWithAutoNav({
        sessionId,
        currentPath: pathname ?? '/',
        targetPath: target,
        narration: narrationFor(panel),
        sectionId: sectionForPanel(panel),
        navigate: (href) => router.push(href),
        dispatch,
      });
    },
    [pathname, router, sessionId],
  );

  // Pending-panel state is intentionally driven by imperative callbacks
  // only; no effect-based reset is needed since setPendingPanel is only
  // called from the onPanelRequest callback and downstream navigation.
  void PROACTIVE_COOLDOWN_MS; // referenced for lint clarity

  if (state.kind === 'converse') {
    return (
      <MobileSheet
        open
        sessionId={sessionId}
        initialMessages={initialMessages}
        pageContext={{ path: pathname ?? '/' }}
        leadState={leadState}
        onPanelRequest={onPanelRequest}
        onClose={() => dispatch({ type: 'CLOSE_CONVERSE' })}
        subtitle={pathname === '/contact' ? copy.idle : undefined}
      />
    );
  }

  if (state.kind === 'peek') {
    return (
      <PillPeek
        variant={state.variant}
        text={state.text}
        onTap={() => dispatch({ type: 'TAP_PEEK' })}
        onDismiss={dismissPeek}
        autoDismissMs={state.variant === 'narration' ? NARRATION_PEEK_MS : 0}
      />
    );
  }

  return <PillIdle label={copy.idle} onActivate={() => dispatch({ type: 'TAP_PILL' })} />;
}

/**
 * Map a show_content_panel tool call to a public-page path when one
 * clearly exists. Returns null when auto-nav would be a bad idea
 * (diagrams, stats, playbook summaries).
 */
function panelTargetPath(panel: ShowContentPanelArgs): string | null {
  const s = panel.entityRef;
  switch (panel.panelType) {
    case 'service':
      return `/services/${s}`;
    case 'industry':
      return `/industries/${s}`;
    case 'platform':
      return `/platforms/${s}`;
    case 'case':
      return `/case-studies/${s}`;
    case 'resource':
      return `/lp/${s}`;
    default:
      return null; // diagram/playbook/comparison/timeline/stats: stay put
  }
}

function narrationFor(panel: ShowContentPanelArgs): string {
  const entity = panel.entityRef
    .split('-')
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
  if (panel.rationale && panel.rationale.trim().length > 0) {
    return panel.rationale.trim();
  }
  return `On the ${entity} page now. Tap to pick it up.`;
}

function sectionForPanel(panel: ShowContentPanelArgs): string | undefined {
  if (panel.panelType === 'case') return 'outcomes';
  if (panel.panelType === 'service') return 'offerings';
  return undefined;
}

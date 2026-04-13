'use client';

/**
 * Atheros chat entry point.
 *
 * Desktop (viewport >= 1024 px) -> ConsultationShell (Part 4).
 * Mobile  (viewport <  1024 px) -> MobilePill (Part 5).
 *
 * Legacy v1 chat widget has been removed; there is no fallback path.
 * When COPILOT_V2_ENABLED is false (or the kill switch is on), this
 * component renders nothing — by design. Rollback = disable the flag
 * = no chat surface at all, which is safer than a broken one.
 *
 * Route-level suppression: ad-connected landing pages under /lp/*
 * are form-fill surfaces; no chat widget renders on those routes.
 */

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { copilotV2Active } from '@/lib/copilot/clientStream';
import type { ChatColumnMessage } from '@/components/copilot/ChatColumn';

const ConsultationShell = dynamic(
  () => import('@/components/copilot/ConsultationShell'),
  { ssr: false },
);

const MobilePill = dynamic(
  () => import('@/components/copilot/mobile/MobilePill'),
  { ssr: false },
);

/**
 * Routes where no chat widget should mount. Landing pages connected
 * to paid ads are laser-focused on the form conversion; adding chat
 * dilutes attention.
 */
function isChatSuppressedRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === '/lp' || pathname.startsWith('/lp/')) return true;
  if (pathname.startsWith('/admin')) return true;
  return false;
}

function generateSessionId(): string {
  return `atheros_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

const SESSION_STORAGE_KEY = 'atheros_session_id';

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Desktop viewport detection for the Atheros surface split.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Persistent session id. Same id across page navigations so the
  // persisted thread in ChatColumn keeps accumulating. We read from
  // localStorage once on mount; reading external state and writing it
  // into React state is what effects are for, so the rule suppression
  // below is intentional and scoped to this exact pattern.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let next = '';
    try {
      const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
      if (existing && existing.startsWith('atheros_')) {
        next = existing;
      } else {
        next = generateSessionId();
        window.localStorage.setItem(SESSION_STORAGE_KEY, next);
      }
    } catch {
      // copilot-allow-silent-catch: storage unavailable; generate a
      // transient id so Atheros still works for the current tab.
      next = generateSessionId();
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- bootstrap sessionId from localStorage on mount; one-shot
    setSessionId(next);
  }, []);

  // Route-level + flag-level short-circuits.
  if (isChatSuppressedRoute(pathname)) return null;
  if (!sessionId) return null;
  if (!copilotV2Active(sessionId)) return null;

  const emptyInitial: ChatColumnMessage[] = [];
  const leadStatePlaceholder: Record<string, unknown> = {};

  if (isDesktop) {
    return (
      <>
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Atheros"
            className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--aci-secondary,#0A1628)] px-4 py-2.5 text-sm font-semibold text-white shadow-2xl transition hover:bg-[var(--aci-primary,#0052CC)]"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            <span>Ask Atheros</span>
            <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-[var(--aci-lime,#C4FF61)]" aria-hidden />
          </button>
        )}
        <ConsultationShell
          sessionId={sessionId}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          initialMessages={emptyInitial}
          pageContext={{ path: pathname ?? '/' }}
          leadState={leadStatePlaceholder}
        />
      </>
    );
  }

  // Mobile: the pill is always mounted; it manages its own open/close
  // state machine (pill / converse / peek).
  return (
    <MobilePill
      sessionId={sessionId}
      initialMessages={emptyInitial}
      leadState={leadStatePlaceholder}
    />
  );
}

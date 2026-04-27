'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import ChatColumn, { type ChatColumnMessage } from './ChatColumn';
import ContentCanvas, { type ContentCanvasHandle } from './ContentCanvas';
import type { PanelType } from './panels/registry';
import type { ShowContentPanelArgs } from '@/lib/copilot/tools';

export interface ConsultationShellProps {
  sessionId: string;
  open: boolean;
  onClose: () => void;
  initialMessages: ChatColumnMessage[];
  pageContext: Record<string, unknown>;
  leadState: Record<string, unknown>;
}

/**
 * Route-specific width profile. /contact clamps the shell so the form
 * stays visible per Guiding Constraint #3.
 */
const ROUTE_PROFILE: Record<string, { widthPct: number; subtitle?: string }> = {
  '/contact': {
    widthPct: 45,
    subtitle: 'Ask Atheros anything while you are filling the form.',
  },
};

function routeProfile(pathname: string | null) {
  if (!pathname) return { widthPct: 60 };
  if (ROUTE_PROFILE[pathname]) return ROUTE_PROFILE[pathname];
  return { widthPct: 60 };
}

export default function ConsultationShell({
  sessionId,
  open,
  onClose,
  initialMessages,
  pageContext,
  leadState,
}: ConsultationShellProps) {
  const pathname = usePathname();
  const profile = routeProfile(pathname);
  const [canvasApi, setCanvasApi] = useState<ContentCanvasHandle | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus management: remember the previously focused element on open,
  // restore on close. Move initial focus to the dialog.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const timer = setTimeout(() => dialogRef.current?.focus(), 50);
    return () => {
      clearTimeout(timer);
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, open]);

  // Body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onPanelRequest = useCallback(
    (panel: ShowContentPanelArgs) => {
      canvasApi?.show(panel.panelType as PanelType, panel.entityRef, panel.rationale);
    },
    [canvasApi],
  );

  const shellWidth = useMemo(
    () => `min(${profile.widthPct}vw, 1100px)`,
    [profile.widthPct],
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="atheros-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[500] bg-black/20"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="atheros-shell"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Atheros consultation"
            tabIndex={-1}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
            style={{ width: shellWidth }}
            className="fixed right-0 top-0 z-[501] h-[100dvh] overflow-hidden rounded-l-3xl border-l border-white/40 shadow-2xl outline-none"
          >
            <div className="relative grid h-full grid-cols-[minmax(320px,40%)_minmax(0,1fr)] bg-white/92 backdrop-blur-xl">
              <aside className="flex min-h-0 flex-col border-r border-gray-200/60">
                <ChatColumn
                  sessionId={sessionId}
                  initialMessages={initialMessages}
                  pageContext={pageContext}
                  leadState={leadState}
                  onPanelRequest={onPanelRequest}
                  onClose={onClose}
                  subtitle={profile.subtitle}
                />
              </aside>
              <section className="min-h-0">
                <ContentCanvas onReady={setCanvasApi} />
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

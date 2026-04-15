'use client';

/**
 * Atheros mobile converse sheet. 85vh bottom sheet with a drag handle
 * at the top. Swiping the handle past a threshold closes the sheet.
 *
 * Reuses the Part-4 ChatColumn so the mobile chat experience is the
 * same component the desktop shell uses, just without the content canvas.
 *
 * Cross-browser note: the enter/exit animation is driven by a numeric
 * pixel offset (y measured off a ref), never by a '%' string. Mixing
 * string and numeric units on the same framer-motion axis has panicked
 * WebKit's animation parser on iOS Safari in the past, which is the
 * root cause of the "Application error" crash we saw when tapping the
 * pill. Keep everything on this axis as `number`.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatColumn, { type ChatColumnMessage } from '../ChatColumn';
import type { ShowContentPanelArgs } from '@/lib/copilot/tools';

interface MobileSheetProps {
  open: boolean;
  sessionId: string;
  initialMessages: ChatColumnMessage[];
  pageContext: Record<string, unknown>;
  leadState: Record<string, unknown>;
  onPanelRequest: (panel: ShowContentPanelArgs) => void;
  onClose: () => void;
  subtitle?: string;
}

// useLayoutEffect emits a warning during SSR; guard it so the sheet
// can still be dynamically imported without noise.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function MobileSheet({
  open,
  sessionId,
  initialMessages,
  pageContext,
  leadState,
  onPanelRequest,
  onClose,
  subtitle,
}: MobileSheetProps) {
  // Measured sheet height in px. Initialised to a reasonable fallback
  // (viewport height on clients) so the first frame has a value even
  // before the ref is populated.
  const [sheetHeight, setSheetHeight] = useState<number>(() => {
    if (typeof window === 'undefined') return 800;
    return Math.round(window.innerHeight * 0.85);
  });
  const [dragY, setDragY] = useState(0);
  const startY = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const savedScrollY = useRef<number>(0);

  // Measure real sheet height once it mounts; update on viewport resize
  // (e.g. rotating a phone or the iOS URL bar collapsing).
  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const h = sheetRef.current?.offsetHeight;
      if (h && h > 0) setSheetHeight(h);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [open]);

  // Body-scroll lock + ESC handler. Wrapped in try/catch because
  // iOS Safari in private browsing can throw on style writes during
  // certain reflow states; if the lock fails we still want the sheet
  // to render rather than the whole page crashing.
  useEffect(() => {
    if (!open) return;
    let prevOverflow = '';
    try {
      savedScrollY.current = window.scrollY;
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } catch {
      // copilot-allow-silent-catch: scroll lock best-effort; sheet still renders
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      try {
        document.body.style.overflow = prevOverflow;
        // Restore the scroll position the user was at when the sheet
        // opened; iOS Safari otherwise jumps to 0 on some releases.
        window.scrollTo(0, savedScrollY.current);
      } catch {
        // copilot-allow-silent-catch: restore is best-effort
      }
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    startY.current = e.clientY;
    const target = e.currentTarget;
    if (typeof target.setPointerCapture === 'function') {
      try {
        target.setPointerCapture(e.pointerId);
      } catch {
        // copilot-allow-silent-catch: capture is a polish nicety
      }
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (startY.current === null) return;
    const delta = e.clientY - startY.current;
    if (Number.isFinite(delta) && delta > 0) setDragY(delta);
  }, []);

  const releaseCapture = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      if (typeof target.releasePointerCapture === 'function') {
        try {
          target.releasePointerCapture(e.pointerId);
        } catch {
          // copilot-allow-silent-catch: pointer capture is a polish nicety
        }
      }
    },
    [],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      releaseCapture(e);
      const shouldClose = dragY > 140;
      startY.current = null;
      setDragY(0);
      if (shouldClose) onClose();
    },
    [dragY, onClose, releaseCapture],
  );

  const onPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      releaseCapture(e);
      startY.current = null;
      setDragY(0);
    },
    [releaseCapture],
  );

  // Off-screen y is the measured sheet height in px (so the sheet
  // enters from below the viewport and exits to below). Numeric
  // throughout — never mixed with '%' strings.
  const offScreenY = sheetHeight;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="atheros-mobile-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[500] bg-black/25"
            aria-hidden
            onClick={onClose}
          />
          <motion.div
            key="atheros-mobile-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Atheros"
            initial={{ y: offScreenY }}
            animate={{ y: dragY }}
            exit={{ y: offScreenY }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-[501] flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-[0_-12px_48px_rgba(10,22,40,0.25)]"
            style={{ height: '85vh' }}
          >
            <div
              className="flex cursor-grab touch-none items-center justify-center py-2 active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
              aria-label="Drag to close"
              role="button"
            >
              <span className="h-1.5 w-12 rounded-full bg-gray-300" />
            </div>
            <div className="min-h-0 flex-1">
              <ChatColumn
                sessionId={sessionId}
                initialMessages={initialMessages}
                pageContext={pageContext}
                leadState={leadState}
                onPanelRequest={onPanelRequest}
                onClose={onClose}
                subtitle={subtitle}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

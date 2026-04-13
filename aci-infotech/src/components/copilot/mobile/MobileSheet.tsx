'use client';

/**
 * Atheros mobile converse sheet. 85vh bottom sheet with a drag handle
 * at the top. Swiping the handle past a threshold closes the sheet.
 *
 * Reuses the Part-4 ChatColumn so the mobile chat experience is the
 * same component the desktop shell uses, just without the content canvas.
 */
import { useEffect, useRef, useState } from 'react';
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
  const [dragY, setDragY] = useState(0);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

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
            role="dialog"
            aria-modal="true"
            aria-label="Atheros"
            initial={{ y: '100%' }}
            animate={{ y: dragY }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-[501] flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-[0_-12px_48px_rgba(10,22,40,0.25)]"
            style={{ height: '85vh' }}
          >
            <div
              className="flex cursor-grab touch-none items-center justify-center py-2 active:cursor-grabbing"
              onPointerDown={(e) => {
                startY.current = e.clientY;
                (e.target as Element).setPointerCapture?.(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (startY.current === null) return;
                const delta = e.clientY - startY.current;
                if (delta > 0) setDragY(delta);
              }}
              onPointerUp={() => {
                const shouldClose = dragY > 140;
                startY.current = null;
                setDragY(0);
                if (shouldClose) onClose();
              }}
              onPointerCancel={() => {
                startY.current = null;
                setDragY(0);
              }}
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

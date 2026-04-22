'use client';

/**
 * MegaMenu — shared shell that every v2 mega menu renders inside.
 *
 * Handles:
 *   - Enter / exit animation (fade + slight rise)
 *   - Scrim behind the panel (blur + dark tint)
 *   - Mouse hover onto the panel cancels the pending close (so
 *     moving from trigger → panel doesn't dismiss the menu)
 *   - Focus management: on open, first focusable element in the
 *     panel receives focus; on close, focus returns to the trigger
 *   - ARIA: role="dialog" on the panel, aria-label per menu
 *
 * The component is presentational — it doesn't know which menu it's
 * hosting. The specific menu components (ServicesMenu, etc.)
 * compose their content inside.
 *
 * Open / close state is owned by the parent orchestrator via
 * useMegaMenuHover. This shell just reacts to the `open` prop.
 */

import { ReactNode, useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface MegaMenuProps {
  /** Whether the menu should render. Parent toggles this. */
  open: boolean;
  /** Called when the user intends to close the menu (scrim click). */
  onClose: () => void;
  /** Called when the user hovers onto the panel. The orchestrator uses
   *  this to cancel a pending close. */
  onPointerEnter?: () => void;
  /** Called when the user hovers off the panel. Orchestrator closes. */
  onPointerLeave?: () => void;
  /** Element that triggered the menu; focus returns here on close. */
  triggerRef?: React.RefObject<HTMLElement | null>;
  /** Max width of the panel. Different menus have different shapes. */
  maxWidth?: number;
  /**
   * How to position the panel horizontally.
   *   - 'left'   — hug the left gutter (default, matches the nav's
   *                logo edge; best for wide menus like Services and
   *                Platforms).
   *   - 'center' — horizontally center within the viewport gutters
   *                (better for narrower menus so they don't look
   *                stranded on the far left of the screen).
   */
  align?: 'left' | 'center';
  /** Accessible label for the dialog / menu panel. */
  ariaLabel: string;
  children: ReactNode;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export default function MegaMenu({
  open,
  onClose,
  onPointerEnter,
  onPointerLeave,
  triggerRef,
  maxWidth = 1080,
  align = 'left',
  ariaLabel,
  children,
}: MegaMenuProps) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus management:
  //   - We deliberately do NOT auto-focus into the panel on open.
  //     The nav is hover-primary, and auto-focus creates a nasty
  //     loop with hover: close → focus returns to trigger → the
  //     trigger's onFocus fires → requestOpen → menu reopens. That
  //     loop was the root cause of the "menu won't close" and the
  //     "Industries hover never updates the card" bugs (since
  //     reopening remounts the menu, which resets its local state).
  //   - Keyboard users can still Tab from the trigger into the
  //     panel — the panel's focusable elements follow the trigger
  //     in DOM order.
  //   - On close, we only return focus to the trigger if the active
  //     element was inside the panel (i.e. the user had explicitly
  //     focused something there, e.g. via Tab or clicking a link).
  //     If focus is already on the trigger or elsewhere, we leave
  //     it alone.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (!open && wasOpen.current) {
      const active = document.activeElement as HTMLElement | null;
      if (active && panelRef.current?.contains(active)) {
        triggerRef?.current?.focus();
      }
    }
    wasOpen.current = open;
  }, [open, triggerRef]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Scrim */}
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18, ease: EASE }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              top: 0,
              zIndex: 45,
              background: 'rgba(5, 11, 31, 0.55)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              pointerEvents: 'auto',
            }}
            aria-hidden
          />

          {/* Panel — 'left' anchors to the nav's gutter so wide menus
              (Services, Platforms) line up with the logo; 'center'
              horizontally centers the panel for narrower menus
              (Industries, Resources, Company) so they don't look
              stranded on the left. Centering uses `left: 50%` with a
              negative marginLeft (not transform) so framer's `y`
              transform doesn't clash. CSS transitions on left /
              margin / width / max-width animate the panel smoothly
              when the user swaps between menus of different shapes
              without the shell closing and reopening. */}
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-label={ariaLabel}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: EASE }}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            style={{
              position: 'fixed',
              top: 80,
              left: align === 'center' ? '50%' : 44,
              marginLeft:
                align === 'center'
                  ? `calc(-1 * min(calc(50vw - 44px), ${maxWidth / 2}px))`
                  : 0,
              width: `min(calc(100vw - 88px), ${maxWidth}px)`,
              zIndex: 46,
              background: 'var(--v2-surface-1)',
              border: '1px solid var(--v2-border-strong)',
              borderRadius: 8,
              boxShadow:
                '0 24px 60px -12px rgba(0, 0, 0, 0.55), 0 0 0 1px var(--v2-border-subtle)',
              overflow: 'hidden',
              transition: reduced
                ? undefined
                : 'left 260ms var(--v2-ease), margin-left 260ms var(--v2-ease), width 260ms var(--v2-ease)',
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

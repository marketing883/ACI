'use client';

/**
 * useMegaMenuHover — centralized hover/open-close timing for the v2
 * mega menus. Lives outside any single menu so moving the cursor
 * from trigger A to trigger B (or onto either panel) feels
 * instant, while an accidental pass-through doesn't flash a menu.
 *
 * Exposes an orchestrator state and helpers each trigger calls:
 *
 *   const menu = useMegaMenuHover();
 *   <button
 *     onMouseEnter={() => menu.requestOpen('services')}
 *     onMouseLeave={() => menu.requestClose()}
 *   >Services</button>
 *   <MegaMenu
 *     open={menu.isOpen('services')}
 *     onMouseEnter={menu.cancelClose}
 *     onMouseLeave={menu.requestClose}
 *   />
 *
 * Timing:
 *   requestOpen while closed      -> opens after 80ms (filters out
 *                                    accidental pass-through hovers)
 *   requestOpen while another     -> swaps after 90ms. A short delay
 *     menu already open              (rather than an instant swap)
 *                                    prevents brief grazing — e.g. the
 *                                    cursor skimming a neighboring
 *                                    trigger on its way from the
 *                                    intended trigger down to a card
 *                                    in the panel's far column — from
 *                                    flipping the menu under the user.
 *   requestClose                  -> closes after 200ms (gives time
 *                                    to cross the gap trigger→panel)
 *   cancelClose                   -> cancels pending close
 *   close                         -> closes immediately (Escape, click
 *                                    outside, user navigation)
 */

import { useCallback, useEffect, useRef, useState } from 'react';

const OPEN_DELAY_MS = 80;
const SWAP_DELAY_MS = 90;
const CLOSE_DELAY_MS = 200;

export function useMegaMenuHover() {
  const [openId, setOpenId] = useState<string | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpenTimer = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const requestOpen = useCallback(
    (id: string) => {
      clearCloseTimer();
      if (openId === id) return;
      clearOpenTimer();
      // Swap faster than a cold-open, but still require a sustained
      // hover so brief grazing of a neighboring trigger doesn't flip
      // the menu under the user.
      const delay = openId !== null ? SWAP_DELAY_MS : OPEN_DELAY_MS;
      openTimer.current = setTimeout(() => {
        setOpenId(id);
      }, delay);
    },
    [openId, clearCloseTimer, clearOpenTimer],
  );

  const requestClose = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    closeTimer.current = setTimeout(() => {
      setOpenId(null);
    }, CLOSE_DELAY_MS);
  }, [clearOpenTimer, clearCloseTimer]);

  const cancelClose = useCallback(() => {
    clearCloseTimer();
  }, [clearCloseTimer]);

  const close = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    setOpenId(null);
  }, [clearOpenTimer, clearCloseTimer]);

  const isOpen = useCallback((id: string) => openId === id, [openId]);

  // Close on Escape.
  useEffect(() => {
    if (openId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId, close]);

  // Clean up any pending timers on unmount.
  useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, [clearOpenTimer, clearCloseTimer]);

  return {
    openId,
    isOpen,
    requestOpen,
    requestClose,
    cancelClose,
    close,
  };
}

export type MegaMenuHover = ReturnType<typeof useMegaMenuHover>;

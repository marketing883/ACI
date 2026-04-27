'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PANEL_REGISTRY, isKnownPanelType, type PanelType } from './panels/registry';
import { resolveEntity } from '@/lib/copilot/entityIndex.generated';
import { log } from '@/lib/copilot/logger';

export interface PanelRequest {
  id: string;
  panelType: PanelType;
  entityRef: string;
  rationale?: string;
  highlight?: string;
  kicker: string;
}

export interface ContentCanvasHandle {
  show(panelType: string, entityRef: string, rationale?: string): void;
  back(): void;
  clear(): void;
}

export interface ContentCanvasProps {
  /** Exposed to parent via ref-like callback (kept simple, no forwardRef). */
  onReady?: (api: ContentCanvasHandle) => void;
  /** Placeholder shown when no panel is active. */
  placeholder?: React.ReactNode;
}

let counter = 0;
function nextId() {
  counter = (counter + 1) % Number.MAX_SAFE_INTEGER;
  return `p_${Date.now().toString(36)}_${counter}`;
}

export default function ContentCanvas({ onReady, placeholder }: ContentCanvasProps) {
  const [history, setHistory] = useState<PanelRequest[]>([]);
  const [active, setActive] = useState<PanelRequest | null>(null);
  const [, startTransition] = useTransition();
  const breadcrumbRef = useRef<HTMLDivElement>(null);

  const show = useCallback((panelType: string, entityRef: string, rationale?: string) => {
    if (!isKnownPanelType(panelType)) {
      log.warn('panel', 'unknown panelType', { extra: { panelType, entityRef } });
      return;
    }
    const resolved = resolveEntity(entityRef);
    // For diagram panels we accept any key registered in DIAGRAM_REGISTRY.
    if (!resolved && panelType !== 'diagram' && panelType !== 'comparison') {
      log.warn('panel', 'unknown entityRef', { extra: { panelType, entityRef } });
      // Still render with a "not in catalog" fallback so the user sees something honest.
    }
    const req: PanelRequest = {
      id: nextId(),
      panelType,
      entityRef,
      rationale,
      kicker: resolved?.title ?? entityRef,
    };
    startTransition(() => {
      setActive(req);
      setHistory((h) => {
        if (h[h.length - 1]?.entityRef === req.entityRef && h[h.length - 1]?.panelType === req.panelType) {
          return h;
        }
        return [...h, req].slice(-6);
      });
    });
  }, []);

  const back = useCallback(() => {
    setHistory((h) => {
      const next = h.slice(0, -1);
      setActive(next[next.length - 1] ?? null);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setHistory([]);
    setActive(null);
  }, []);

  const api = useMemo<ContentCanvasHandle>(
    () => ({ show, back, clear }),
    [show, back, clear],
  );

  useEffect(() => {
    onReady?.(api);
  }, [api, onReady]);

  const Panel = active ? PANEL_REGISTRY[active.panelType] : null;

  return (
    <div className="flex h-full flex-col bg-white">
      {history.length > 1 && (
        <nav
          ref={breadcrumbRef}
          aria-label="Canvas history"
          className="flex gap-1.5 border-b border-gray-200/70 bg-gray-50/50 px-6 py-2 overflow-x-auto"
        >
          {history.map((h, i) => (
            <button
              key={h.id}
              type="button"
              onClick={() => {
                setActive(h);
                setHistory((list) => list.slice(0, i + 1));
              }}
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                h.id === active?.id
                  ? 'bg-[color:var(--aci-primary,#0052CC)] text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-[color:var(--aci-primary,#0052CC)]'
              }`}
            >
              {h.kicker}
            </button>
          ))}
        </nav>
      )}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {active && Panel ? (
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    Loading…
                  </div>
                }
              >
                <Panel
                  entityRef={active.entityRef}
                  highlight={active.highlight}
                />
              </Suspense>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0"
            >
              {placeholder ?? (
                <div className="flex h-full items-center justify-center p-10 text-center text-sm text-gray-400">
                  The content canvas will respond here as Atheros finds matching proof, diagrams, and playbooks.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

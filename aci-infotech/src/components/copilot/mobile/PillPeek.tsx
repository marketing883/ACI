'use client';

/**
 * Peek surface above the idle pill. Two visually-distinct variants:
 *   - proactive: the passive dwell+scroll triggered nudge.
 *   - narration: the post-autonav guide with a page-icon glyph.
 *
 * Self-contained CSS so mobile first-interaction bundle stays small.
 */
import { useEffect } from 'react';

interface PillPeekProps {
  variant: 'proactive' | 'narration';
  text: string;
  onTap: () => void;
  onDismiss: () => void;
  /** Auto-dismiss after N ms. 0 disables. */
  autoDismissMs?: number;
}

export default function PillPeek({
  variant,
  text,
  onTap,
  onDismiss,
  autoDismissMs = 0,
}: PillPeekProps) {
  useEffect(() => {
    if (!autoDismissMs) return;
    const t = window.setTimeout(onDismiss, autoDismissMs);
    return () => window.clearTimeout(t);
  }, [autoDismissMs, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`atheros-peek atheros-peek--${variant}`}
    >
      <button
        type="button"
        className="atheros-peek-body"
        onClick={onTap}
        aria-label="Open Atheros"
      >
        {variant === 'narration' ? (
          <svg
            viewBox="0 0 16 16"
            className="atheros-peek-glyph"
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="1.5" y="2" width="13" height="12" rx="1.6" fill="#0052CC" />
            <rect x="3" y="4.5" width="6" height="1.2" rx="0.6" fill="#fff" />
            <rect x="3" y="7" width="10" height="1.2" rx="0.6" fill="#fff" />
            <rect x="3" y="9.5" width="8" height="1.2" rx="0.6" fill="#fff" />
          </svg>
        ) : (
          <span className="atheros-peek-dot" aria-hidden />
        )}
        <span className="atheros-peek-text">{text}</span>
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="atheros-peek-close"
      >
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden>
          <path
            d="M2 2 L10 10 M10 2 L2 10"
            stroke="#6b7280"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <style>{`
        .atheros-peek {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: calc(env(safe-area-inset-bottom, 0px) + 68px);
          z-index: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          max-width: min(92vw, 420px);
          padding: 8px 10px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(10, 22, 40, 0.1);
          backdrop-filter: blur(22px) saturate(180%);
          -webkit-backdrop-filter: blur(22px) saturate(180%);
          box-shadow: 0 12px 32px rgba(10, 22, 40, 0.18);
          animation: atheros-peek-in 0.28s ease-out both;
        }
        .atheros-peek--narration { border-color: rgba(0, 82, 204, 0.25); }
        .atheros-peek-body {
          appearance: none;
          border: 0;
          background: transparent;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex: 1 1 auto;
          padding: 2px 4px;
          font-family: 'Funnel Sans', system-ui, sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #0a1628;
          text-align: left;
          cursor: pointer;
        }
        .atheros-peek-text { line-height: 1.3; }
        .atheros-peek-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #c4ff61;
          flex: 0 0 auto;
        }
        .atheros-peek-glyph { width: 16px; height: 16px; flex: 0 0 auto; }
        .atheros-peek-close {
          appearance: none;
          border: 0;
          background: transparent;
          padding: 4px;
          cursor: pointer;
          flex: 0 0 auto;
          color: #6b7280;
        }
        @keyframes atheros-peek-in {
          from { opacity: 0; transform: translate(-50%, 6px); }
          to   { opacity: 1; transform: translate(-50%, 0);   }
        }
        @media (prefers-reduced-motion: reduce) {
          .atheros-peek { animation: none; }
        }
      `}</style>
    </div>
  );
}

'use client';

/**
 * Idle pill. Pure CSS, no Framer Motion, no heavy deps.
 * Stays within the Part-5 ≤ 4 KB gzipped idle budget by keeping the
 * markup minimal and the animation in plain CSS.
 */
import type { MouseEventHandler } from 'react';

interface PillIdleProps {
  label: string;
  onActivate: MouseEventHandler<HTMLButtonElement>;
}

export default function PillIdle({ label, onActivate }: PillIdleProps) {
  return (
    <button
      type="button"
      aria-label="Open Atheros"
      onClick={onActivate}
      className="atheros-pill-idle"
    >
      <span className="atheros-pill-dot" aria-hidden />
      <span className="atheros-pill-label">{label}</span>
      <style>{`
        .atheros-pill-idle {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
          z-index: 500;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 16px 0 12px;
          border: 1px solid rgba(10, 22, 40, 0.08);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          box-shadow: 0 10px 24px rgba(10, 22, 40, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          font-family: 'Funnel Sans', system-ui, -apple-system, sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #0a1628;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .atheros-pill-idle:active { transform: translateX(-50%) scale(0.98); }
        .atheros-pill-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #c4ff61;
          box-shadow: 0 0 0 3px rgba(196, 255, 97, 0.25);
          animation: atheros-pill-pulse 3s ease-in-out infinite;
        }
        .atheros-pill-label {
          max-width: 240px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        @keyframes atheros-pill-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(196, 255, 97, 0.25); }
          50%      { box-shadow: 0 0 0 6px rgba(196, 255, 97, 0.12); }
        }
        @media (prefers-reduced-motion: reduce) {
          .atheros-pill-dot { animation: none; }
        }
      `}</style>
    </button>
  );
}

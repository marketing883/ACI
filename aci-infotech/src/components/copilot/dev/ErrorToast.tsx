'use client';

/**
 * Dev-only Atheros error toast.
 *
 * Rendered only when NEXT_PUBLIC_COPILOT_DEV_ERRORS === '1' so it never
 * ships on a production public page and never appears to real users.
 * Reads the client-side buffer populated by src/lib/copilot/logger.ts.
 *
 * This is a developer-assist surface, not a user-facing component. Admin
 * error triage happens on /admin/copilot/errors (Part 6).
 */

import { useEffect, useState } from 'react';
import { COPILOT_DEV_ERRORS } from '@/lib/copilot/flags';
import { getDevErrorBuffer } from '@/lib/copilot/logger';

interface DevErrorRow {
  stage: string;
  severity: string;
  message: string;
  createdAt: string;
}

export default function ErrorToast() {
  const [rows, setRows] = useState<DevErrorRow[]>([]);

  useEffect(() => {
    if (!COPILOT_DEV_ERRORS) return;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const buf = getDevErrorBuffer();
      // Slice last 5 for compact display, newest first.
      const next = buf
        .slice(-5)
        .reverse()
        .map((e) => ({
          stage: e.stage,
          severity: e.severity,
          message: e.message,
          createdAt: e.createdAt,
        }));
      setRows(next);
    };
    tick();
    const t = window.setInterval(tick, 1500);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, []);

  if (!COPILOT_DEV_ERRORS || rows.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        right: 12,
        bottom: 12,
        zIndex: 999999,
        maxWidth: 360,
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        fontSize: 11,
        lineHeight: 1.4,
        color: '#fff',
        background: 'rgba(10,22,40,0.92)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: '8px 10px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      }}
    >
      <div style={{ opacity: 0.7, marginBottom: 4 }}>
        atheros / dev-only ({rows.length})
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ marginTop: 4 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '1px 6px',
              borderRadius: 4,
              marginRight: 6,
              background:
                r.severity === 'fatal'
                  ? '#b00020'
                  : r.severity === 'error'
                  ? '#d35400'
                  : r.severity === 'warn'
                  ? '#8e6a00'
                  : '#1f4d8a',
            }}
          >
            {r.severity}
          </span>
          <span style={{ opacity: 0.8 }}>{r.stage}</span>
          <div style={{ whiteSpace: 'pre-wrap' }}>{r.message}</div>
        </div>
      ))}
    </div>
  );
}

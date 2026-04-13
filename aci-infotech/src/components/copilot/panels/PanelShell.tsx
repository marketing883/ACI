'use client';

/**
 * Shared shell for every panel. Provides the panel header (kicker +
 * title + rationale), the scrollable body, and the sticky outcome-copy
 * footer. Keeps per-panel bundles small.
 */
import type { ReactNode } from 'react';

export interface PanelShellProps {
  kicker: string;
  title: string;
  rationale?: string;
  outcomeCopy?: string;
  children: ReactNode;
  /** Optional secondary action in the footer, e.g. "See the full case study". */
  secondaryHref?: string;
  secondaryLabel?: string;
}

export default function PanelShell({
  kicker,
  title,
  rationale,
  outcomeCopy,
  children,
  secondaryHref,
  secondaryLabel,
}: PanelShellProps) {
  return (
    <article
      aria-live="polite"
      className="flex h-full flex-col bg-white text-[color:var(--aci-secondary,#0A1628)]"
    >
      <header className="sticky top-0 z-10 border-b border-gray-200/70 bg-white/95 backdrop-blur px-8 pt-7 pb-5">
        <div className="text-xs font-medium uppercase tracking-[0.12em] text-[color:var(--aci-primary,#0052CC)]">
          {kicker}
        </div>
        <h2 className="mt-2 font-[var(--font-title,'Funnel_Display')] text-2xl font-bold leading-tight">
          {title}
        </h2>
        {rationale ? (
          <p className="mt-2 max-w-[64ch] text-sm text-gray-600">{rationale}</p>
        ) : null}
      </header>
      <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>
      {(outcomeCopy || secondaryHref) && (
        <footer className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200/70 bg-white/95 backdrop-blur px-8 py-4">
          {outcomeCopy ? (
            <p className="max-w-[54ch] text-sm font-medium text-[color:var(--aci-secondary,#0A1628)]">
              {outcomeCopy}
            </p>
          ) : (
            <span />
          )}
          {secondaryHref ? (
            <a
              href={secondaryHref}
              className="rounded-full bg-[color:var(--aci-primary,#0052CC)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--aci-primary-dark,#003D99)]"
            >
              {secondaryLabel ?? 'Open page'}
            </a>
          ) : null}
        </footer>
      )}
    </article>
  );
}

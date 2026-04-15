'use client';

/**
 * ChatErrorBoundary - React error boundary that wraps the Atheros
 * chat widget (desktop ConsultationShell + mobile MobilePill). If
 * anything inside the chat tree throws during render or lifecycle,
 * the boundary swallows the error so the host page stays usable.
 *
 * In production we render a tiny "Atheros is temporarily unavailable"
 * pill with a retry button instead of silently hiding the widget.
 * The retry increments a `resetKey` so the children remount fresh -
 * tapping retry after fixing a transient WebKit animation hiccup
 * brings the chat back without a full page reload.
 *
 * Tap the small "?" on the fallback pill to reveal the error message
 * and stack in-place. Useful for diagnosing mobile crashes without a
 * tethered devtools session: the visitor can screenshot the expanded
 * card and send it back.
 *
 * In development we render a louder red badge and expand the detail
 * panel by default so the failure is unmissable during local testing.
 *
 * Either way we console.error the full error + component stack so it
 * shows up in browser devtools and any attached RUM. The `[atheros-
 * chat]` prefix makes it easy to filter.
 */

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  resetKey: number;
  showDetails: boolean;
  errorMessage: string | null;
  errorStack: string | null;
  componentStack: string | null;
}

export default class ChatErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    resetKey: 0,
    showDetails: false,
    errorMessage: null,
    errorStack: null,
    componentStack: null,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      errorMessage: error?.message ?? 'unknown error',
      errorStack: error?.stack ?? null,
    };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    // Surface the error verbatim so devtools and any attached RUM can
    // grab the stack. The `[atheros-chat]` prefix makes it easy to
    // filter in browser consoles and in any remote log aggregator
    // hooked into console output.
    console.error(
      '[atheros-chat] crashed and was contained by ChatErrorBoundary',
      error,
      info?.componentStack,
    );
    this.setState({ componentStack: info?.componentStack ?? null });
  }

  private handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      resetKey: prev.resetKey + 1,
      showDetails: false,
      errorMessage: null,
      errorStack: null,
      componentStack: null,
    }));
  };

  private toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development';
      const { errorMessage, errorStack, componentStack, showDetails } = this.state;

      // Dev: red, expanded by default, unmissable.
      if (isDev) {
        return (
          <div
            className="fixed bottom-4 right-4 z-[500] flex max-w-[380px] flex-col gap-2 rounded-lg border border-red-500/40 bg-red-950/95 px-3 py-2 text-xs text-red-100 shadow-xl"
            role="status"
          >
            <div className="flex items-center gap-2">
              <span className="flex-1">Atheros crashed.</span>
              <button
                type="button"
                onClick={this.handleRetry}
                className="rounded border border-red-400/60 px-2 py-0.5 hover:bg-red-900/80"
              >
                Retry
              </button>
            </div>
            <pre className="max-h-[50vh] overflow-auto whitespace-pre-wrap break-words rounded bg-black/40 p-2 text-[10px] leading-snug">
              {errorMessage ?? 'unknown error'}
              {errorStack ? `\n\n${errorStack}` : ''}
              {componentStack ? `\n\nComponent stack:${componentStack}` : ''}
            </pre>
          </div>
        );
      }

      // Production: a quiet pill with a tap-to-reveal diagnostic card.
      return (
        <div
          className="fixed bottom-4 right-4 z-[500] flex max-w-[320px] flex-col gap-2 rounded-2xl border border-gray-200 bg-white/95 px-3 py-2 text-xs text-gray-700 shadow-lg"
          role="status"
        >
          <div className="flex items-center gap-2">
            <span className="flex-1">Atheros is temporarily unavailable.</span>
            <button
              type="button"
              onClick={this.toggleDetails}
              aria-label={showDetails ? 'Hide error details' : 'Show error details'}
              aria-expanded={showDetails}
              className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-[11px] font-semibold text-gray-500 hover:bg-gray-100"
            >
              ?
            </button>
            <button
              type="button"
              onClick={this.handleRetry}
              className="rounded-full bg-[color:var(--aci-primary,#0052CC)] px-2.5 py-0.5 text-[11px] font-medium text-white hover:opacity-90"
            >
              Try again
            </button>
          </div>
          {showDetails ? (
            <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap break-words rounded bg-gray-100 p-2 text-[10px] leading-snug text-gray-800">
              {errorMessage ?? 'unknown error'}
              {errorStack ? `\n\n${errorStack}` : ''}
              {componentStack ? `\n\nComponent stack:${componentStack}` : ''}
            </pre>
          ) : null}
        </div>
      );
    }
    // `resetKey` on a Fragment child doesn't remount; wrap in a keyed
    // div-less structure by spreading into a keyed child. Using
    // `key={resetKey}` on the children container forces a fresh
    // mount on retry.
    return (
      <div key={this.state.resetKey} style={{ display: 'contents' }}>
        {this.props.children}
      </div>
    );
  }
}

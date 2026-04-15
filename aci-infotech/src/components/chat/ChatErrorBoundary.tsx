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
 * In development we render a louder red badge so the failure is
 * unmissable during local testing.
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
}

export default class ChatErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, resetKey: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
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
  }

  private handleRetry = () => {
    this.setState((prev) => ({ hasError: false, resetKey: prev.resetKey + 1 }));
  };

  render() {
    if (this.state.hasError) {
      if (process.env.NODE_ENV === 'development') {
        return (
          <div
            className="fixed bottom-4 right-4 z-[500] flex max-w-[320px] items-center gap-2 rounded-lg border border-red-500/40 bg-red-950/90 px-3 py-2 text-xs text-red-100 shadow-xl"
            role="status"
          >
            <span>Atheros crashed. See console for the stack.</span>
            <button
              type="button"
              onClick={this.handleRetry}
              className="rounded border border-red-400/60 px-2 py-0.5 text-red-100 hover:bg-red-900/80"
            >
              Retry
            </button>
          </div>
        );
      }
      // Production: offer a quiet retry. If the boundary keeps firing
      // the user will see the same pill again, which is better than a
      // whole-page "application error".
      return (
        <div
          className="fixed bottom-4 right-4 z-[500] flex max-w-[300px] items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-3 py-2 text-xs text-gray-700 shadow-lg"
          role="status"
        >
          <span>Atheros is temporarily unavailable.</span>
          <button
            type="button"
            onClick={this.handleRetry}
            className="rounded-full bg-[color:var(--aci-primary,#0052CC)] px-2.5 py-0.5 text-[11px] font-medium text-white hover:opacity-90"
          >
            Try again
          </button>
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

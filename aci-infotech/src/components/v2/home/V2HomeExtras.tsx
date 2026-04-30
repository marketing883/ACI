'use client';

/**
 * V2HomeExtras — small client component that lazy-loads the chat
 * widget + Atheros nudge + Lenis smooth-scroll for the v2 homepage.
 *
 * Lives as a client component so we can use `next/dynamic({ ssr:
 * false })` to defer both bundles past initial render. The parent
 * V2HomeContent is an async server component and can't host the
 * `ssr: false` dynamic import directly.
 *
 * All three are post-hydration concerns: the chat tree is ~50 KB,
 * the proactive nudge has its own dwell/scroll trigger (7s in or
 * 25% scroll), and Lenis smooth-scroll has no effect on the first
 * paint. Pulling them out of the initial bundle keeps LCP and TTI on
 * the hero copy where they belong.
 */

import dynamic from 'next/dynamic';

const ChatWidgetWrapper = dynamic(
  () => import('@/components/chat/ChatWidgetWrapper'),
  { ssr: false },
);

interface Props {
  /** When true, skip the desktop AtherosNudge (mobile pill is enough). */
  mobile?: boolean;
}

const AtherosNudge = dynamic(
  () => import('@/components/atheros/AtherosNudge'),
  { ssr: false },
);

// Lenis itself bails on mobile and reduced-motion, but the import
// still ships in the initial chunk if loaded synchronously. Defer it
// so the Lenis bytes never compete with the LCP frame.
const SmoothScrollInit = dynamic(
  () => import('@/components/v2/craft/SmoothScroll').then((m) => m.SmoothScrollInit),
  { ssr: false },
);

export default function V2HomeExtras({ mobile = false }: Props) {
  return (
    <>
      <SmoothScrollInit />
      <ChatWidgetWrapper />
      {!mobile && <AtherosNudge />}
    </>
  );
}

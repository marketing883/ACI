'use client';

/**
 * V2HomeExtras — small client component that lazy-loads the chat
 * widget + Atheros nudge for the v2 homepage.
 *
 * Lives as a client component so we can use `next/dynamic({ ssr:
 * false })` to defer both bundles past initial render. The parent
 * V2HomeContent is an async server component and can't host the
 * `ssr: false` dynamic import directly.
 *
 * Both chat and nudge are post-hydration concerns: the chat tree is
 * ~50 KB and the proactive nudge has its own dwell/scroll trigger
 * (7s in or 25% scroll). Pulling them out of the initial bundle keeps
 * LCP and TTI on the hero copy where they belong.
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

export default function V2HomeExtras({ mobile = false }: Props) {
  return (
    <>
      <ChatWidgetWrapper />
      {!mobile && <AtherosNudge />}
    </>
  );
}

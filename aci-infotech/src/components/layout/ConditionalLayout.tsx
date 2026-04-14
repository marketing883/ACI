'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

// Lazy load ChatWidget - it's 887 lines and not critical for initial page render
const ChatWidgetWrapper = dynamic(
  () => import('@/components/chat/ChatWidgetWrapper'),
  { ssr: false }
);

// Lazy load the Atheros proactive nudge bubble. Desktop-only,
// dismissable, context-aware copy (see src/lib/atheros/contextMap.ts).
const AtherosNudge = dynamic(
  () => import('@/components/atheros/AtherosNudge'),
  { ssr: false },
);

// Dark-hero routes. On these, the nav renders transparent and the hero
// should extend beneath it, so we drop the usual pt-20 that pads every
// other page below the fixed nav bar.
const OVERLAY_HERO_ROUTES = new Set<string>(['/', '/preview/home']);

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isLandingPage = pathname?.startsWith('/lp');

  // Admin routes and landing pages have their own layouts
  if (isAdminRoute || isLandingPage) {
    return <>{children}</>;
  }

  const isOverlayHero = OVERLAY_HERO_ROUTES.has(pathname ?? '');

  // Regular site pages with Navigation, Footer, and Chat
  return (
    <>
      <Navigation />
      <main className={isOverlayHero ? '' : 'pt-20'}>{children}</main>
      <Footer />
      <ChatWidgetWrapper />
      <AtherosNudge />
    </>
  );
}

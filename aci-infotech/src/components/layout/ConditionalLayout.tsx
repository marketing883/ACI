'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import NavV2 from '@/components/v2/nav/NavV2';
import FooterV2 from '@/components/v2/home/FooterV2';
import { isV2NavRoute } from '@/components/layout/v2-routes';

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
  // v2 preview routes render standalone so the new dark aesthetic can
  // be judged without v1 nav/footer chrome on top. Only affects
  // /preview/v2* routes; /preview/home and all other existing routes
  // keep their existing layout behavior.
  const isV2Preview = pathname?.startsWith('/preview/v2');
  // Staging builds set NEXT_PUBLIC_USE_V2_HOME=true, which flips `/`
  // to the v2 homepage. That page renders its own NavV2 / FooterV2,
  // so the v1 chrome must be suppressed here too. The env var is
  // inlined at build time — on production builds this expression
  // folds to `false` and the branch is pruned.
  const isV2Root =
    pathname === '/' && process.env.NEXT_PUBLIC_USE_V2_HOME === 'true';

  // Admin routes, landing pages, v2 previews, and the staging v2
  // root all bypass the v1 Navigation / Footer / chat widgets.
  if (isAdminRoute || isLandingPage || isV2Preview || isV2Root) {
    return <>{children}</>;
  }

  // V2 chrome rollout: marketing sections migrate one at a time
  // (see src/components/layout/v2-routes.ts for the allowlist). On
  // a matching route, render NavV2/FooterV2 instead of the v1
  // Navigation/Footer. The mega-menu spotlight cards (featured
  // case study / whitepaper / blog) load empty here — V2HomeContent
  // pre-fetches them server-side because it's an async server
  // component, while this layout is client-only. A follow-up can
  // hydrate them via a small /api/nav/featured endpoint once we
  // decide whether the bandwidth is worth the visual richness on
  // every inner page.
  if (isV2NavRoute(pathname)) {
    // No top padding on the wrapper — V2 pages place a hero or
    // top-padded section as their first child (the careers hero has
    // its own pt-32, well above the ~70px nav). A wrapper pt-20
    // would just paint an 80px strip in the body background between
    // the dark nav and the page's dark hero. The dark background
    // here is a safety net for any future migrated page whose first
    // element doesn't fully cover the viewport top.
    return (
      <>
        <NavV2 forceSolid />
        <main style={{ background: 'var(--v2-bg)', minHeight: '100vh' }}>
          {children}
        </main>
        <FooterV2 />
        <ChatWidgetWrapper />
        <AtherosNudge />
      </>
    );
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

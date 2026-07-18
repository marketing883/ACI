'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import SiteNav, { v4HeadingClass } from '@/components/v4/hero/SiteNav';
import SiteFooter from '@/components/v4/hero/SiteFooter';

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
  // be judged without site chrome on top. Only affects
  // /preview/v2* routes; /preview/home and all other existing routes
  // keep their existing layout behavior.
  const isV2Preview = pathname?.startsWith('/preview/v2');
  // v3 "Data and AI" homepage preview is fully standalone too: it
  // ships its own nav, footer, and design system (src/components/v3),
  // so suppress all site chrome on /preview/v3.
  const isV3Preview = pathname?.startsWith('/preview/v3');
  // v4 (Effica-based) homepage preview ships its own nav, footer, and
  // design system (src/components/v4), so suppress all site chrome.
  const isV4Preview = pathname?.startsWith('/preview/v4');
  // The v4 design is now the production homepage. It renders its own
  // nav and footer, so `/` is fully standalone too.
  const isV4Home = pathname === '/';
  // Staging builds set NEXT_PUBLIC_USE_V2_HOME=true, which flips `/`
  // to the v2 homepage. That page renders its own NavV2 / FooterV2,
  // so the v1 chrome must be suppressed here too. The env var is
  // inlined at build time — on production builds this expression
  // folds to `false` and the branch is pruned.
  const isV2Root =
    pathname === '/' && process.env.NEXT_PUBLIC_USE_V2_HOME === 'true';

  // Admin routes, landing pages, v2 previews, and the staging v2
  // root all bypass the v1 Navigation / Footer / chat widgets.
  if (isAdminRoute || isLandingPage || isV2Preview || isV3Preview || isV4Preview || isV4Home || isV2Root) {
    return <>{children}</>;
  }

  const isOverlayHero = OVERLAY_HERO_ROUTES.has(pathname ?? '');

  // Every regular page gets the v4 chrome: the homepage mega-nav
  // (solid glass variant, since inner pages have no white hero for it
  // to float over) and the v4 SiteFooter, plus chat + nudge. The
  // fixed nav needs pt-20 on the content wrapper; overlay-hero
  // routes render the nav transparent over their own hero instead.
  return (
    <>
      <SiteNav variant={isOverlayHero ? 'overlay' : 'solid'} />
      <main className={isOverlayHero ? '' : 'pt-20'}>{children}</main>
      <SiteFooter headingClass={v4HeadingClass} />
      <ChatWidgetWrapper />
      <AtherosNudge />
    </>
  );
}

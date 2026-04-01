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

  // Regular site pages with Navigation, Footer, and Chat
  return (
    <>
      <Navigation />
      <main className="pt-20">{children}</main>
      <Footer />
      <ChatWidgetWrapper />
    </>
  );
}

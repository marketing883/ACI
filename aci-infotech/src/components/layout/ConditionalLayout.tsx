'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ChatWidgetWrapper from '@/components/chat/ChatWidgetWrapper';

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

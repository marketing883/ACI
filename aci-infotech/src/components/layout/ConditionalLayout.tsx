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

  // Admin routes have their own layout - don't show main site navigation
  if (isAdminRoute) {
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

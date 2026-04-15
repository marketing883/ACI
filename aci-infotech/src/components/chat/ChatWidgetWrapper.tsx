'use client';

import { usePathname } from 'next/navigation';
import ChatWidget from './ChatWidget';
import ChatErrorBoundary from './ChatErrorBoundary';

export default function ChatWidgetWrapper() {
  const pathname = usePathname();

  // Don't show chat widget on admin pages
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Any uncaught error inside the chat tree is caught here so it
  // cannot take down the rest of the page. iOS Safari in particular
  // has surfaced intermittent crashes; the boundary degrades to "no
  // pill" instead of a whole-page client-side exception.
  return (
    <ChatErrorBoundary>
      <ChatWidget />
    </ChatErrorBoundary>
  );
}

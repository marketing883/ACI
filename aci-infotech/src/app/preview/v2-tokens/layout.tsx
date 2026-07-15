import type { Metadata } from 'next';

// The page is a client component, so the noindex lives here. Internal
// design-token preview — must never be indexed.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function V2TokensLayout({ children }: { children: React.ReactNode }) {
  return children;
}

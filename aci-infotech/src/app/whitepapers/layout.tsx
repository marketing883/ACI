import type { Metadata } from 'next';

// /whitepapers is a Client Component, so this pass-through layout carries
// its metadata and a self-referencing canonical. The [slug] detail pages
// and the thank-you page override the canonical in their own layouts so
// they do not inherit this listing one.
export const metadata: Metadata = {
  title: { absolute: 'Whitepapers & Guides | ACI Infotech' },
  description:
    'Deep-dive resources from architects who have deployed these solutions at scale. Technical depth without the vendor fluff.',
  alternates: { canonical: 'https://aciinfotech.com/whitepapers' },
};

export default function WhitepapersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from 'next';

// /contact is a Client Component (it reads search params to prefill the
// form), so it cannot export metadata itself. This pass-through layout
// carries it. The canonical strips the query string: the page is linked
// with ?service=, ?reason=, and ?source= variants for form prefill and
// attribution, and Search Console was indexing each as a separate URL.
// Pointing every variant at the clean /contact consolidates them.
export const metadata: Metadata = {
  title: { absolute: 'Contact ACI Infotech | Talk to a Senior Architect' },
  description:
    "Talk to a senior architect about your data, AI, or cloud project. No sales pitch, just an engineering conversation about what's actually possible.",
  alternates: { canonical: 'https://aciinfotech.com/contact' },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

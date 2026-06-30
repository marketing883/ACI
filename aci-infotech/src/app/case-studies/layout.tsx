import type { Metadata } from 'next';

// /case-studies is a Client Component (industry/service filters live in
// React state and in ?service= query params), so it cannot export
// metadata itself. This pass-through layout carries it. The canonical
// strips the query string so the ?service= filter variants consolidate
// onto the clean /case-studies instead of indexing as separate pages.
//
// Note: this canonical would otherwise cascade onto /case-studies/[slug]
// detail pages; those set their own self-referencing canonical in
// generateMetadata, which overrides this one.
export const metadata: Metadata = {
  title: {
    absolute: 'Case Studies | Enterprise Data & AI Projects | ACI Infotech',
  },
  description:
    "How we've helped Fortune 500 companies and industry leaders solve complex data, AI, and cloud challenges. 280+ projects delivered.",
  alternates: { canonical: 'https://aciinfotech.com/case-studies' },
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

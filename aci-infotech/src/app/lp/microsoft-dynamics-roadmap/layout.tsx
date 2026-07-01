import type { Metadata } from 'next';

// This landing page is a Client Component and cannot export metadata. The
// pass-through layout supplies a self-referencing canonical (and folds any
// ?source=/?utm= variants onto the clean URL). It is a leaf route, so no
// child overrides are needed. Composes under the metadata-free src/app/lp
// structural layout.
export const metadata: Metadata = {
  alternates: { canonical: 'https://aciinfotech.com/lp/microsoft-dynamics-roadmap' },
};

export default function LpRoadmapLayout({ children }: { children: React.ReactNode }) {
  return children;
}

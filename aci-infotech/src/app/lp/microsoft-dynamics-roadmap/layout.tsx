import type { Metadata } from 'next';

// This landing page is a Client Component and cannot export metadata, so
// this pass-through layout carries it. The page is a paid/campaign
// conversion asset: /lp/dynamics-365-implementation owns the organic
// "Dynamics 365 implementation" intent and /platforms/microsoft-dynamics
// owns the consulting intent, so this page is noindexed (and out of the
// sitemap) to avoid a three-way Dynamics overlap. It previously shipped
// with the site-default homepage title; the metadata below keeps paid
// shares and browser tabs honest without competing in organic.
export const metadata: Metadata = {
  title: { absolute: 'Dynamics 365 Roadmap Session | ACI Infotech' },
  description:
    'Book a free 30-minute session with a senior architect and leave with a 90-day implementation plan for Microsoft Dynamics 365 and Power Platform.',
  alternates: { canonical: 'https://aciinfotech.com/lp/microsoft-dynamics-roadmap' },
  robots: { index: false, follow: true },
};

export default function LpRoadmapLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';

// /platforms/microsoft-dynamics is a Client Component, so this
// pass-through layout carries its metadata and canonical (the others in
// this folder set theirs inline in the page).
//
// Keyword split for the Dynamics cluster: this page owns the
// informational "Microsoft Dynamics 365 consulting" intent;
// /lp/dynamics-365-implementation owns the transactional
// "Dynamics 365 implementation services" intent; the roadmap LP is
// noindexed paid-campaign inventory.
const TITLE = 'Microsoft Dynamics 365 Consulting | ACI Infotech';
const DESCRIPTION =
  'Microsoft Dynamics 365 consulting for enterprise teams: Copilot, Power Platform, and Fabric implementation, integration, migration, and managed support.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: 'https://aciinfotech.com/platforms/microsoft-dynamics' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://aciinfotech.com/platforms/microsoft-dynamics',
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: DEFAULT_TWITTER_IMAGES,
  },
};

export default function MicrosoftDynamicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

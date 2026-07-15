import type { Metadata } from 'next';

// /platforms/microsoft-dynamics is a Client Component, so this
// pass-through layout carries its metadata and canonical (the others in
// this folder set theirs inline in the page).
export const metadata: Metadata = {
  title: { absolute: 'Microsoft Dynamics, Copilot & Power Platform | ACI Infotech' },
  description:
    'Dynamics 365, Power Platform, and Copilot implementation, integration, and optimization for enterprise teams. Migration, governance, and managed support.',
  alternates: { canonical: 'https://aciinfotech.com/platforms/microsoft-dynamics' },
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'Microsoft Dynamics, Copilot & Power Platform | ACI Infotech',
    description: 'Dynamics 365, Power Platform, and Copilot implementation, integration, and optimization for enterprise teams. Migration, governance, and managed support.',
    url: 'https://aciinfotech.com/platforms/microsoft-dynamics',
    siteName: 'ACI Infotech',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Microsoft Dynamics, Copilot & Power Platform | ACI Infotech',
    description: 'Dynamics 365, Power Platform, and Copilot implementation, integration, and optimization for enterprise teams. Migration, governance, and managed support.',
  },
};

export default function MicrosoftDynamicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

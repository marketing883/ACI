import type { Metadata } from 'next';

// Event campaign page for the National Digital Trust Summit (AION 2026),
// Bengaluru, 31 July 2026. The page is a Client Component, so this
// pass-through layout carries the metadata. It is a paid/QR/email
// conversion asset with a hard expiry date, so it stays out of the
// organic index and the sitemap.
export const metadata: Metadata = {
  title: { absolute: 'ACI Infotech at AION 2026 | National Digital Trust Summit' },
  description:
    'Meet ACI Infotech at the National Digital Trust Summit, AION 2026 in Bengaluru on 31 July. Register now, tell us your AI challenge, and enter the lucky draw for Ray-Ban Meta smart glasses.',
  alternates: { canonical: 'https://aciinfotech.com/lp/digital-trust-summit-2026' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'ACI Infotech at AION 2026 | National Digital Trust Summit',
    description:
      'Register for AION 2026 in Bengaluru, 31 July. Meet our experts, see ArqAI Labs in action, and enter the lucky draw for Ray-Ban Meta smart glasses.',
    url: 'https://aciinfotech.com/lp/digital-trust-summit-2026',
    type: 'website',
  },
};

export default function DigitalTrustSummitLayout({ children }: { children: React.ReactNode }) {
  return children;
}

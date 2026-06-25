import type { Metadata } from 'next';
import V3Next from '@/components/v3/next/V3Next';

const TITLE = 'ACI Infotech | From data foundation to AI outcomes';
const DESCRIPTION =
  'ACI Infotech engineers the data foundation, builds the AI on top, and runs it in production for Fortune 500 companies across financial services, retail, manufacturing, and healthcare.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'enterprise data engineering',
    'lakehouse migration',
    'applied AI',
    'generative AI',
    'data governance',
    'cloud modernization',
    'managed data services',
    'Fortune 500 data and AI',
  ],
  // Preview route is kept out of the index. The production homepage would drop
  // this `robots` block; everything else here is the real, shippable metadata.
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://aciinfotech.com/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    siteName: 'ACI Infotech',
    url: 'https://aciinfotech.com/',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

// Structured data for search, answer engines (AEO) and generative engines (GEO).
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://aciinfotech.com/#organization',
      name: 'ACI Infotech',
      url: 'https://aciinfotech.com',
      slogan: 'From data foundation to AI outcomes.',
      description: DESCRIPTION,
      knowsAbout: [
        'Data engineering',
        'Lakehouse architecture',
        'Applied AI',
        'Generative AI',
        'Data governance',
        'Cloud modernization',
        'Managed services',
      ],
      areaServed: 'Worldwide',
    },
    {
      '@type': 'ProfessionalService',
      name: 'ACI Infotech data and AI engineering',
      description: DESCRIPTION,
      provider: { '@id': 'https://aciinfotech.com/#organization' },
      serviceType: [
        'Data Engineering & Lakehouse',
        'Applied AI & GenAI',
        'Integration & Governance',
        'Managed Run & SRE',
      ],
    },
    {
      '@type': 'WebPage',
      name: TITLE,
      description: DESCRIPTION,
      about: { '@type': 'Thing', name: 'Enterprise data and AI engineering' },
      isPartOf: { '@id': 'https://aciinfotech.com/#organization' },
    },
  ],
};

export default function V3NextPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <V3Next />
    </>
  );
}

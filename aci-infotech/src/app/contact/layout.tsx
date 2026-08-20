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

// ContactPage + ContactPoint JSON-LD. The page itself is a Client
// Component, so the schema lives here where it server-renders. The
// address matches the Organization schema in
// src/components/seo/StructuredData.tsx; if one changes, change both.
// Contact is email-only by design: no phone number anywhere.
const contactSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://aciinfotech.com/contact#contactpage',
  url: 'https://aciinfotech.com/contact',
  name: 'Contact ACI Infotech',
  about: { '@id': 'https://aciinfotech.com/#organization' },
  mainEntity: {
    '@type': 'Organization',
    '@id': 'https://aciinfotech.com/#organization',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'insights@aciinfotech.com',
        areaServed: 'Worldwide',
        availableLanguage: 'English',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '220 Davidson Ave, 2nd Floor, Suite 129',
      addressLocality: 'Somerset',
      addressRegion: 'NJ',
      postalCode: '08873',
      addressCountry: 'US',
    },
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}

'use client';

/**
 * Structured Data Components for SEO/AEO/GEO Optimization
 * Implements Schema.org JSON-LD for enhanced search visibility
 */

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  sameAs?: string[];
  foundingDate?: string;
  numberOfEmployees?: string;
}

interface WebSiteSchemaProps {
  name?: string;
  url?: string;
  description?: string;
  searchUrl?: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  provider?: string;
  serviceType?: string;
  areaServed?: string[];
}

interface LocalBusinessSchemaProps {
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  image?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
  sameAs?: string[];
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aciinfotech.com';

// Organization Schema - Core company information
export function OrganizationSchema({
  name = 'ACI Infotech',
  url = siteUrl,
  // Real, existing asset — /images/logo.png was a dead path.
  logo = `${siteUrl}/aci-infotech-logo.png`,
  description = 'ACI Infotech is an enterprise engineering firm. We build the data foundation, put AI on top of it, and run both in production: data engineering, applied AI and GenAI, cloud modernization, MarTech, and managed operations.',
  email = 'hello@aciinfotech.com',
  phone = '+1-888-225-4638',
  address = {
    streetAddress: '1100 Cornwall Road, Suite 215',
    addressLocality: 'Monmouth Junction',
    addressRegion: 'NJ',
    postalCode: '08852',
    addressCountry: 'US',
  },
  // Keep in sync with the social links in the site footers.
  sameAs = [
    'https://www.linkedin.com/company/aciinfotech',
    'https://x.com/ACIInfotech',
    'https://www.youtube.com/@aciinfotech',
  ],
  foundingDate = '2006',
  numberOfEmployees = '1200',
}: OrganizationSchemaProps = {}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name,
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
      width: '200',
      height: '64',
    },
    description,
    email,
    telephone: phone,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    sameAs,
    foundingDate,
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: numberOfEmployees,
    },
    areaServed: {
      '@type': 'GeoShape',
      name: 'Global',
    },
    knowsAbout: [
      'Data Engineering',
      'Lakehouse Architecture',
      'Cloud Modernization',
      'Artificial Intelligence',
      'Generative AI',
      'Machine Learning',
      'Enterprise Integration',
      'MarTech & CDP',
      'Cybersecurity',
      'Managed Operations',
      'Databricks',
      'Snowflake',
      'Microsoft Azure',
      'Amazon Web Services',
      'Salesforce',
    ],
    slogan: 'Build the AI foundation. Run it in production.',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebSite Schema - Site-level information. No SearchAction: the site
// has no /search results page, and advertising one that 404s is worse
// than omitting it.
export function WebSiteSchema({
  name = 'ACI Infotech',
  url = siteUrl,
  description = 'ACI Infotech builds the enterprise data foundation, puts AI on top, and runs both in production. Data engineering, applied AI, cloud, MarTech, and managed operations.',
}: WebSiteSchemaProps = {}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name,
    url,
    description,
    publisher: {
      '@id': `${url}/#organization`,
    },
    inLanguage: 'en-US',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// BreadcrumbList Schema - Navigation path for pages
export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema - Question and answer pairs for AEO
export function FAQSchema({ faqs }: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Service Schema - For service pages
export function ServiceSchema({
  name,
  description,
  url,
  provider = 'ACI Infotech',
  serviceType = 'Technology Consulting',
  areaServed = ['United States', 'Canada', 'Europe', 'Asia Pacific'],
}: ServiceSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name,
    description,
    url: url.startsWith('http') ? url : `${siteUrl}${url}`,
    provider: {
      '@id': `${siteUrl}/#organization`,
    },
    serviceType,
    areaServed: areaServed.map((area) => ({
      '@type': 'Country',
      name: area,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${name} Services`,
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name,
            description,
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Local Business Schema - For location-specific pages
export function LocalBusinessSchema({
  name = 'ACI Infotech',
  description = 'Enterprise Technology Consulting',
  url = siteUrl,
  logo = `${siteUrl}/images/logo.png`,
  image = `${siteUrl}/images/office.jpg`,
  telephone = '+1-888-225-4638',
  email = 'hello@aciinfotech.com',
  address = {
    streetAddress: '1100 Cornwall Road, Suite 215',
    addressLocality: 'Monmouth Junction',
    addressRegion: 'NJ',
    postalCode: '08852',
    addressCountry: 'US',
  },
  geo = {
    latitude: 40.3897,
    longitude: -74.5477,
  },
  openingHours = ['Mo-Fr 09:00-18:00'],
  priceRange = '$$$',
  sameAs = [
    'https://www.linkedin.com/company/aci-infotech',
    'https://x.com/ACIInfotech',
  ],
}: LocalBusinessSchemaProps = {}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${url}/#localbusiness`,
    name,
    description,
    url,
    logo,
    image,
    telephone,
    email,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    openingHoursSpecification: openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    })),
    priceRange,
    sameAs,
    hasMap: `https://maps.google.com/?q=${address.streetAddress},${address.addressLocality},${address.addressRegion}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Combined Global Schema - For root layout
export function GlobalStructuredData() {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
    </>
  );
}

export default GlobalStructuredData;

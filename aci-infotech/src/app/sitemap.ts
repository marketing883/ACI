import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://aciinfotech.com';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/case-studies',
    '/blog',
  ];

  // Service pages
  const servicePages = [
    '/services/data-engineering',
    '/services/applied-ai-ml',
    '/services/cloud-modernization',
    '/services/martech-cdp',
    '/services/digital-transformation',
    '/services/cyber-security',
  ];

  // Case study slugs - in production, fetch from database
  const caseStudySlugs = [
    'msci-data-automation',
    'racetrac-martech',
    'sodexo-unified-data',
    'fortune-100-retailer-ai',
    'healthcare-cloud-migration',
    'finserv-fraud-detection',
    'manufacturing-iot',
    'insurance-digital-platform',
    'energy-security-overhaul',
    'pharma-data-lake',
    'retail-personalization',
    'logistics-optimization',
  ];

  // Blog post slugs - in production, fetch from database
  const blogSlugs = [
    'building-enterprise-data-mesh-architecture',
    'ai-governance-enterprise-guide',
    'databricks-vs-snowflake-2025',
    'zero-trust-security-implementation',
    'mlops-best-practices-production',
    'customer-data-platform-selection',
    'cloud-cost-optimization-strategies',
    'real-time-analytics-architecture',
    'llm-enterprise-integration',
    'data-quality-automation',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));

  const serviceEntries: MetadataRoute.Sitemap = servicePages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudySlugs.map((slug) => ({
    url: `${baseUrl}/case-studies/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticEntries, ...serviceEntries, ...caseStudyEntries, ...blogEntries];
}

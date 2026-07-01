import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const baseUrl = 'https://aciinfotech.com';

// Create Supabase client for fetching dynamic content
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getSupabase();

  // =====================
  // STATIC PAGES
  // =====================

  const staticPages: MetadataRoute.Sitemap = [
    // Main pages
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/careers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },

    // Resource listings
    { url: `${baseUrl}/case-studies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blogs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/whitepapers`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/playbooks`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },

    // Section landing pages
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/platforms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/industries`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/partners`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },

    // Legal pages
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms-of-service`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // =====================
  // SERVICE PAGES
  // =====================

  const servicePages: MetadataRoute.Sitemap = [
    '/services/data-engineering',
    '/services/applied-ai-ml',
    '/services/cloud-modernization',
    '/services/martech-cdp',
    '/services/digital-transformation',
    '/services/app-development',
    '/services/quality-engineering',
    '/services/cyber-security',
    '/services/advisory-strategy',
    '/services/managed-operations',
    '/services/gcc',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // =====================
  // PLATFORM PAGES
  // =====================

  const platformPages: MetadataRoute.Sitemap = [
    '/platforms/databricks',
    '/platforms/snowflake',
    '/platforms/salesforce',
    '/platforms/aws',
    '/platforms/azure',
    '/platforms/gcp',
    '/platforms/sap',
    '/platforms/braze',
    '/platforms/servicenow',
    '/platforms/microsoft-dynamics',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // =====================
  // INDUSTRY PAGES
  // =====================

  const industryPages: MetadataRoute.Sitemap = [
    '/industries/financial-services',
    '/industries/retail',
    '/industries/healthcare',
    '/industries/manufacturing',
    '/industries/energy',
    '/industries/oil-gas',
    '/industries/hospitality',
    '/industries/transportation',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // =====================
  // LANDING PAGES
  // =====================

  const landingPages: MetadataRoute.Sitemap = [
    '/lp/microsoft-dynamics-roadmap',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // =====================
  // DYNAMIC CONTENT FROM DATABASE
  // =====================

  let blogEntries: MetadataRoute.Sitemap = [];
  let caseStudyEntries: MetadataRoute.Sitemap = [];
  let whitepaperEntries: MetadataRoute.Sitemap = [];
  const newsEntries: MetadataRoute.Sitemap = [];

  if (supabase) {
    // Fetch published blog posts (published_at not null = published)
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at')
      .not('published_at', 'is', null)
      .order('created_at', { ascending: false });

    if (blogPosts) {
      blogEntries = blogPosts.map(post => ({
        url: `${baseUrl}/blogs/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }

    // Fetch published case studies (status = 'published')
    const { data: caseStudies } = await supabase
      .from('case_studies')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (caseStudies) {
      caseStudyEntries = caseStudies.map(cs => ({
        url: `${baseUrl}/case-studies/${cs.slug}`,
        lastModified: new Date(cs.updated_at || cs.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }

    // Fetch published whitepapers (status = 'published')
    const { data: whitepapers } = await supabase
      .from('whitepapers')
      .select('slug, updated_at, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (whitepapers) {
      whitepaperEntries = whitepapers.map(wp => ({
        url: `${baseUrl}/whitepapers/${wp.slug}`,
        lastModified: new Date(wp.updated_at || wp.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }

    // Individual /careers/{slug} job pages are intentionally NOT in the
    // sitemap. Those detail pages render `robots: noindex, follow`
    // (job posts are transient and thin), so listing them here created a
    // sitemap-vs-page contradiction that Google reports as "Excluded by
    // 'noindex' tag" for every job. The indexable /careers listing page
    // is included above via staticPages and links to the open roles.

    // Note: News items link externally, so we don't add individual
    // pages to the sitemap. If you add individual news pages later,
    // fetch the published rows here and map them as below:
    // const { data: news } = await supabase
    //   .from('news')
    //   .select('id, updated_at, published_at, created_at')
    //   .eq('status', 'published')
    //   .order('published_at', { ascending: false });
    // if (news) {
    //   newsEntries = news.map(item => ({
    //     url: `${baseUrl}/news/${item.id}`,
    //     lastModified: new Date(item.updated_at || item.published_at || item.created_at),
    //     changeFrequency: 'monthly' as const,
    //     priority: 0.5,
    //   }));
    // }
  }

  // =====================
  // COMBINE ALL ENTRIES
  // =====================

  return [
    ...staticPages,
    ...servicePages,
    ...platformPages,
    ...industryPages,
    ...landingPages,
    ...blogEntries,
    ...caseStudyEntries,
    ...whitepaperEntries,
    ...newsEntries,
  ];
}

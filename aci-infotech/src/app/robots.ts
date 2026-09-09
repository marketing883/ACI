import { MetadataRoute } from 'next';
import { PRODUCTION_URL, isProductionDeployment } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  // Off-production (staging, previews): block everything. Before this
  // gate, staging.aciinfotech.com served the same "allow all" robots
  // as production and was fully crawlable as a duplicate site.
  if (!isProductionDeployment()) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /preview/ and /v1 are internal design-comparison routes that
        // near-duplicate the homepage; keep crawlers out entirely.
        // /dl/ serves campaign ebooks behind signed links; nothing there
        // should ever be indexed.
        disallow: ['/api/', '/admin/', '/preview/', '/v1', '/dl/'],
      },
    ],
    sitemap: `${PRODUCTION_URL}/sitemap.xml`,
  };
}

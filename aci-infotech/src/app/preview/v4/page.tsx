import type { Metadata } from 'next';
import V4Home from '@/components/v4/V4Home';
import { getPublishedCaseStudies } from '@/lib/content/case-study';
import { getPublishedBlogPosts } from '@/lib/content/blog';

export const revalidate = 60;

const TITLE = 'ACI Infotech | AI that ships. Systems that stay up.';
const DESCRIPTION =
  'ACI Infotech engineers data platforms and AI for Fortune 500 operations, then runs them in production with SLAs. Founded 2006. 500+ large enterprise projects.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  // Preview route stays out of the index. When v4 is promoted to `/`,
  // drop this robots block; the rest is the shippable metadata.
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

export default async function V4PreviewPage() {
  const [caseStudies, posts] = await Promise.all([
    getPublishedCaseStudies(),
    getPublishedBlogPosts(1, 4).then((r) => r.posts),
  ]);
  return <V4Home caseStudies={caseStudies} posts={posts} />;
}

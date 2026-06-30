import type { Metadata } from 'next';
import { getBlogPostMeta } from '@/lib/seo/post-meta';

// /blogs/[slug] is a Client Component (it fetches the post client-side),
// so its metadata is resolved here. Each post gets its own title and
// description from the CMS, plus a self-referencing canonical so these
// detail pages do not inherit the /blogs listing canonical one segment
// up. Falls back to a bare self-canonical when the post or the CMS creds
// are unavailable.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const selfCanonical = `https://aciinfotech.com/blogs/${slug}`;

  const meta = await getBlogPostMeta(slug);
  if (!meta) {
    return { alternates: { canonical: selfCanonical } };
  }

  const canonical = meta.canonical ?? selfCanonical;
  return {
    title: { absolute: meta.title },
    description: meta.description ?? undefined,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: meta.title,
      description: meta.description ?? undefined,
      url: canonical,
      images: meta.ogImage ? [{ url: meta.ogImage }] : undefined,
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

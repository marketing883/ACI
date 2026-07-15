import type { Metadata } from 'next';
import { getWhitepaperMeta } from '@/lib/seo/post-meta';
import { fallbackWhitepapers } from './whitepaper-detail';

// /whitepapers/[slug] is a Client Component, so its metadata is resolved
// here. Each whitepaper gets its own title and description from the CMS,
// plus a self-referencing canonical so these detail pages do not inherit
// the /whitepapers listing canonical one segment up. Falls back to a bare
// self-canonical when the whitepaper or the CMS creds are unavailable.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const selfCanonical = `https://aciinfotech.com/whitepapers/${slug}`;

  const meta = await getWhitepaperMeta(slug);
  if (!meta) {
    // CMS unavailable or slug not in the CMS: fall back to the
    // editorial data so the page still gets its own title/description
    // instead of inheriting the listing layout's.
    const fallback = fallbackWhitepapers[slug];
    if (fallback) {
      return {
        title: { absolute: `${fallback.title} | ACI Infotech` },
        description: fallback.description,
        alternates: { canonical: selfCanonical },
      };
    }
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

export default function WhitepaperDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

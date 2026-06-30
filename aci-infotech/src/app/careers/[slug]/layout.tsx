import type { Metadata } from 'next';

// Job detail pages are thin and client-rendered, and recruiting is not
// the acquisition channel for an enterprise services firm. Keep them out
// of the index to stop duplicate-title noise and index bloat, but follow
// links so the apply CTA and internal links are still crawled. The jobs
// index at /careers stays indexable.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    robots: { index: false, follow: true },
    alternates: { canonical: `https://aciinfotech.com/careers/${slug}` },
  };
}

export default function CareerDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

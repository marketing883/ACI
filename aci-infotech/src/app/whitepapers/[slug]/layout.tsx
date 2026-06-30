import type { Metadata } from 'next';

// /whitepapers/[slug] is a Client Component, so its metadata lives here.
// The self-referencing canonical stops these detail pages from inheriting
// the /whitepapers listing canonical set one segment up.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    alternates: { canonical: `https://aciinfotech.com/whitepapers/${slug}` },
  };
}

export default function WhitepaperDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

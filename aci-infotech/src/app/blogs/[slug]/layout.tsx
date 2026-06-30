import type { Metadata } from 'next';

// /blogs/[slug] is a Client Component (it fetches the post client-side),
// so its metadata lives here. The self-referencing canonical is the
// point: without it these detail pages would inherit the /blogs listing
// canonical set one segment up and de-index themselves.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    alternates: { canonical: `https://aciinfotech.com/blogs/${slug}` },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

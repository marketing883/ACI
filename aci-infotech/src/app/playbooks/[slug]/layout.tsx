import type { Metadata } from 'next';

// Playbook detail pages are Client Components, so this layout supplies a
// per-slug self-referencing canonical, overriding the /playbooks listing
// canonical from the parent layout so each playbook is its own canonical.
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  return { alternates: { canonical: `https://aciinfotech.com/playbooks/${slug}` } };
}

export default function PlaybookDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}

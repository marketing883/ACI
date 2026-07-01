import type { Metadata } from 'next';

// /playbooks is a Client Component (interactive), so it cannot export
// metadata itself. This pass-through layout carries a self-referencing
// canonical for the listing. The /playbooks/[slug] detail pages override
// it with their own self-canonical (see playbooks/[slug]/layout.tsx) so
// they do not inherit this one.
export const metadata: Metadata = {
  alternates: { canonical: 'https://aciinfotech.com/playbooks' },
};

export default function PlaybooksLayout({ children }: { children: React.ReactNode }) {
  return children;
}

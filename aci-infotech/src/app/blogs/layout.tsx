import type { Metadata } from 'next';

// /blogs is a Client Component (search + filters run in React state and
// the posts are fetched client-side), so it cannot export metadata
// itself. This pass-through layout carries it and sets a self-referencing
// canonical, which also folds any future ?tag=/?category= filter URLs
// back onto the clean listing. The /blogs/[slug] detail pages override
// the canonical in their own layout so they do not inherit this one.
export const metadata: Metadata = {
  title: { absolute: 'Enterprise Technology Blog | ACI Infotech' },
  description:
    'Deep dives into data engineering, AI/ML, cloud architecture, and enterprise technology trends from our team of practitioners.',
  alternates: { canonical: 'https://aciinfotech.com/blogs' },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

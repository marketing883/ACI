'use client';

import './v4.css';
import V4Nav from './V4Nav';
import V4Hero from './V4Hero';
import V4Services from './V4Services';
import V4WhyUs from './V4WhyUs';
import V4CaseStudies from './V4CaseStudies';
import V4Engagements from './V4Engagements';
import V4Journal from './V4Journal';
import V4FAQ from './V4FAQ';
import V4Footer from './V4Footer';
import type { CaseStudyListItem } from '@/lib/content/case-study';
import type { BlogListItem } from '@/lib/content/blog';

export default function V4Home({
  caseStudies,
  posts,
}: {
  caseStudies: CaseStudyListItem[];
  posts: BlogListItem[];
}) {
  return (
    <div className="v4-root">
      <V4Nav />
      <main>
        <V4Hero />
        <V4Services />
        <V4WhyUs />
        <V4CaseStudies items={caseStudies} />
        <V4Engagements />
        <V4Journal posts={posts} />
        <V4FAQ />
      </main>
      <V4Footer />
    </div>
  );
}

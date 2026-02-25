// Force dynamic rendering to always fetch fresh blog data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Button from '@/components/ui/Button';
import {
  HeroSection,
  DynamicCaseStudiesSection,
  PartnersSection,
  TestimonialsSection,
  NewsSection,
  AwardsSection,
  DynamicBlogSection,
  ArqAISection,
  WhatWeBuildSection,
} from '@/components/sections';
import PlaybookVaultSection from '@/components/sections/PlaybookVaultSection';

const partners = [
  { name: 'Databricks', logo_url: '/images/Solution-Partners/databricks.png' },
  { name: 'Dynatrace', logo_url: '/images/Solution-Partners/dynatrace.png' },
  { name: 'Salesforce', logo_url: '/images/Solution-Partners/salesforce.png' },
  { name: 'AWS', logo_url: '/images/Solution-Partners/aws.png' },
  { name: 'Microsoft Azure', logo_url: '/images/Solution-Partners/azure.png' },
  { name: 'SAP', logo_url: '/images/Solution-Partners/sap.png' },
  { name: 'ServiceNow', logo_url: '/images/Solution-Partners/servicenow.png' },
  { name: 'Braze', logo_url: '/images/Solution-Partners/braze.png' },
];

const testimonials = [
  {
    quote: "I'm thrilled with our Data Team's achievement at ACI Infotech. They've flawlessly delivered top-tier Digital Data to Altria, marking a critical milestone for RaceTrac. Their dedication and expertise have made ACI Infotech a valuable partner to RaceTrac.",
    author: 'Director of Data and MarTech',
    company: 'RaceTrac',
  },
  {
    quote: "I'm extremely satisfied with ACI Infotech, especially their work on IICS Informatica and MDM integrations. Their commitment to deliverables without compromising quality is impressive. It's a pleasure working with such a dedicated, professional team.",
    author: 'Senior Director',
    company: 'Sodexo',
  },
  {
    quote: "It was truly a pleasure working with ACI Infotech. I am really impressed by the quality of the services Arcadia University received from ACI. Jag and the team have significantly contributed to the process of identifying the best ways to add values to the institution.",
    author: 'Interim CIO',
    company: 'Arcadia University',
  },
  {
    quote: "ACI Infotech's dedicated resources consistently deliver excellent work quality, exceeding our expectations. Their dedicated onshore and onsite resources have been commendable, consistently demonstrating excellence.",
    author: 'Director',
    company: 'Gen II',
  },
];

const newsItems = [
  {
    id: 'salesforce-agentforce',
    title: 'ACI Infotech Accelerates Growth with Exclusive Salesforce-Agentforce Partnership',
    excerpt: "Partnership with Salesforce's Agentforce platform positions ACI as a trusted innovation partner for Fortune 500 companies, enabling intelligent agents that act across systems and deliver measurable business value at scale.",
    image_url: '/images/news/PR-newswire-new.jpg',
    source: 'PR Newswire',
    date: 'June 2025',
    url: 'https://www.prnewswire.com/news-releases/aci-infotech-accelerates-growth-with-exclusive-salesforceagentforce-partnership-and-bold-vision-for-the-future-302486563.html',
    cta_text: 'Read Full Story',
  },
  {
    id: 'agentforce-einpresswire',
    title: 'Bold Vision for the Future: ACI Infotech and Salesforce Agentforce',
    excerpt: 'As autonomous AI moves from concept to enterprise reality, ACI Infotech delivers Agentforce implementations that are secure, explainable, and aligned with industry-specific goals.',
    image_url: '/images/news/EIN-presswire.jpg',
    source: 'EIN Presswire',
    date: 'June 2025',
    url: 'https://www.einpresswire.com/article/823866377/aci-infotech-accelerates-growth-with-exclusive-salesforce-agentforce-partnership-and-bold-vision-for-the-future',
    cta_text: 'Read Article',
  },
  {
    id: 'jag-kanumuri-ai',
    title: 'Jag Kanumuri: Helping Enterprises Turn AI from Ambition into Advantage',
    excerpt: 'Outlook India profiles ACI Infotech CEO Jag Kanumuri on pioneering AI-native enterprises and shaping a technopreneurial era where change is built into the DNA of business.',
    image_url: '/images/news/outlook-new.jpg',
    source: 'Outlook India',
    date: 'May 2025',
    url: 'https://www.outlookindia.com/hub4business/jag-kanumuri-helping-enterprises-turn-ai-from-ambition-into-advantage',
    cta_text: 'Read Interview',
  },
  {
    id: 'arqai-egypt-summit',
    title: 'ACI Infotech Unveils ArqAI at World CIO 200 Summit Egypt',
    excerpt: 'Twenty-year enterprise transformation veteran ACI Infotech unveiled ArqAI at the World CIO 200 Summit in Egypt, positioning MENA enterprises to capitalize on the most dramatic AI investment surge in modern business history.',
    image_url: '/images/news/GEC-Newswire.jpg',
    source: 'GEC Newswire',
    date: 'May 2025',
    url: 'https://gecnewswire.com/aci-infotech-unveils-arqai-at-world-cio-200-summit-egypt/',
    cta_text: 'Read Coverage',
  },
];

const badges = [
  { name: 'Great Place to Work', description: 'Certified 2024-25', image_url: '/images/certifications-awards/best-place-to-work.webp' },
  { name: 'ISO 27001:2022', description: 'Information Security Certified', image_url: '/images/certifications-awards/iso-27001.webp' },
  { name: 'CMMi Level 3', description: 'Process Maturity Certified', image_url: '/images/certifications-awards/cmmi.webp' },
  { name: '5 Best Data Analytics Companies', description: 'To Watch in 2025', image_url: '/images/certifications-awards/best-data-analytics-company.webp' },
];


export default function HomePage() {
  return (
    <>
      {/* Hero Section with Video Background */}
      <HeroSection />

      {/* Testimonials Section - Light relief between dark sections */}
      <TestimonialsSection
        headline="What Enterprise Leaders Say"
        testimonials={testimonials}
      />

      {/* Playbook Vault Section */}
      <PlaybookVaultSection />

      {/* What We Build - System Architecture Diagram */}
      <WhatWeBuildSection />

      {/* Case Studies Section - Dynamic from CMS */}
      <DynamicCaseStudiesSection
        headline="Here's What We Built. Here's What It Delivered."
        subheadline="Real projects. Real Fortune 500 clients. Real outcomes."
      />

      {/* Partners Section */}
      <PartnersSection partners={partners} />

      {/* News Section */}
      <NewsSection
        headline="In The News"
        subheadline="Recent recognition and partnerships"
        news={newsItems}
      />

      {/* ArqAI Platform Section */}
      <ArqAISection />

      {/* Awards Section - Deactivated for now, may be used later
      <AwardsSection
        headline="Trusted & Certified"
        subheadline="Our work, culture, and capabilities have been validated by global benchmarks"
        badges={badges}
      />
      */}

      {/* Blog Preview Section - Dynamic from Database */}
      <DynamicBlogSection
        headline="Thoughts and Insights"
        subheadline="Technical depth from engineers who've been there"
        limit={4}
      />

      {/* Final CTA Section */}
      <section className="relative py-28 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="/images/aci-cta-home-bg.jpg"
          >
            <source src="/videos/cta-bg.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/70 via-[#0A1628]/80 to-[#0A1628]/70" />
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-[var(--font-title)] drop-shadow-lg">
            Talk to People Who&apos;ve Actually Deployed These Systems.
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            No sales teams. No junior consultants. Just senior practitioners who&apos;ve architected and deployed the infrastructure you&apos;re considering.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-10 mb-14">
            <div className="flex items-center gap-3 text-white">
              <span className="w-2.5 h-2.5 bg-[#C4FF61] rounded-full flex-shrink-0 shadow-lg shadow-[#C4FF61]/30" />
              <span className="text-base md:text-lg drop-shadow-md">30-minute technical conversations with architects</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <span className="w-2.5 h-2.5 bg-[#C4FF61] rounded-full flex-shrink-0 shadow-lg shadow-[#C4FF61]/30" />
              <span className="text-base md:text-lg drop-shadow-md">Architecture diagrams from live deployments</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <span className="w-2.5 h-2.5 bg-[#C4FF61] rounded-full flex-shrink-0 shadow-lg shadow-[#C4FF61]/30" />
              <span className="text-base md:text-lg drop-shadow-md">Honest answers about feasibility, timeline, and risk</span>
            </div>
          </div>

          <Button href="/contact" variant="lime" size="lg">
            Schedule a Discussion
          </Button>
        </div>
      </section>
    </>
  );
}

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
    company_logo: '/images/clients/racetrac-logo.svg',
  },
  {
    quote: "I'm extremely satisfied with ACI Infotech, especially their work on IICS Informatica and MDM integrations. Their commitment to deliverables without compromising quality is impressive. It's a pleasure working with such a dedicated, professional team.",
    author: 'Senior Director',
    company: 'Sodexo',
    company_logo: '/images/clients/sodexo-logo.svg',
  },
  {
    quote: "It was truly a pleasure working with ACI Infotech. I am really impressed by the quality of the services Arcadia University received from ACI. Jag and the team have significantly contributed to the process of identifying the best ways to add values to the institution.",
    author: 'Interim CIO',
    company: 'Arcadia University',
    company_logo: '/images/clients/arcadia-logo.svg',
  },
  {
    quote: "ACI Infotech's dedicated resources consistently deliver excellent work quality, exceeding our expectations. Their dedicated onshore and onsite resources have been commendable, consistently demonstrating excellence.",
    author: 'Director',
    company: 'Gen II',
    company_logo: '/images/clients/genii-logo.svg',
  },
];

const newsItems = [
  {
    id: 'salesforce-agentforce',
    title: 'ACI Infotech Accelerates Growth with Exclusive Salesforce-Agentforce Partnership',
    excerpt: "Partnership with Salesforce's Agentforce platform positions ACI as a trusted innovation partner for Fortune 500 companies, enabling intelligent agents that act across systems and deliver measurable business value at scale.",
    image_url: '/images/news/pr-newswire.jpg',
    source: 'PR Newswire',
    date: 'June 2025',
    url: 'https://www.prnewswire.com/news-releases/aci-infotech-accelerates-growth-with-exclusive-salesforceagentforce-partnership-and-bold-vision-for-the-future-302486563.html',
    cta_text: 'Read Full Story',
  },
  {
    id: 'agentforce-einpresswire',
    title: 'Bold Vision for the Future: ACI Infotech and Salesforce Agentforce',
    excerpt: 'As autonomous AI moves from concept to enterprise reality, ACI Infotech delivers Agentforce implementations that are secure, explainable, and aligned with industry-specific goals.',
    image_url: '/images/news/salesforce-partnership.jpg',
    source: 'EIN Presswire',
    date: 'June 2025',
    url: 'https://www.einpresswire.com/article/823866377/aci-infotech-accelerates-growth-with-exclusive-salesforce-agentforce-partnership-and-bold-vision-for-the-future',
    cta_text: 'Read Article',
  },
  {
    id: 'jag-kanumuri-ai',
    title: 'Jag Kanumuri: Helping Enterprises Turn AI from Ambition into Advantage',
    excerpt: 'Outlook India profiles ACI Infotech CEO Jag Kanumuri on pioneering AI-native enterprises and shaping a technopreneurial era where change is built into the DNA of business.',
    image_url: '/images/news/Jag-post-CIO_post.jpg',
    source: 'Outlook India',
    date: 'May 2025',
    url: 'https://www.outlookindia.com/hub4business/jag-kanumuri-helping-enterprises-turn-ai-from-ambition-into-advantage',
    cta_text: 'Read Interview',
  },
  {
    id: 'arqai-egypt-summit',
    title: 'ACI Infotech Unveils ArqAI at World CIO 200 Summit Egypt',
    excerpt: 'Twenty-year enterprise transformation veteran ACI Infotech unveiled ArqAI at the World CIO 200 Summit in Egypt, positioning MENA enterprises to capitalize on the most dramatic AI investment surge in modern business history.',
    image_url: '/images/news/CIO-SUMMIT-Egypt.jpg',
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
        headline="What Fortune 500 Leaders Say"
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
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/aci-cta-home-bg.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#0A1628]/75" />
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-[var(--font-title)]">
            Talk to Someone Who&apos;s Built This Before
          </h2>
          <p className="text-lg md:text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto">
            Tell us what you&apos;re trying to build. We&apos;ll tell you if we&apos;ve done it before and exactly how it went.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-10 mb-12 text-left sm:text-center">
            <div className="flex items-center gap-3 text-white/90">
              <span className="w-2 h-2 bg-[#C4FF61] rounded-full flex-shrink-0" />
              <span className="text-sm md:text-base">See similar builds and their outcomes</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <span className="w-2 h-2 bg-[#C4FF61] rounded-full flex-shrink-0" />
              <span className="text-sm md:text-base">Browse architectures we&apos;ve actually deployed</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <span className="w-2 h-2 bg-[#C4FF61] rounded-full flex-shrink-0" />
              <span className="text-sm md:text-base">Save months of trial and error</span>
            </div>
          </div>

          <Button href="/contact" variant="secondary-dark" size="lg">
            Book 30 Minutes
          </Button>
        </div>
      </section>
    </>
  );
}

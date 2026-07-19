import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { healthcareRelated } from '@/content/related-links';
import ClusterPosts from '@/components/seo/ClusterPosts';
import { healthcareFaqs } from '@/content/industry-faqs';
import { ServiceSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import { getSiteUrl } from '@/lib/site-url';
import { v4Sans, v4Geist } from '@/components/v4/fonts';
import FoldcraftHero from '@/components/v4/hero/FoldcraftHero';
import CtaSection from '@/components/v4/hero/CtaSection';
import {
  SectionHead,
  ServiceHero,
  OfferingList,
  ProcessStrip,
  BridgeBand,
  FactsRow,
  PageFaq,
  CheckBadge,
  cardShadow,
} from '@/components/v4/page/kit';
import CmsProofCards from '@/components/v4/page/CmsProofCards';
import FlowScene from '@/components/v4/page/FlowScene';
import { FLOWS } from '@/components/v4/page/flow-configs';

export const revalidate = 3600;

const siteUrl = getSiteUrl();

const DESCRIPTION =
  'Healthcare technology consulting for providers, payers, and life sciences: HIPAA-compliant data platforms, EHR and FHIR integration, and claims analytics.';

export const metadata: Metadata = {
  alternates: { canonical: `${siteUrl}/industries/healthcare` },
  title: 'Healthcare & Life Sciences Technology',
  description: DESCRIPTION,
  openGraph: {
    title: 'Healthcare & Life Sciences Technology | ACI Infotech',
    description: DESCRIPTION,
    url: `${siteUrl}/industries/healthcare`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthcare & Life Sciences Technology | ACI Infotech',
    description: DESCRIPTION,
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page data ------------------------------- */

const OFFERINGS = [
  {
    title: 'Clinical data integration',
    body: 'Epic, Cerner, and other EHRs integrated through FHIR APIs and HL7 feeds into one governed platform. Clinical, claims, and operational data share a single patient view instead of twelve.',
    chips: ['FHIR', 'HL7', 'AWS', 'Snowflake'],
  },
  {
    title: 'Population health analytics',
    body: 'Risk stratification, care gap identification, and outcome prediction on the unified record. The at-risk list updates from live data, not last quarter’s extract.',
    chips: ['Databricks', 'MLflow', 'Power BI'],
  },
  {
    title: 'Research and life sciences data',
    body: 'Unified research platforms with automated lineage for discovery teams. One pharmaceutical engagement cut data access time 24%, doubled researcher productivity, and held 100% lineage compliance.',
    chips: ['Databricks', 'Delta Lake', 'Airflow', 'Python'],
  },
  {
    title: 'Claims and revenue cycle analytics',
    body: 'Automated claims analysis, denial prediction, and payment optimization aimed at the numbers the revenue cycle team already argues about: denial rates and days in A/R. Document AI took one provider from 72-hour claims processing to 4.',
    chips: ['Python', 'Kafka', 'Snowflake'],
  },
  {
    title: 'HIPAA-compliant cloud',
    body: 'Healthcare workloads moved to cloud landing zones with encryption, least-privilege access, BAA coverage, and audit logging designed in. Audit ready is the default state, not a project.',
    chips: ['AWS', 'Azure', 'Audit logging'],
  },
  {
    title: 'Clinical decision support AI',
    body: 'Models that assist clinicians with diagnosis support, treatment recommendations, and alert optimization, governed with a registry and documented evaluation. Anything that touches a care decision gets human review before it ships.',
    chips: ['MLflow', 'Model registry', 'Evaluation'],
  },
];

const COMPLIANCE = [
  { name: 'HIPAA', description: 'Health data privacy' },
  { name: 'HITRUST', description: 'Security framework' },
  { name: 'SOC 2 Type II', description: 'Security controls' },
  { name: 'FDA 21 CFR Part 11', description: 'Electronic records' },
  { name: 'GDPR', description: 'EU data protection' },
  { name: 'GxP', description: 'Pharma quality standards' },
];

const PROOF_FALLBACK = [
  {
    eyebrow: 'National Healthcare Provider',
    metric: '4h',
    metricLabel: 'Claims processing, down from 72',
    summary:
      'Document AI reading claims with 88% automated accuracy, cutting manual processing 35%. Humans now handle the edge cases, not the pile.',
    href: '/case-studies/healthcare-eligibility-verification-automation-aci-yesbot',
    linkLabel: 'Read the YesBot story',
    image: '/images/v4/case-healthcare.jpg',
  },
  {
    eyebrow: 'Global Food Services Operator',
    metric: '53',
    metricLabel: 'Countries on one data platform',
    summary:
      'One platform for 400,000 employees replacing dozens of regional reporting stacks, with decisions landing 22% faster.',
    href: '/case-studies/global-food-facilities-data-intelligence',
    linkLabel: 'Read the story',
    image: '/images/v4/case-retail.jpg',
  },
  {
    eyebrow: 'Global Technology Enterprise',
    metric: '0.1%',
    metricLabel: 'Contract error rate',
    summary:
      'Contract operations automated end to end in a governed CLM environment. The same document automation discipline behind our claims work.',
    href: '/case-studies/accelerating-contract-performance-through-intelligent-automation',
    linkLabel: 'Read the automation story',
    image: '/images/v4/svc-ops.jpg',
  },
];

const PROCESS = [
  {
    title: 'Assess',
    body: 'Map the systems, the PHI flows, and the compliance obligations. Pick the first use case that moves a measure you already report.',
  },
  {
    title: 'Design',
    body: 'Platform architecture and controls mapped to HIPAA and the HITRUST CSF, with de-identification decided up front, not discovered later.',
  },
  {
    title: 'Integrate',
    body: 'EHR, claims, and operational feeds wired in through FHIR and HL7. The unified record starts building from the first sprint.',
  },
  {
    title: 'Validate',
    body: 'Reconcile against source systems and walk the controls with your compliance team. A first working use case, like denial analysis, lands inside the 10 to 14 weeks we quote.',
  },
  {
    title: 'Run',
    body: 'Around-the-clock operations under SLA, with audit evidence coming out of normal operations instead of a scramble before the assessment.',
  },
];

const FACTS = [
  {
    label: 'Compliance',
    line: 'Delivery mapped to HIPAA, the HITRUST CSF, FDA 21 CFR Part 11, and GxP. Controls are designed in from day one.',
  },
  {
    label: 'Interoperability',
    line: 'FHIR and HL7 integration across Epic, Cerner, and the systems around them. One patient view instead of twelve.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Operations',
    line: 'ISO 27001 certified and CMMI Level 3 appraised, with 24/7 managed operations under published SLAs.',
  },
];

const FAQS = healthcareFaqs.map((f) => ({ question: f.q, answer: f.a }));

/* --------------------------------- page ---------------------------------- */

export default function HealthcarePage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Healthcare & Life Sciences Technology"
        description={DESCRIPTION}
        url="/industries/healthcare"
        serviceType="Healthcare Technology Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below, one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Industries', url: '/industries' },
          { name: 'Healthcare', url: '/industries/healthcare' },
        ]}
      />

      <ServiceHero
        kicker="Healthcare & Life Sciences"
        title={
          <>
            Healthcare technology with{' '}
            <span style={{ color: '#1D4ED8' }}>compliance built&nbsp;in</span>
          </>
        }
        lede="HIPAA-compliant data platforms, EHR and FHIR integration, and claims analytics for providers, payers, and life sciences. We unify clinical and claims data under controls that satisfy HITRUST assessors, and we govern the AI that reads it."
        chips={[
          'HIPAA and HITRUST controls',
          '4h claims, down from 72',
          'FHIR and HL7 integration',
          'ISO 27001',
        ]}
        primary={{ label: 'Talk to a healthcare team', href: '/contact?industry=healthcare&source=hero' }}
        secondary={{ label: 'See the case studies', href: '/case-studies' }}
        visual={<FlowScene config={FLOWS['industry-healthcare']} />}
      />

      {/* Problem band: fragmented systems, one patient */}
      <FoldcraftHero
        geistClass={v4Geist}
        image="/images/v4/case-healthcare.jpg"
        pill="Why care data stalls"
        headline={
          <>
            Twelve systems.{' '}
            <br className="hidden sm:block" />
            <span className="text-[#60A5FA]">One patient.</span>
          </>
        }
        body="Clinical data lives in the EHR, claims in another system, labs and devices in their own silos, and every one of them holds a piece of the same patient. Coordinated care needs one governed record, under controls an assessor will actually sign off on. We build that record and keep it current."
        story={{
          metric: { value: '4h', label: 'Claims processing, down from 72' },
          title:
            'Eligibility verification automated for a national healthcare provider, with document AI reading claims at 88% automated accuracy.',
          href: '/case-studies/healthcare-eligibility-verification-automation-aci-yesbot',
          logoSrc: '/brand/aci-infotech-logo-white.png',
          logoAlt: 'ACI Infotech',
        }}
      />

      {/* Offerings */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we build for healthcare"
            title={
              <>
                From the record to <span style={{ color: '#1D4ED8' }}>the&nbsp;outcome.</span>
              </>
            }
            sub="Healthcare technology pointed at the measures you already report: HEDIS scores, readmission rates, denial rates, days in A/R."
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Compliance band: the signature regulatory content, restyled */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Compliance"
            title={<>Built for the&nbsp;assessor.</>}
            sub="The frameworks our healthcare work is delivered against. When an assessor asks who touched a record and when, the answer is a query, not a week of meetings."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPLIANCE.map((item) => (
              <div key={item.name} className={`flex items-start gap-3 rounded-2xl bg-white px-5 py-4 ${cardShadow}`}>
                <CheckBadge />
                <div>
                  <p className="text-[15px] font-semibold leading-snug text-black">{item.name}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Measured in production, <span style={{ color: '#1D4ED8' }}>not&nbsp;pilots.</span>
              </>
            }
          />
          <CmsProofCards industry="Healthcare" fallback={PROOF_FALLBACK} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No mystery." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Bridge to the applied AI practice */}
      <BridgeBand
        title={<>The record is ready. Now the&nbsp;models.</>}
        body="Once clinical and claims data share one governed platform, the AI work gets real: denial prediction, risk stratification, document automation. Our applied AI practice builds those models with the registry, evaluation, and human review that clinical data demands."
        link={{ label: 'Applied AI & ML', href: '/services/applied-ai-ml' }}
      />

      {/* Why us */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title={<>Why healthcare organizations build with&nbsp;us</>} />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <ClusterPosts keywords={['healthcare', 'hipaa', 'fhir', 'claims']} />

      <RelatedLinks items={healthcareRelated} />

      <PageFaq
        kicker="Healthcare FAQ"
        title={
          <>
            Healthcare questions,
            <br />
            answered straight.
          </>
        }
        faqs={FAQS}
      />

      <CtaSection label="Let's talk healthcare data" href="/contact?industry=healthcare&source=cta-section" />
    </div>
  );
}

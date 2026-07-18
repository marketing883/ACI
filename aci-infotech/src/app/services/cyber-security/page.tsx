import { Metadata } from 'next';
import RelatedLinks from '@/components/seo/RelatedLinks';
import { cyberSecurityRelated } from '@/content/related-links';
import { ServiceSchema, BreadcrumbSchema } from '@/components/seo/StructuredData';
import { DEFAULT_OG_IMAGES, DEFAULT_TWITTER_IMAGES } from '@/lib/seo/og';
import { getSiteUrl } from '@/lib/site-url';
import FoldcraftHero from '@/components/v4/hero/FoldcraftHero';
import CtaSection from '@/components/v4/hero/CtaSection';
import { v4Sans, v4Geist, v4Display } from '@/components/v4/fonts';
import {
  SectionHead,
  ServiceHero,
  OfferingList,
  ProofCards,
  ProcessStrip,
  BridgeBand,
  FactsRow,
  PageFaq,
} from '@/components/v4/page/kit';

export const revalidate = 3600;

// Canonical origin: always production, so staging builds can never
// self-canonicalize (see src/lib/site-url.ts).
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Cyber Security Services',
  description: 'Security built in, not bolted on. DevSecOps, observability, compliance. SOC 2, ISO 27001 compliant architectures from day one.',
  keywords: 'cyber security, DevSecOps, SOC 2, ISO 27001, security compliance, enterprise security',
  alternates: {
    canonical: `${siteUrl}/services/cyber-security`,
  },
  // Per-page social card. Without this, every share and link preview
  // inherited the homepage's OpenGraph (title, image, and og:url all
  // pointing at /), mis-attributing all 21 service/platform pages.
  openGraph: {
    title: 'Cyber Security Services | ACI Infotech',
    description: 'Security built in, not bolted on. DevSecOps, observability, compliance. SOC 2, ISO 27001 compliant architectures from day one.',
    url: `${siteUrl}/services/cyber-security`,
    siteName: 'ACI Infotech',
    type: 'website',
    images: DEFAULT_OG_IMAGES,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cyber Security Services | ACI Infotech',
    description: 'Security built in, not bolted on. DevSecOps, observability, compliance. SOC 2, ISO 27001 compliant architectures from day one.',
    images: DEFAULT_TWITTER_IMAGES,
  },
};

/* ------------------------------- page copy ------------------------------- */

const OFFERINGS = [
  {
    title: 'DevSecOps implementation',
    body: 'Security wired into the CI/CD pipeline: automated scanning, dependency checks, and secure-by-default deployments. Developers get findings in the pull request, when they cost minutes to fix instead of quarters.',
    chips: ['Snyk', 'SonarQube', 'Checkmarx', 'GitLab Security'],
  },
  {
    title: 'Security observability',
    body: 'Real-time threat detection and incident response on the SIEM stack we run every day: Splunk, Microsoft Sentinel, and CrowdStrike, tied into Dynatrace. You find out from an alert, not from a customer.',
    chips: ['Dynatrace', 'Splunk', 'CrowdStrike', 'Microsoft Sentinel'],
  },
  {
    title: 'Identity and access management',
    body: 'Zero-trust architecture with SSO, MFA, and privileged access management. Access follows identity, not network location, and leavers lose everything at once instead of account by account.',
    chips: ['Okta', 'Azure AD', 'CyberArk', 'Ping Identity'],
  },
  {
    title: 'Compliance and audit',
    body: 'SOC 2, ISO 27001, HIPAA, and PCI-DSS controls implemented as running systems, with evidence collected continuously. When the auditor arrives, the answer is an export, not a scramble.',
    chips: ['SOC 2', 'ISO 27001', 'HIPAA', 'PCI-DSS'],
  },
  {
    title: 'Vulnerability management',
    body: 'Continuous scanning, penetration testing, and remediation tracked to closure, prioritized by exploitability rather than raw counts. The backlog shrinks instead of scrolling.',
    chips: ['Qualys', 'Tenable', 'Burp Suite', 'OWASP Tools'],
  },
  {
    title: 'Cloud security posture',
    body: 'CSPM and workload protection across AWS, Azure, and GCP. Misconfigurations get caught by policy, not by whoever finds the open bucket first.',
    chips: ['AWS Security Hub', 'Azure Security Center', 'Prisma Cloud'],
  },
];

const PROOF = [
  {
    eyebrow: 'National Healthcare Provider',
    metric: '100%',
    metricLabel: 'HIPAA compliance achieved',
    summary: 'Gaps flagged in a security audit closed on Azure Security, CyberArk, and Splunk. Vulnerabilities down 25%, and zero findings the next time the auditors came.',
    href: '/case-studies?service=cyber-security',
    linkLabel: 'Browse the security case studies',
  },
  {
    eyebrow: 'Global Financial Services Firm',
    metric: '70%',
    metricLabel: 'Faster secure releases',
    summary: 'Security moved into the CI/CD pipeline with Snyk, GitLab, and SonarQube: 65% of checks automated and zero bypasses, because the secure path became the fast path.',
    href: '/case-studies?industry=financial-services',
    linkLabel: 'See the financial services stories',
  },
  {
    eyebrow: 'National Retail Chain',
    metric: '35%',
    metricLabel: 'Reduction in attack surface',
    summary: 'Zero-trust architecture across a remote workforce and third-party access, built on Okta, CrowdStrike, and Zscaler, with MFA everywhere it belongs.',
    href: '/case-studies?industry=retail',
    linkLabel: 'See the retail stories',
  },
];

const PROCESS = [
  {
    title: 'Assess',
    timeframe: 'Weeks 1 to 3',
    body: 'Threat model, control gaps, and compliance obligations mapped against how the estate actually runs.',
  },
  {
    title: 'Design',
    timeframe: 'Weeks 2 to 5',
    body: 'Identity, network, pipeline, and detection architecture, with every control mapped to a framework requirement.',
  },
  {
    title: 'Implement',
    timeframe: 'Weeks 4 to 12',
    body: 'Controls shipped into pipelines and platforms in increments. Developers keep shipping the whole time.',
  },
  {
    title: 'Prove',
    body: 'Penetration tests, control validation, and audit evidence collected as we go. SOC 2 certification typically lands in 6 to 12 months.',
  },
  {
    title: 'Operate',
    body: '24/7 SOC coverage under SLA with our analysts, or a documented handover to your team with detection rules they can maintain.',
  },
];

const FACTS = [
  {
    label: 'Approach',
    line: 'Security is designed into the architecture from the first review, not added by a separate team at the end.',
  },
  {
    label: 'Certification',
    line: 'ISO 27001 certified ourselves, with delivery mapped to SOC 2, HIPAA, and PCI-DSS requirements.',
  },
  {
    label: 'Scale',
    line: 'Founded 2006. 1,200+ engineers across 11 global delivery hubs. 500+ enterprise projects.',
  },
  {
    label: 'Partnerships',
    line: 'Dynatrace partner, with SIEM operations on Splunk, Microsoft Sentinel, and CrowdStrike.',
  },
];

const FAQS = [
  {
    question: 'How do you balance security with development speed?',
    answer: 'By putting security in the pipeline instead of at the end of it. Automated scanning catches issues in the pull request, when they are cheap to fix, so developers get fast feedback instead of a gate they route around.',
  },
  {
    question: 'How long does SOC 2 compliance take?',
    answer: '6 to 12 months to initial certification depending on where you start. We implement the controls, document the policies, and prepare the evidence, so the audit reviews a running system instead of a binder.',
  },
  {
    question: 'Which compliance frameworks do you work with?',
    answer: 'SOC 2, ISO 27001, HIPAA, and PCI-DSS. We hold ISO 27001 certification ourselves, which means we run these controls on our own operations, not just recommend them to yours.',
  },
  {
    question: 'What about our existing security tools?',
    answer: 'We integrate with what you already run. Most enterprises own more security tools than they use, so we rationalize the stack and wire the keepers together before proposing anything new.',
  },
  {
    question: 'Do you run SOC operations, or just set them up?',
    answer: 'Both. We design, implement, and operate 24/7 SOC coverage on Splunk, Microsoft Sentinel, CrowdStrike, and PagerDuty, with the engineers who built your controls staying on the console. The broader picture, including NOC coverage and incident handoff, lives with our Managed Operations practice.',
  },
  {
    question: 'What does zero trust mean in practice?',
    answer: 'Access follows identity, not network location. Every request gets verified, MFA sits everywhere it matters, and privileged access is brokered and recorded. One retail client cut its attack surface 35% making that shift.',
  },
  {
    question: 'How fast do you respond to incidents?',
    answer: 'P1 containment targets are measured in minutes and reported monthly. Tier 1 to Tier 3 analysts are on shift around the clock, with weekly threat hunts in between the alerts.',
  },
];

/* --------------------- decision artifact (page-local) --------------------- */

// One-off variation on the kit's DecisionPanel grammar: two engagement
// models side by side instead of a two-logo table, so it lives inline
// rather than in the shared kit.
const ENGAGEMENT_MODELS = [
  {
    kicker: 'Security project',
    title: 'Build and hand over',
    body: 'For teams with their own SOC. We design and implement the controls, pipelines, and detection rules, then hand over cleanly.',
    points: [
      'Controls and detection engineering delivered as a scoped project',
      'Runbooks and documented handover to your analysts',
      'We stay on call through the transition',
    ],
  },
  {
    kicker: 'Managed SOC',
    title: 'Design, implement, operate',
    body: 'For teams that need 24/7 coverage without hiring one. The engineers who built your controls stay on the console.',
    points: [
      'Tier 1 to Tier 3 analyst coverage, 24/7, with weekly threat hunts',
      'P1 containment measured in minutes, reported monthly',
      'Audit evidence prepared for SOC 2, ISO 27001, HIPAA, and PCI-DSS reviews',
    ],
  },
];

function EngagementPanel() {
  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2
          className={`text-3xl font-bold tracking-tight text-black sm:text-4xl ${v4Display}`}
          style={{ lineHeight: 1.08 }}
        >
          Security project or managed&nbsp;SOC?
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
          Both are real engagements, and the honest answer depends on whether you want to own the console. Most clients start with the project and add the SOC after the first 2am alert.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {ENGAGEMENT_MODELS.map((m) => (
            <div key={m.title} className="rounded-2xl border border-gray-200 bg-white p-7 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ {m.kicker}</p>
              <h3 className={`mt-3 text-xl font-semibold text-black md:text-2xl ${v4Display}`}>{m.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{m.body}</p>
              <ul className="mt-5 space-y-3 border-t border-gray-200 pt-5">
                {m.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 block h-2 w-2 shrink-0 rounded-full"
                      style={{ background: '#1D4ED8' }}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- page ---------------------------------- */

export default function CyberSecurityPage() {
  return (
    <div className={`bg-white text-black ${v4Sans}`}>
      <ServiceSchema
        name="Cyber Security Services"
        description="Security built in, not bolted on. DevSecOps, observability, compliance. SOC 2, ISO 27001 compliant architectures."
        url="/services/cyber-security"
        serviceType="Cybersecurity Consulting"
      />
      {/* FAQPage JSON-LD comes from PageFaq below — one per page. */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
          { name: 'Cyber Security', url: '/services/cyber-security' },
        ]}
      />

      <ServiceHero
        kicker="Cyber Security"
        title={
          <>
            Cyber Security Built In,{' '}
            <span style={{ color: '#1D4ED8' }}>Not Bolted&nbsp;On</span>
          </>
        }
        lede="ACI Infotech builds security into the systems we deliver: DevSecOps pipelines, zero-trust identity, and controls mapped to SOC 2, ISO 27001, HIPAA, and PCI-DSS from the first commit. We hold ISO 27001 certification ourselves, and we run 24/7 SOC coverage for clients who want the builders on the console."
        chips={[
          'ISO 27001 certified',
          'SOC 2, HIPAA, PCI-DSS frameworks',
          '24/7 SOC coverage',
          'Dynatrace partner',
        ]}
        primary={{ label: 'Talk to a security architect', href: '/contact?service=cyber-security' }}
        secondary={{ label: 'See the security case studies', href: '/case-studies?service=cyber-security' }}
        logos={[
          { src: '/brand/dynatrace-color.svg', alt: 'Dynatrace' },
          { src: '/brand/microsoft-mono.svg', alt: 'Microsoft' },
        ]}
        logosCaption="ISO 27001 certified, operating SIEM stacks on Splunk, Microsoft Sentinel, and CrowdStrike."
      />

      {/* Problem band: bolted-on security */}
      <FoldcraftHero
        geistClass={v4Geist}
        pill="Why breaches still happen"
        headline={
          <>
            The audit passed.{' '}
            <br className="hidden sm:block" />
            The breach <span className="text-[#60A5FA]">did not care.</span>
          </>
        }
        body="Most enterprises treat security as a phase: build the system, then hand it to a team who bolts controls onto the outside. The paperwork passes and the gaps stay, because controls added after the fact protect the diagram, not the system. We build security into the pipeline, the identity layer, and the architecture itself, then keep watching it after go-live."
        story={{
          metric: { value: '100%', label: 'HIPAA compliance achieved' },
          title: 'Vulnerabilities down 25%, zero findings on the next audit',
          role: 'Healthcare',
          org: 'A national healthcare provider',
          href: '/case-studies?service=cyber-security',
          logoSrc: '/brand/microsoft-mono.svg',
          logoAlt: 'Microsoft',
        }}
      />

      {/* What we secure */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="What we secure"
            title={
              <>
                Six layers. <span style={{ color: '#1D4ED8' }}>One&nbsp;posture.</span>
              </>
            }
          />
          <OfferingList items={OFFERINGS} />
        </div>
      </section>

      {/* Decision artifact: project vs managed SOC */}
      <EngagementPanel />

      {/* Proof */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead
            kicker="Results"
            title={
              <>
                Controls that held. <span style={{ color: '#1D4ED8' }}>Audits that&nbsp;passed.</span>
              </>
            }
          />
          <ProofCards cards={PROOF} />
        </div>
      </section>

      {/* Process */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="How an engagement runs" title="Five phases. No mystery." />
          <ProcessStrip steps={PROCESS} />
        </div>
      </section>

      {/* Managed SOC teaser: managed-operations owns the full story */}
      <BridgeBand
        title="The SOC can be ours to run."
        body="For clients who need 24/7 detection and response without standing it up in house, we operate the SOC: Tier 1 to Tier 3 analysts around the clock, weekly threat hunts, P1 containment measured in minutes, and audit evidence prepared for SOC 2, ISO 27001, HIPAA, and PCI-DSS reviews. The engineers who built your controls stay on the console."
        link={{ label: 'Managed Operations', href: '/services/managed-operations' }}
      />

      {/* Why ACI */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <SectionHead kicker="Why ACI" title="Why enterprises pick us for security" />
          <FactsRow facts={FACTS} />
        </div>
      </section>

      <PageFaq
        kicker="Questions"
        title={
          <>
            Security questions,
            <br />
            <span style={{ color: '#1D4ED8' }}>answered straight.</span>
          </>
        }
        sub="The questions we hear most before a security engagement. Anything else belongs in a conversation."
        faqs={FAQS}
      />

      <RelatedLinks items={cyberSecurityRelated} />

      {/* Closing CTA: video stage, one button, nothing else */}
      <CtaSection label="Let's talk security" />
    </div>
  );
}

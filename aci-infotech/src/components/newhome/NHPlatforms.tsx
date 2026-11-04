'use client';

// Platforms and partners: a white constellation grid. Logos sit in glass
// tiles that lift, glow cobalt from the pointer position, and show the
// platform name on hover; each tile opens that platform's page.

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Eyebrow, Reveal, SplitHeadline } from './motion';

const PLATFORMS = [
  { name: 'Databricks', logo: '/images/new-home/partners/databricks.png', href: '/platforms/databricks' },
  { name: 'Microsoft Azure', logo: '/images/new-home/partners/azure.png', href: '/platforms/azure' },
  { name: 'Snowflake', logo: '/images/new-home/partners/snowflake.png', href: '/platforms/snowflake' },
  { name: 'AWS', logo: '/images/new-home/partners/aws.png', href: '/platforms/aws' },
  { name: 'Google Cloud', logo: '/images/new-home/partners/google-cloud.png', href: '/platforms/gcp' },
  { name: 'SAP', logo: '/images/new-home/partners/sap.png', href: '/platforms/sap' },
  { name: 'Salesforce', logo: '/images/new-home/partners/salesforce.png', href: '/platforms/salesforce' },
  { name: 'ServiceNow', logo: '/images/new-home/partners/servicenow.png', href: '/platforms/servicenow' },
  { name: 'Microsoft Dynamics 365', logo: '/brand/MS-Dynamics-365-logo.png', href: '/platforms/microsoft-dynamics' },
];

const CERTS = [
  { name: 'Great Place to Work Certified', src: '/images/certifications-awards/best-place-to-work.webp' },
  { name: 'CMMI Level 3', src: '/images/certifications-awards/cmmi.webp' },
  { name: 'ISO/IEC 27001:2022 Certified', src: '/images/certifications-awards/iso-27001.webp' },
  { name: '5 Best Data Analytics Companies to Watch', src: '/images/certifications-awards/best-data-analytics-company.webp' },
  { name: 'GSA Contract Holder', src: '/images/certifications-awards/gsa-contract-holder.png' },
];

const ALSO = ['Braze', 'Dynatrace', 'Kubernetes', 'Anthropic', 'OpenAI', 'LangGraph'];

export default function NHPlatforms({ headingClass }: { headingClass: string }) {
  return (
    <section id="platforms" className="relative overflow-hidden bg-white py-28 text-[#0a1024] md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#1d4ed8]/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow tone="light">Technology partnerships</Eyebrow>
          <SplitHeadline
            lines={['Runs on the stack', 'we know *cold.*']}
            className={`mt-6 text-[clamp(2.2rem,5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] ${headingClass}`}
            accentClassName="nh-accent-ink"
          />
          <Reveal>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#0a1024]/65">
              Databricks, Snowflake, Microsoft Azure, AWS, Google Cloud, SAP, ServiceNow, Salesforce, and
              Braze, plus frontier model providers and tooling for AI&nbsp;delivery.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PLATFORMS.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 0.06}>
              <Link
                href={p.href}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
                }}
                className="nh-btn nh-glow-card group relative flex h-36 flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#0a1024]/8 bg-[#f4f6fb] transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_30px_60px_-30px_rgba(29,78,216,0.45)] md:h-40"
              >
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={240}
                  height={80}
                  style={{ width: 'auto', height: 'auto' }}
                  className="h-auto max-h-11 w-auto max-w-[58%] object-contain opacity-90 transition-all duration-500 group-hover:-translate-y-2 group-hover:scale-105 group-hover:opacity-100 md:max-h-12"
                />
                <span className="absolute bottom-4 flex translate-y-3 items-center gap-1 text-xs font-semibold text-[#1d4ed8] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {p.name} <ArrowUpRight size={13} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0a1024]/45">Also in the stack</span>
          {ALSO.map((a) => (
            <span key={a} className="rounded-full border border-[#0a1024]/10 px-3.5 py-1.5 text-sm text-[#0a1024]/65">
              {a}
            </span>
          ))}
          <Link href="/platforms" className="nh-btn ml-2 inline-flex items-center gap-1 text-sm font-semibold text-[#1d4ed8]">
            All platforms <ArrowUpRight size={14} />
          </Link>
        </Reveal>

        {/* Certifications and recognition */}
        <div className="mt-20 rounded-[26px] border border-[#0a1024]/8 bg-[#f4f6fb] p-6 md:p-8">
          <div className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#0a1024]/45">Certifications and recognition</div>
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {CERTS.map((c, i) => (
              <Reveal as="li" key={c.name} delay={i * 0.06}>
                <Image src={c.src} alt={c.name} title={c.name} width={160} height={80} style={{ width: 'auto' }} className="h-14 w-auto object-contain transition-transform duration-500 hover:-translate-y-1 hover:scale-105 md:h-16" />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

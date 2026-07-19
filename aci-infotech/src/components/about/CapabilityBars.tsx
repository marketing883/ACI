'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { techLogo } from '@/components/v4/page/tech-logos';

const EASE = [0.22, 1, 0.36, 1] as const;

type Capability = {
  no: string;
  title: string;
  eyebrow: string;
  description: string;
  outcomes: string[];
  technologies: string[];
  bg: string;
  href: string;
};

// The four areas where the 500+ projects concentrate. Each bar links
// to the practice page that owns the work.
const CAPABILITIES: Capability[] = [
  {
    no: '/01',
    title: 'Data Resilience',
    eyebrow: 'Your data estate, unified and AI-ready.',
    description:
      'Platform-native observability, lineage, and policy controls built into the data itself.',
    outcomes: ['Executive-grade dashboards', 'Real-time decisioning', 'Compliant analytics', 'High-trust data products'],
    technologies: ['Databricks', 'Snowflake', 'AWS Glue', 'Azure Data Factory', 'dbt', 'Dynatrace'],
    bg: '/images/v4/svc-data.jpg',
    href: '/services/data-engineering',
  },
  {
    no: '/02',
    title: 'Observability & Platform Reliability',
    eyebrow: 'Instrumented end to end, from app to infra.',
    description:
      'SLOs set, latency traced across the stack, and incidents caught before the pager does.',
    outcomes: ['Fewer Sev1 incidents', 'Faster MTTR', 'Release stability', 'Performance SLOs met'],
    technologies: ['Dynatrace', 'Datadog', 'Prometheus', 'Grafana', 'PagerDuty'],
    bg: '/images/v4/svc-ops.jpg',
    href: '/services/managed-operations',
  },
  {
    no: '/03',
    title: 'MarTech & CDP',
    eyebrow: 'Growth on composable customer data.',
    description:
      'Composable CDP stacks and signal-rich journeys, engineered with the same production discipline.',
    outcomes: ['1:1 personalization', 'Loyalty intelligence', 'Media ROI measurement', 'Privacy-safe activation'],
    technologies: ['Salesforce Marketing Cloud', 'Adobe Experience Platform', 'Braze', 'Segment'],
    bg: '/images/martech-cdp.jpg',
    href: '/services/martech-cdp',
  },
  {
    no: '/04',
    title: 'Intelligent Automation',
    eyebrow: 'From scattered bots to orchestrated flow.',
    description:
      'Process automation that spans systems and teams, with a human in the loop where it counts.',
    outcomes: ['Straight-through processing', 'Faster close cycles', 'Measurable cost reduction', 'Human-in-the-loop where needed'],
    technologies: ['ServiceNow', 'UiPath', 'Automation Anywhere', 'Power Automate'],
    bg: '/images/digital-transformation.jpg',
    href: '/services/digital-transformation',
  },
];

/**
 * "What we build" on the about page, in the homepage capability-bar
 * grammar: number, outcome eyebrow, big title, hover image takeover,
 * outcome chips, and the real logos of the stack each area runs on.
 */
export default function CapabilityBars({ headingClass }: { headingClass: string }) {
  // Only fetch a bar's hover image once the visitor points at it.
  const [warm, setWarm] = useState<Set<number>>(new Set());
  const warmUp = (i: number) => setWarm((w) => (w.has(i) ? w : new Set(w).add(i)));

  return (
    <ul className="m-0 mt-12 list-none border-t border-black p-0">
      {CAPABILITIES.map((c, idx) => (
        <motion.li
          key={c.no}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: idx * 0.06, ease: EASE }}
          className="border-b border-gray-200"
        >
          <Link
            href={c.href}
            onPointerEnter={() => warmUp(idx)}
            onFocus={() => warmUp(idx)}
            className="group relative isolate grid grid-cols-[2.5rem_minmax(0,1fr)_2rem] items-center gap-x-4 gap-y-4 overflow-hidden px-2 py-6 no-underline md:grid-cols-[3.5rem_minmax(0,1.15fr)_minmax(0,1fr)_2rem] md:gap-6 md:px-3 md:py-7"
          >
            {/* Hover takeover: full-color image under a stylized dark overlay */}
            <span aria-hidden="true" className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
              <span
                className="absolute inset-0 scale-[1.04] bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-100"
                style={{ backgroundImage: warm.has(idx) ? `url(${c.bg})` : undefined }}
              />
              <span
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(100deg, rgba(4,7,15,0.93) 0%, rgba(4,7,15,0.78) 42%, rgba(11,23,58,0.55) 74%, rgba(29,78,216,0.35) 100%)',
                }}
              />
            </span>

            {/* Number */}
            <span className="relative z-10 self-start pt-1 text-xs font-semibold tracking-[0.08em] text-gray-400 transition-colors duration-300 group-hover:text-white/60">
              {c.no}
            </span>

            {/* Message block */}
            <span className="relative z-10 flex flex-col gap-2">
              <span className="text-[13px] font-semibold tracking-wide text-blue-700 transition-colors duration-300 group-hover:text-[#A3E635]">
                {c.eyebrow}
              </span>
              <span
                className={`font-semibold text-black transition-colors duration-300 group-hover:text-white ${headingClass}`}
                style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.15rem)', lineHeight: 1.06, letterSpacing: '-0.02em' }}
              >
                {c.title}
              </span>
              <span className="mt-0.5 max-w-md border-l-2 border-blue-700 pl-3 text-[13px] leading-relaxed text-gray-600 transition-colors duration-300 group-hover:border-[#A3E635] group-hover:text-white/85">
                {c.description}
              </span>
            </span>

            {/* Outcomes + stack */}
            <span className="relative z-10 col-start-2 flex flex-col gap-4 md:col-start-auto">
              <span className="flex flex-wrap gap-2">
                {c.outcomes.map((outcome) => (
                  <span
                    key={outcome}
                    className="whitespace-nowrap rounded-full border border-gray-300 px-3 py-1 text-[12px] font-medium text-gray-700 transition-colors duration-300 group-hover:border-white/40 group-hover:text-white lg:px-3.5 lg:py-1.5 lg:text-[13px]"
                  >
                    {outcome}
                  </span>
                ))}
              </span>
              <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {c.technologies.map((tech) => {
                  const logo = techLogo(tech);
                  return (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium uppercase tracking-wide text-gray-500 transition-colors duration-300 group-hover:text-white/80"
                    >
                      {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={logo}
                          alt=""
                          aria-hidden="true"
                          className="h-4 w-auto max-w-12 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                        />
                      ) : null}
                      {tech}
                    </span>
                  );
                })}
              </span>
            </span>

            {/* Arrow */}
            <span
              aria-hidden="true"
              className="relative z-10 justify-self-end text-black transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
            >
              <ArrowUpRight size={22} />
            </span>
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}

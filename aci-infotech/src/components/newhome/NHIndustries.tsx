'use client';

// Industries: a bento mosaic on porcelain. Each tile is a Magnific photo
// in the shared cobalt grade; on hover the photo pushes in, the tile tilts
// toward the pointer, and the industry's focus areas rise into view. On
// touch screens the focus line is always visible.

import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Eyebrow, Reveal, SplitHeadline } from './motion';
import { MORE_VERTICALS } from './deck-data';

// Focus lines are taken from each industry page's own description
// (src/data/industries.ts).
const INDUSTRIES = [
  { name: 'Financial Services', href: '/industries/financial-services', image: '/images/new-home/industry-financial-services.jpg', focus: 'Regulatory compliance, fraud detection, and digital transformation for banks, insurers, and asset managers.', span: 'sm:col-span-2 lg:row-span-2' },
  { name: 'Healthcare', href: '/industries/healthcare', image: '/images/new-home/industry-healthcare.jpg', focus: 'HIPAA-compliant data platforms, EHR and FHIR integration, and claims analytics.', span: '' },
  { name: 'Manufacturing', href: '/industries/manufacturing', image: '/images/new-home/industry-manufacturing.jpg', focus: 'IoT analytics, predictive maintenance, quality analytics, and smart factory implementations.', span: 'lg:row-span-2' },
  { name: 'Retail & Consumer', href: '/industries/retail', image: '/images/new-home/industry-retail.jpg', focus: 'Customer data platforms, demand forecasting, personalization, and supply chain optimization.', span: '' },
  { name: 'Energy & Utilities', href: '/industries/energy', image: '/images/new-home/industry-energy.jpg', focus: 'NERC CIP and FERC compliance, OT/IT convergence, grid analytics, and renewable integration.', span: 'lg:col-span-2' },
  { name: 'Hospitality', href: '/industries/hospitality', image: '/images/new-home/industry-hospitality.jpg', focus: 'Guest data unification, POS and PMS integration, and loyalty personalization.', span: 'lg:col-span-2' },
  { name: 'Oil & Gas', href: '/industries/oil-gas', image: '/images/new-home/industry-oil-gas.jpg', focus: 'Production and drilling analytics, predictive maintenance, HSE and emissions reporting.', span: 'lg:col-span-2' },
  { name: 'Transportation', href: '/industries/transportation', image: '/images/new-home/industry-transportation.jpg', focus: 'TMS, telematics, and EDI integration, route optimization, and OTIF improvement.', span: 'sm:col-span-2' },
];

function Tile({ ind, headingClass, index }: { ind: (typeof INDUSTRIES)[number]; headingClass: string; index: number }) {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18 });
  const glare = useTransform([srx, sry] as never, ([x, y]: number[]) => `radial-gradient(400px circle at ${50 - y * 6}% ${50 + x * 6}%, rgba(255,255,255,0.18), transparent 60%)`);

  return (
    <Reveal delay={(index % 4) * 0.07} className={`${ind.span} min-h-[260px]`}>
      <motion.div style={{ rotateX: srx, rotateY: sry, transformPerspective: 1000 }} className="h-full">
        <Link
          href={ind.href}
          onMouseMove={(e) => {
            if (reduce) return;
            const r = e.currentTarget.getBoundingClientRect();
            ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
            rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
          }}
          onMouseLeave={() => {
            rx.set(0);
            ry.set(0);
          }}
          className="nh-btn group relative flex h-full min-h-[260px] flex-col justify-end overflow-hidden rounded-[22px] bg-[#05070d] p-6 text-white shadow-[0_24px_60px_-30px_rgba(10,16,36,0.6)]"
        >
          <Image src={ind.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/45 to-[#05070d]/5 transition-opacity duration-500 group-hover:opacity-90" />
          <motion.div aria-hidden="true" style={{ background: glare }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative">
            <div className="flex items-end justify-between gap-4">
              <h3 className={`[color:inherit] text-2xl font-semibold tracking-tight ${headingClass}`}>{ind.name}</h3>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-white group-hover:text-[#05070d]">
                <ArrowUpRight size={16} />
              </span>
            </div>
            <p className="mt-2 max-w-sm text-sm leading-snug text-white/75 transition-all duration-500 lg:max-h-0 lg:translate-y-3 lg:opacity-0 lg:group-hover:max-h-24 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
              {ind.focus}
            </p>
          </div>
        </Link>
      </motion.div>
    </Reveal>
  );
}

export default function NHIndustries({ headingClass }: { headingClass: string }) {
  return (
    <section id="industries" className="relative bg-[#f4f6fb] py-28 text-[#0a1024] md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow tone="light">Industry expertise</Eyebrow>
            <SplitHeadline
              lines={['Regulated, production-grade,', '*industry by industry.*']}
              className={`mt-6 text-[clamp(2.2rem,5vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] ${headingClass}`}
              accentClassName="nh-accent-ink"
            />
          </div>
          <Reveal className="max-w-sm">
            <p className="text-base leading-relaxed text-[#0a1024]/65">
              Most engagements are with large enterprises that need regulated, production-grade&nbsp;systems.
            </p>
            <Link href="/industries" className="nh-btn mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1d4ed8]">
              All industries <ArrowUpRight size={15} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-flow-dense auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((ind, i) => (
            <Tile key={ind.name} ind={ind} headingClass={headingClass} index={i} />
          ))}
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0a1024]/45">We also serve</span>
          {MORE_VERTICALS.map((v) => (
            <span key={v} className="rounded-full border border-[#0a1024]/10 bg-white px-4 py-2 text-sm text-[#0a1024]/70">
              {v}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

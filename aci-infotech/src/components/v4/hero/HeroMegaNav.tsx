'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import {
  SERVICES,
  PLATFORM_CATEGORIES,
  INDUSTRIES,
  INDUSTRY_FEATURES,
  RESOURCES,
  COMPANY,
} from '@/components/v2/nav/menu-data';

const ACCENT = '#1D4ED8';
const EASE = [0.16, 1, 0.3, 1] as const;

type MenuId = 'services' | 'platforms' | 'industries' | 'resources' | 'company';
const TRIGGERS: { id: MenuId; label: string }[] = [
  { id: 'services', label: 'Services' },
  { id: 'platforms', label: 'Platforms' },
  { id: 'industries', label: 'Industries' },
  { id: 'resources', label: 'Resources' },
  { id: 'company', label: 'Company' },
];

const PLATFORM_LOGOS: Record<string, string> = {
  Databricks: '/images/Solution-Partners/databricks.png',
  Snowflake: '/images/Solution-Partners/snowflake.svg',
  AWS: '/images/Solution-Partners/aws.png',
  Azure: '/images/Solution-Partners/azure.png',
  'Google Cloud': '/images/Solution-Partners/googlecloud.svg',
  SAP: '/images/Solution-Partners/sap.png',
  ServiceNow: '/images/Solution-Partners/servicenow.png',
  Salesforce: '/images/Solution-Partners/salesforce.png',
  Braze: '/images/Solution-Partners/braze.png',
};

const INDUSTRY_IMAGES: Record<string, string> = {
  'financial-services': '/images/v4/case-finance.jpg',
  healthcare: '/images/v4/case-healthcare.jpg',
  retail: '/images/v4/case-retail.jpg',
  hospitality: '/images/v4/hero-atmosphere.jpg',
  manufacturing: '/images/v4/case-manufacturing.jpg',
  energy: '/images/v4/case-energy.jpg',
  transportation: '/images/v4/case-transport.jpg',
};

function Underline() {
  return (
    <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
  );
}

/* ------------------------------- panels ------------------------------- */

function ServicesPanel({ headingClass, onNavigate }: { headingClass: string; onNavigate: () => void }) {
  return (
    <div className="flex gap-8">
      <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-1">
        {SERVICES.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            onClick={onNavigate}
            className="group/item flex flex-col rounded-xl px-4 py-3 transition-colors hover:bg-black/[0.04]"
          >
            <span className="flex items-center gap-1.5 text-[16px] font-semibold text-black">
              {s.label}
              <ArrowUpRight
                size={14}
                className="opacity-0 transition-all -translate-x-1 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                style={{ color: ACCENT }}
              />
            </span>
            <span className="mt-0.5 text-[13.5px] text-black/55">{s.description}</span>
          </Link>
        ))}
      </div>
      <Link
        href="/services"
        onClick={onNavigate}
        className="group/feat relative w-72 shrink-0 overflow-hidden rounded-2xl bg-black text-white"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-500 group-hover/feat:opacity-90"
        >
          <source src="/videos/foldcraft.webm" type="video/webm" />
          <source src="/videos/foldcraft.mp4" type="video/mp4" />
        </video>
        {/* Heavier scrim than a hero would use: the card is small, so the
            copy has to win over the footage at every frame. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />
        <div className="relative flex h-full min-h-[240px] flex-col justify-end p-5">
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#93c5fd' }}>
            Featured
          </span>
          <h4 className={`mt-1 text-lg font-semibold leading-snug ${headingClass}`}>
            Nine practices, one delivery model.
          </h4>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
            Explore all services
            <ArrowUpRight size={16} />
          </span>
        </div>
      </Link>
    </div>
  );
}

function PlatformsPanel({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {PLATFORM_CATEGORIES.map((cat) => (
        <div key={cat.id}>
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-black/45">{cat.label}</p>
          <div className="flex flex-col gap-1">
            {cat.items.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                onClick={onNavigate}
                className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-black/[0.04]"
              >
                {PLATFORM_LOGOS[p.label] ? (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center">
                    <Image src={PLATFORM_LOGOS[p.label]} alt={p.label} width={28} height={28} className="h-6 w-6 object-contain" />
                  </span>
                ) : (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ACCENT }} />
                )}
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold text-black">{p.label}</span>
                  <span className="block truncate text-[13px] text-black/50">{p.capability}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function IndustriesPanel({ headingClass, onNavigate }: { headingClass: string; onNavigate: () => void }) {
  const [slug, setSlug] = useState(INDUSTRIES[0].slug);
  const active = INDUSTRIES.find((i) => i.slug === slug) ?? INDUSTRIES[0];
  const feat = INDUSTRY_FEATURES[slug];
  return (
    <div className="flex gap-8">
      <div className="flex w-64 shrink-0 flex-col gap-0.5">
        {INDUSTRIES.map((ind) => (
          <Link
            key={ind.slug}
            href={ind.href}
            onClick={onNavigate}
            onMouseEnter={() => setSlug(ind.slug)}
            className="group/item flex items-center justify-between rounded-xl px-4 py-2.5 text-[16px] font-semibold transition-colors hover:bg-black/[0.04]"
            style={{ color: ind.slug === slug ? ACCENT : '#000' }}
          >
            {ind.label}
            <ArrowUpRight
              size={15}
              className="transition-opacity"
              style={{ opacity: ind.slug === slug ? 1 : 0, color: ACCENT }}
            />
          </Link>
        ))}
      </div>
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <Link href={feat?.href ?? '/case-studies'} onClick={onNavigate} className="group/feat block overflow-hidden rounded-2xl bg-black text-white">
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={INDUSTRY_IMAGES[slug] ?? '/images/v4/hero-atmosphere.jpg'}
                  alt={active.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover/feat:scale-105"
                  sizes="480px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              </div>
              <div className="p-5">
                {feat ? (
                  <>
                    <div className="flex items-baseline gap-3">
                      <span className={`text-3xl font-bold ${headingClass}`} style={{ color: '#93c5fd' }}>
                        {feat.metric.value}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-white/75">
                        {feat.metric.label}
                      </span>
                    </div>
                    <p className={`mt-2 text-base font-semibold leading-snug ${headingClass}`}>{feat.headline}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white/90">
                      See the engagement <ArrowUpRight size={15} />
                    </span>
                  </>
                ) : null}
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResourcesPanel({ headingClass, onNavigate }: { headingClass: string; onNavigate: () => void }) {
  const cards = [
    { ...RESOURCES.playbooks, blurb: 'Field-tested delivery patterns you can run.', img: '/images/v4/svc-ai.jpg' },
    { ...RESOURCES.work, blurb: 'Outcomes we shipped, with the numbers.', img: '/images/v4/case-retail.jpg' },
    { ...RESOURCES.whitepapers, blurb: 'Deep dives on architecture and governance.', img: '/images/v4/svc-data.jpg' },
    { ...RESOURCES.insights, blurb: 'What our engineers are thinking about.', img: '/images/v4/why-visual.jpg' },
  ];
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((c) => (
        <Link
          key={c.indexHref}
          href={c.indexHref}
          onClick={onNavigate}
          className="group/item overflow-hidden rounded-2xl border border-black/[0.07] bg-white transition-shadow hover:shadow-lg"
        >
          <div className="relative h-24 w-full overflow-hidden">
            <Image src={c.img} alt={c.eyebrow} fill className="object-cover transition-transform duration-500 group-hover/item:scale-105" sizes="260px" />
          </div>
          <div className="p-4">
            <span className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
              {c.eyebrow}
            </span>
            <p className={`mt-1 text-[15px] font-semibold text-black ${headingClass}`}>{c.blurb}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-[14px] font-medium text-black/60">
              {c.cta} <ArrowUpRight size={13} />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function CompanyPanel({ headingClass, onNavigate }: { headingClass: string; onNavigate: () => void }) {
  return (
    <div className="flex gap-8">
      <div className="flex flex-1 flex-col gap-1">
        {COMPANY.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            onClick={onNavigate}
            className="group/item flex flex-col rounded-xl px-4 py-3 transition-colors hover:bg-black/[0.04]"
          >
            <span className="flex items-center gap-1.5 text-[16px] font-semibold text-black">
              {c.label}
              <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover/item:opacity-100" style={{ color: ACCENT }} />
            </span>
            <span className="mt-0.5 text-[13.5px] text-black/55">{c.description}</span>
          </Link>
        ))}
      </div>
      <Link href="/careers" onClick={onNavigate} className="group/feat relative flex w-64 shrink-0 flex-col justify-between overflow-hidden rounded-2xl bg-black p-5 text-white">
        <div className="flex items-center gap-3">
          <Image src="/images/certifications-awards/best-place-to-work.webp" alt="Great Place to Work Certified" width={48} height={64} className="h-14 w-auto" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/80">Certified<br />Great Place to Work</span>
        </div>
        <div className="mt-6">
          <h4 className={`text-lg font-semibold leading-snug ${headingClass}`}>Build what matters, with people who care.</h4>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium">
            See open roles <ArrowUpRight size={15} />
          </span>
        </div>
      </Link>
    </div>
  );
}

/* ------------------------------- shell ------------------------------- */

export default function HeroMegaNav({ headingClass }: { headingClass: string }) {
  const [open, setOpen] = useState<MenuId | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const requestOpen = (id: MenuId) => {
    cancel();
    setOpen(id);
  };
  const requestClose = () => {
    cancel();
    timer.current = setTimeout(() => setOpen(null), 140);
  };
  const close = () => {
    cancel();
    setOpen(null);
  };

  return (
    <div className="relative" onMouseLeave={requestClose}>
      <div className="hidden items-center gap-1 md:flex">
        {TRIGGERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onMouseEnter={() => requestOpen(t.id)}
            onClick={() => (open === t.id ? close() : requestOpen(t.id))}
            aria-expanded={open === t.id}
            className="group flex items-center gap-1 px-3 py-2 text-[16px] font-semibold capitalize tracking-wide transition-colors"
            style={{ color: open === t.id ? ACCENT : 'rgba(0,0,0,0.75)' }}
          >
            <span className="relative">
              {t.label}
              <Underline />
            </span>
            <ChevronDown size={13} className="transition-transform duration-200" style={{ transform: open === t.id ? 'rotate(180deg)' : 'none' }} />
          </button>
        ))}

        {/* ArqAI Labs — distinct external item */}
        <a
          href="https://thearq.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="group ml-1 flex items-center gap-1.5 rounded-full border px-4 py-2 text-[16px] font-semibold capitalize tracking-wide transition-colors"
          style={{ color: ACCENT, borderColor: 'rgba(94,14,215,0.3)' }}
        >
          ArqAI Labs
          <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* Shared dropdown panel */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22, ease: EASE }}
            onMouseEnter={cancel}
            onMouseLeave={requestClose}
            className="absolute left-1/2 top-full z-50 mt-3 w-[min(1040px,92vw)] -translate-x-1/2 rounded-3xl border border-black/[0.06] bg-white/95 p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
          >
            {open === 'services' && <ServicesPanel headingClass={headingClass} onNavigate={close} />}
            {open === 'platforms' && <PlatformsPanel onNavigate={close} />}
            {open === 'industries' && <IndustriesPanel headingClass={headingClass} onNavigate={close} />}
            {open === 'resources' && <ResourcesPanel headingClass={headingClass} onNavigate={close} />}
            {open === 'company' && <CompanyPanel headingClass={headingClass} onNavigate={close} />}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ChevronDown,
  BrainCircuit,
  Cloud,
  Database,
  Megaphone,
  Blocks,
  MonitorSmartphone,
  ShieldCheck,
  ServerCog,
  Compass,
  Building2,
  Landmark,
  HeartPulse,
  ShoppingBag,
  UtensilsCrossed,
  Factory,
  Zap,
  Truck,
  Fuel,
  ClipboardCheck,
  type LucideIcon,
} from 'lucide-react';
import {
  SERVICES,
  PLATFORM_CATEGORIES,
  INDUSTRIES,
  INDUSTRY_FEATURES,
  RESOURCES,
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

// Icons keyed by href/slug so the maps survive label copy edits.
const SERVICE_ICONS: Record<string, LucideIcon> = {
  '/services/applied-ai-ml': BrainCircuit,
  '/services/cloud-modernization': Cloud,
  '/services/data-engineering': Database,
  '/services/martech-cdp': Megaphone,
  '/services/app-development': Blocks,
  '/services/quality-engineering': ClipboardCheck,
  '/services/digital-transformation': MonitorSmartphone,
  '/services/cyber-security': ShieldCheck,
  '/services/managed-operations': ServerCog,
  '/services/advisory-strategy': Compass,
  '/services/gcc': Building2,
};

const INDUSTRY_ICONS: Record<string, LucideIcon> = {
  'financial-services': Landmark,
  healthcare: HeartPulse,
  retail: ShoppingBag,
  hospitality: UtensilsCrossed,
  manufacturing: Factory,
  energy: Zap,
  'oil-gas': Fuel,
  transportation: Truck,
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
        {SERVICES.map((s) => {
          const Icon = SERVICE_ICONS[s.href];
          return (
            <Link
              key={s.href}
              href={s.href}
              onClick={onNavigate}
              className="group/item flex items-start gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-black/[0.04]"
            >
              {Icon ? (
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 transition-colors group-hover/item:bg-blue-700 group-hover/item:text-white">
                  <Icon size={18} aria-hidden="true" />
                </span>
              ) : null}
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-[16px] font-semibold text-black">
                  {s.label}
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 transition-all -translate-x-1 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                    style={{ color: ACCENT }}
                  />
                </span>
                <span className="mt-0.5 block text-[13.5px] text-black/55">{s.description}</span>
              </span>
            </Link>
          );
        })}
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
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-500 group-hover/feat:opacity-100"
        >
          <source src="/videos/foldcraft.webm" type="video/webm" />
          <source src="/videos/foldcraft.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        <div className="relative flex h-full min-h-[240px] flex-col justify-end p-5">
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#93c5fd' }}>
            Featured
          </span>
          {/* text-white is load-bearing: the design system paints all
              headings near-black, which vanishes on this dark card. */}
          <h4 className={`mt-1 text-lg font-semibold leading-snug text-white ${headingClass}`}>
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
                  // Wide box: most of these files are horizontal wordmarks,
                  // and squeezing them into a 28px square made them unreadable.
                  <span className="flex h-10 w-16 shrink-0 items-center justify-center">
                    <Image
                      src={PLATFORM_LOGOS[p.label]}
                      alt={p.label}
                      width={128}
                      height={80}
                      className="max-h-9 w-auto max-w-full object-contain"
                    />
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
        {INDUSTRIES.map((ind) => {
          const Icon = INDUSTRY_ICONS[ind.slug];
          const isActive = ind.slug === slug;
          return (
            <Link
              key={ind.slug}
              href={ind.href}
              onClick={onNavigate}
              onMouseEnter={() => setSlug(ind.slug)}
              className="group/item flex items-center gap-3 rounded-xl px-4 py-2.5 text-[16px] font-semibold transition-colors hover:bg-black/[0.04]"
              style={{ color: isActive ? ACCENT : '#000' }}
            >
              {Icon ? (
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
                  style={{
                    background: isActive ? ACCENT : 'rgba(0,0,0,0.05)',
                    color: isActive ? '#fff' : 'rgba(0,0,0,0.65)',
                  }}
                >
                  <Icon size={16} aria-hidden="true" />
                </span>
              ) : null}
              <span className="flex-1">{ind.label}</span>
              <ArrowUpRight
                size={15}
                className="transition-opacity"
                style={{ opacity: isActive ? 1 : 0, color: ACCENT }}
              />
            </Link>
          );
        })}
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

/* Company panel: three destination cards over colorful abstract
 * gradient art (brand blue + lime, with violet/amber accents echoing
 * the chromatic CTA footage). All copy is explicitly white — the
 * design system paints headings near-black by default, which is
 * invisible on these dark cards. */
const COMPANY_CARDS = [
  {
    label: 'About',
    href: '/about',
    kicker: 'The company',
    description: 'Who we are, how we build, and why it runs in production.',
    cta: 'Meet ACI',
    art: 'radial-gradient(120% 90% at 15% 10%, #1D4ED8 0%, transparent 55%), radial-gradient(90% 80% at 90% 20%, #7C3AED 0%, transparent 50%), radial-gradient(100% 100% at 70% 100%, #22D3EE 0%, transparent 55%), #060B1F',
  },
  {
    label: 'Careers',
    href: '/careers',
    kicker: 'Join the team',
    description: 'Build what matters, with people who care.',
    cta: 'See open roles',
    badge: true,
    art: 'radial-gradient(110% 90% at 88% 8%, #84CC16 0%, transparent 52%), radial-gradient(120% 90% at 8% 35%, #1D4ED8 0%, transparent 55%), radial-gradient(90% 90% at 55% 100%, #0EA5E9 0%, transparent 55%), #05130D',
  },
  {
    label: 'News',
    href: '/news',
    kicker: 'Press & partnerships',
    description: 'Announcements, alliances, and coverage.',
    cta: 'Read the news',
    art: 'radial-gradient(120% 80% at 60% 0%, #1D4ED8 0%, transparent 58%), radial-gradient(110% 100% at 85% 85%, #DB2777 0%, transparent 55%), radial-gradient(110% 90% at 12% 92%, #F59E0B 0%, transparent 50%), #140610',
  },
];

function CompanyPanel({ headingClass, onNavigate }: { headingClass: string; onNavigate: () => void }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {COMPANY_CARDS.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          onClick={onNavigate}
          className="group/item relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-2xl p-5 text-white"
        >
          {/* abstract art layer */}
          <span
            aria-hidden="true"
            className="absolute inset-0 transition-transform duration-700 ease-out group-hover/item:scale-[1.06]"
            style={{ background: c.art }}
          />
          {/* readability scrim */}
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

          {c.badge ? (
            <span className="absolute right-4 top-4 flex items-center gap-2 rounded-xl bg-white/95 py-1.5 pl-1.5 pr-2.5 shadow-sm">
              <Image
                src="/images/certifications-awards/best-place-to-work.webp"
                alt="Great Place to Work Certified"
                width={30}
                height={40}
                className="h-9 w-auto"
              />
              <span className="text-[9px] font-bold uppercase leading-tight tracking-wide text-black/70">
                Certified
                <br />
                Great Place
                <br />
                to Work
              </span>
            </span>
          ) : null}

          <span className="relative">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">{c.kicker}</span>
            <h4 className={`mt-1 text-xl font-semibold leading-snug text-white ${headingClass}`}>{c.label}</h4>
            <span className="mt-1 block text-[13.5px] leading-snug text-white/85">{c.description}</span>
            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
              {c.cta}
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5"
              />
            </span>
          </span>
        </Link>
      ))}
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
      {/* Full trigger row needs ~1000px; below lg the hero nav falls back
          to the hamburger + mobile menu instead of cramming. */}
      <div className="hidden items-center gap-1 lg:flex">
        {TRIGGERS.map((t) => (
          <button
            key={t.id}
            type="button"
            onMouseEnter={() => requestOpen(t.id)}
            onClick={() => (open === t.id ? close() : requestOpen(t.id))}
            aria-expanded={open === t.id}
            className="group flex items-center gap-1 whitespace-nowrap px-2 py-2 text-[15px] font-semibold capitalize tracking-wide transition-colors xl:px-3 xl:text-[16px]"
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
          className="group ml-1 flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-2 text-[15px] font-semibold capitalize tracking-wide transition-colors xl:px-4 xl:text-[16px]"
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

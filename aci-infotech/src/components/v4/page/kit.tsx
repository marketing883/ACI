import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import { v4Display } from '../fonts';
import '../hero/hero.css';

/** Soft double shadow for white cards sitting on a white field. */
const CARD_SHADOW = 'shadow-[0_3px_9px_rgba(63,74,126,0.06),0_1px_29px_rgba(63,74,126,0.12)]';

/** Glue the final two words with a non-breaking space so no width can
    strand a widow. Apply to every plain-string copy render. */
export function glueWidow(s: string) {
  return s.replace(/ (\S+)$/, '\u00a0$1');
}

// v4 inner-page kit. Server components only: every word these render
// ships in the initial HTML. The visual grammar mirrors the homepage
// (kicker in blue small caps, giant Funnel Display headings, hairline
// dividers, white base) so inner pages read as siblings of `/`.

const ACCENT = '#1D4ED8';

/* ---------------------------------- head --------------------------------- */

export function SectionHead({
  kicker,
  title,
  sub,
  className = '',
}: {
  kicker: string;
  title: React.ReactNode;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
        / {kicker}
      </p>
      <h2
        className={`text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[44px] ${v4Display}`}
        style={{ lineHeight: 1.06 }}
      >
        {title}
      </h2>
      {sub ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{glueWidow(sub)}</p> : null}
    </div>
  );
}

/* ---------------------------------- hero --------------------------------- */

export function ServiceHero({
  kicker,
  title,
  lede,
  chips,
  primary,
  secondary,
  logos,
  logosCaption,
  stats,
  visual,
}: {
  kicker: string;
  title: React.ReactNode;
  lede: string;
  chips: string[];
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  /** Partner credential panel. Omit and pass `stats` instead for
      practices without partner logos (advisory, GCC, QE). */
  logos?: { src: string; alt: string }[];
  logosCaption?: string;
  stats?: { value: string; label: string }[];
  /** Full custom right-column visual (e.g. an animated canvas panel).
      When provided it replaces the logos/stats credential panel. */
  visual?: React.ReactNode;
}) {
  return (
    <section className="border-b border-gray-200 bg-white text-black">
      {/* 6/6 split: the animated visual gets equal billing with the copy,
          so the metaphor has room to read. Smaller H1 wraps to two lines. */}
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-12 md:pt-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / {kicker}
          </p>
          <h1
            className={`text-3xl font-bold tracking-tight sm:text-4xl lg:text-[40px] xl:text-[46px] ${v4Display}`}
            style={{ lineHeight: 1.08 }}
          >
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-gray-700 md:text-base">{glueWidow(lede)}</p>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {chips.map((chip) => (
              <li key={chip} className="whitespace-nowrap">
                {chip}
              </li>
            ))}
          </ul>

          {/* Text links only: buttons live in CTA sections, nowhere else. */}
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link
              href={primary.href}
              className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-blue-700"
            >
              <span className="relative">
                {primary.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </span>
              <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href={secondary.href}
              className="group inline-flex items-center gap-1.5 text-[15px] font-semibold text-black"
            >
              <span className="relative">
                {secondary.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </span>
              <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Right column: a custom animated visual when provided,
            otherwise the credential panel (partner logos or stats). */}
        {visual ? (
          <div className="lg:col-span-6">{visual}</div>
        ) : (
        <div className="lg:col-span-6">
          <div className="flex h-full flex-col justify-center gap-8 rounded-3xl border border-gray-200 bg-gray-50/60 p-8 md:p-10">
            {logos?.map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={280}
                height={64}
                className="h-12 w-auto self-start object-contain sm:h-14"
              />
            ))}
            {stats?.map((stat) => (
              <div key={stat.label}>
                <p className={`text-4xl font-bold leading-none text-[#1D4ED8] sm:text-5xl ${v4Display}`}>
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500">{stat.label}</p>
              </div>
            ))}
            {logosCaption ? <p className="text-sm font-medium text-gray-500">{logosCaption}</p> : null}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------- offerings ------------------------------- */

export function OfferingList({
  items,
}: {
  items: { title: string; body: string; chips: string[] }[];
}) {
  return (
    <div className="mt-12 grid gap-x-14 md:grid-cols-2">
      {items.map((item, i) => (
        <div key={item.title} className="border-t border-gray-200 py-8">
          <div className="flex items-baseline gap-4">
            <span className={`text-sm font-semibold text-gray-300 ${v4Display}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className={`text-xl font-semibold text-black md:text-2xl ${v4Display}`}>{item.title}</h3>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{glueWidow(item.body)}</p>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-400">
            {item.chips.join(' · ')}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- decision panel ----------------------------- */

/** Shared soft-card shadow, exported for page-local decision variants. */
export const cardShadow = CARD_SHADOW;

/** Blue check badge used across the decision grammar. */
export function CheckBadge() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
      style={{ background: ACCENT }}
    >
      <Check size={12} strokeWidth={3} className="text-white" />
    </span>
  );
}

/** The circular video window at the center of a two-way comparison.
    Defaults to the homepage hero sphere, whose subject sits dead center,
    so the circle crop keeps it centered at any size. */
export function DecisionCircle({
  video = { mp4: '/videos/v4-editorial-signal.mp4', webm: '/videos/v4-editorial-signal.webm' },
}: {
  video?: { mp4: string; webm?: string };
}) {
  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200 shadow-[0_20px_60px_-20px_rgba(63,74,126,0.35)]"
      style={{ width: 'clamp(200px, 21vw, 320px)', height: 'clamp(200px, 21vw, 320px)' }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        {video.webm ? <source src={video.webm} type="video/webm" /> : null}
        <source src={video.mp4} type="video/mp4" />
      </video>
    </div>
  );
}

function JobCard({ row }: { row: { need: string; pick: 'a' | 'b' | 'both' } }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl bg-white px-5 py-4 ${CARD_SHADOW}`}>
      <CheckBadge />
      <div>
        <p className="text-[15px] font-medium leading-snug text-gray-800">{glueWidow(row.need)}</p>
        {row.pick === 'both' ? (
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
            Both platforms
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Column header: a partner logo (optionally with a wordmark label for
    icon-only marks), or a text label for approach columns. `px` sets the
    rendered logo height, since padded assets need more than tight ones. */
export type DecisionCol =
  | { src: string; alt: string; label?: string; px?: number }
  | { label: string; src?: undefined; alt?: undefined; px?: undefined };

function ColHead({ col }: { col: DecisionCol }) {
  return (
    <div className={`flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-6 ${CARD_SHADOW}`}>
      {col.src ? (
        <>
          <Image
            src={col.src}
            alt={col.alt ?? ''}
            width={260}
            height={64}
            className="w-auto object-contain"
            style={{ height: col.px ?? 44 }}
          />
          {col.label ? (
            <span className={`text-xl font-semibold text-black ${v4Display}`}>{col.label}</span>
          ) : null}
        </>
      ) : (
        <span className={`text-center text-xl font-semibold text-black ${v4Display}`}>{col.label}</span>
      )}
    </div>
  );
}

export function DecisionPanel({
  title,
  body,
  colA,
  colB,
  rows,
  video = { mp4: '/videos/v4-editorial-signal.mp4', webm: '/videos/v4-editorial-signal.webm' },
  footnote,
}: {
  title: React.ReactNode;
  body: string;
  colA: DecisionCol;
  colB: DecisionCol;
  rows: { need: string; pick: 'a' | 'b' | 'both' }[];
  /** Loop playing inside the center circle. */
  video?: { mp4: string; webm?: string };
  footnote?: string;
}) {
  const aRows = rows.filter((r) => r.pick !== 'b');
  const bRows = rows.filter((r) => r.pick !== 'a');

  return (
    <section className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <h2
          className={`text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[44px] ${v4Display}`}
          style={{ lineHeight: 1.08 }}
        >
          {title}
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">{glueWidow(body)}</p>

        <div className="mt-12 flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-10">
          {/* Center circle first on mobile, middle on desktop */}
          <div className="order-first flex justify-center lg:order-none lg:col-start-2 lg:row-start-1 lg:pt-6">
            <DecisionCircle video={video} />
          </div>

          <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-1">
            <ColHead col={colA} />
            {aRows.map((row) => (
              <JobCard key={row.need} row={row} />
            ))}
          </div>

          <div className="flex flex-col gap-4 lg:col-start-3 lg:row-start-1">
            <ColHead col={colB} />
            {bRows.map((row) => (
              <JobCard key={row.need} row={row} />
            ))}
          </div>
        </div>

        {footnote ? <p className="mt-8 text-sm text-gray-500">{glueWidow(footnote)}</p> : null}
      </div>
    </section>
  );
}

/* ------------------------------ proof cards ------------------------------ */

export function ProofCards({
  cards,
  video = { mp4: '/videos/retail-bg.mp4' },
  images = ['/images/v4/case-finance.jpg', '/images/v4/case-energy.jpg'],
}: {
  cards: { eyebrow: string; metric: string; metricLabel: string; summary: string; href: string; linkLabel: string }[];
  /** Backdrop loop inside the feature card (first card). */
  video?: { mp4: string; webm?: string };
  /** Photographic backdrops for the supporting cards, in order. */
  images?: string[];
}) {
  const [feature, ...rest] = cards;
  return (
    <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:grid-rows-2">
      {/* Feature card: tall, with a quiet video backdrop */}
      <Link
        href={feature.href}
        className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-3xl bg-[#0b1220] p-8 ring-1 ring-white/10 transition-all duration-300 hover:ring-white/25 lg:row-span-2 lg:p-10"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        >
          {video.webm ? <source src={video.webm} type="video/webm" /> : null}
          <source src={video.mp4} type="video/mp4" />
        </video>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(11,18,32,0.35) 0%, rgba(11,18,32,0.82) 62%, rgba(11,18,32,0.96) 100%)' }}
        />
        <div className="relative flex flex-1 flex-col">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">{feature.eyebrow}</p>
          <div className="flex-1" />
          <span className={`text-7xl font-bold leading-none text-[#84CC16] lg:text-[104px] ${v4Display}`}>
            {feature.metric}
          </span>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">{feature.metricLabel}</p>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/80">{glueWidow(feature.summary)}</p>
          <span className="mt-7 flex items-center gap-1 text-sm font-semibold text-[#84CC16]">
            {feature.linkLabel}
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>

      {/* Supporting cards: photographic backdrop under the same veil */}
      {rest.map((card, i) => (
        <Link
          key={card.href}
          href={card.href}
          className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#0b1220] p-8 ring-1 ring-white/10 transition-all duration-300 hover:ring-white/25"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[i % images.length]}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(11,18,32,0.55) 0%, rgba(11,18,32,0.88) 62%, rgba(11,18,32,0.96) 100%)' }}
          />
          <p className="relative text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">{card.eyebrow}</p>
          <div className="relative mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className={`text-6xl font-bold leading-none text-[#84CC16] ${v4Display}`}>{card.metric}</span>
            <span className="max-w-[220px] text-[11px] font-semibold uppercase leading-tight tracking-[0.16em] text-white/60">
              {card.metricLabel}
            </span>
          </div>
          <p className="relative mt-5 flex-1 text-sm leading-relaxed text-white/75">{glueWidow(card.summary)}</p>
          <span className="relative mt-6 flex items-center gap-1 text-xs font-semibold text-[#84CC16]">
            {card.linkLabel}
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}

/* ----------------------------- process strip ----------------------------- */

export function ProcessStrip({
  steps,
}: {
  steps: { title: string; timeframe?: string; body: string }[];
}) {
  return (
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step, i) => (
        <div key={step.title} className={`flex flex-col rounded-2xl bg-white p-6 ${CARD_SHADOW}`}>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold text-[#1D4ED8] ${v4Display}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-gray-200" />
            {i < steps.length - 1 ? (
              <ArrowUpRight size={13} aria-hidden="true" className="rotate-45 text-gray-300" />
            ) : (
              <Check size={13} aria-hidden="true" className="text-[#84CC16]" strokeWidth={3} />
            )}
          </div>
          <h3 className={`mt-5 text-lg font-semibold text-black ${v4Display}`}>{step.title}</h3>
          {step.timeframe ? (
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">{step.timeframe}</p>
          ) : null}
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{glueWidow(step.body)}</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ bridge band ------------------------------ */

export function BridgeBand({
  title,
  body,
  link,
  video = { mp4: '/videos/v4-slide1.mp4', webm: '/videos/v4-slide1.webm' },
}: {
  title: React.ReactNode;
  body: string;
  link: { label: string; href: string };
  /** Full-bleed backdrop loop behind the stylized overlay. */
  video?: { mp4: string; webm?: string };
}) {
  return (
    <section className="relative overflow-hidden border-t border-gray-200">
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      >
        {video.webm ? <source src={video.webm} type="video/webm" /> : null}
        <source src={video.mp4} type="video/mp4" />
      </video>
      {/* Stylized veil: heavy on the reading side, easing right */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, rgba(4,7,13,0.93) 0%, rgba(4,7,13,0.78) 45%, rgba(11,18,32,0.45) 100%)',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-24">
        <h2
          className={`max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl ${v4Display}`}
          style={{ lineHeight: 1.08 }}
        >
          {title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">{glueWidow(body)}</p>
        <Link
          href={link.href}
          className="group mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold text-white"
        >
          <span className="relative">
            {link.label}
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </span>
          <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
}

/* -------------------------------- facts row ------------------------------ */

export function FactsRow({ facts }: { facts: { label: string; line: string }[] }) {
  return (
    <div className="mt-12 grid gap-x-0 gap-y-10 border-t border-gray-200 pt-10 sm:grid-cols-2 lg:grid-cols-4">
      {facts.map((fact, i) => {
        // Lead sentence carries the claim; the rest is supporting detail.
        // Last two words of the lead are glued so no width strands a widow.
        const stop = fact.line.indexOf('. ');
        const rawLead = stop === -1 ? fact.line : fact.line.slice(0, stop + 1);
        const lead = rawLead.replace(/ (\S+)$/, ' $1');
        const detail = stop === -1 ? '' : fact.line.slice(stop + 2);
        const smDivider = i % 2 === 1 ? 'sm:border-l sm:border-gray-200 sm:pl-8' : '';
        const lgDivider = i > 0 ? 'lg:border-l lg:border-gray-200 lg:pl-8' : 'lg:border-l-0 lg:pl-0';
        return (
          <div key={fact.label} className={`sm:pr-8 ${smDivider} ${lgDivider}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ {fact.label}</p>
            <p className={`mt-4 text-[17px] font-semibold leading-snug text-black ${v4Display}`}>{lead}</p>
            {detail ? <p className="mt-2 text-sm leading-relaxed text-gray-600">{detail}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------- faq ---------------------------------- */

export function PageFaq({
  id = 'faq',
  kicker,
  title,
  sub,
  faqs,
}: {
  id?: string;
  kicker: string;
  title: React.ReactNode;
  sub?: string;
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
  return (
    <section id={id} className="border-t border-gray-200 bg-white text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">/ {kicker}</p>
            <h2
              className={`text-3xl font-bold tracking-tight text-black sm:text-4xl lg:text-[44px] ${v4Display}`}
              style={{ lineHeight: 1.06 }}
            >
              {title}
            </h2>
            {sub ? <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600 md:text-base">{glueWidow(sub)}</p> : null}
          </div>

          <div className="min-w-0 lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              {faqs.map((item, i) => (
                <details key={item.question} className={`group ${i > 0 ? 'border-t border-gray-200' : ''}`}>
                  <summary
                    className={`flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-semibold text-black transition-colors hover:bg-gray-50 md:p-6 md:text-lg [&::-webkit-details-marker]:hidden ${v4Display}`}
                  >
                    {item.question}
                    <Plus
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-blue-700 transition-transform duration-300 group-open:rotate-45"
                    />
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-gray-600 md:px-6 md:pb-6 md:text-base">
                    {glueWidow(item.answer)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

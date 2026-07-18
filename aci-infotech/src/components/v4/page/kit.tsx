import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Plus } from 'lucide-react';
import { v4Display } from '../fonts';

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
        className={`text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-[56px] ${v4Display}`}
        style={{ lineHeight: 1.06 }}
      >
        {title}
      </h2>
      {sub ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{sub}</p> : null}
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
}: {
  kicker: string;
  title: React.ReactNode;
  lede: string;
  chips: string[];
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  logos: { src: string; alt: string }[];
  logosCaption: string;
}) {
  return (
    <section className="border-b border-gray-200 bg-white text-black">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-12 md:pt-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
            / {kicker}
          </p>
          <h1
            className={`text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-[64px] ${v4Display}`}
            style={{ lineHeight: 1.04 }}
          >
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 md:text-lg">{lede}</p>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {chips.map((chip) => (
              <li key={chip} className="whitespace-nowrap">
                {chip}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              href={primary.href}
              className="inline-flex items-center gap-2 rounded-full bg-[#1D4ED8] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors duration-300 hover:bg-black"
            >
              {primary.label}
              <ArrowUpRight size={16} aria-hidden="true" />
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

        {/* Partner credential panel: the platforms this practice is
            certified on, given real prominence instead of a chip. */}
        <div className="lg:col-span-5">
          <div className="flex h-full flex-col justify-center gap-8 rounded-3xl border border-gray-200 bg-gray-50/60 p-8 md:p-10">
            {logos.map((logo) => (
              <Image
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                width={280}
                height={64}
                className="h-12 w-auto self-start object-contain sm:h-14"
              />
            ))}
            <p className="text-sm font-medium text-gray-500">{logosCaption}</p>
          </div>
        </div>
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
          <p className="mt-3 text-[15px] leading-relaxed text-gray-600">{item.body}</p>
          <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-400">
            {item.chips.join(' · ')}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- decision panel ----------------------------- */

export function DecisionPanel({
  title,
  body,
  colA,
  colB,
  rows,
}: {
  title: React.ReactNode;
  body: string;
  colA: { src: string; alt: string };
  colB: { src: string; alt: string };
  rows: { need: string; pick: 'a' | 'b' | 'both' }[];
}) {
  const Dot = ({ on }: { on: boolean }) => (
    <span
      aria-hidden="true"
      className="mx-auto block h-3 w-3 rounded-full"
      style={{ background: on ? ACCENT : 'rgba(0,0,0,0.08)' }}
    />
  );
  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2
          className={`text-3xl font-bold tracking-tight text-black sm:text-4xl ${v4Display}`}
          style={{ lineHeight: 1.08 }}
        >
          {title}
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">{body}</p>

        <div className="mt-9 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr>
                <th className="w-1/2 border-b border-gray-200 pb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  The job at hand
                </th>
                {[colA, colB].map((col) => (
                  <th key={col.alt} className="border-b border-gray-200 pb-4 text-center">
                    <Image src={col.src} alt={col.alt} width={140} height={32} className="mx-auto h-7 w-auto object-contain" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.need}>
                  <td className="border-b border-gray-200 py-4 pr-6 font-medium text-gray-800">{row.need}</td>
                  <td className="border-b border-gray-200 py-4">
                    <Dot on={row.pick === 'a' || row.pick === 'both'} />
                  </td>
                  <td className="border-b border-gray-200 py-4">
                    <Dot on={row.pick === 'b' || row.pick === 'both'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ proof cards ------------------------------ */

export function ProofCards({
  cards,
}: {
  cards: { eyebrow: string; metric: string; metricLabel: string; summary: string; href: string; linkLabel: string }[];
}) {
  return (
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group flex flex-col rounded-2xl border border-white/10 bg-[#0b1220] p-7 transition-colors duration-300 hover:border-white/25"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50">{card.eyebrow}</p>
          <div className="mt-5 flex items-baseline gap-2">
            <span className={`text-5xl font-bold leading-none text-[#84CC16] ${v4Display}`}>{card.metric}</span>
          </div>
          <p className="mt-2 text-[11px] font-semibold uppercase leading-tight tracking-wide text-white/50">
            {card.metricLabel}
          </p>
          <p className="mt-5 flex-1 text-sm leading-relaxed text-white/75">{card.summary}</p>
          <span className="mt-6 flex items-center gap-1 text-xs font-semibold text-[#84CC16]">
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
    <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
      {steps.map((step, i) => (
        <div key={step.title}>
          <span className={`block text-6xl font-bold leading-none text-gray-200 ${v4Display}`}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className={`mt-4 text-lg font-semibold text-black ${v4Display}`}>{step.title}</h3>
          {step.timeframe ? (
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">{step.timeframe}</p>
          ) : null}
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.body}</p>
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
}: {
  title: React.ReactNode;
  body: string;
  link: { label: string; href: string };
}) {
  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <h2
          className={`text-3xl font-bold tracking-tight text-black sm:text-4xl ${v4Display}`}
          style={{ lineHeight: 1.08 }}
        >
          {title}
        </h2>
        <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">{body}</p>
        <Link
          href={link.href}
          className="group mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold text-blue-700"
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
    <div className="mt-12 grid gap-x-8 gap-y-10 border-t border-gray-200 pt-10 sm:grid-cols-2 lg:grid-cols-4">
      {facts.map((fact) => (
        <div key={fact.label}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{fact.label}</p>
          <p className="mt-3 text-[15px] font-medium leading-relaxed text-black">{fact.line}</p>
        </div>
      ))}
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
              className={`text-4xl font-bold tracking-tight text-black sm:text-5xl lg:text-[56px] ${v4Display}`}
              style={{ lineHeight: 1.06 }}
            >
              {title}
            </h2>
            {sub ? <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600 md:text-base">{sub}</p> : null}
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
                    {item.answer}
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

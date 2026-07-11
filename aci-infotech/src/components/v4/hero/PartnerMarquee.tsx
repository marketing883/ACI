'use client';

import Image from 'next/image';
import './hero.css';

const LOGOS = [
  { src: '/images/Solution-Partners/azure.png', alt: 'Microsoft Azure', w: 120 },
  { src: '/images/Solution-Partners/databricks.png', alt: 'Databricks', w: 132 },
  { src: '/images/Solution-Partners/snowflake.svg', alt: 'Snowflake', w: 138 },
  { src: '/images/Solution-Partners/googlecloud.svg', alt: 'Google Cloud', w: 150 },
  { src: '/images/Solution-Partners/sap.png', alt: 'SAP', w: 70 },
  { src: '/images/Solution-Partners/salesforce.png', alt: 'Salesforce', w: 96 },
  { src: '/images/Solution-Partners/dynatrace.png', alt: 'Dynatrace', w: 132 },
  { src: '/images/Solution-Partners/aws.png', alt: 'Amazon Web Services', w: 74 },
];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-16 pr-16">
      {LOGOS.map((l, idx) => (
        <div key={`${l.alt}-${idx}`} className="flex h-9 shrink-0 items-center">
          <Image
            src={l.src}
            alt={l.alt}
            width={l.w}
            height={36}
            className="h-7 w-auto object-contain opacity-55 transition-opacity duration-300 hover:opacity-100"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
      ))}
    </div>
  );
}

export default function PartnerMarquee({ headingClass }: { headingClass: string }) {
  return (
    <section className="border-t border-white/10 bg-black py-14">
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-12">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className={`text-2xl font-semibold text-white sm:text-3xl ${headingClass}`}>
            Our Partner Platforms
          </h2>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40 sm:block">
            Platform Ecosystem
          </span>
        </div>
      </div>

      {/* full-bleed scrolling track with edge fade */}
      <div className="marquee-viewport marquee-mask overflow-hidden">
        <div className="marquee-track">
          <Row />
          <Row />
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import './hero.css';

// Marks are forced to solid white via the brightness/invert filter below,
// so source color doesn't matter — using the colored brand assets keeps the
// shapes accurate (the plain grayscale PNGs are lower fidelity).
const LOGOS = [
  { src: '/brand/azure-color.png', alt: 'Microsoft Azure', w: 146, h: 64 },
  { src: '/brand/databricks-color.svg', alt: 'Databricks', w: 120, h: 50 },
  { src: '/brand/snowflake-color.svg', alt: 'Snowflake', w: 24, h: 48 },
  { src: '/brand/googlecloud-color.svg', alt: 'Google Cloud', w: 24, h: 48 },
  { src: '/brand/sap-color.svg', alt: 'SAP', w: 24, h: 46 },
  { src: '/brand/salesforce-color.png', alt: 'Salesforce', w: 146, h: 62 },
  { src: '/brand/dynatrace-color.svg', alt: 'Dynatrace', w: 24, h: 46 },
  { src: '/brand/aws-color.png', alt: 'Amazon Web Services', w: 146, h: 44 },
];

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-20 pr-20">
      {LOGOS.map((l, idx) => (
        <div key={`${l.alt}-${idx}`} className="flex h-16 shrink-0 items-center">
          <Image
            src={l.src}
            alt={l.alt}
            width={Math.round(l.w * 1.5)}
            height={l.h * 2}
            className="w-auto object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
            style={{ height: `${l.h}px`, filter: 'brightness(0) invert(1)' }}
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
        <div className="mb-10">
          <h2 className={`text-2xl font-semibold text-white sm:text-3xl ${headingClass}`}>
            Our Partner Platforms
          </h2>
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

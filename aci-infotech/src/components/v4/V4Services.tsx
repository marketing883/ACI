'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Reveal, ImageSettle, ArrowCircle } from './v4-motion';

const SERVICES = [
  {
    title: 'Data Engineering',
    href: '/services/data-engineering',
    image: '/images/v4/svc-data.jpg',
    alt: 'Data center aisle with server racks',
    description:
      'Scattered systems become one governed lakehouse. Every dataset gets lineage, quality scores, and access controls.',
    chips: ['#Lakehouse', '#Databricks', '#Snowflake', '#Governance'],
  },
  {
    title: 'Applied AI & ML',
    href: '/services/applied-ai-ml',
    image: '/images/v4/svc-ai.jpg',
    alt: 'Macro view of circuitry',
    description:
      'Models that run 24-7 under SLAs, with monitoring and rollback. Built on your data, not a demo dataset.',
    chips: ['#GenAI', '#MLOps', '#Agents', '#Governance'],
  },
  {
    title: 'Cloud Modernization',
    href: '/services/cloud-modernization',
    image: '/images/v4/svc-cloud.jpg',
    alt: 'Glass architecture from below',
    description:
      'Legacy estates re-architected for cloud, not just lifted into it. Costs drop, releases speed up, audits calm down.',
    chips: ['#AWS', '#Azure', '#Kubernetes', '#FinOps'],
  },
  {
    title: 'Managed Operations',
    href: '/services/managed-operations',
    image: '/images/v4/svc-ops.jpg',
    alt: 'Operations control room with monitoring screens',
    description:
      'We run what we ship. Uptime targets, on-call rotations, and audit evidence on demand. We answer the 2am call.',
    chips: ['#SLA', '#Observability', '#SOC2', '#ITSM'],
  },
];

export default function V4Services() {
  return (
    <section style={{ padding: '96px 24px 48px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <Reveal tier="sm">
          <span className="v4-eyebrow">What we do</span>
        </Reveal>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 32,
            flexWrap: 'wrap',
            marginTop: 14,
          }}
        >
          <Reveal tier="md">
            <h2 className="v4-h2" style={{ maxWidth: 560 }}>
              Four practices. One production standard.
            </h2>
          </Reveal>
          <Reveal tier="sm" delay={0.1}>
            <Link
              href="/services"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                font: '500 15px/1 var(--font-funnel-sans)',
                color: 'var(--v4-ink)',
                textDecoration: 'none',
              }}
            >
              All services <ArrowCircle />
            </Link>
          </Reveal>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            marginTop: 48,
          }}
        >
          {SERVICES.map((s, i) => (
            <Reveal key={s.href} tier="md" delay={i * 0.08}>
              <Link
                href={s.href}
                className="v4-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#fff',
                  border: '1px solid var(--v4-mist)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'var(--v4-ink)',
                  height: '100%',
                }}
              >
                <ImageSettle style={{ aspectRatio: '16/10', position: 'relative' }}>
                  <div className="v4-zoom" style={{ position: 'absolute', inset: 0 }}>
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1240px) 50vw, 300px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </ImageSettle>
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <h3
                      style={{
                        font: '600 20px/1.2 var(--font-funnel-display)',
                        letterSpacing: '-0.01em',
                        margin: 0,
                      }}
                    >
                      {s.title}
                    </h3>
                    <ArrowCircle />
                  </div>
                  <p style={{ margin: 0, font: '400 14.5px/1.6 var(--font-funnel-sans)', color: 'var(--v4-muted)', flex: 1 }}>
                    {s.description}
                  </p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    {s.chips.map((c) => (
                      <span key={c} className="v4-chip">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

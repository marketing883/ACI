'use client';

/**
 * PlaybooksGrid — six playbook cards with a cursor-tracking lime
 * spotlight. Each card shows a mono tag, title, description, and a
 * deployment count in the footer with a rotating-arrow go button.
 *
 * Cards are driven by the real PLAYBOOKS data from
 * src/components/sections/PlaybookVaultSection.tsx (shared source of
 * truth for all deployment counts and copy).
 */

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PLAYBOOKS } from '@/components/sections/PlaybookVaultSection';

// Map internal categories to mono tag labels (reading order).
const PB_TAGS: Record<string, string> = {
  ai: 'AI',
  data: 'DATA',
  cloud: 'CLOUD',
  integration: 'INT',
  analytics: 'BI',
};

export default function PlaybooksGrid() {
  // Surface up to 6 playbooks, prioritizing those with more deployments.
  const cards = [...PLAYBOOKS]
    .sort((a, b) => b.deployments - a.deployments)
    .slice(0, 6);

  return (
    <section
      id="playbooks"
      style={{
        background: 'var(--v2-bg)',
        paddingTop: 'var(--v2-section-py)',
        paddingBottom: 'var(--v2-section-py)',
        paddingLeft: 'var(--v2-container-px)',
        paddingRight: 'var(--v2-container-px)',
        borderTop: '1px solid var(--v2-border-subtle)',
      }}
    >
      <div style={{ maxWidth: 'var(--v2-container-max)', margin: '0 auto' }}>
        {/* Head */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 32,
            flexWrap: 'wrap',
            marginBottom: 56,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <h2
              style={{
                fontFamily: 'var(--font-title)',
                fontSize: 'clamp(32px, 5vw, 68px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                fontWeight: 700,
                color: 'var(--v2-text-primary)',
                margin: 0,
              }}
            >
              Repeatable engagement{' '}
              <em
                style={{
                  fontStyle: 'italic',
                  fontWeight: 500,
                  color: 'var(--v2-accent)',
                }}
              >
                models.
              </em>
            </h2>
          </div>
          <p
            style={{
              color: 'var(--v2-text-secondary)',
              fontSize: 15,
              lineHeight: 1.6,
              maxWidth: 380,
              margin: 0,
            }}
          >
            Fixed scope. Fixed outcome. A senior engineer assigned at kickoff.
            Each playbook has been delivered enough times that the risks are
            known before work starts.
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          {cards.map((pb, i) => (
            <PlaybookCard
              key={pb.id}
              tag={`PB-${String(i + 1).padStart(2, '0')} · ${PB_TAGS[pb.category] ?? pb.category.toUpperCase()}`}
              title={pb.displayTitle}
              desc={pb.challengePattern[0] ?? pb.keyLearnings[0] ?? ''}
              outcomeValue={pb.outcomes[0]?.metric}
              outcomeLabel={pb.outcomes[0]?.description}
              deployments={pb.deployments}
              slug={pb.slug}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlaybookCard({
  tag,
  title,
  desc,
  outcomeValue,
  outcomeLabel,
  deployments,
  slug,
}: {
  tag: string;
  title: string;
  desc: string;
  /** Lead outcome metric from the playbook, e.g. "$9.2M" or "64%". */
  outcomeValue?: string;
  /** Label for the outcome, e.g. "Year-one savings". */
  outcomeLabel?: string;
  /** Deployment count shown in the footer. */
  deployments: number;
  slug: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={ref}
      href={`/playbooks/${slug}`}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }}
      className="v2-pb-card"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--v2-surface-1)',
        border: '1px solid var(--v2-border-strong)',
        borderRadius: 6,
        padding: 26,
        minHeight: 340,
        color: 'var(--v2-text-primary)',
        textDecoration: 'none',
        overflow: 'hidden',
        transition: 'border-color 300ms var(--v2-ease)',
      }}
    >
      {/* cursor-tracking lime spotlight */}
      <span
        aria-hidden
        className="v2-pb-spotlight"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(320px 220px at var(--mx, 50%) var(--my, 50%), rgba(198, 255, 61, 0.12), transparent 70%)',
          opacity: 0,
          transition: 'opacity 300ms var(--v2-ease)',
          pointerEvents: 'none',
        }}
      />

      <style>{`
        .v2-pb-card:hover { border-color: var(--v2-border-hot); }
        .v2-pb-card:hover .v2-pb-spotlight { opacity: 1; }
        .v2-pb-card:hover .v2-pb-arrow {
          transform: rotate(-45deg);
          background: var(--v2-accent);
          border-color: var(--v2-accent);
          color: var(--v2-text-inverted);
        }
      `}</style>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--v2-text-muted)',
          marginBottom: 16,
          position: 'relative',
        }}
      >
        / {tag}
      </div>
      <h3
        style={{
          fontFamily: 'var(--font-title)',
          fontSize: 20,
          fontWeight: 600,
          lineHeight: 1.25,
          letterSpacing: '-0.015em',
          margin: 0,
          color: 'var(--v2-text-primary)',
          position: 'relative',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 13,
          lineHeight: 1.55,
          color: 'var(--v2-text-secondary)',
          marginTop: 12,
          marginBottom: 18,
          flex: 1,
          position: 'relative',
        }}
      >
        {desc}
      </p>

      {/* Lead business outcome — the impactful number from the
          playbook's own outcomes[]. Lime accent bar on the left
          echoes the case-study impact tiles. */}
      {outcomeValue && outcomeLabel && (
        <div
          style={{
            position: 'relative',
            borderLeft: '2px solid var(--v2-accent)',
            paddingLeft: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-title)',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: 'var(--v2-text-primary)',
            }}
          >
            {outcomeValue}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--v2-text-muted)',
              marginTop: 6,
            }}
          >
            {outcomeLabel}
          </div>
        </div>
      )}

      <div
        style={{
          paddingTop: 14,
          borderTop: '1px dashed var(--v2-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: 'var(--v2-text-muted)',
          position: 'relative',
        }}
      >
        <span>
          <strong
            style={{
              color: 'var(--v2-text-primary)',
              fontFamily: 'var(--font-title)',
              fontWeight: 700,
              fontSize: 15,
            }}
          >
            {deployments}
          </strong>{' '}
          deployments
        </span>
        <span
          className="v2-pb-arrow"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            border: '1px solid var(--v2-border-strong)',
            background: 'transparent',
            color: 'var(--v2-text-secondary)',
            transition: 'all 300ms var(--v2-ease)',
          }}
        >
          <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

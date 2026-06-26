import s from './v3next.module.css';

/**
 * Flat, layered architecture diagram of ACI's data + AI platform, in the
 * style of an enterprise reference architecture but refined to our palette:
 * hairline cards, monochrome line icons, mono labels, clean connectors.
 * Server-rendered HTML/SVG, no JS; the flow ticks animate via CSS (disabled
 * under prefers-reduced-motion).
 */

type IconName =
  | 'plug' | 'pulse' | 'box' | 'layers' | 'catalog' | 'check' | 'grid'
  | 'target' | 'chip' | 'code' | 'window' | 'bolt' | 'shield' | 'eye' | 'branch';

const ICONS: Record<IconName, React.ReactNode> = {
  plug: <><path d="M9 2v5M15 2v5" /><rect x="7" y="7" width="10" height="6" rx="1.5" /><path d="M12 13v5a3 3 0 0 0 3 3h3" /></>,
  pulse: <path d="M2 12h4l2.5-7 4 14 2.5-7H22" />,
  box: <><path d="M3 7l9-4 9 4v10l-9 4-9-4z" /><path d="M3 7l9 4 9-4M12 11v10" /></>,
  layers: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5M3 16.5l9 5 9-5" opacity="0.55" /></>,
  catalog: <><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 7h8M8 11h8M8 15h5" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5 5-5.5" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></>,
  chip: <><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="9.5" y="9.5" width="5" height="5" rx="0.6" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
  code: <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" />,
  window: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 8h18M6.5 6.2h.01" /></>,
  bolt: <path d="M13 2L4 14h6l-1 8 9-12h-6z" />,
  shield: <><path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" /><path d="M9 12l2 2 4-4.5" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="2.6" /></>,
  branch: <><circle cx="6" cy="5" r="2.4" /><circle cx="6" cy="19" r="2.4" /><circle cx="18" cy="9" r="2.4" /><path d="M6 7.4v9.2M6 12h6a3 3 0 0 0 3-3V11" /></>,
};

function Icon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {ICONS[name]}
    </svg>
  );
}

type Card = { icon: IconName; title: string; sub: string };
type Group = { no: string; label: string; cards: Card[] };

const GROUPS: Group[] = [
  {
    no: '01',
    label: 'Sources & Ingestion',
    cards: [
      { icon: 'plug', title: 'Connectors', sub: 'ERP · CRM · SaaS' },
      { icon: 'pulse', title: 'Streaming & CDC', sub: 'real-time capture' },
      { icon: 'box', title: 'Batch & files', sub: 'scheduled loads' },
    ],
  },
  {
    no: '02',
    label: 'Governed Lakehouse',
    cards: [
      { icon: 'layers', title: 'Medallion', sub: 'bronze · silver · gold' },
      { icon: 'catalog', title: 'Catalog & lineage', sub: 'every column traced' },
      { icon: 'check', title: 'Data quality', sub: 'tested at the gate' },
    ],
  },
  {
    no: '03',
    label: 'AI & ML Platform',
    cards: [
      { icon: 'grid', title: 'Feature store', sub: 'reused, governed' },
      { icon: 'target', title: 'Train & evaluate', sub: 'offline and online' },
      { icon: 'chip', title: 'Registry · RAG · agents', sub: 'shipped, not piloted' },
    ],
  },
  {
    no: '04',
    label: 'Production',
    cards: [
      { icon: 'code', title: 'APIs & SDKs', sub: 'low-latency serving' },
      { icon: 'window', title: 'Copilots & apps', sub: 'in the workflow' },
      { icon: 'bolt', title: 'Real-time decisions', sub: 'live' },
    ],
  },
];

const CROSS: Card[] = [
  { icon: 'shield', title: 'Security & Trust', sub: 'SOC 2 · ISO 27001 · HIPAA' },
  { icon: 'eye', title: 'Observability & SRE', sub: 'monitored · on-call' },
  { icon: 'branch', title: 'MLOps & Governance', sub: 'CI/CD · policy · audit' },
];

function CardEl({ c }: { c: Card }) {
  return (
    <div className={s.archCard}>
      <span className={s.archIco}><Icon name={c.icon} /></span>
      <span className={s.archCardText}>
        <span className={s.archCardTitle}>{c.title}</span>
        <span className={s.archCardSub}>{c.sub}</span>
      </span>
    </div>
  );
}

export default function ArchDiagram({ className }: { className?: string }) {
  return (
    <div className={`${className ?? ''} ${s.arch}`}>
      <div className={s.archFlow}>
        {GROUPS.map((g, i) => (
          <div className={s.archGroupWrap} key={g.no}>
            <div className={s.archGroup}>
              <span className={s.archGroupLabel}>
                <span className={s.archGroupNo}>{g.no}</span>
                {g.label}
              </span>
              <div className={s.archCards}>
                {g.cards.map((c) => <CardEl key={c.title} c={c} />)}
              </div>
            </div>
            {i < GROUPS.length - 1 && (
              <span className={s.archArrow} aria-hidden>
                <span className={s.archArrowLine} />
                <span className={s.archArrowHead}>›</span>
              </span>
            )}
          </div>
        ))}
      </div>

      <div className={s.archPlatform}>
        <span className={s.archPlatformLabel}>Across every layer</span>
        <div className={s.archPlatformCards}>
          {CROSS.map((c) => <CardEl key={c.title} c={c} />)}
        </div>
      </div>
    </div>
  );
}

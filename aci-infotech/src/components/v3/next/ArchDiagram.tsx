import s from './v3next.module.css';

/**
 * Data-to-AI reference architecture as a connected left-to-right flow:
 * sources -> ingestion -> governed lakehouse (medallion) -> feature store ->
 * train & evaluate -> production, with a monitor/retrain feedback loop and a
 * platform foundation (security, observability, MLOps) underneath. Pure
 * server-rendered SVG; the flow line animates via CSS (off under reduced
 * motion). Arrowheads are inline polygons (no markers) for reliability.
 */

type IconName = 'plug' | 'pulse' | 'layers' | 'grid' | 'target' | 'bolt' | 'shield' | 'eye' | 'branch';

const ICONS: Record<IconName, React.ReactNode> = {
  plug: <><path d="M9 2v5M15 2v5" /><rect x="7" y="7" width="10" height="6" rx="1.5" /><path d="M12 13v5a3 3 0 0 0 3 3h3" /></>,
  pulse: <path d="M2 12h4l2.5-7 4 14 2.5-7H22" />,
  layers: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5M3 16.5l9 5 9-5" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /></>,
  bolt: <path d="M13 2L4 14h6l-1 8 9-12h-6z" />,
  shield: <><path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5z" /><path d="M9 12l2 2 4-4.5" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="2.6" /></>,
  branch: <><circle cx="6" cy="5" r="2.4" /><circle cx="6" cy="19" r="2.4" /><circle cx="18" cy="9" r="2.4" /><path d="M6 7.4v9.2M6 12h6a3 3 0 0 0 3-3V11" /></>,
};

const EDGE = '#16171a';
const LINE = '#d3d1c7';
const SUB = '#80848c';
const GRO = 'var(--font-grotesk), Inter, sans-serif';
const MONO = 'var(--font-jetbrains-mono), monospace';

const NW = 176;
const NH = 108;
const NY = 70;
const GAP = 38;
const X0 = 6;
const nx = (i: number) => X0 + i * (NW + GAP);

function Glyph({ name, x, y, size = 18 }: { name: IconName; x: number; y: number; size?: number }) {
  const sc = size / 24;
  return (
    <g transform={`translate(${x} ${y}) scale(${sc})`} fill="none" stroke={EDGE} strokeWidth={1.7 / sc} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </g>
  );
}

type Node = { no: string; icon: IconName; title: string; subs: string[]; medallion?: boolean };
const NODES: Node[] = [
  { no: '01', icon: 'plug', title: 'Sources', subs: ['ERP · CRM · SaaS', 'IoT · streams · files'] },
  { no: '02', icon: 'pulse', title: 'Ingestion', subs: ['streaming + CDC', 'batch & files'] },
  { no: '03', icon: 'layers', title: 'Governed Lakehouse', subs: ['catalog · lineage · quality'], medallion: true },
  { no: '04', icon: 'grid', title: 'Feature Store', subs: ['governed, reused', 'offline + online'] },
  { no: '05', icon: 'target', title: 'Train & Evaluate', subs: ['registry · RAG · agents', 'evaluated, not piloted'] },
  { no: '06', icon: 'bolt', title: 'Production', subs: ['APIs · copilots · apps', 'real-time decisions'] },
];

const FOUNDATION: { icon: IconName; label: string; sub: string }[] = [
  { icon: 'shield', label: 'Security & Trust', sub: 'SOC 2 · ISO 27001 · HIPAA' },
  { icon: 'eye', label: 'Observability & SRE', sub: 'monitored · on-call' },
  { icon: 'branch', label: 'MLOps & Governance', sub: 'CI/CD · policy · audit' },
];

export default function ArchDiagram({ className }: { className?: string }) {
  const cy = NY + NH / 2;
  const fy = NY + NH + 64;
  const fh = 68;
  const fw = nx(5) + NW - X0;

  return (
    <div className={`${className ?? ''} ${s.arch}`}>
      <svg
        viewBox={`-6 40 ${fw + 24} ${fy + fh - 30}`}
        width="100%"
        role="img"
        aria-label="Data to AI reference architecture: sources flow through ingestion into a governed lakehouse, then a feature store, training and evaluation, and into production, with a monitor and retrain feedback loop, all on a platform of security, observability and MLOps."
      >
        {/* risers: the platform underlies every stage */}
        <g stroke={LINE} strokeWidth={1} strokeDasharray="1 5">
          {NODES.map((_, i) => (
            <line key={i} x1={nx(i) + NW / 2} y1={NY + NH} x2={nx(i) + NW / 2} y2={fy} />
          ))}
        </g>

        {/* main flow connectors */}
        {NODES.slice(0, -1).map((_, i) => {
          const x1 = nx(i) + NW + 3;
          const x2 = nx(i + 1) - 3;
          return (
            <g key={i}>
              <line x1={x1} y1={cy} x2={x2 - 6} y2={cy} stroke={EDGE} strokeWidth={1.4} className={s.archFlow} />
              <polygon points={`${x2},${cy} ${x2 - 7},${cy - 4} ${x2 - 7},${cy + 4}`} fill={EDGE} />
            </g>
          );
        })}

        {/* feedback loop: production -> train & evaluate */}
        {(() => {
          const xA = nx(5) + NW / 2;
          const xB = nx(4) + NW / 2;
          const yb = NY + NH;
          const yd = NY + NH + 34;
          return (
            <g>
              <path d={`M ${xA} ${yb} C ${xA} ${yd}, ${xB} ${yd}, ${xB} ${yb + 6}`} fill="none" stroke={SUB} strokeWidth={1.2} strokeDasharray="4 4" />
              <polygon points={`${xB},${yb} ${xB - 4},${yb + 7} ${xB + 4},${yb + 7}`} fill={SUB} />
              <text x={(xA + xB) / 2} y={yd + 3} textAnchor="middle" fontFamily={MONO} fontSize={10} letterSpacing="0.08em" fill={SUB}>monitor · retrain</text>
            </g>
          );
        })()}

        {/* nodes */}
        {NODES.map((n, i) => {
          const x = nx(i);
          return (
            <g key={n.no}>
              <rect x={x} y={NY} width={NW} height={NH} rx={13} fill="#fff" stroke={LINE} strokeWidth={1} />
              <rect x={x + 13} y={NY + 13} width={30} height={30} rx={8} fill="#faf9f5" stroke={LINE} strokeWidth={1} />
              <Glyph name={n.icon} x={x + 19} y={NY + 19} />
              <text x={x + NW - 13} y={NY + 27} textAnchor="end" fontFamily={MONO} fontSize={10} letterSpacing="0.1em" fill={SUB}>/ {n.no}</text>
              <text x={x + 14} y={NY + 62} fontFamily={GRO} fontSize={14} fontWeight={600} letterSpacing="-0.01em" fill={EDGE}>{n.title}</text>
              {n.medallion ? (
                <g>
                  {['Bronze', 'Silver', 'Gold'].map((t, k) => {
                    const cw = (NW - 28 - 12) / 3;
                    const cxk = x + 14 + k * (cw + 6);
                    const cyt = NY + 74;
                    return (
                      <g key={t}>
                        <rect x={cxk} y={cyt} width={cw} height={20} rx={5} fill="#faf9f5" stroke={LINE} strokeWidth={1} />
                        <rect x={cxk} y={cyt} width={(cw * (k + 1)) / 3} height={20} rx={5} fill="#e7e4d9" />
                        <text x={cxk + cw / 2} y={cyt + 13.5} textAnchor="middle" fontFamily={MONO} fontSize={8.5} letterSpacing="0.02em" fill={EDGE}>{t}</text>
                        {k < 2 && <polygon points={`${cxk + cw + 4},${cyt + 10} ${cxk + cw + 0.5},${cyt + 7.5} ${cxk + cw + 0.5},${cyt + 12.5}`} fill={SUB} />}
                      </g>
                    );
                  })}
                  <text x={x + 14} y={NY + 104} fontFamily={MONO} fontSize={9.5} letterSpacing="0.02em" fill={SUB}>{n.subs[0]}</text>
                </g>
              ) : (
                n.subs.map((sline, k) => (
                  <text key={k} x={x + 14} y={NY + 80 + k * 15} fontFamily={MONO} fontSize={9.5} letterSpacing="0.02em" fill={SUB}>{sline}</text>
                ))
              )}
            </g>
          );
        })}

        {/* platform foundation band */}
        <rect x={X0} y={fy} width={fw} height={fh} rx={13} fill="#fbfaf6" stroke={LINE} strokeWidth={1} />
        <text x={X0 + 18} y={fy + 28} fontFamily={MONO} fontSize={10} letterSpacing="0.12em" fill={SUB}>PLATFORM</text>
        <text x={X0 + 18} y={fy + 44} fontFamily={MONO} fontSize={10} letterSpacing="0.12em" fill={SUB}>EVERY LAYER</text>
        {FOUNDATION.map((f, i) => {
          const colW = (fw - 150) / 3;
          const cxk = X0 + 132 + i * colW;
          return (
            <g key={f.label}>
              <rect x={cxk + 18} y={fy + 15} width={28} height={28} rx={7} fill="#fff" stroke={LINE} strokeWidth={1} />
              <Glyph name={f.icon} x={cxk + 23} y={fy + 20} size={18} />
              <text x={cxk + 56} y={fy + 30} fontFamily={GRO} fontSize={12.5} fontWeight={600} fill={EDGE}>{f.label}</text>
              <text x={cxk + 56} y={fy + 45} fontFamily={MONO} fontSize={9.5} letterSpacing="0.02em" fill={SUB}>{f.sub}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

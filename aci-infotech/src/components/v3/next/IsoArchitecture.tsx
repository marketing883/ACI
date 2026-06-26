import s from './v3next.module.css';

/**
 * Symbolic isometric architecture of ACI's enterprise data + AI stack:
 * sources -> ingestion -> governed lakehouse -> AI/ML platform -> production,
 * standing on cross-cutting bands (security, observability, MLOps). Pure
 * server-rendered SVG with computed isometric geometry; the data-flow is a
 * CSS-animated dashed stroke (disabled under prefers-reduced-motion). No JS.
 */

const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);
const U = 32;

// isometric projection: x = right-depth, z = left-depth, y = up
function pt(x: number, z: number, y = 0): [number, number] {
  return [(x - z) * COS * U, (x + z) * SIN * U - y * U];
}
function P(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

const EDGE = '#1b1c1f';
const TOP = '#fcfbf8';
const LEFTF = '#ebe9e0';
const RIGHTF = '#dedcd2';
const SUB = '#7c8088';

type B = { x: number; z: number; w: number; d: number; h: number; base?: number; pulse?: boolean; div?: number };

function Box({ x, z, w, d, h, base = 0, pulse, div = 0 }: B) {
  const y1 = base + h;
  const A = pt(x, z, y1);
  const Bp = pt(x + w, z, y1);
  const C = pt(x + w, z + d, y1);
  const D = pt(x, z + d, y1);
  const Bg = pt(x + w, z, base);
  const Cg = pt(x + w, z + d, base);
  const Dg = pt(x, z + d, base);
  const lines = [];
  for (let i = 1; i <= div; i++) {
    const yk = base + (h * i) / (div + 1);
    lines.push(
      <g key={i} stroke={EDGE} strokeWidth={0.6} opacity={0.22}>
        <line x1={pt(x + w, z, yk)[0]} y1={pt(x + w, z, yk)[1]} x2={pt(x + w, z + d, yk)[0]} y2={pt(x + w, z + d, yk)[1]} />
        <line x1={pt(x, z + d, yk)[0]} y1={pt(x, z + d, yk)[1]} x2={pt(x + w, z + d, yk)[0]} y2={pt(x + w, z + d, yk)[1]} />
      </g>,
    );
  }
  return (
    <g className={pulse ? s.isoPulse : undefined} stroke={EDGE} strokeWidth={1} strokeLinejoin="round">
      <polygon points={P([D, C, Cg, Dg])} fill={LEFTF} />
      <polygon points={P([Bp, C, Cg, Bg])} fill={RIGHTF} />
      <polygon points={P([A, Bp, C, D])} fill={TOP} />
      {lines}
    </g>
  );
}

const SOURCES: B[] = [
  { x: 0.6, z: 11.8, w: 1.5, d: 1.5, h: 0.85 },
  { x: 2.2, z: 12.0, w: 1.5, d: 1.5, h: 0.85 },
  { x: 1.4, z: 13.4, w: 1.5, d: 1.5, h: 0.85 },
];
const LAKE: B[] = [
  { x: 5.3, z: 5.3, w: 3.6, d: 3.6, h: 0.45 },
  { x: 5.65, z: 5.65, w: 2.9, d: 2.9, h: 0.62, base: 0.45 },
  { x: 6.0, z: 6.0, w: 2.2, d: 2.2, h: 0.62, base: 1.07 },
  { x: 6.4, z: 6.4, w: 1.4, d: 1.4, h: 0.62, base: 1.69, pulse: true },
];
const AI: B[] = [
  { x: 9.8, z: 1.8, w: 2.6, d: 2.6, h: 0.4 },
  { x: 10.15, z: 2.15, w: 1.9, d: 1.9, h: 2.5, base: 0.4, div: 3 },
  { x: 10.6, z: 2.6, w: 1.0, d: 1.0, h: 0.7, base: 2.9, pulse: true },
];
const PROD: B[] = [
  { x: 13.0, z: -0.9, w: 1.4, d: 1.4, h: 0.85 },
  { x: 14.4, z: -0.4, w: 1.4, d: 1.4, h: 0.85 },
  { x: 13.5, z: 0.6, w: 1.4, d: 1.4, h: 0.85 },
];

// labels: lx = label centre (screen x); topY = approx top of the cluster (screen y)
const LABELS = [
  { lx: -262, topY: pt(1.8, 12.8, 0.85)[1], head: '01 / SOURCES', items: ['ERP · CRM', 'IoT · streams', 'SaaS · files'] },
  { lx: 0, topY: pt(7.1, 7.1, 2.31)[1], head: '02 / GOVERNED LAKEHOUSE', items: ['bronze · silver · gold', 'catalog · lineage · DQ'] },
  { lx: 214, topY: pt(11.1, 3.1, 3.6)[1], head: '03 / AI & ML PLATFORM', items: ['feature store · training', 'eval · registry · RAG · agents'] },
  { lx: 430, topY: pt(13.9, -0.1, 0.85)[1], head: '04 / PRODUCTION', items: ['APIs · copilots', 'apps · decisions'] },
];

function softShadow(cx: number, cz: number, rw: number) {
  const [sx, sy] = pt(cx, cz, 0);
  return <ellipse cx={sx} cy={sy} rx={rw} ry={rw * 0.42} fill="#16171a" opacity={0.07} filter="url(#isoBlur)" />;
}

export default function IsoArchitecture({ className }: { className?: string }) {
  const conduit = `M ${pt(2.6, 12).join(' ')} L ${pt(5.4, 8).join(' ')} L ${pt(8.9, 5.5).join(' ')} L ${pt(11, 3.3).join(' ')} L ${pt(13.2, 0.7).join(' ')}`;

  return (
    <div className={className}>
      <svg
        viewBox="-430 40 910 322"
        width="100%"
        height="100%"
        role="img"
        aria-label="Isometric architecture: data sources flow through ingestion into a governed lakehouse, up into the AI and ML platform, then out to production, all on a base of security, observability and MLOps."
      >
        <defs>
          <filter id="isoBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        {/* soft grounding shadows */}
        {softShadow(2.4, 12.8, 120)}
        {softShadow(7.1, 7.1, 150)}
        {softShadow(11.1, 3.1, 110)}
        {softShadow(14.0, -0.1, 110)}

        {/* conduits + animated flow */}
        <path d={conduit} fill="none" stroke={EDGE} strokeWidth={1.2} opacity={0.18} />
        <path className={s.isoFlow} d={conduit} fill="none" stroke={EDGE} strokeWidth={1.5} />

        {/* structures */}
        {SOURCES.map((b, i) => <Box key={`s${i}`} {...b} />)}
        {LAKE.map((b, i) => <Box key={`l${i}`} {...b} />)}
        {AI.map((b, i) => <Box key={`a${i}`} {...b} />)}
        {PROD.map((b, i) => <Box key={`p${i}`} {...b} />)}

        {/* labels, hugging each cluster (staggered to the skyline) */}
        {LABELS.map((l) => {
          const headY = l.topY - 22 - l.items.length * 16;
          return (
            <text
              key={l.head}
              x={l.lx}
              y={headY}
              textAnchor="middle"
              fontFamily="var(--font-jetbrains-mono), monospace"
              fontSize={12}
              letterSpacing="0.06em"
              fill={EDGE}
            >
              <tspan x={l.lx} fontWeight={600}>{l.head}</tspan>
              {l.items.map((it) => (
                <tspan key={it} x={l.lx} dy={16} fill={SUB} fontSize={11.5}>{it}</tspan>
              ))}
            </text>
          );
        })}

        {/* live tick at production */}
        {(() => {
          const [lx, ly] = pt(14.4, -0.4, 0.85);
          return (
            <g>
              <circle className={s.isoLive} cx={lx + 30} cy={ly + 2} r={3.2} fill={EDGE} />
              <text x={lx + 40} y={ly + 6} fontFamily="var(--font-jetbrains-mono), monospace" fontSize={11} letterSpacing="0.14em" fill={SUB}>LIVE</text>
            </g>
          );
        })()}

        {/* cross-cutting bands, below */}
        <g fontFamily="var(--font-jetbrains-mono), monospace" fontSize={11} letterSpacing="0.16em" fill="#a4a8af">
          <line x1={-410} y1={306} x2={450} y2={306} stroke={EDGE} strokeWidth={1} strokeDasharray="1 7" opacity={0.35} />
          <text x={-410} y={330}>SECURITY &amp; TRUST</text>
          <text x={19} y={330} textAnchor="middle">OBSERVABILITY &amp; SRE</text>
          <text x={450} y={330} textAnchor="end">MLOPS &amp; GOVERNANCE</text>
        </g>
      </svg>
    </div>
  );
}

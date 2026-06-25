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
const U = 30; // grid unit in svg px

// Isometric projection. x = right-depth axis, z = left-depth axis, y = up.
function pt(x: number, z: number, y = 0): [number, number] {
  return [(x - z) * COS * U, (x + z) * SIN * U - y * U];
}
function P(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

const INK = '#16171a';
const TOP = '#edebe2';
const LEFTF = '#dcdad0';
const RIGHTF = '#cdcabf';

type B = { x: number; z: number; w: number; d: number; h: number; base?: number; pulse?: boolean };

function Box({ x, z, w, d, h, base = 0, pulse }: B) {
  const y1 = base + h;
  const A = pt(x, z, y1);
  const Bp = pt(x + w, z, y1);
  const C = pt(x + w, z + d, y1);
  const D = pt(x, z + d, y1);
  const Bg = pt(x + w, z, base);
  const Cg = pt(x + w, z + d, base);
  const Dg = pt(x, z + d, base);
  return (
    <g className={pulse ? s.isoPulse : undefined} stroke={INK} strokeWidth={1} strokeLinejoin="round">
      <polygon points={P([D, C, Cg, Dg])} fill={LEFTF} />
      <polygon points={P([Bp, C, Cg, Bg])} fill={RIGHTF} />
      <polygon points={P([A, Bp, C, D])} fill={TOP} />
    </g>
  );
}

// flat ground shadow under a footprint
function Shadow({ x, z, w, d }: { x: number; z: number; w: number; d: number }) {
  return (
    <polygon
      points={P([pt(x, z), pt(x + w, z), pt(x + w, z + d), pt(x, z + d)])}
      fill={INK}
      opacity={0.05}
    />
  );
}

const SOURCES: B[] = [
  { x: 0.4, z: 11.6, w: 1.5, d: 1.5, h: 0.7 },
  { x: 2.1, z: 12.5, w: 1.4, d: 1.4, h: 1.1 },
  { x: 0.9, z: 13.7, w: 1.6, d: 1.3, h: 0.5 },
];
const LAKE: B[] = [
  { x: 5.4, z: 5.4, w: 3.4, d: 3.4, h: 0.5 },
  { x: 5.7, z: 5.7, w: 2.8, d: 2.8, h: 0.7, base: 0.5 },
  { x: 6.0, z: 6.0, w: 2.2, d: 2.2, h: 0.7, base: 1.2 },
  { x: 6.3, z: 6.3, w: 1.6, d: 1.6, h: 0.7, base: 1.9, pulse: true },
];
const AI: B[] = [
  { x: 9.9, z: 1.9, w: 2.4, d: 2.4, h: 0.6 },
  { x: 10.2, z: 2.2, w: 1.8, d: 1.8, h: 2.8, base: 0.6, pulse: true },
];
const PROD: B[] = [
  { x: 13.2, z: -1.1, w: 1.4, d: 1.4, h: 1.2 },
  { x: 14.5, z: 0.2, w: 1.2, d: 1.2, h: 0.8 },
  { x: 13.1, z: 0.5, w: 1.3, d: 1.3, h: 0.5 },
];

// labels: lx = explicit screen-x (kept clear of neighbours); cx/cz/ty = leader target (structure top)
const LABELS = [
  { lx: -281, cx: 1.6, cz: 12.4, ty: 1.1, head: '01 / SOURCES', items: ['ERP · CRM', 'IoT · streams', 'SaaS · files'] },
  { lx: 0, cx: 7.0, cz: 7.0, ty: 2.6, head: '02 / GOVERNED LAKEHOUSE', items: ['bronze · silver · gold', 'catalog · lineage · DQ'] },
  { lx: 206, cx: 11.1, cz: 3.1, ty: 3.4, head: '03 / AI & ML PLATFORM', items: ['feature store', 'training · eval', 'registry · RAG', 'agents'] },
  { lx: 406, cx: 14.3, cz: -0.3, ty: 1.2, head: '04 / PRODUCTION', items: ['APIs · copilots', 'apps · decisions'] },
];
const LABEL_Y = -118;

export default function IsoArchitecture({ className }: { className?: string }) {
  const conduit = `M ${pt(3, 12).join(' ')} L ${pt(5.6, 8).join(' ')} L ${pt(8.8, 5.6).join(' ')} L ${pt(11, 3.3).join(' ')} L ${pt(13.4, 0.6).join(' ')}`;
  const riser = `M ${pt(11, 3.3, 0).join(' ')} L ${pt(11, 3.3, 3).join(' ')}`;

  return (
    <div className={className}>
      <svg
        viewBox="-420 -150 880 470"
        width="100%"
        height="100%"
        role="img"
        aria-label="Isometric architecture: data sources flow through ingestion into a governed lakehouse, up into the AI and ML platform, then out to production, all on a base of security, observability and MLOps."
      >
        {/* shadows */}
        {[...SOURCES, ...LAKE.slice(0, 1), ...AI.slice(0, 1), ...PROD].map((b, i) => (
          <Shadow key={`sh${i}`} x={b.x} z={b.z} w={b.w} d={b.d} />
        ))}

        {/* conduits + animated flow */}
        <path d={conduit} fill="none" stroke={INK} strokeWidth={1.4} opacity={0.22} />
        <path className={s.isoFlow} d={conduit} fill="none" stroke={INK} strokeWidth={1.7} />
        <path d={riser} fill="none" stroke={INK} strokeWidth={1.4} opacity={0.22} />
        <path className={s.isoFlow} d={riser} fill="none" stroke={INK} strokeWidth={1.7} />

        {/* structures */}
        {SOURCES.map((b, i) => <Box key={`s${i}`} {...b} />)}
        {LAKE.map((b, i) => <Box key={`l${i}`} {...b} />)}
        {AI.map((b, i) => <Box key={`a${i}`} {...b} />)}
        {PROD.map((b, i) => <Box key={`p${i}`} {...b} />)}

        {/* leader lines + labels */}
        {LABELS.map((l) => {
          const lx = l.lx;
          const [tx, ty] = pt(l.cx, l.cz, l.ty);
          const labelBottom = LABEL_Y + 20 + l.items.length * 16;
          return (
            <g key={l.head}>
              <line x1={lx} y1={labelBottom} x2={tx} y2={ty - 6} stroke={INK} strokeWidth={1} opacity={0.28} strokeDasharray="1 4" />
              <circle cx={lx} cy={labelBottom} r={1.8} fill={INK} />
              <text
                x={lx}
                y={LABEL_Y}
                textAnchor="middle"
                fontFamily="var(--font-jetbrains-mono), monospace"
                fontSize={12}
                letterSpacing="0.06em"
                fill={INK}
              >
                <tspan x={lx} fontWeight={600}>{l.head}</tspan>
                {l.items.map((it) => (
                  <tspan key={it} x={lx} dy={16} fill="#6b6f76" fontSize={11.5}>{it}</tspan>
                ))}
              </text>
            </g>
          );
        })}

        {/* live tick near production */}
        {(() => {
          const [lx, ly] = pt(14.5, 0.2, 1.0);
          return (
            <g>
              <circle className={s.isoLive} cx={lx + 30} cy={ly} r={3.2} fill={INK} />
              <text x={lx + 40} y={ly + 4} fontFamily="var(--font-jetbrains-mono), monospace" fontSize={11} letterSpacing="0.14em" fill="#6b6f76">LIVE</text>
            </g>
          );
        })()}

        {/* cross-cutting bands, below the structures */}
        <g fontFamily="var(--font-jetbrains-mono), monospace" fontSize={11} letterSpacing="0.14em" fill="#9a9ea6">
          <line x1={-400} y1={268} x2={440} y2={268} stroke={INK} strokeWidth={1} strokeDasharray="1 6" opacity={0.4} />
          <text x={-400} y={292}>SECURITY &amp; TRUST</text>
          <text x={20} y={292} textAnchor="middle">OBSERVABILITY &amp; SRE</text>
          <text x={440} y={292} textAnchor="end">MLOPS &amp; GOVERNANCE</text>
        </g>
      </svg>
    </div>
  );
}

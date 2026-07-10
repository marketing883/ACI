'use client';

/**
 * Intricate hero pipeline: a live architecture diagram rendered as pure
 * SVG so it stays crisp at any size. Source systems converge into an
 * ingestion gateway, land in a governed lakehouse (bronze/silver/gold),
 * feed a feature store, drive models in production, and exit as
 * decisions. Data "packets" (lime + royal dots) stream along every wire
 * via SMIL animateMotion with staggered begins and varied durations, so
 * the flow reads as continuous and organic rather than a single marching
 * dash. Pulsing status dots and a slow scan line add life. Under
 * prefers-reduced-motion the packets and pulses are dropped and the
 * diagram renders static but complete.
 */

import { useReducedMotion } from 'framer-motion';

const MONO = 'var(--font-jetbrains-mono), monospace';
const ROYAL = '#3b63ff';
const LIME = '#c6ff3d';
const INK_CARD = '#0f1730';
const STROKE = 'rgba(120,150,255,0.28)';
const LABEL = '#aab6d8';
const LABEL_DIM = '#6b789e';

// horizontal-biased cubic between two points
function wire(x1: number, y1: number, x2: number, y2: number) {
  const dx = Math.max(40, (x2 - x1) * 0.5);
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}

const SOURCES = [
  { label: 'SAP / ERP', y: 70 },
  { label: 'SALESFORCE', y: 150 },
  { label: 'IOT / OT', y: 230 },
  { label: 'FILES / APIS', y: 310 },
  { label: 'KAFKA STREAMS', y: 390 },
];

const MODELS = [
  { label: 'FORECASTING', y: 192 },
  { label: 'GENAI COPILOTS', y: 254 },
  { label: 'VISION / OCR', y: 316 },
];

// Anchor geometry
const SRC_RIGHT = 196;
const ING_X = 262;
const ING_TOP = 150;
const ING_BOT = 380;
const LAKE_L = 372;
const LAKE_R = 604;
const MID_Y = 266;
const FEAT_L = 652;
const FEAT_R = 760;
const AI_L = 812;
const AI_R = 1000;
const OUT_L = 1052;

// Build the wire set with ids
const WIRES: { id: string; d: string }[] = [
  ...SOURCES.map((s, i) => ({ id: `s${i}`, d: wire(SRC_RIGHT, s.y + 24, ING_X, MID_Y) })),
  { id: 'ing', d: wire(ING_X + 60, MID_Y, LAKE_L, MID_Y) },
  { id: 'lf', d: wire(LAKE_R, MID_Y, FEAT_L, MID_Y) },
  ...MODELS.map((m, i) => ({ id: `fm${i}`, d: wire(FEAT_R, MID_Y, AI_L, m.y + 22) })),
  ...MODELS.map((m, i) => ({ id: `mo${i}`, d: wire(AI_R, m.y + 22, OUT_L, MID_Y) })),
];

function Packet({ wireId, delay, dur, color, r = 2.4 }: { wireId: string; delay: number; dur: number; color: string; r?: number }) {
  return (
    <circle r={r} fill={color} filter="url(#v4glow)">
      <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.4 0 0.2 1">
        <mpath href={`#${wireId}`} />
      </animateMotion>
      <animate attributeName="opacity" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.1;0.85;1" />
    </circle>
  );
}

export default function HeroPipeline({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg viewBox="0 0 1180 470" className={className} role="img" aria-label="Live architecture: source systems flow into a governed lakehouse, feed a feature store and models in production, and exit as decisions.">
      <defs>
        <linearGradient id="v4wire" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={ROYAL} stopOpacity="0.15" />
          <stop offset="0.5" stopColor={ROYAL} stopOpacity="0.5" />
          <stop offset="1" stopColor={LIME} stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id="v4core" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor={ROYAL} stopOpacity="0.55" />
          <stop offset="1" stopColor={ROYAL} stopOpacity="0" />
        </radialGradient>
        <filter id="v4glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="v4dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="1.2" fill="rgba(120,150,255,0.10)" />
        </pattern>
      </defs>

      {/* faint dotted backdrop + core glow */}
      <rect x="0" y="0" width="1180" height="470" fill="url(#v4dots)" />
      <ellipse cx={(LAKE_L + LAKE_R) / 2} cy={MID_Y} rx="220" ry="150" fill="url(#v4core)" />

      {/* wires (base) */}
      {WIRES.map((w) => (
        <path key={w.id} id={w.id} d={w.d} fill="none" stroke="url(#v4wire)" strokeWidth="1.6" />
      ))}

      {/* streaming packets */}
      {!reduce &&
        WIRES.flatMap((w, wi) =>
          [0, 1, 2].map((k) => (
            <Packet
              key={`${w.id}-${k}`}
              wireId={w.id}
              delay={(wi * 0.19 + k * 0.9) % 2.6}
              dur={2 + ((wi * 7 + k * 5) % 12) / 10}
              color={k === 1 ? ROYAL : LIME}
              r={k === 1 ? 2 : 2.6}
            />
          ))
        )}
      {/* static dots for reduced-motion */}
      {reduce && WIRES.map((w) => <circle key={`d-${w.id}`} r="2.4" fill={LIME}><animateMotion /></circle>)}

      {/* slow scan sweep */}
      {!reduce && (
        <rect x="0" y="0" width="2" height="470" fill={LIME} opacity="0.10">
          <animate attributeName="x" values="120;1080;120" dur="9s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.5;1" keySplines="0.4 0 0.2 1;0.4 0 0.2 1" />
        </rect>
      )}

      {/* ---- Source pills ---- */}
      {SOURCES.map((s) => (
        <g key={s.label}>
          <rect x="24" y={s.y} width="172" height="48" rx="10" fill={INK_CARD} stroke={STROKE} />
          <circle cx="42" cy={s.y + 24} r="3.4" fill={LIME}>
            {!reduce && <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" />}
          </circle>
          <text x="58" y={s.y + 29} fontFamily={MONO} fontSize="12" fill={LABEL} letterSpacing="0.5">{s.label}</text>
        </g>
      ))}
      <text x="24" y="446" fontFamily={MONO} fontSize="10.5" fill={LABEL_DIM} letterSpacing="1.4">47 SOURCE SYSTEMS</text>

      {/* ---- Ingestion gateway ---- */}
      <g>
        <rect x={ING_X} y={ING_TOP} width="60" height={ING_BOT - ING_TOP} rx="12" fill={INK_CARD} stroke={STROKE} />
        <text x={ING_X + 30} y={MID_Y - 6} fontFamily={MONO} fontSize="11" fill={LABEL} textAnchor="middle" transform={`rotate(-90 ${ING_X + 30} ${MID_Y})`}>INGEST + CDC</text>
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={ING_X + 14} y={ING_TOP + 22 + i * 48} width="32" height="6" rx="3" fill={ROYAL} opacity="0.6" />
        ))}
      </g>

      {/* ---- Governed lakehouse ---- */}
      <g>
        <rect x={LAKE_L} y="168" width={LAKE_R - LAKE_L} height="196" rx="16" fill="rgba(16,24,52,0.9)" stroke={STROKE} />
        <text x={(LAKE_L + LAKE_R) / 2} y="192" fontFamily={MONO} fontSize="12.5" fill="#fff" textAnchor="middle" letterSpacing="1">GOVERNED LAKEHOUSE</text>
        {[
          ['GOLD', '#c6ff3d', 210],
          ['SILVER', '#9fb4dd', 250],
          ['BRONZE', '#c08a5a', 290],
        ].map(([lbl, col, y]) => (
          <g key={lbl as string}>
            <rect x={LAKE_L + 20} y={y as number} width={LAKE_R - LAKE_L - 40} height="30" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
            <circle cx={LAKE_L + 36} cy={(y as number) + 15} r="4" fill={col as string} />
            <text x={LAKE_L + 50} y={(y as number) + 19} fontFamily={MONO} fontSize="11" fill={LABEL}>{lbl as string}</text>
          </g>
        ))}
        <text x={(LAKE_L + LAKE_R) / 2} y="350" fontFamily={MONO} fontSize="9.5" fill={LABEL_DIM} textAnchor="middle" letterSpacing="1.5">LINEAGE · QUALITY · ACCESS</text>
      </g>

      {/* ---- Feature store ---- */}
      <g>
        <rect x={FEAT_L} y="238" width={FEAT_R - FEAT_L} height="56" rx="12" fill={INK_CARD} stroke={STROKE} />
        <text x={(FEAT_L + FEAT_R) / 2} y="264" fontFamily={MONO} fontSize="10.5" fill={LABEL} textAnchor="middle">FEATURE</text>
        <text x={(FEAT_L + FEAT_R) / 2} y="279" fontFamily={MONO} fontSize="10.5" fill={LABEL} textAnchor="middle">STORE</text>
      </g>

      {/* ---- AI in production ---- */}
      <g>
        <rect x={AI_L} y="150" width={AI_R - AI_L} height="246" rx="16" fill="rgba(16,24,52,0.9)" stroke={STROKE} />
        <text x={(AI_L + AI_R) / 2} y="176" fontFamily={MONO} fontSize="12" fill="#fff" textAnchor="middle" letterSpacing="1">AI IN PRODUCTION</text>
        {MODELS.map((m) => (
          <g key={m.label}>
            <rect x={AI_L + 22} y={m.y} width={AI_R - AI_L - 44} height="44" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.09)" />
            <circle cx={AI_L + 40} cy={m.y + 22} r="3.6" fill={LIME}>
              {!reduce && <animate attributeName="opacity" values="0.35;1;0.35" dur="1.8s" repeatCount="indefinite" />}
            </circle>
            <text x={AI_L + 54} y={m.y + 26} fontFamily={MONO} fontSize="11" fill={LABEL}>{m.label}</text>
          </g>
        ))}
        <text x={(AI_L + AI_R) / 2} y="380" fontFamily={MONO} fontSize="9.5" fill={LABEL_DIM} textAnchor="middle" letterSpacing="1.4">SLA 99.9 · MONITORED · 24/7</text>
      </g>

      {/* ---- Outcome ---- */}
      <g>
        {!reduce && (
          <circle cx={OUT_L + 54} cy={MID_Y} r="30" fill="none" stroke={LIME} strokeOpacity="0.5">
            <animate attributeName="r" values="26;40;26" dur="2.6s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="2.6s" repeatCount="indefinite" />
          </circle>
        )}
        <rect x={OUT_L} y={MID_Y - 34} width="108" height="68" rx="14" fill={ROYAL} />
        <text x={OUT_L + 54} y={MID_Y - 2} fontFamily={MONO} fontSize="12" fill="#fff" textAnchor="middle" letterSpacing="0.5">DECISIONS</text>
        <text x={OUT_L + 54} y={MID_Y + 16} fontFamily={MONO} fontSize="9" fill="rgba(255,255,255,0.75)" textAnchor="middle" letterSpacing="1">AT 2AM TOO</text>
      </g>
    </svg>
  );
}

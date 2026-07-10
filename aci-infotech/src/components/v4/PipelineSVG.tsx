'use client';

/**
 * Signature hero graphic: ACI's thesis as a live diagram. Source
 * systems on the left feed a lakehouse core, AI models sit on top of
 * it, decisions come out the right side. Royal hairline paths carry
 * lime pulses (CSS-animated, see v4.css) so the whole thing reads as a
 * system that is running, not a picture of one.
 */

const MONO = 'var(--font-jetbrains-mono), monospace';

function Node({
  x,
  y,
  w,
  h,
  label,
  sub,
  strong = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  strong?: boolean;
}) {
  return (
    <g className="v4-node">
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        fill={strong ? 'var(--v4-royal)' : '#ffffff'}
        stroke={strong ? 'var(--v4-royal)' : 'var(--v4-mist)'}
        strokeWidth={1.2}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 4 : y + h / 2 + 4}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={11.5}
        fontWeight={500}
        letterSpacing={0.5}
        fill={strong ? '#ffffff' : 'var(--v4-ink)'}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 13}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={9}
          letterSpacing={0.8}
          fill={strong ? 'rgba(255,255,255,0.72)' : 'var(--v4-muted)'}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

export default function PipelineSVG({ className }: { className?: string }) {
  // Wire paths: sources -> lakehouse -> models -> outcomes
  const wires = [
    'M150 70 H210 Q230 70 240 90 L252 128 Q260 148 282 148 H330',
    'M150 148 H330',
    'M150 226 H210 Q230 226 240 206 L252 168 Q260 148 282 148 H330',
    'M560 148 H660',
    'M890 148 H990',
  ];
  return (
    <svg
      viewBox="0 0 1140 296"
      className={className}
      role="img"
      aria-label="Diagram: source systems flow into a governed lakehouse, AI models run on top, and decisions come out the other side."
    >
      {/* wires */}
      {wires.map((d, i) => (
        <path key={`w-${i}`} d={d} fill="none" stroke="var(--v4-mist)" strokeWidth={1.4} />
      ))}
      {/* travelling lime pulses, staggered */}
      {wires.map((d, i) => (
        <path
          key={`p-${i}`}
          d={d}
          fill="none"
          className="v4-pulse"
          stroke="var(--v4-lime)"
          strokeWidth={2.4}
          strokeLinecap="round"
          style={{ animationDelay: `${i * 0.55}s` }}
        />
      ))}

      {/* left column: the mess we start from */}
      <Node x={20} y={44} w={130} h={52} label="ERP / SAP" sub="47 SYSTEMS" />
      <Node x={20} y={122} w={130} h={52} label="CRM + CDP" sub="EVENTS" />
      <Node x={20} y={200} w={130} h={52} label="OT / IOT" sub="TELEMETRY" />

      {/* core */}
      <Node x={330} y={108} w={230} h={80} label="GOVERNED LAKEHOUSE" sub="LINEAGE / QUALITY / ACCESS" strong />

      {/* models */}
      <Node x={660} y={108} w={230} h={80} label="AI IN PRODUCTION" sub="SLAS / MONITORING / 24-7" />

      {/* outcome */}
      <Node x={990} y={116} w={130} h={64} label="DECISIONS" sub="AT 2AM TOO" />

      {/* rotated decorative tick, the template's 44-degree mark */}
      <rect className="v4-tilt" x={600} y={30} width={14} height={14} fill="var(--v4-royal)" />
    </svg>
  );
}

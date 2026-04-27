/**
 * Shared diagram primitives. Keeps per-diagram bundles small and keeps
 * the brand palette coordinated across every SVG.
 */
import type { ReactNode, SVGProps } from 'react';

export const BRAND = {
  primary: '#0052CC',
  primaryDark: '#003D99',
  primaryLight: '#3B6FD4',
  secondary: '#0A1628',
  lime: '#C4FF61',
  gray100: '#F3F4F6',
  gray300: '#D1D5DB',
  gray500: '#6B7280',
  gray700: '#374151',
  white: '#FFFFFF',
} as const;

export interface NodeProps {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  tone?: 'primary' | 'dark' | 'light' | 'lime' | 'gray';
  highlighted?: boolean;
  id?: string;
}

export function Node({
  x,
  y,
  w = 140,
  h = 60,
  label,
  sub,
  tone = 'primary',
  highlighted,
  id,
}: NodeProps) {
  const palette = {
    primary: { fill: BRAND.primary, text: BRAND.white, stroke: BRAND.primaryDark },
    dark: { fill: BRAND.secondary, text: BRAND.white, stroke: BRAND.secondary },
    light: { fill: BRAND.white, text: BRAND.secondary, stroke: BRAND.gray300 },
    lime: { fill: BRAND.lime, text: BRAND.secondary, stroke: BRAND.primaryDark },
    gray: { fill: BRAND.gray100, text: BRAND.gray700, stroke: BRAND.gray300 },
  }[tone];
  return (
    <g data-node-id={id} data-highlighted={highlighted ? 'true' : undefined}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        ry={10}
        fill={palette.fill}
        stroke={highlighted ? BRAND.lime : palette.stroke}
        strokeWidth={highlighted ? 3 : 1.5}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 4 : y + h / 2 + 5}
        textAnchor="middle"
        fontFamily="Funnel Sans, system-ui, sans-serif"
        fontSize={14}
        fontWeight={600}
        fill={palette.text}
      >
        {label}
      </text>
      {sub ? (
        <text
          x={x + w / 2}
          y={y + h / 2 + 14}
          textAnchor="middle"
          fontFamily="Funnel Sans, system-ui, sans-serif"
          fontSize={11}
          fontWeight={400}
          fill={palette.text}
          opacity={0.85}
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
}

interface EdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
  label?: string;
}

export function Edge({ x1, y1, x2, y2, dashed, label }: EdgeProps) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={BRAND.gray500}
        strokeWidth={1.5}
        strokeDasharray={dashed ? '4 4' : undefined}
        markerEnd="url(#atheros-arrow)"
      />
      {label ? (
        <text
          x={mx}
          y={my - 6}
          textAnchor="middle"
          fontFamily="Funnel Sans, system-ui, sans-serif"
          fontSize={11}
          fill={BRAND.gray700}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function DiagramSurface({
  viewBox,
  title,
  description,
  children,
  className,
  ...rest
}: {
  viewBox: string;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
} & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={viewBox}
      role="img"
      aria-labelledby="atheros-diagram-title atheros-diagram-desc"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <title id="atheros-diagram-title">{title}</title>
      <desc id="atheros-diagram-desc">{description}</desc>
      <defs>
        <marker
          id="atheros-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={BRAND.gray500} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

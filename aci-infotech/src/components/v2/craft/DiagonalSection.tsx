'use client';

import { ReactNode } from 'react';

interface DiagonalSectionProps {
  children: ReactNode;
  className?: string;
  angleTop?: number;
  angleBottom?: number;
  background?: string;
  style?: React.CSSProperties;
}

export function DiagonalSection({
  children,
  className,
  angleTop = 0,
  angleBottom = 0,
  background = 'var(--v2-bg, #050B1F)',
  style,
}: DiagonalSectionProps) {
  const topPercent = Math.abs(angleTop) * 1.8;
  const bottomPercent = Math.abs(angleBottom) * 1.8;

  const topLeft = angleTop > 0 ? `${topPercent}%` : '0%';
  const topRight = angleTop < 0 ? `${topPercent}%` : '0%';
  const bottomLeft = angleBottom < 0 ? `${100 + bottomPercent}%` : '100%';
  const bottomRight = angleBottom > 0 ? `${100 + bottomPercent}%` : '100%';

  return (
    <section
      className={className}
      style={{
        position: 'relative',
        background,
        clipPath: `polygon(0 ${topLeft}, 100% ${topRight}, 100% ${bottomRight}, 0 ${bottomLeft})`,
        marginTop: angleTop ? `-${topPercent * 0.5}%` : undefined,
        paddingTop: angleTop ? `${topPercent * 0.6}%` : undefined,
        marginBottom: angleBottom ? `-${bottomPercent * 0.5}%` : undefined,
        paddingBottom: angleBottom ? `${bottomPercent * 0.6}%` : undefined,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

'use client';

import { useRef, useState, useCallback, ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  strength?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className,
  href,
  strength = 0.3,
  style,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setOffset({
        x: (e.clientX - centerX) * strength,
        y: (e.clientY - centerY) * strength,
      });
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    setOffset({ x: 0, y: 0 });
  }, []);

  const sharedStyle: React.CSSProperties = {
    // Default to inline-block so the magnetic transform has a positioned
    // box to operate on. Callers can override `display` (e.g. inline-flex
    // when the button has an icon + label that need to lay out as a row)
    // by passing it through `style` — the spread below wins.
    display: 'inline-block',
    ...style,
    // Transform/transition are the magnetic effect itself; keep them
    // locked so a caller spreading their own transform can't accidentally
    // disable the magnet.
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: offset.x === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.1s ease-out',
  };

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        className={className}
        style={sharedStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      className={className}
      style={sharedStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

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
    ...style,
    transform: `translate(${offset.x}px, ${offset.y}px)`,
    transition: offset.x === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.1s ease-out',
    display: 'inline-block',
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

'use client';

import { useRef, useState, useCallback, ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  style?: React.CSSProperties;
}

export function TiltCard({ children, className, maxTilt = 5, style }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: -y * maxTilt, y: x * maxTilt });
    },
    [maxTilt]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
        transition: isHovered
          ? 'transform 0.1s ease-out'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
}

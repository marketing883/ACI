'use client';

/**
 * GradientMesh — soft ambient radial gradients positioned behind dark
 * section content. Uses the --v2-mesh-blue and --v2-mesh-violet tokens
 * from design-system-v2.css.
 *
 * Variants:
 *   - hero:   asymmetric two-source wash, top-left blue + bottom-right violet
 *   - cta:    centered violet glow
 *   - subtle: top-only blue wash, low intensity
 *
 * Positioned absolutely; parent must be `position: relative`. The
 * component is aria-hidden and pointer-events-none so it never blocks
 * interaction or screen reader flow.
 *
 * If `animated` is true, the mesh drifts slowly on a 30s loop. The loop
 * is GPU-composited (transform only). Disabled by prefers-reduced-motion.
 */

import { motion, useReducedMotion } from 'framer-motion';

type MeshVariant = 'hero' | 'cta' | 'subtle';

interface GradientMeshProps {
  variant?: MeshVariant;
  animated?: boolean;
  className?: string;
}

const meshStyles: Record<MeshVariant, React.CSSProperties> = {
  hero: {
    backgroundImage: `
      radial-gradient(ellipse 60% 50% at 20% 30%, var(--v2-mesh-blue), transparent 60%),
      radial-gradient(ellipse 50% 40% at 80% 70%, var(--v2-mesh-violet), transparent 60%)
    `,
  },
  cta: {
    backgroundImage: `
      radial-gradient(ellipse 80% 55% at 50% 50%, var(--v2-mesh-violet), transparent 70%)
    `,
  },
  subtle: {
    backgroundImage: `
      radial-gradient(ellipse 90% 60% at 50% 0%, var(--v2-mesh-blue), transparent 80%)
    `,
  },
};

export default function GradientMesh({
  variant = 'hero',
  animated = false,
  className,
}: GradientMeshProps) {
  const reduced = useReducedMotion();
  const shouldAnimate = animated && !reduced;

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    ...meshStyles[variant],
  };

  if (!shouldAnimate) {
    return <div aria-hidden className={className} style={baseStyle} />;
  }

  return (
    <motion.div
      aria-hidden
      className={className}
      style={{ ...baseStyle, willChange: 'transform' }}
      animate={{
        scale: [1, 1.08, 1],
        x: [0, 12, 0],
        y: [0, -8, 0],
      }}
      transition={{
        duration: 30,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
    />
  );
}

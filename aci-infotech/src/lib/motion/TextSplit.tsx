'use client';

/**
 * TextSplit — splits heading text into words or lines and staggers their
 * entrance with a slight blur-to-focus effect. Accessible: the visible
 * text uses aria-hidden and the element carries aria-label with the full
 * string so screen readers speak it naturally.
 *
 * For line mode, pass text with explicit `\n` separators.
 *
 * Usage:
 *   <TextSplit text="Enterprise systems, engineered to stay up." as="h1" />
 *   <TextSplit text={"Line one\nLine two"} by="line" as="h2" />
 */

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { V2_EASE } from './variants';

type Tag = 'h1' | 'h2' | 'h3' | 'p';

interface TextSplitProps {
  text: string;
  by?: 'word' | 'line';
  as?: Tag;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
  once?: boolean;
}

// Explicit mapping keeps TypeScript happy without any-casts.
const MotionHeading = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
} as const;

export default function TextSplit({
  text,
  by = 'word',
  as = 'h2',
  className,
  delayChildren = 0.05,
  staggerChildren = 0.08,
  once = true,
}: TextSplitProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { amount: 0.3, once });

  const pieces = by === 'word' ? text.split(' ') : text.split('\n');
  const MotionTag = MotionHeading[as];

  if (reduced) {
    const Tag = as;
    return (
      <Tag className={className}>
        {by === 'line'
          ? pieces.map((line, i) => (
              <span key={i} style={{ display: 'block' }}>
                {line}
              </span>
            ))
          : text}
      </Tag>
    );
  }

  const childVariants = {
    hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: V2_EASE },
    },
  };

  return (
    <MotionTag
      // Ref type inference is awkward with motion.* union; cast is
      // contained to this single assignment.
      ref={ref as unknown as React.RefObject<HTMLHeadingElement>}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren, delayChildren } },
      }}
      aria-label={text.replace(/\n/g, ' ')}
    >
      {pieces.map((piece, i) =>
        by === 'line' ? (
          <motion.span
            key={`${piece}-${i}`}
            aria-hidden
            style={{ display: 'block' }}
            variants={childVariants}
          >
            {piece}
          </motion.span>
        ) : (
          <motion.span
            key={`${piece}-${i}`}
            aria-hidden
            style={{
              display: 'inline-block',
              marginRight: '0.25em',
              willChange: 'transform, opacity, filter',
            }}
            variants={childVariants}
          >
            {piece}
          </motion.span>
        ),
      )}
    </MotionTag>
  );
}

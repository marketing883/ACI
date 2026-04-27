'use client';

import { useRef, useState, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

interface TextScrambleProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  duration?: number;
}

export function TextScramble({ text, className, style, duration = 600 }: TextScrambleProps) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number>(0);
  const isRunning = useRef(false);

  const scramble = useCallback(() => {
    if (isRunning.current) return;
    isRunning.current = true;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const revealedCount = Math.floor(progress * text.length);

      let result = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          result += ' ';
        } else if (i < revealedCount) {
          result += text[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplay(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
        isRunning.current = false;
      }
    };

    frameRef.current = requestAnimationFrame(step);
  }, [text, duration]);

  const unscramble = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    setDisplay(text);
    isRunning.current = false;
  }, [text]);

  return (
    <span
      className={className}
      style={{ ...style, fontVariantNumeric: 'tabular-nums' }}
      onMouseEnter={scramble}
      onMouseLeave={unscramble}
    >
      {display}
    </span>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';

interface Stat {
  value: string;
  label: string;
}

interface LPStatsProps {
  stats: Stat[];
}

function AnimatedNumber({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateValue = () => {
    // Extract numeric part and suffix
    const match = value.match(/^([<>]?)(\d+\.?\d*)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const [, prefix, numStr, suffix] = match;
    const targetNum = parseFloat(numStr);
    const duration = 1500;
    const steps = 40;
    const stepDuration = duration / steps;
    const increment = targetNum / steps;

    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, targetNum);

      // Format number based on whether it's a decimal
      const formatted = numStr.includes('.')
        ? current.toFixed(numStr.split('.')[1].length)
        : Math.round(current).toString();

      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, stepDuration);
  };

  return <span ref={ref}>{displayValue}</span>;
}

export default function LPStats({ stats }: LPStatsProps) {
  return (
    <section className="py-12 bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <AnimatedNumber value={stat.value} />
              </div>
              <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

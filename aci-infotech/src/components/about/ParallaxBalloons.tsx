'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface BalloonConfig {
  src: string;
  webpSrc: string;
  alt: string;
  width: number;
  height: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  parallaxSpeed: number; // Multiplier for scroll effect (higher = more movement)
  size: string; // Tailwind width class
  zIndex: number;
}

const balloons: BalloonConfig[] = [
  {
    src: '/images/about-page-img/3.png',
    webpSrc: '/images/about-page-img/3.webp',
    alt: 'Hot air balloon in distance',
    width: 80,
    height: 100,
    position: { top: '15%', left: '8%' },
    parallaxSpeed: 0.15,
    size: 'w-12 md:w-16',
    zIndex: 10,
  },
  {
    src: '/images/about-page-img/4.png',
    webpSrc: '/images/about-page-img/4.webp',
    alt: 'Hot air balloons floating',
    width: 200,
    height: 280,
    position: { top: '35%', left: '5%' },
    parallaxSpeed: 0.25,
    size: 'w-24 md:w-32',
    zIndex: 20,
  },
  {
    src: '/images/about-page-img/1.png',
    webpSrc: '/images/about-page-img/1.webp',
    alt: 'White hot air balloon with ACI logo',
    width: 300,
    height: 350,
    position: { bottom: '10%', left: '15%' },
    parallaxSpeed: 0.35,
    size: 'w-32 md:w-44',
    zIndex: 30,
  },
  {
    src: '/images/about-page-img/2.png',
    webpSrc: '/images/about-page-img/2.webp',
    alt: 'Orange hot air balloon with ACI logo',
    width: 250,
    height: 300,
    position: { top: '20%', right: '25%' },
    parallaxSpeed: 0.3,
    size: 'w-28 md:w-36',
    zIndex: 25,
  },
];

// Hero balloon config (last.png) - special handling
const heroBalloon: BalloonConfig = {
  src: '/images/about-page-img/last.png',
  webpSrc: '/images/about-page-img/last.webp',
  alt: 'ACI Infotech branded hot air balloon rising',
  width: 600,
  height: 700,
  position: { top: '0', right: '0' },
  parallaxSpeed: 0.2,
  size: 'w-48 md:w-64 lg:w-80',
  zIndex: 40,
};

export default function ParallaxBalloons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far the element is through the viewport
      // 0 = element just entering viewport from bottom
      // 1 = element just leaving viewport from top
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Progress: starts when element enters viewport, ends when it leaves
      const progress = Math.max(0, Math.min(1,
        (windowHeight - elementTop) / (windowHeight + elementHeight)
      ));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getTransform = (speed: number, direction: 'up' | 'down' = 'up') => {
    const movement = scrollProgress * speed * 100;
    return direction === 'up' ? -movement : movement;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-80 lg:h-[450px] rounded-xl overflow-hidden"
    >
      {/* Background layer */}
      <div className="absolute inset-0">
        <picture>
          <source srcSet="/images/about-page-img/bg.webp" type="image/webp" />
          <Image
            src="/images/about-page-img/bg.jpg"
            alt="Scenic aerial view with sunlight through clouds"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </picture>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {/* Floating balloons with parallax */}
      {balloons.map((balloon, index) => (
        <div
          key={index}
          className={`absolute ${balloon.size} transition-transform duration-100 ease-out`}
          style={{
            ...balloon.position,
            zIndex: balloon.zIndex,
            transform: `translateY(${getTransform(balloon.parallaxSpeed)}px)`,
          }}
        >
          <picture>
            <source srcSet={balloon.webpSrc} type="image/webp" />
            <Image
              src={balloon.src}
              alt={balloon.alt}
              width={balloon.width}
              height={balloon.height}
              className="w-full h-auto drop-shadow-lg"
              sizes="(max-width: 768px) 80px, 150px"
            />
          </picture>
        </div>
      ))}

      {/* Hero balloon (last.png) - top right with upward parallax */}
      <div
        className={`absolute ${heroBalloon.size} transition-transform duration-100 ease-out`}
        style={{
          top: 0,
          right: 0,
          zIndex: heroBalloon.zIndex,
          // Moves upward on scroll, but clamped so it doesn't go beyond initial position
          transform: `translateY(${Math.max(getTransform(heroBalloon.parallaxSpeed), -20)}px)`,
        }}
      >
        <picture>
          <source srcSet={heroBalloon.webpSrc} type="image/webp" />
          <Image
            src={heroBalloon.src}
            alt={heroBalloon.alt}
            width={heroBalloon.width}
            height={heroBalloon.height}
            className="w-full h-auto drop-shadow-2xl"
            priority
            sizes="(max-width: 768px) 200px, (max-width: 1024px) 260px, 320px"
          />
        </picture>
      </div>

      {/* Subtle atmospheric haze at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Partner {
  name: string;
  logo_url: string;
}

interface PartnersSectionProps {
  headline?: string;
  subheadline?: string;
  partners: Partner[];
}

export default function PartnersSection({
  headline = "Built on Enterprise-Grade Platforms",
  subheadline = "We're certified experts in the platforms enterprises already trust",
  partners,
}: PartnersSectionProps) {
  const isOdd = partners.length % 2 !== 0;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-scroll for marquee effect when odd number of partners
  useEffect(() => {
    if (!isOdd || !scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      if (!isHovered) {
        scrollPosition += scrollSpeed;
        // Reset when we've scrolled through half (the duplicated content)
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isOdd, isHovered]);

  // For marquee, duplicate the partners array
  const displayPartners = isOdd ? [...partners, ...partners] : partners;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--aci-secondary)] mb-3">
            {headline}
          </h2>
          <p className="text-gray-600">{subheadline}</p>
        </div>

        {isOdd ? (
          /* Marquee/Carousel for odd number of partners */
          <div
            className="overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              ref={scrollRef}
              className="flex gap-12 overflow-x-hidden"
              style={{ scrollBehavior: 'auto' }}
            >
              {displayPartners.map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center p-4"
                >
                  <div className="relative h-12 w-32 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
                    <Image
                      src={partner.logo_url}
                      alt={partner.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Grid for even number of partners */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex items-center justify-center p-4"
              >
                <div className="relative h-12 w-32 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
                  <Image
                    src={partner.logo_url}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

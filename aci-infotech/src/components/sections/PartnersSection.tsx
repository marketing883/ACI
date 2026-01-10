'use client';

import Image from 'next/image';
import Badge from '@/components/ui/Badge';

interface Partner {
  name: string;
  logo_url: string;
  badge?: string;
  badge_style?: 'gold' | 'silver';
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

        {/* Partner Logos Grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center justify-center p-4 group"
            >
              <div className="relative h-12 w-full grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300">
                {/* Placeholder for partner logo */}
                <div className="flex items-center justify-center h-full">
                  <span className="text-sm font-medium text-gray-500 group-hover:text-[#0052CC] transition-colors">
                    {partner.name}
                  </span>
                </div>
              </div>
              {partner.badge && (
                <Badge
                  variant={partner.badge_style === 'gold' ? 'warning' : 'info'}
                  size="sm"
                  className="mt-2"
                >
                  {partner.badge}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

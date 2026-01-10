'use client';

import Image from 'next/image';

interface Badge {
  name: string;
  description: string;
  image_url?: string;
}

interface AwardsSectionProps {
  headline?: string;
  subheadline?: string;
  badges: Badge[];
}

export default function AwardsSection({
  headline = "Trusted & Certified",
  subheadline = "Our work, culture, and capabilities have been validated by global benchmarks",
  badges,
}: AwardsSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--aci-secondary)] mb-3">
            {headline}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subheadline}</p>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className="flex flex-col items-center text-center p-6 bg-[#FAFAFA] rounded-[6px] hover:-translate-y-0.5 transition-all duration-200"
            >
              {badge.image_url ? (
                <Image
                  src={badge.image_url}
                  alt={badge.name}
                  width={80}
                  height={80}
                  className="object-contain mb-4"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-[6px] flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-gray-400">
                    {badge.name.charAt(0)}
                  </span>
                </div>
              )}
              <h3 className="font-semibold text-[#0A1628] text-sm mb-1">
                {badge.name}
              </h3>
              <p className="text-xs text-gray-500">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

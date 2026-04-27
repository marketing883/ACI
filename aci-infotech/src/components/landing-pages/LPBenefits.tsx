'use client';

import {
  Layers,
  Zap,
  TrendingDown,
  Users,
  Layout,
  RefreshCw,
  Sliders,
  Smartphone,
  Shield,
  DollarSign,
  Rocket,
  Award,
  Box,
  Cpu,
  Link,
  Lock,
  Settings,
  Target,
} from 'lucide-react';

interface Benefit {
  title: string;
  description: string;
  icon: string;
}

interface LPBenefitsProps {
  headline: string;
  benefits: Benefit[];
}

const ICON_MAP: Record<string, React.ElementType> = {
  layers: Layers,
  zap: Zap,
  'trending-down': TrendingDown,
  users: Users,
  layout: Layout,
  'refresh-cw': RefreshCw,
  sliders: Sliders,
  smartphone: Smartphone,
  shield: Shield,
  'dollar-sign': DollarSign,
  rocket: Rocket,
  award: Award,
  box: Box,
  cpu: Cpu,
  link: Link,
  lock: Lock,
  settings: Settings,
  target: Target,
};

export default function LPBenefits({ headline, benefits }: LPBenefitsProps) {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{headline}</h2>
          <div className="w-24 h-1 bg-[#0066FF] mx-auto" />
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = ICON_MAP[benefit.icon] || Zap;

            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all group"
              >
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                  <IconComponent className="w-7 h-7 text-[#0066FF]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

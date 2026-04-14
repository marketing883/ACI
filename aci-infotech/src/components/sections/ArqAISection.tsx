'use client';

import Image from 'next/image';
import { Workflow, Zap, Rocket, ArrowRight } from 'lucide-react';

interface ArqAISectionProps {
  ctaUrl?: string;
}

export default function ArqAISection({
  ctaUrl = "https://www.thearq.ai",
}: ArqAISectionProps) {
  const features = [
    {
      icon: Workflow,
      title: "End-to-End AI Delivery",
      description:
        "We handle the full build, from use case definition and model selection to deployment and ongoing operations. Not advisory. Not a pilot. A working\u00A0system.",
    },
    {
      icon: Zap,
      title: "Products That Accelerate Delivery",
      description:
        "ArqAI brings purpose-built products into every engagement so enterprises are not starting from zero. Faster deployment, fewer integration risks, lower total\u00A0cost.",
    },
    {
      icon: Rocket,
      title: "From Pilot to Production",
      description:
        "Most enterprise AI gets stuck in proof of concept. We are built specifically to get past that stage, into live environments, with real users and measurable\u00A0outcomes.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#0A1628] to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            {/* Eyebrow */}
            <span className="text-[#3B6FD4] font-semibold text-sm uppercase tracking-wide">
              Introducing
            </span>

            {/* ArqAI Logo */}
            <div className="mt-4 mb-6">
              <Image
                src="/images/ArqAI-Logo-no-tagline.png"
                alt="ArqAI"
                width={717}
                height={253}
                className="h-12 w-auto"
              />
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {'AI Services, Built for\u00A0Production.'}
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-8">
              {"ArqAI is ACI's AI services vertical. We take enterprises from AI strategy to working systems, with the products and the engineering capability to back it\u00A0up."}
            </p>

            {/* Features */}
            <div className="space-y-6 mb-10">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#0052CC]/20 rounded-[6px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#3B6FD4]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 px-6 py-3 bg-[#0052CC] text-white font-semibold rounded-lg hover:text-[#C4FF61] transition-all duration-200 cursor-pointer"
            >
              <span>See ArqAI</span>
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={2.25}
                aria-hidden
              />
            </a>
          </div>

          {/* Video */}
          <div className="relative">
            <div className="relative rounded-[6px] overflow-hidden shadow-2xl">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto"
              >
                <source src="/video/ArqAI-foundry-v2.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-[#0052CC]/10 rounded-3xl blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

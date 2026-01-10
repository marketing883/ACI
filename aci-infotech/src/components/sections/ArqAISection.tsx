'use client';

import Image from 'next/image';
import { Shield, FileCheck, Activity } from 'lucide-react';

interface ArqAISectionProps {
  ctaUrl?: string;
}

export default function ArqAISection({
  ctaUrl = "https://www.thearq.ai",
}: ArqAISectionProps) {
  const features = [
    {
      icon: Shield,
      title: "Trust-Aware Agent Orchestration",
      description: "Every agent carries cryptographic identity and scoped authorization. Non-repudiable audit trails for every action.",
    },
    {
      icon: FileCheck,
      title: "Compliance-Aware Prompt Compiler",
      description: "Regulatory policies compiled into execution logic, not checked after the fact. Built for HIPAA, GDPR, SOX, PCI-DSS.",
    },
    {
      icon: Activity,
      title: "Observability-Driven Adaptive RAG",
      description: "Real-time performance monitoring with automatic, policy-compliant adaptation. Quality and compliance in a closed loop.",
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
                src="/images/arqai/arq-ai-logo-white.svg"
                alt="ArqAI"
                width={180}
                height={50}
                className="h-12 w-auto"
              />
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              The Enterprise Foundry for Trusted AI
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-4">
              ArqAI enables regulated enterprises to build, run, and govern mission-critical agent workforces at production scale. Three patented technologies compile your policies into infrastructure, delivering 30-day deployments with cryptographic audit trails and compliance built into every agent&apos;s DNA.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Deployed across healthcare, finance, manufacturing, and telecommunications.
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
                      <h4 className="font-semibold text-white mb-1">{feature.title}<span className="text-[#3B6FD4]">&trade;</span></h4>
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0052CC] text-white font-semibold rounded-[6px] hover:bg-[#0052CC]/90 transition-colors"
            >
              See ArqAI Live In Action
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
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

'use client';

import Image from 'next/image';
import Button from '@/components/ui/Button';
import { Shield, Eye, CheckCircle } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
}

interface ArqAISectionProps {
  eyebrow?: string;
  headline?: string;
  description?: string;
  features?: Feature[];
  demoUrl?: string;
  websiteUrl?: string;
}

export default function ArqAISection({
  eyebrow = "Introducing ArqAI",
  headline = "Enterprise AI Governance Platform",
  description = "ArqAI is our purpose-built AI governance platform for enterprises scaling AI responsibly. Policy-as-code, model observability, automated compliance reporting, and audit trails that satisfy regulators.",
  features = [
    {
      title: "Automated AI Governance",
      description: "Policy enforcement across all ML models, automated compliance checks",
    },
    {
      title: "Model Observability",
      description: "Drift detection, bias monitoring, performance tracking in production",
    },
    {
      title: "Compliance Ready",
      description: "EU AI Act, GDPR, DPDP compliant out of the box, audit-ready logs",
    },
  ],
  demoUrl = "https://demo.thearq.ai",
  websiteUrl = "https://thearq.ai",
}: ArqAISectionProps) {
  const icons = [Shield, Eye, CheckCircle];

  return (
    <section className="py-20 bg-gradient-to-br from-[var(--aci-secondary)] to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="text-[var(--aci-primary-light)] font-semibold text-sm uppercase tracking-wide">
              {eyebrow}
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-6">
              {headline}
            </h2>

            <p className="text-lg text-gray-300 mb-8">{description}</p>

            {/* Features */}
            <div className="space-y-6 mb-10">
              {features.map((feature, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[var(--aci-primary)]/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[var(--aci-primary-light)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                href={demoUrl}
                target="_blank"
                variant="primary"
                size="lg"
              >
                See ArqAI Demo
              </Button>
              <Button
                href={websiteUrl}
                target="_blank"
                variant="ghost"
                size="lg"
                className="text-white border border-white/30 hover:bg-white/10"
              >
                Visit ArqAI.ai
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative bg-gray-800 rounded-2xl p-8 shadow-2xl">
              {/* Mock Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-400 ml-2">ArqAI Dashboard</span>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">24</div>
                    <div className="text-xs text-gray-400">Active Models</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-400">98%</div>
                    <div className="text-xs text-gray-400">Compliance</div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-[var(--aci-primary-light)]">0</div>
                    <div className="text-xs text-gray-400">Drift Alerts</div>
                  </div>
                </div>

                {/* Policy Status */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-300">Policy Compliance</span>
                    <span className="text-xs text-green-400">All Passing</span>
                  </div>
                  <div className="space-y-2">
                    {['Data Privacy', 'Bias Detection', 'Model Drift'].map((policy) => (
                      <div key={policy} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-gray-400">{policy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -inset-4 bg-[var(--aci-primary)]/10 rounded-3xl blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

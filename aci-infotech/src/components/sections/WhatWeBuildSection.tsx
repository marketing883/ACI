'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  ArrowRight,
  Database,
  Brain,
  Cloud,
  Users,
  Shield,
  Zap,
  ChevronRight,
} from 'lucide-react';

// ============================================================================
// SERVICE DATA
// ============================================================================

interface ServiceData {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  deployments: string;
  deploymentsLabel: string;
  techStack: string[];
  keyOutcome: string;
  icon: typeof Database;
  href: string;
  flowOrder: number;
}

const SERVICES: ServiceData[] = [
  {
    id: 'digital',
    name: 'Digital Transformation',
    shortName: 'Digital',
    tagline: 'Intelligent process automation',
    description: 'ServiceNow workflows, RPA, document processing. Automate what humans shouldn\'t do manually—not vanity projects, but processes that move the P&L.',
    deployments: '40',
    deploymentsLabel: 'deployments',
    techStack: ['ServiceNow', 'UiPath', 'Power Automate', 'Appian', 'Camunda'],
    keyOutcome: '78% average process time reduction',
    icon: Zap,
    href: '/services/digital-transformation',
    flowOrder: 1,
  },
  {
    id: 'data',
    name: 'Data Engineering',
    shortName: 'Data',
    tagline: 'Platforms that feed AI and analytics',
    description: 'Databricks lakehouses, Snowflake warehouses, real-time Kafka pipelines. Not data swamps—governed, observable systems with Dynatrace monitoring and automated quality gates.',
    deployments: '100+',
    deploymentsLabel: 'deployments',
    techStack: ['Databricks', 'Snowflake', 'Kafka', 'Dynatrace', 'dbt'],
    keyOutcome: '64% average data latency reduction',
    icon: Database,
    href: '/services/data-engineering',
    flowOrder: 2,
  },
  {
    id: 'ai',
    name: 'Applied AI & ML',
    shortName: 'AI & ML',
    tagline: 'From GenAI pilots to production ML',
    description: 'GenAI chatbots, forecasting engines, recommendation systems. Not POCs that die—production ML with MLOps, model monitoring, and governance that passes audits.',
    deployments: '50',
    deploymentsLabel: 'deployments',
    techStack: ['OpenAI', 'Databricks ML', 'SageMaker', 'MLflow', 'ArqAI'],
    keyOutcome: '3x faster model deployment cycles',
    icon: Brain,
    href: '/services/applied-ai-ml',
    flowOrder: 3,
  },
  {
    id: 'martech',
    name: 'MarTech & CDP',
    shortName: 'MarTech',
    tagline: 'Customer 360 that actually works',
    description: 'Salesforce Marketing Cloud, Adobe Experience Platform, Braze. Real-time personalization at scale—not siloed campaigns that miss the customer standing in your store.',
    deployments: '34',
    deploymentsLabel: 'deployments',
    techStack: ['Salesforce', 'Adobe AEP', 'Braze', 'Segment', 'Twilio'],
    keyOutcome: '25% average campaign effectiveness lift',
    icon: Users,
    href: '/services/martech-cdp',
    flowOrder: 4,
  },
];

const CLOUD_SERVICE: ServiceData = {
  id: 'cloud',
  name: 'Cloud Modernization',
  shortName: 'Cloud',
  tagline: 'Multi-cloud without the chaos',
  description: 'AWS, Azure, GCP migrations. Not lift-and-shift failures, but re-architected systems that actually use cloud benefits. Terraform IaC, cost optimization, zero-downtime migrations.',
  deployments: '52',
  deploymentsLabel: 'deployments',
  techStack: ['AWS', 'Azure', 'GCP', 'Terraform', 'Kubernetes'],
  keyOutcome: '68% average infrastructure cost reduction',
  icon: Cloud,
  href: '/services/cloud-modernization',
  flowOrder: 0,
};

const SECURITY_SERVICE: ServiceData = {
  id: 'security',
  name: 'Cyber Security',
  shortName: 'Security',
  tagline: 'Built in, not bolted on',
  description: 'DevSecOps, observability, compliance automation. SOC 2, ISO 27001, HIPAA compliant architectures from day one. Security isn\'t a phase—it\'s embedded in every layer.',
  deployments: '82',
  deploymentsLabel: 'clients protected',
  techStack: ['Dynatrace', 'Splunk', 'CrowdStrike', 'HashiCorp Vault', 'Snyk'],
  keyOutcome: 'Zero security incidents across deployments',
  icon: Shield,
  href: '/services/cyber-security',
  flowOrder: 5,
};

// ============================================================================
// SERVICE NODE COMPONENT
// ============================================================================

interface ServiceNodeProps {
  service: ServiceData;
  isHovered: boolean;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onClick: (service: ServiceData) => void;
  variant?: 'default' | 'infrastructure' | 'security';
}

function ServiceNode({ service, isHovered, hoveredId, onHover, onClick, variant = 'default' }: ServiceNodeProps) {
  const Icon = service.icon;
  const isSecurity = variant === 'security';
  const isInfrastructure = variant === 'infrastructure';
  const isDimmed = hoveredId !== null && !isHovered;

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 ease-out
        ${isDimmed ? 'opacity-40' : 'opacity-100'}
      `}
      style={{
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
      }}
      onMouseEnter={() => onHover(service.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(service)}
    >
      <div
        className={`
          relative p-5 md:p-6 rounded-sm bg-white
          border-2 transition-all duration-300
          ${isHovered ? 'border-[#0052CC] shadow-[0_8px_32px_rgba(0,82,204,0.2)]' : 'border-[#0052CC]/20 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'}
          ${isSecurity ? 'border-[#C4FF61]/50' : ''}
          ${isInfrastructure ? 'border-[#0052CC]/30' : ''}
        `}
      >
        {/* Security pulse animation */}
        {isSecurity && (
          <>
            <div className="absolute inset-0 rounded-sm bg-[#C4FF61]/5" />
            <div
              className="absolute inset-0 rounded-sm border-2 border-[#C4FF61]/30"
              style={{
                animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          </>
        )}

        {/* Icon */}
        <div className={`
          w-11 h-11 md:w-12 md:h-12 rounded-sm flex items-center justify-center mb-3
          ${isSecurity ? 'bg-[#C4FF61]/20' : isInfrastructure ? 'bg-[#0052CC]/15' : 'bg-[#0052CC]/10'}
          transition-colors duration-300
        `}>
          <Icon
            className={`w-5 h-5 md:w-6 md:h-6 ${isSecurity ? 'text-[#0A1628]' : 'text-[#0052CC]'}`}
            strokeWidth={1.5}
          />
        </div>

        {/* Name */}
        <h3 className="font-semibold text-sm md:text-base text-[#0A1628] mb-1 leading-tight">
          {service.shortName}
        </h3>

        {/* Tagline */}
        <p className="text-xs text-gray-500 mb-3 line-clamp-1">
          {service.tagline}
        </p>

        {/* Deployment count */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl md:text-2xl font-bold text-[#C4FF61] font-mono">
            {service.deployments}
          </span>
          <span className="text-[10px] md:text-xs text-gray-400">
            {service.deploymentsLabel}
          </span>
        </div>

        {/* Hover indicator */}
        <div className={`
          absolute bottom-0 left-0 right-0 h-1 bg-[#0052CC] rounded-b-sm
          transition-transform duration-300 origin-left
          ${isHovered ? 'scale-x-100' : 'scale-x-0'}
        `} />
      </div>

      {/* Tech stack tooltip */}
      {isHovered && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30
                     bg-[#0A1628] text-white text-xs px-3 py-2 rounded-sm shadow-xl
                     whitespace-nowrap"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          <div className="flex gap-1.5 flex-wrap justify-center max-w-[180px]">
            {service.techStack.slice(0, 3).map((tech, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">
                {tech}
              </span>
            ))}
            {service.techStack.length > 3 && (
              <span className="px-1.5 py-0.5 text-white/50 text-[10px]">
                +{service.techStack.length - 3}
              </span>
            )}
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0A1628] rotate-45" />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// FLOW ARROW COMPONENT
// ============================================================================

function FlowArrow({ isHighlighted }: { isHighlighted: boolean }) {
  return (
    <div className="hidden md:flex items-center justify-center px-2">
      <div className="relative">
        {/* Arrow line */}
        <div
          className={`
            w-8 lg:w-12 h-0.5 transition-all duration-300
            ${isHighlighted ? 'bg-[#0052CC]' : 'bg-[#0052CC]/30'}
          `}
        />
        {/* Arrow head */}
        <ChevronRight
          className={`
            absolute -right-1 top-1/2 -translate-y-1/2 w-4 h-4 transition-all duration-300
            ${isHighlighted ? 'text-[#0052CC]' : 'text-[#0052CC]/30'}
          `}
          strokeWidth={2}
        />
        {/* Animated flow dot */}
        {isHighlighted && (
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#C4FF61] rounded-full"
            style={{
              animation: 'flowDot 1s ease-in-out infinite',
            }}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// EXPANDED SERVICE PANEL
// ============================================================================

interface ExpandedPanelProps {
  service: ServiceData;
  onClose: () => void;
}

function ExpandedServicePanel({ service, onClose }: ExpandedPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = service.icon;
  const isSecurity = service.id === 'security';

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.25s ease-out',
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/95 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-sm shadow-[0_25px_80px_rgba(0,0,0,0.12)] border-2 border-[#0052CC]/20 max-h-[90vh] overflow-y-auto"
        style={{
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
          transition: 'transform 0.25s ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-sm bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className={`
              w-14 h-14 rounded-sm flex items-center justify-center shrink-0
              ${isSecurity ? 'bg-[#C4FF61]/20' : 'bg-[#0052CC]/10'}
            `}>
              <Icon
                className={`w-7 h-7 ${isSecurity ? 'text-[#0A1628]' : 'text-[#0052CC]'}`}
                strokeWidth={1.5}
              />
            </div>
            <div className="flex-1 pr-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#0A1628] mb-1">
                {service.name}
              </h2>
              <p className="text-gray-500">{service.tagline}</p>
            </div>
          </div>

          {/* Deployment count badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A1628] rounded-sm mb-6">
            <span className="text-xl font-bold text-[#C4FF61] font-mono">
              {service.deployments}
            </span>
            <span className="text-white/70 text-sm">{service.deploymentsLabel}</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#0052CC] uppercase tracking-wider mb-2">
              What We Build
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-[#0052CC] uppercase tracking-wider mb-3">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-gray-100 text-[#0A1628] text-sm font-medium rounded-sm border border-gray-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Key Outcome */}
          <div className="mb-6 p-4 bg-[#C4FF61]/10 rounded-sm border border-[#C4FF61]/30">
            <h3 className="text-xs font-semibold text-[#0A1628] uppercase tracking-wider mb-1">
              Key Outcome
            </h3>
            <p className="text-lg font-semibold text-[#0A1628]">
              {service.keyOutcome}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Link
              href={service.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-[#0052CC] text-white font-semibold hover:bg-[#003D99] hover:text-[#C4FF61] transition-all duration-200 group"
            >
              <span className="group-hover:text-[#C4FF61] transition-colors">See {service.shortName} Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-[#C4FF61] transition-all" />
            </Link>
            <Link
              href={`/contact?service=${service.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm border-2 border-[#0052CC]/20 text-[#0A1628] font-semibold hover:border-[#0052CC]/40 hover:bg-gray-50 transition-all duration-200"
            >
              Talk to Architect
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WhatWeBuildSection() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);

  return (
    <>
      <section className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[#0052CC] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              System Architecture
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A1628] mb-4">
              What We Build
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our solutions integrate as a complete system.
              <span className="hidden md:inline"> Hover to explore. Click for details.</span>
            </p>
          </div>

          {/* CLOUD - Infrastructure Layer */}
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-[200px]">
              <ServiceNode
                service={CLOUD_SERVICE}
                isHovered={hoveredService === CLOUD_SERVICE.id}
                hoveredId={hoveredService}
                onHover={setHoveredService}
                onClick={setSelectedService}
                variant="infrastructure"
              />
            </div>
          </div>

          {/* Vertical connector from Cloud */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center">
              <div className={`w-0.5 h-8 transition-colors duration-300 ${hoveredService === 'cloud' ? 'bg-[#0052CC]' : 'bg-[#0052CC]/20'}`} />
              <div className={`w-3 h-3 border-l-2 border-b-2 rotate-[-45deg] -mt-1.5 transition-colors duration-300 ${hoveredService === 'cloud' ? 'border-[#0052CC]' : 'border-[#0052CC]/20'}`} />
            </div>
          </div>

          {/* Label */}
          <div className="text-center mb-4">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Data Pipeline Flow</span>
          </div>

          {/* MAIN FLOW - Left to Right: Digital → Data → AI → MarTech */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 mb-8">
            {SERVICES.map((service, index) => (
              <div key={service.id} className="flex items-center">
                {/* Service Node */}
                <div className="w-[160px] md:w-[170px] lg:w-[180px]">
                  <ServiceNode
                    service={service}
                    isHovered={hoveredService === service.id}
                    hoveredId={hoveredService}
                    onHover={setHoveredService}
                    onClick={setSelectedService}
                  />
                </div>

                {/* Arrow between nodes (not after last) */}
                {index < SERVICES.length - 1 && (
                  <FlowArrow isHighlighted={
                    hoveredService === service.id ||
                    hoveredService === SERVICES[index + 1].id
                  } />
                )}
              </div>
            ))}
          </div>

          {/* Vertical connector to Security */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center">
              <div className={`w-0.5 h-8 transition-colors duration-300 ${hoveredService === 'security' ? 'bg-[#C4FF61]' : 'bg-[#0052CC]/20'}`} />
              <div className={`w-3 h-3 border-l-2 border-b-2 rotate-[-45deg] -mt-1.5 transition-colors duration-300 ${hoveredService === 'security' ? 'border-[#C4FF61]' : 'border-[#0052CC]/20'}`} />
            </div>
          </div>

          {/* SECURITY - Wraps Everything */}
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-[220px]">
              <ServiceNode
                service={SECURITY_SERVICE}
                isHovered={hoveredService === SECURITY_SERVICE.id}
                hoveredId={hoveredService}
                onHover={setHoveredService}
                onClick={setSelectedService}
                variant="security"
              />
            </div>
          </div>

          {/* Security annotation */}
          <div className="text-center mb-12">
            <p className="text-xs text-gray-500 italic">
              Security wraps all layers — built in, not bolted on
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-6 h-0.5 bg-[#0052CC]/40" />
                <ChevronRight className="w-3 h-3 text-[#0052CC]/40" />
              </div>
              <span>Data Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-[#C4FF61]/20 border border-[#C4FF61]/50" />
              <span>Security Layer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C4FF61] font-mono font-bold text-base">52</span>
              <span>Deployments</span>
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes pulse-ring {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.1;
              transform: scale(1.03);
            }
          }

          @keyframes flowDot {
            0% {
              left: 0;
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            80% {
              opacity: 1;
            }
            100% {
              left: calc(100% - 8px);
              opacity: 0;
            }
          }
        `}</style>
      </section>

      {/* Expanded Panel */}
      {selectedService && (
        <ExpandedServicePanel
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  );
}

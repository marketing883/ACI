'use client';

import { useState, useEffect } from 'react';
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
  Building2,
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
}

// Tier 1: Infrastructure
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
};

// Tier 2: Core Business Systems
const ERP_SERVICE: ServiceData = {
  id: 'erp',
  name: 'ERP & Enterprise Applications',
  shortName: 'ERP & Apps',
  tagline: 'Core systems that run your business',
  description: 'SAP S/4HANA, Oracle ERP Cloud, Microsoft Dynamics. Core business systems for finance, supply chain, HR, and operations. Post-acquisition consolidations and greenfield implementations.',
  deployments: '40',
  deploymentsLabel: 'implementations',
  techStack: ['SAP S/4HANA', 'Oracle ERP', 'Microsoft Dynamics', 'Workday', 'NetSuite'],
  keyOutcome: '$9.2M average year-one savings from consolidations',
  icon: Building2,
  href: '/services/enterprise-applications',
};

// Tier 3: Data Intelligence Pipeline
const DATA_SERVICE: ServiceData = {
  id: 'data',
  name: 'Data Engineering',
  shortName: 'Data',
  tagline: 'Platforms that feed AI',
  description: 'Databricks lakehouses, Snowflake warehouses, real-time Kafka pipelines. Not data swamps, governed, observable systems with Dynatrace monitoring and automated quality gates.',
  deployments: '100+',
  deploymentsLabel: 'deployments',
  techStack: ['Databricks', 'Snowflake', 'Kafka', 'Dynatrace', 'dbt'],
  keyOutcome: '64% average data latency reduction',
  icon: Database,
  href: '/services/data-engineering',
};

const AI_SERVICE: ServiceData = {
  id: 'ai',
  name: 'Applied AI & ML',
  shortName: 'AI & ML',
  tagline: 'GenAI to production ML',
  description: 'GenAI chatbots, forecasting engines, recommendation systems. Not POCs that die, production ML with MLOps, model monitoring, and governance that passes audits.',
  deployments: '50',
  deploymentsLabel: 'deployments',
  techStack: ['OpenAI', 'Databricks ML', 'SageMaker', 'MLflow', 'ArqAI'],
  keyOutcome: '3x faster model deployment cycles',
  icon: Brain,
  href: '/services/applied-ai-ml',
};

const MARTECH_SERVICE: ServiceData = {
  id: 'martech',
  name: 'MarTech & CDP',
  shortName: 'MarTech',
  tagline: 'Customer 360 that works',
  description: 'Salesforce Marketing Cloud, Adobe Experience Platform, Braze. Real-time personalization at scale, not siloed campaigns that miss the customer standing in your store.',
  deployments: '34',
  deploymentsLabel: 'deployments',
  techStack: ['Salesforce', 'Adobe AEP', 'Braze', 'Segment', 'Twilio'],
  keyOutcome: '25% average campaign effectiveness lift',
  icon: Users,
  href: '/services/martech-cdp',
};

// Tier 4: Process Optimization
const DIGITAL_SERVICE: ServiceData = {
  id: 'digital',
  name: 'Digital Transformation',
  shortName: 'Digital',
  tagline: 'Intelligent process automation',
  description: 'ServiceNow workflows, RPA, document processing. Automate what humans shouldn\'t do manually, not vanity projects, but processes that move the P&L.',
  deployments: '40',
  deploymentsLabel: 'deployments',
  techStack: ['ServiceNow', 'UiPath', 'Power Automate', 'Appian', 'Camunda'],
  keyOutcome: '78% average process time reduction',
  icon: Zap,
  href: '/services/digital-transformation',
};

// Security wraps everything
const SECURITY_SERVICE: ServiceData = {
  id: 'security',
  name: 'Cyber Security',
  shortName: 'Security',
  tagline: 'Built in, not bolted on',
  description: 'DevSecOps, observability, compliance automation. SOC 2, ISO 27001, HIPAA compliant architectures from day one. Security isn\'t a phase, it\'s embedded in every layer.',
  deployments: '82',
  deploymentsLabel: 'clients protected',
  techStack: ['Dynatrace', 'Splunk', 'CrowdStrike', 'HashiCorp Vault', 'Snyk'],
  keyOutcome: 'Zero security incidents across deployments',
  icon: Shield,
  href: '/services/cyber-security',
};

// ============================================================================
// SERVICE NODE COMPONENT
// ============================================================================

interface ServiceNodeProps {
  service: ServiceData;
  isHovered: boolean;
  isDirectlyHovered: boolean;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onClick: (service: ServiceData) => void;
  size?: 'sm' | 'md';
}

function ServiceNode({ service, isHovered, isDirectlyHovered, hoveredId, onHover, onClick, size = 'md' }: ServiceNodeProps) {
  const Icon = service.icon;
  const isDimmed = hoveredId !== null && !isHovered;

  return (
    <div
      className={`
        relative cursor-pointer transition-all duration-300 ease-out
        ${isDimmed ? 'opacity-40' : 'opacity-100'}
      `}
      style={{
        transform: isHovered ? 'scale(1.03) translateY(-2px)' : 'scale(1)',
      }}
      onMouseEnter={() => onHover(service.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(service)}
    >
      <div
        className={`
          relative bg-white rounded-sm border-2 transition-all duration-300
          ${size === 'sm' ? 'p-4 md:p-5' : 'p-5 md:p-6'}
          ${isHovered ? 'border-[#0052CC] shadow-[0_8px_24px_rgba(0,82,204,0.2)]' : 'border-[#0052CC]/20 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'}
        `}
      >
        {/* Icon */}
        <div className={`
          ${size === 'sm' ? 'w-10 h-10 md:w-11 md:h-11' : 'w-11 h-11 md:w-12 md:h-12'}
          rounded-sm flex items-center justify-center mb-3 bg-[#0052CC]/80
          transition-colors duration-300
        `}>
          <Icon
            className={`${size === 'sm' ? 'w-5 h-5 md:w-6 md:h-6' : 'w-6 h-6'} text-[#C4FF61]`}
            strokeWidth={1.5}
          />
        </div>

        {/* Name */}
        <h3 className={`font-semibold text-[#0A1628] leading-tight mb-2 text-[16px]`}>
          {service.shortName}
        </h3>

        {/* Tagline */}
        <p className={`text-gray-500 line-clamp-2 ${size === 'sm' ? 'text-xs md:text-sm' : 'text-sm'}`}>
          {service.tagline}
        </p>

        {/* Hover indicator */}
        <div className={`
          absolute bottom-0 left-0 right-0 h-0.5 bg-[#0052CC] rounded-b-sm
          transition-transform duration-300 origin-left
          ${isHovered ? 'scale-x-100' : 'scale-x-0'}
        `} />
      </div>

      {/* Tech stack tooltip - only show when directly hovering this box, not via Security wrapper */}
      {isDirectlyHovered && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30
                     bg-[#0A1628] text-white text-xs px-3 py-2 rounded-sm shadow-xl
                     whitespace-nowrap"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          <div className="flex gap-1.5 flex-wrap justify-center max-w-[180px]">
            {service.techStack.slice(0, 3).map((tech, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-white/10 rounded text-[11px]">
                {tech}
              </span>
            ))}
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

function FlowArrow({ isHighlighted, size = 'md' }: { isHighlighted: boolean; size?: 'sm' | 'md' }) {
  return (
    <div className={`hidden lg:flex items-center justify-center ${size === 'sm' ? 'px-1' : 'px-2'}`}>
      <div className="relative">
        <div
          className={`
            ${size === 'sm' ? 'w-4 xl:w-5' : 'w-5 xl:w-6'} h-0.5 transition-all duration-300
            ${isHighlighted ? 'bg-[#0052CC]' : 'bg-[#0052CC]/60'}
          `}
        />
        <ChevronRight
          className={`
            absolute -right-1 top-1/2 -translate-y-1/2 ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} transition-all duration-300
            ${isHighlighted ? 'text-[#0052CC]' : 'text-[#0052CC]/60'}
          `}
          strokeWidth={2}
        />
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
      <div
        className="absolute inset-0 bg-white/95 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        className="relative w-full max-w-2xl bg-white rounded-sm shadow-[0_25px_80px_rgba(0,0,0,0.12)] border-2 border-[#0052CC]/20 max-h-[90vh] overflow-y-auto"
        style={{
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(10px)',
          transition: 'transform 0.25s ease-out',
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-sm bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className={`
              w-14 h-14 rounded-sm flex items-center justify-center shrink-0
              ${isSecurity ? 'bg-[#0052CC]/15' : 'bg-[#0052CC]/10'}
            `}>
              <Icon
                className="w-7 h-7 text-[#0052CC]"
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

          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-[#0052CC] capitalize mb-2">
              What We Build
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {service.description}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-[#0052CC] capitalize mb-3">
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

          <div className="mb-6 p-4 bg-[#0052CC]/5 rounded-sm border border-[#0052CC]/20">
            <h3 className="text-2xl font-semibold text-[#0A1628] capitalize mb-1">
              Key Outcome
            </h3>
            <p className="text-lg font-semibold text-[#0A1628]">
              {service.keyOutcome}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Link
              href={service.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#0052CC] text-white font-semibold hover:text-[#C4FF61] transition-all duration-200 cursor-pointer group"
            >
              See {service.shortName} Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              href={`/contact?service=${service.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-transparent border border-[#0A1628] text-[#0A1628] font-semibold hover:border-[#0052CC] hover:text-[#0052CC] transition-all duration-200 cursor-pointer"
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

  const isSecurityHovered = hoveredService === 'security';

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
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[#0052CC] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              System Architecture
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A1628] mb-4">
              What We Build
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              End-to-end enterprise solutions, secured at every layer.
              <span className="hidden md:inline"> Hover to explore. Click for details.</span>
            </p>
          </div>

          {/* SECURITY WRAPPER - Wraps Everything */}
          <div
            className={`
              relative border-2 rounded-sm p-4 md:p-6 lg:p-8 transition-all duration-300
              ${isSecurityHovered ? 'border-[#0052CC] bg-[#0052CC]/5' : 'border-[#0052CC]/30 bg-transparent'}
            `}
            onMouseEnter={() => setHoveredService('security')}
            onMouseLeave={() => setHoveredService(null)}
          >
            {/* Security Header Bar */}
            <div
              className="flex items-center justify-between mb-6 pb-4 border-b border-[#0052CC]/15 cursor-pointer"
              onClick={() => setSelectedService(SECURITY_SERVICE)}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-sm flex items-center justify-center transition-colors duration-300
                  ${isSecurityHovered ? 'bg-[#0052CC]/20' : 'bg-[#0052CC]/10'}
                `}>
                  <Shield className="w-5 h-5 text-[#0052CC]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0A1628] text-base md:text-lg">
                    Security
                  </h3>
                  <p className="text-sm text-gray-500">Built in, not bolted on</p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-colors duration-300 ${isSecurityHovered ? 'text-[#0052CC]' : 'text-gray-400'}`} />
            </div>

            {/* Main Flow: Cloud → ERP → [Data → AI → MarTech] → Digital */}
            <div className="flex flex-col lg:flex-row items-stretch justify-between gap-4 lg:gap-1 xl:gap-2">

              {/* Tier 1: Infrastructure */}
              <div className="flex flex-col">
                <div className="flex-1 flex items-center">
                  <div className="w-full lg:w-[150px] xl:w-[160px]">
                    <ServiceNode
                      service={CLOUD_SERVICE}
                      isHovered={hoveredService === CLOUD_SERVICE.id || isSecurityHovered}
                      isDirectlyHovered={hoveredService === CLOUD_SERVICE.id}
                      hoveredId={isSecurityHovered ? null : hoveredService}
                      onHover={setHoveredService}
                      onClick={setSelectedService}
                      size="md"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-3 font-medium uppercase tracking-wider">
                  Infrastructure
                </p>
              </div>

              <FlowArrow isHighlighted={hoveredService === 'cloud' || hoveredService === 'erp' || isSecurityHovered} />

              {/* Tier 2: Core Business Systems */}
              <div className="flex flex-col">
                <div className="flex-1 flex items-center">
                  <div className="w-full lg:w-[150px] xl:w-[160px]">
                    <ServiceNode
                      service={ERP_SERVICE}
                      isHovered={hoveredService === ERP_SERVICE.id || isSecurityHovered}
                      isDirectlyHovered={hoveredService === ERP_SERVICE.id}
                      hoveredId={isSecurityHovered ? null : hoveredService}
                      onHover={setHoveredService}
                      onClick={setSelectedService}
                      size="md"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-3 font-medium uppercase tracking-wider">
                  Core Business
                </p>
              </div>

              <FlowArrow isHighlighted={hoveredService === 'erp' || hoveredService === 'data' || isSecurityHovered} />

              {/* Tier 3: Data Intelligence Pipeline */}
              <div className="flex flex-col">
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row items-center gap-2 lg:gap-0">
                    <div className="w-full lg:w-[130px] xl:w-[140px]">
                      <ServiceNode
                        service={DATA_SERVICE}
                        isHovered={hoveredService === DATA_SERVICE.id || isSecurityHovered}
                        isDirectlyHovered={hoveredService === DATA_SERVICE.id}
                        hoveredId={isSecurityHovered ? null : hoveredService}
                        onHover={setHoveredService}
                        onClick={setSelectedService}
                        size="sm"
                      />
                    </div>
                    <FlowArrow isHighlighted={hoveredService === 'data' || hoveredService === 'ai' || isSecurityHovered} size="sm" />
                    <div className="w-full lg:w-[130px] xl:w-[140px]">
                      <ServiceNode
                        service={AI_SERVICE}
                        isHovered={hoveredService === AI_SERVICE.id || isSecurityHovered}
                        isDirectlyHovered={hoveredService === AI_SERVICE.id}
                        hoveredId={isSecurityHovered ? null : hoveredService}
                        onHover={setHoveredService}
                        onClick={setSelectedService}
                        size="sm"
                      />
                    </div>
                    <FlowArrow isHighlighted={hoveredService === 'ai' || hoveredService === 'martech' || isSecurityHovered} size="sm" />
                    <div className="w-full lg:w-[130px] xl:w-[140px]">
                      <ServiceNode
                        service={MARTECH_SERVICE}
                        isHovered={hoveredService === MARTECH_SERVICE.id || isSecurityHovered}
                        isDirectlyHovered={hoveredService === MARTECH_SERVICE.id}
                        hoveredId={isSecurityHovered ? null : hoveredService}
                        onHover={setHoveredService}
                        onClick={setSelectedService}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-3 font-medium uppercase tracking-wider">
                  Data Intelligence Pipeline
                </p>
              </div>

              <FlowArrow isHighlighted={hoveredService === 'martech' || hoveredService === 'digital' || isSecurityHovered} />

              {/* Tier 4: Process Optimization */}
              <div className="flex flex-col">
                <div className="flex-1 flex items-center">
                  <div className="w-full lg:w-[150px] xl:w-[160px]">
                    <ServiceNode
                      service={DIGITAL_SERVICE}
                      isHovered={hoveredService === DIGITAL_SERVICE.id || isSecurityHovered}
                      isDirectlyHovered={hoveredService === DIGITAL_SERVICE.id}
                      hoveredId={isSecurityHovered ? null : hoveredService}
                      onHover={setHoveredService}
                      onClick={setSelectedService}
                      size="md"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-3 font-medium uppercase tracking-wider">
                  Process Optimization
                </p>
              </div>
            </div>

            {/* Security annotation */}
            <div className="mt-6 pt-4 border-t border-[#0052CC]/15 text-center">
              <p className="text-sm text-gray-500">
                <span className="text-[#0052CC] font-semibold">Security</span> wraps all layers ,  SOC 2, ISO 27001, HIPAA compliant from day one
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-6 h-0.5 bg-[#0052CC]/40" />
                <ChevronRight className="w-3 h-3 text-[#0052CC]/40" />
              </div>
              <span>Data Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-[#0052CC]/10 border-2 border-[#0052CC]/40" />
              <span>Security Wrapper</span>
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  ExternalLink,
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
  position: 'top' | 'left' | 'center-left' | 'center' | 'center-right' | 'right' | 'bottom';
  connections: { targetId: string; label: string; direction: 'to' | 'from' | 'both' }[];
}

const SERVICES: ServiceData[] = [
  {
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
    position: 'top',
    connections: [
      { targetId: 'data', label: 'Runs on', direction: 'to' },
      { targetId: 'ai', label: 'Enables', direction: 'to' },
      { targetId: 'martech', label: 'Hosts', direction: 'to' },
    ],
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
    position: 'center-left',
    connections: [
      { targetId: 'ai', label: 'Feeds models', direction: 'to' },
      { targetId: 'martech', label: 'Powers analytics', direction: 'to' },
    ],
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
    position: 'center',
    connections: [
      { targetId: 'martech', label: 'Powers personalization', direction: 'to' },
      { targetId: 'data', label: 'Consumes features', direction: 'from' },
    ],
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
    position: 'center-right',
    connections: [
      { targetId: 'ai', label: 'Uses predictions', direction: 'from' },
    ],
  },
  {
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
    position: 'bottom',
    connections: [
      { targetId: 'cloud', label: 'Secures', direction: 'to' },
      { targetId: 'data', label: 'Governs', direction: 'to' },
      { targetId: 'ai', label: 'Audits', direction: 'to' },
      { targetId: 'martech', label: 'Protects', direction: 'to' },
      { targetId: 'digital', label: 'Hardens', direction: 'to' },
    ],
  },
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
    position: 'left',
    connections: [
      { targetId: 'data', label: 'Feeds data', direction: 'to' },
      { targetId: 'ai', label: 'Uses AI', direction: 'from' },
    ],
  },
];

// Get all connected service IDs for a given service
function getConnectedServices(serviceId: string): string[] {
  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) return [];

  const connected = new Set<string>();

  // Add direct connections
  service.connections.forEach(conn => connected.add(conn.targetId));

  // Add reverse connections (services that connect TO this one)
  SERVICES.forEach(s => {
    s.connections.forEach(conn => {
      if (conn.targetId === serviceId) {
        connected.add(s.id);
      }
    });
  });

  // Security connects to everything
  if (serviceId === 'security') {
    SERVICES.forEach(s => {
      if (s.id !== 'security') connected.add(s.id);
    });
  }

  return Array.from(connected);
}

// ============================================================================
// CONNECTION LINES SVG COMPONENT
// ============================================================================

interface ConnectionLinesProps {
  hoveredService: string | null;
  selectedService: string | null;
}

function ConnectionLines({ hoveredService, selectedService }: ConnectionLinesProps) {
  const connectedServices = hoveredService ? getConnectedServices(hoveredService) : [];
  const isHighlighted = (from: string, to: string) => {
    if (!hoveredService) return false;
    return (hoveredService === from || hoveredService === to) &&
           (connectedServices.includes(from) || connectedServices.includes(to) || hoveredService === from || hoveredService === to);
  };

  // Define connection paths - these are relative positions for the diagram
  const connections = [
    // Cloud to Data
    { from: 'cloud', to: 'data', path: 'M 400 120 L 400 180 Q 400 200 380 200 L 250 200 L 250 260', label: 'Infrastructure' },
    // Cloud to AI
    { from: 'cloud', to: 'ai', path: 'M 400 120 L 400 260', label: 'Enables' },
    // Cloud to MarTech
    { from: 'cloud', to: 'martech', path: 'M 400 120 L 400 180 Q 400 200 420 200 L 550 200 L 550 260', label: 'Hosts' },
    // Data to AI
    { from: 'data', to: 'ai', path: 'M 300 320 L 350 320', label: 'Feeds' },
    // AI to MarTech
    { from: 'ai', to: 'martech', path: 'M 450 320 L 500 320', label: 'Powers' },
    // Data to Security
    { from: 'data', to: 'security', path: 'M 250 380 L 250 420 Q 250 450 280 450 L 350 450', label: '' },
    // AI to Security
    { from: 'ai', to: 'security', path: 'M 400 380 L 400 450', label: '' },
    // MarTech to Security
    { from: 'martech', to: 'security', path: 'M 550 380 L 550 420 Q 550 450 520 450 L 450 450', label: '' },
    // Digital to Data
    { from: 'digital', to: 'data', path: 'M 120 320 L 200 320', label: 'Feeds' },
    // Digital to Security
    { from: 'digital', to: 'security', path: 'M 120 380 L 120 480 Q 120 510 150 510 L 350 510 L 350 490', label: '' },
  ];

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Animated dash pattern */}
        <pattern id="flowPattern" patternUnits="userSpaceOnUse" width="20" height="1">
          <line x1="0" y1="0" x2="10" y2="0" stroke="#0052CC" strokeWidth="2" strokeLinecap="round">
            <animate
              attributeName="x1"
              from="0"
              to="20"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              from="10"
              to="30"
              dur="1s"
              repeatCount="indefinite"
            />
          </line>
        </pattern>

        {/* Arrow marker */}
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#0052CC" />
        </marker>
        <marker
          id="arrowhead-highlight"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#C4FF61" />
        </marker>

        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Connection lines */}
      {connections.map((conn, index) => {
        const highlighted = isHighlighted(conn.from, conn.to);
        const dimmed = hoveredService && !highlighted && hoveredService !== conn.from && hoveredService !== conn.to;

        return (
          <g key={index}>
            {/* Base line */}
            <path
              d={conn.path}
              fill="none"
              stroke={highlighted ? '#C4FF61' : '#0052CC'}
              strokeWidth={highlighted ? 3 : 2}
              strokeOpacity={dimmed ? 0.15 : highlighted ? 1 : 0.4}
              strokeDasharray={highlighted ? 'none' : '8 4'}
              markerEnd={highlighted ? 'url(#arrowhead-highlight)' : 'url(#arrowhead)'}
              filter={highlighted ? 'url(#glow)' : 'none'}
              style={{
                transition: 'all 0.3s ease-out',
              }}
            />

            {/* Animated flow overlay for highlighted lines */}
            {highlighted && (
              <path
                d={conn.path}
                fill="none"
                stroke="#C4FF61"
                strokeWidth="2"
                strokeDasharray="10 20"
                strokeLinecap="round"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="30"
                  to="0"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </path>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================================
// SERVICE NODE COMPONENT
// ============================================================================

interface ServiceNodeProps {
  service: ServiceData;
  isHovered: boolean;
  isConnected: boolean;
  isDimmed: boolean;
  isSelected: boolean;
  onHover: (id: string | null) => void;
  onClick: (service: ServiceData) => void;
}

function ServiceNode({ service, isHovered, isConnected, isDimmed, isSelected, onHover, onClick }: ServiceNodeProps) {
  const Icon = service.icon;
  const isSecurity = service.id === 'security';

  // Position classes based on service position
  const positionClasses: Record<string, string> = {
    'top': 'top-[5%] left-1/2 -translate-x-1/2',
    'center-left': 'top-[35%] left-[15%]',
    'center': 'top-[35%] left-1/2 -translate-x-1/2',
    'center-right': 'top-[35%] right-[15%]',
    'left': 'top-[35%] left-[2%]',
    'bottom': 'top-[65%] left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={`
        absolute w-[140px] md:w-[160px] cursor-pointer
        transition-all duration-300 ease-out
        ${positionClasses[service.position]}
        ${isSelected ? 'opacity-0 pointer-events-none' : ''}
      `}
      style={{
        transform: `${service.position === 'top' || service.position === 'center' || service.position === 'bottom' ? 'translateX(-50%)' : ''} scale(${isHovered ? 1.08 : 1})`,
        opacity: isDimmed ? 0.35 : 1,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={() => onHover(service.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(service)}
    >
      <div
        className={`
          relative p-4 md:p-5 rounded-sm bg-white
          border-2 transition-all duration-300
          ${isHovered || isConnected ? 'border-[#0052CC] shadow-[0_8px_32px_rgba(0,82,204,0.25)]' : 'border-[#0052CC]/30 shadow-[0_4px_16px_rgba(0,0,0,0.08)]'}
          ${isSecurity ? 'ring-2 ring-[#C4FF61]/30' : ''}
        `}
      >
        {/* Security pulse animation */}
        {isSecurity && (
          <div className="absolute inset-0 rounded-sm">
            <div className="absolute inset-0 rounded-sm bg-[#C4FF61]/10 animate-pulse" />
            <div
              className="absolute inset-0 rounded-sm border-2 border-[#C4FF61]/40"
              style={{
                animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          </div>
        )}

        {/* Icon */}
        <div className={`
          w-10 h-10 md:w-12 md:h-12 rounded-sm flex items-center justify-center mb-3
          ${isSecurity ? 'bg-[#C4FF61]/20' : 'bg-[#0052CC]/10'}
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

        {/* Deployment count */}
        <div className="flex items-baseline gap-1">
          <span className="text-lg md:text-xl font-bold text-[#C4FF61] font-mono">
            {service.deployments}
          </span>
          <span className="text-[10px] md:text-xs text-gray-500">
            {service.deploymentsLabel}
          </span>
        </div>

        {/* Hover tooltip with tech stack */}
        {isHovered && (
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full z-30
                       bg-[#0A1628] text-white text-xs px-3 py-2 rounded-sm shadow-xl
                       whitespace-nowrap"
            style={{
              animation: 'fadeInUp 0.2s ease-out',
            }}
          >
            <div className="flex gap-1.5 flex-wrap justify-center max-w-[200px]">
              {service.techStack.slice(0, 4).map((tech, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]"
                >
                  {tech}
                </span>
              ))}
            </div>
            {/* Arrow */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0A1628] rotate-45" />
          </div>
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
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  // Get integration relationships
  const integrations = service.connections.map(conn => {
    const targetService = SERVICES.find(s => s.id === conn.targetId);
    return {
      name: targetService?.name || '',
      label: conn.label,
      direction: conn.direction,
    };
  });

  // Add reverse connections
  SERVICES.forEach(s => {
    s.connections.forEach(conn => {
      if (conn.targetId === service.id) {
        integrations.push({
          name: s.name,
          label: conn.label,
          direction: 'from' as const,
        });
      }
    });
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/90 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-sm shadow-[0_25px_80px_rgba(0,0,0,0.15)] border-2 border-[#0052CC]"
        style={{
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          transition: 'transform 0.3s ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-sm bg-gray-100 hover:bg-gray-200 transition-colors"
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
            <div>
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

          {/* Integrations */}
          {integrations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-[#0052CC] uppercase tracking-wider mb-3">
                Integrates With
              </h3>
              <div className="space-y-2">
                {integrations.slice(0, 4).map((integration, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className={integration.direction === 'to' ? 'text-[#0052CC]' : 'text-[#C4FF61]'}>
                      {integration.direction === 'to' ? '→' : integration.direction === 'from' ? '←' : '↔'}
                    </span>
                    <span className="font-medium text-[#0A1628]">{integration.name}</span>
                    {integration.label && (
                      <span className="text-gray-400">({integration.label})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Link
              href={service.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-[#0052CC] text-white font-semibold hover:bg-[#003D99] hover:text-[#C4FF61] transition-all duration-200 group"
            >
              See {service.shortName} Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={`/contact?service=${service.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm border-2 border-[#0052CC] text-[#0052CC] font-semibold hover:bg-[#0052CC]/5 transition-all duration-200"
            >
              Talk to {service.shortName} Architect
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
  const containerRef = useRef<HTMLDivElement>(null);

  const connectedServices = hoveredService ? getConnectedServices(hoveredService) : [];

  return (
    <>
      <section className="relative py-16 md:py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.4]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <p className="text-[#0052CC] text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              System Architecture
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-4">
              What We Build
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our solutions integrate as a complete system.
              <span className="hidden md:inline"> Hover to see connections. Click to explore details.</span>
              <span className="md:hidden"> Tap to explore.</span>
            </p>
          </div>

          {/* System Diagram Container */}
          <div
            ref={containerRef}
            className="relative mx-auto"
            style={{
              height: '500px',
              maxWidth: '800px',
            }}
          >
            {/* Connection Lines */}
            <ConnectionLines
              hoveredService={hoveredService}
              selectedService={selectedService?.id || null}
            />

            {/* Service Nodes */}
            {SERVICES.map(service => (
              <ServiceNode
                key={service.id}
                service={service}
                isHovered={hoveredService === service.id}
                isConnected={connectedServices.includes(service.id)}
                isDimmed={hoveredService !== null && hoveredService !== service.id && !connectedServices.includes(service.id)}
                isSelected={selectedService?.id === service.id}
                onHover={setHoveredService}
                onClick={setSelectedService}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-[#0052CC]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #0052CC 0, #0052CC 8px, transparent 8px, transparent 12px)' }} />
              <span>Data Flow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#C4FF61]/30 border border-[#C4FF61]" />
              <span>Security Layer (Always Active)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C4FF61] font-mono font-bold">52</span>
              <span>Deployment Count</span>
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse-ring {
            0%, 100% {
              opacity: 0.4;
              transform: scale(1);
            }
            50% {
              opacity: 0.1;
              transform: scale(1.05);
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

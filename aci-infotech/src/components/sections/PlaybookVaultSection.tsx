'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  X,
  ArrowRight,
  Sparkles,
  Zap,
  Radio,
  Globe,
  BarChart3,
  Shield,
  Truck,
  Cloud,
  GitMerge
} from 'lucide-react';

// ============================================================================
// PLAYBOOK DATA
// ============================================================================

interface PlaybookData {
  id: string;
  name: string;
  shortName: string;
  displayTitle: string;
  slug: string;
  deployments: number;
  challengePattern: string[];
  keyLearnings: string[];
  outcomes: { metric: string; description: string }[];
  industries: string[];
  architecture: string[];
  category: 'data' | 'cloud' | 'analytics' | 'integration';
  gradient: string;
  iconType: 'zap' | 'radio' | 'globe' | 'barchart' | 'shield' | 'truck' | 'cloud' | 'gitmerge';
}

const PLAYBOOKS: PlaybookData[] = [
  {
    id: 'post-acquisition',
    name: 'Post-Acquisition System Consolidation',
    shortName: 'Post-Acquisition',
    displayTitle: 'Post-M&A System Consolidation',
    slug: 'post-acquisition-consolidation',
    deployments: 23,
    challengePattern: [
      '30-50 disparate systems post-merger',
      'Multiple data formats, inconsistent standards',
      'Finance teams manually reconciling',
      'Regulatory compliance needs unified audit',
    ],
    keyLearnings: [
      'Phased migration with parallel runs eliminates cutover risk',
      'Automated data quality gates catch 95% of issues',
      'SOX compliance must be designed in, not retrofitted',
    ],
    outcomes: [
      { metric: '$9.2M', description: 'Year-one savings' },
      { metric: '0', description: 'Disruptions' },
      { metric: '78%', description: 'Effort reduced' },
    ],
    industries: ['Financial Services', 'Private Equity', 'Healthcare', 'Manufacturing'],
    architecture: ['SAP S/4HANA', 'Python ETL', 'Azure/AWS', 'PowerBI', 'Auto Reconciliation', 'Audit Logging'],
    category: 'integration',
    gradient: 'from-violet-500 to-purple-600',
    iconType: 'zap',
  },
  {
    id: 'multi-location',
    name: 'Multi-Location Real-Time Data Platform',
    shortName: 'Real-Time Platform',
    displayTitle: 'Multi-Location Real-Time Data',
    slug: 'real-time-data-platform',
    deployments: 47,
    challengePattern: [
      '300-1000+ locations generating data',
      'Zero tolerance for payment downtime',
      'Real-time customer behavior insights needed',
      'Legacy batch ETL causing 12-24hr latency',
    ],
    keyLearnings: [
      'Payment integration requires dual-write pattern',
      'Auto-scaling for weekend traffic spikes (3x load)',
      'Dynatrace observability prevents 90% of issues',
    ],
    outcomes: [
      { metric: '64%', description: 'Latency reduced' },
      { metric: '0', description: 'Disruptions' },
      { metric: '99.97%', description: 'Uptime' },
    ],
    industries: ['Retail', 'QSR/Fast Food', 'Convenience Stores', 'Hospitality'],
    architecture: ['Kafka/Kinesis', 'Databricks', 'Delta Lake', 'Salesforce/Braze', 'Dynatrace', 'Real-time Dashboards'],
    category: 'data',
    gradient: 'from-cyan-500 to-blue-600',
    iconType: 'radio',
  },
  {
    id: 'global-unification',
    name: 'Global Data Unification',
    shortName: 'Global Unification',
    displayTitle: 'Global Operations Data Unification',
    slug: 'global-data-unification',
    deployments: 31,
    challengePattern: [
      '40-60 countries with regional silos',
      'Inconsistent data standards globally',
      'No unified view of operations',
      'Executive reporting takes weeks',
    ],
    keyLearnings: [
      'MDM must be established before integration',
      'Regional compliance varies (GDPR, local laws)',
      'API integration more flexible than batch',
    ],
    outcomes: [
      { metric: '50%', description: 'Faster decisions' },
      { metric: '100%', description: 'Visibility' },
      { metric: '65%', description: 'Duplicates removed' },
    ],
    industries: ['Hospitality', 'Manufacturing', 'Logistics', 'Professional Services'],
    architecture: ['Informatica IICS', 'MDM', 'Cloud Data Lakes', 'API Gateway', 'Global Dashboards', 'Regional Integration'],
    category: 'data',
    gradient: 'from-emerald-500 to-teal-600',
    iconType: 'globe',
  },
  {
    id: 'self-service-analytics',
    name: 'Enterprise Self-Service Analytics',
    shortName: 'Self-Service Analytics',
    displayTitle: 'Enterprise Self-Service Analytics',
    slug: 'self-service-analytics',
    deployments: 19,
    challengePattern: [
      '5,000-15,000 users need data access',
      'IT backlog creating 2-week delays',
      'Users can\'t answer questions real-time',
      'Row-level security required',
    ],
    keyLearnings: [
      'Row-level security must be designed upfront',
      'Pre-configured dashboards cover 80% of uses',
      'Power user training creates champions',
    ],
    outcomes: [
      { metric: '88%', description: 'IT requests reduced' },
      { metric: '92%', description: 'Satisfaction' },
      { metric: '2hrs', description: 'Time-to-insight' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Insurance', 'Retail'],
    architecture: ['Databricks', 'Power BI/Tableau', 'Row-Level Security', 'Real-time Refresh', 'Pre-built Dashboards', 'HIPAA Logging'],
    category: 'analytics',
    gradient: 'from-amber-500 to-orange-600',
    iconType: 'barchart',
  },
  {
    id: 'healthcare-data',
    name: 'Multi-Jurisdiction Healthcare Data',
    shortName: 'Healthcare Data',
    displayTitle: 'Multi-Jurisdiction Healthcare Data',
    slug: 'healthcare-data-platform',
    deployments: 12,
    challengePattern: [
      'Patient data across multiple countries',
      'Different compliance per region (HIPAA, GDPR)',
      'No unified patient identity',
      'Audit requirements extremely stringent',
    ],
    keyLearnings: [
      'Compliance must be automated, not manual',
      'Master patient index reduces duplicates 60%',
      'Encryption is baseline, not optional',
    ],
    outcomes: [
      { metric: '100%', description: 'Identity unified' },
      { metric: '58%', description: 'Duplicates removed' },
      { metric: '0', description: 'Violations' },
    ],
    industries: ['Healthcare Services', 'Healthcare Tech', 'Clinical Research', 'Pharma'],
    architecture: ['Patient MDM', 'Compliance Automation', 'Encrypted Storage', 'API Gateway', 'Clinical Integration', 'Audit Logging'],
    category: 'data',
    gradient: 'from-rose-500 to-pink-600',
    iconType: 'shield',
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Visibility',
    shortName: 'Supply Chain',
    displayTitle: 'End-to-End Supply Chain Visibility',
    slug: 'supply-chain-visibility',
    deployments: 28,
    challengePattern: [
      'Data scattered across procurement/logistics',
      'No end-to-end supplier visibility',
      'Forecasting based on outdated data',
      'Disruption response takes days',
    ],
    keyLearnings: [
      'IoT integration reduces blind spots',
      'Supplier data standardization is critical',
      'ML models beat historical trends for forecasting',
    ],
    outcomes: [
      { metric: '100%', description: 'E2E visibility' },
      { metric: '25%', description: 'Cost reduced' },
      { metric: '4hrs', description: 'Response time' },
    ],
    industries: ['Food & Beverage', 'Manufacturing', 'Retail', 'Automotive'],
    architecture: ['Snowflake/Databricks', 'IoT Integration', 'SAP/Oracle', 'ML Forecasting', 'Tableau/PowerBI', 'Real-time Alerting'],
    category: 'analytics',
    gradient: 'from-lime-500 to-green-600',
    iconType: 'truck',
  },
  {
    id: 'cloud-migration',
    name: 'Legacy to Cloud Migration',
    shortName: 'Cloud Migration',
    displayTitle: 'Legacy System Cloud Migration',
    slug: 'legacy-cloud-migration',
    deployments: 52,
    challengePattern: [
      'On-prem Hadoop/Teradata/Oracle aging',
      'Infrastructure costs growing 15-20%/year',
      'Scaling requires 6-12 month procurement',
      'Maintenance consuming 40%+ team time',
    ],
    keyLearnings: [
      'Lift-and-shift misses cloud benefits',
      'Re-architecture delivers 3x better ROI',
      'Zero-downtime needs parallel run strategy',
    ],
    outcomes: [
      { metric: '68%', description: 'Cost cut' },
      { metric: '10x', description: 'Speed gain' },
      { metric: '$3.2M', description: '3yr savings' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Retail', 'Education'],
    architecture: ['AWS/Azure/GCP', 'Databricks/Snowflake', 'Migration Tools', 'Data Validation', 'Terraform IaC', 'Cost Optimization'],
    category: 'cloud',
    gradient: 'from-blue-500 to-indigo-600',
    iconType: 'cloud',
  },
  {
    id: 'data-integration',
    name: 'Multi-Source Data Integration',
    shortName: 'Data Integration',
    displayTitle: 'Multi-Source Data Integration',
    slug: 'multi-source-integration',
    deployments: 34,
    challengePattern: [
      '20-40 disparate source systems',
      'SaaS, on-prem, spreadsheets, APIs mixed',
      'No unified data model or standards',
      'Data quality varies dramatically',
    ],
    keyLearnings: [
      'Source discovery takes 3x longer than expected',
      'Quality issues always surface (automate detection)',
      'CDC required for real-time sources',
    ],
    outcomes: [
      { metric: '32', description: 'Avg systems' },
      { metric: '85%', description: 'Quality improved' },
      { metric: '99.8%', description: 'Reliability' },
    ],
    industries: ['Technology', 'Financial Services', 'Healthcare', 'Retail'],
    architecture: ['Fivetran/Airbyte', 'Informatica/Mulesoft', 'Databricks/Snowflake', 'Great Expectations', 'Unified Model', 'Self-healing Pipelines'],
    category: 'integration',
    gradient: 'from-fuchsia-500 to-purple-600',
    iconType: 'gitmerge',
  },
];

// Icon component map
const IconMap = {
  zap: Zap,
  radio: Radio,
  globe: Globe,
  barchart: BarChart3,
  shield: Shield,
  truck: Truck,
  cloud: Cloud,
  gitmerge: GitMerge,
};

// ============================================================================
// ANIMATED SVG BACKGROUND - FLOWING DATA ARCHITECTURE
// ============================================================================

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const nodesRef = useRef<Node[]>([]);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    color: string;
    life: number;
    maxLife: number;
  }

  interface Node {
    x: number;
    y: number;
    radius: number;
    pulsePhase: number;
    connections: number[];
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize nodes (architecture points)
    const initNodes = () => {
      const nodes: Node[] = [];
      const numNodes = 12;
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 3 + Math.random() * 4,
          pulsePhase: Math.random() * Math.PI * 2,
          connections: [],
        });
      }
      // Create connections
      nodes.forEach((node, i) => {
        const numConnections = 2 + Math.floor(Math.random() * 2);
        for (let j = 0; j < numConnections; j++) {
          const targetIndex = Math.floor(Math.random() * numNodes);
          if (targetIndex !== i && !node.connections.includes(targetIndex)) {
            node.connections.push(targetIndex);
          }
        }
      });
      nodesRef.current = nodes;
    };

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        particles.push(createParticle(canvas.width, canvas.height));
      }
      particlesRef.current = particles;
    };

    const createParticle = (width: number, height: number): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.3,
      color: Math.random() > 0.5 ? '#0052CC' : '#C4FF61',
      life: 0,
      maxLife: 200 + Math.random() * 300,
    });

    initNodes();
    initParticles();

    let time = 0;
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      // Draw connection lines with flowing effect
      ctx.lineWidth = 1;
      nodesRef.current.forEach((node, i) => {
        node.connections.forEach(targetIndex => {
          const target = nodesRef.current[targetIndex];
          if (!target) return;

          const gradient = ctx.createLinearGradient(node.x, node.y, target.x, target.y);
          const flowOffset = (time * 2 + i * 0.5) % 1;

          gradient.addColorStop(0, 'rgba(0, 82, 204, 0)');
          gradient.addColorStop(Math.max(0, flowOffset - 0.2), 'rgba(0, 82, 204, 0)');
          gradient.addColorStop(flowOffset, 'rgba(0, 82, 204, 0.4)');
          gradient.addColorStop(Math.min(1, flowOffset + 0.2), 'rgba(0, 82, 204, 0)');
          gradient.addColorStop(1, 'rgba(0, 82, 204, 0)');

          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        });
      });

      // Draw and animate nodes
      nodesRef.current.forEach((node, i) => {
        node.pulsePhase += 0.02;
        const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;
        const currentRadius = node.radius + pulse * 2;

        // Glow effect
        const glowGradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, currentRadius * 4
        );
        glowGradient.addColorStop(0, 'rgba(0, 82, 204, 0.3)');
        glowGradient.addColorStop(0.5, 'rgba(0, 82, 204, 0.1)');
        glowGradient.addColorStop(1, 'rgba(0, 82, 204, 0)');

        ctx.beginPath();
        ctx.fillStyle = glowGradient;
        ctx.arc(node.x, node.y, currentRadius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 82, 204, ${0.6 + pulse * 0.4})`;
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner highlight
        ctx.beginPath();
        ctx.fillStyle = 'rgba(196, 255, 97, 0.8)';
        ctx.arc(node.x, node.y, currentRadius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and update particles
      particlesRef.current.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        // Fade in/out
        let alpha = particle.opacity;
        if (particle.life < 30) {
          alpha = (particle.life / 30) * particle.opacity;
        } else if (particle.life > particle.maxLife - 30) {
          alpha = ((particle.maxLife - particle.life) / 30) * particle.opacity;
        }

        ctx.beginPath();
        ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Reset particle if needed
        if (particle.life > particle.maxLife ||
            particle.x < -10 || particle.x > canvas.width + 10 ||
            particle.y < -10 || particle.y > canvas.height + 10) {
          particlesRef.current[i] = createParticle(canvas.width, canvas.height);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

// ============================================================================
// GLASSMORPHIC PLAYBOOK CARD WITH PARALLAX
// ============================================================================

interface PlaybookCardProps {
  playbook: PlaybookData;
  index: number;
  isActive: boolean;
  isAnyActive: boolean;
  onSelect: () => void;
  mousePosition: { x: number; y: number };
}

function PlaybookCard({ playbook, index, isActive, isAnyActive, onSelect, mousePosition }: PlaybookCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [cardRect, setCardRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (cardRef.current) {
      setCardRect(cardRef.current.getBoundingClientRect());
    }
  }, []);

  // Calculate parallax transform based on mouse position
  const getParallaxTransform = useCallback(() => {
    if (!isHovered || !cardRect) return {};

    const cardCenterX = cardRect.left + cardRect.width / 2;
    const cardCenterY = cardRect.top + cardRect.height / 2;

    const deltaX = (mousePosition.x - cardCenterX) / cardRect.width;
    const deltaY = (mousePosition.y - cardCenterY) / cardRect.height;

    const rotateY = deltaX * 10;
    const rotateX = -deltaY * 10;

    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
    };
  }, [isHovered, cardRect, mousePosition]);

  const parallaxStyle = getParallaxTransform();

  // Staggered entrance animation
  const entranceDelay = index * 100;

  if (isActive) return null;

  return (
    <div
      ref={cardRef}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative cursor-pointer
        transition-all duration-500 ease-out
        ${isAnyActive && !isActive ? 'opacity-40 scale-95 blur-[1px]' : 'opacity-100'}
      `}
      style={{
        animation: `fadeInUp 0.6s ease-out ${entranceDelay}ms both`,
        ...parallaxStyle,
        transformStyle: 'preserve-3d',
        transition: isHovered ? 'transform 0.1s ease-out' : 'all 0.5s ease-out',
      }}
    >
      {/* Glassmorphic card container */}
      <div
        className="relative h-full rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: isHovered
            ? '0 25px 50px -12px rgba(0, 82, 204, 0.4), 0 0 0 1px rgba(196, 255, 97, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
            : '0 10px 40px -10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        {/* Animated gradient border */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, ${playbook.gradient.includes('violet') ? '#8B5CF6' : playbook.gradient.includes('cyan') ? '#06B6D4' : playbook.gradient.includes('emerald') ? '#10B981' : playbook.gradient.includes('amber') ? '#F59E0B' : playbook.gradient.includes('rose') ? '#F43F5E' : playbook.gradient.includes('lime') ? '#84CC16' : playbook.gradient.includes('blue') ? '#3B82F6' : '#D946EF'}, transparent)`,
            padding: '2px',
            borderRadius: '1rem',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
          }}
        />

        {/* Card content */}
        <div className="relative p-6 h-full flex flex-col">
          {/* Top section: Icon + Category */}
          <div className="flex items-start justify-between mb-4">
            {(() => {
              const IconComponent = IconMap[playbook.iconType];
              return (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300"
                >
                  <IconComponent className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
              );
            })()}
            <div className="flex flex-col items-end">
              <span className="text-[#C4FF61] font-mono text-sm font-bold">
                {playbook.deployments}x
              </span>
              <span className="text-white/60 text-xs">deployed</span>
            </div>
          </div>

          {/* Title */}
          <h5 className="text-white font-medium text-xs leading-tight mb-3 group-hover:text-[#C4FF61] transition-colors duration-300">
            {playbook.displayTitle}
          </h5>

          {/* Quick stats */}
          <div className="flex gap-2 mb-4">
            {playbook.outcomes.slice(0, 2).map((outcome, i) => (
              <div
                key={i}
                className="px-2 py-1 rounded-md bg-white/5 border border-white/10"
              >
                <span className="text-[#C4FF61] font-mono text-xs font-bold">{outcome.metric}</span>
                <span className="text-white/70 text-[10px] ml-1">{outcome.description}</span>
              </div>
            ))}
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1 mt-auto mb-4">
            {playbook.architecture.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#0052CC]/20 text-[#60A5FA] border border-[#0052CC]/30"
              >
                {tech}
              </span>
            ))}
            {playbook.architecture.length > 3 && (
              <span className="px-2 py-0.5 rounded text-[10px] text-white/60">
                +{playbook.architecture.length - 3}
              </span>
            )}
          </div>

          {/* CTA indicator */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-white/70 text-xs group-hover:text-white transition-colors">
              Explore playbook
            </span>
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-[#C4FF61] group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>

        {/* Shine effect on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
            transform: 'translateX(-100%)',
            animation: isHovered ? 'shine 0.8s ease-out forwards' : 'none',
          }}
        />
      </div>

      {/* Floating glow effect */}
      <div
        className={`
          absolute -inset-4 rounded-3xl pointer-events-none transition-opacity duration-500
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background: `radial-gradient(ellipse at center, rgba(0, 82, 204, 0.2) 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
}

// ============================================================================
// EXPANDED PLAYBOOK DETAIL PANEL
// ============================================================================

interface ExpandedPanelProps {
  playbook: PlaybookData;
  onClose: () => void;
}

function ExpandedPanel({ playbook, onClose }: ExpandedPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => setContentReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setContentReady(false);
    setTimeout(onClose, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A1628]/90 backdrop-blur-xl"
        onClick={handleClose}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease-out',
        }}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl"
        style={{
          background: 'linear-gradient(180deg, rgba(10, 22, 40, 0.98) 0%, rgba(0, 21, 41, 0.98) 100%)',
          border: '1px solid rgba(0, 82, 204, 0.3)',
          boxShadow: '0 50px 100px -20px rgba(0, 82, 204, 0.4), 0 0 60px rgba(0, 82, 204, 0.2)',
          transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(50px)',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Animated border glow */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent, rgba(0, 82, 204, 0.5), rgba(196, 255, 97, 0.5), transparent)`,
            padding: '1px',
            borderRadius: '1.5rem',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
            animation: 'rotate 4s linear infinite',
            opacity: 0.5,
          }}
        />

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
        >
          <X className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
        </button>

        {/* Header */}
        <div
          className="relative p-8 pb-0"
          style={{
            opacity: contentReady ? 1 : 0,
            transform: contentReady ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.5s ease-out 0.1s',
          }}
        >
          <div className="flex items-start gap-6">
            {(() => {
              const IconComponent = IconMap[playbook.iconType];
              return (
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center bg-white/5 border border-white/10"
                >
                  <IconComponent className="w-7 h-7 text-white/90" strokeWidth={1.5} />
                </div>
              );
            })()}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#C4FF61]/10 text-[#C4FF61] text-sm font-medium border border-[#C4FF61]/20">
                  {playbook.deployments}x Deployed
                </span>
                <span className="text-white/40 text-sm">|</span>
                <span className="text-white/40 text-sm capitalize">{playbook.category} Architecture</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {playbook.displayTitle}
              </h2>
              <p className="text-white/60 text-lg">{playbook.name}</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div
          className="p-8 grid md:grid-cols-3 gap-8"
          style={{
            opacity: contentReady ? 1 : 0,
            transform: contentReady ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-out 0.2s',
          }}
        >
          {/* Challenge Pattern */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base capitalize tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C4FF61]" />
              Challenge Pattern
            </h3>
            <ul className="space-y-3">
              {playbook.challengePattern.map((item, i) => (
                <li
                  key={i}
                  className="text-white/70 text-sm flex items-start gap-3"
                  style={{
                    opacity: contentReady ? 1 : 0,
                    transform: contentReady ? 'translateX(0)' : 'translateX(-10px)',
                    transition: `all 0.4s ease-out ${0.3 + i * 0.1}s`,
                  }}
                >
                  <span className="text-[#0052CC] mt-1">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Key Learnings */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base capitalize tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C4FF61]" />
              Key Learnings
            </h3>
            <ul className="space-y-3">
              {playbook.keyLearnings.map((item, i) => (
                <li
                  key={i}
                  className="text-white/70 text-sm flex items-start gap-3"
                  style={{
                    opacity: contentReady ? 1 : 0,
                    transform: contentReady ? 'translateX(0)' : 'translateX(-10px)',
                    transition: `all 0.4s ease-out ${0.4 + i * 0.1}s`,
                  }}
                >
                  <span className="text-[#C4FF61]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Outcomes */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-base capitalize tracking-wide flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C4FF61]" />
              Outcomes Achieved
            </h3>
            <div className="grid gap-3">
              {playbook.outcomes.map((outcome, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10"
                  style={{
                    opacity: contentReady ? 1 : 0,
                    transform: contentReady ? 'scale(1)' : 'scale(0.9)',
                    transition: `all 0.4s ease-out ${0.5 + i * 0.1}s`,
                  }}
                >
                  <div className="text-2xl font-bold text-[#C4FF61] font-mono">
                    {outcome.metric}
                  </div>
                  <div className="text-white/50 text-sm">{outcome.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section: Tech stack & CTA */}
        <div
          className="p-8 pt-0"
          style={{
            opacity: contentReady ? 1 : 0,
            transform: contentReady ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-out 0.4s',
          }}
        >
          {/* Architecture Stack */}
          <div className="mb-8">
            <h3 className="text-white font-semibold text-base capitalize tracking-wide mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#0052CC]" />
              Architecture Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {playbook.architecture.map((tech, i) => (
                <span
                  key={i}
                  className="px-4 py-2 rounded-lg bg-[#0052CC]/10 text-white/80 text-sm font-medium border border-[#0052CC]/30 hover:border-[#0052CC]/60 hover:bg-[#0052CC]/20 transition-all duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div className="mb-8">
            <h3 className="text-white font-semibold text-base capitalize tracking-wide mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#0052CC]" />
              Industries Deployed
            </h3>
            <div className="flex flex-wrap gap-2">
              {playbook.industries.map((industry, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-white/5 text-white/60 text-sm border border-white/10"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
            <Link
              href={`/contact?playbook=${playbook.id}`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-[#0052CC] text-white font-semibold hover:text-[#C4FF61] transition-all duration-300 cursor-pointer group"
            >
              <span className="w-2 h-2 rounded-full bg-[#C4FF61] group-hover:scale-125 transition-transform" />
              Talk to the Architect
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link
              href={`/playbooks/${playbook.slug}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-transparent border border-white text-white font-medium hover:border-[#C4FF61] hover:text-[#C4FF61] transition-all duration-300 cursor-pointer"
            >
              View Full Playbook
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION HEADER WITH ANIMATED COUNTER
// ============================================================================

function SectionHeader() {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const totalDeployments = PLAYBOOKS.reduce((sum, p) => sum + p.deployments, 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * totalDeployments));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(totalDeployments);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, totalDeployments]);

  return (
    <div ref={headerRef} className="text-center mb-16 relative">
      {/* Decorative element */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-8 w-24 h-1 bg-gradient-to-r from-transparent via-[#0052CC] to-transparent rounded-full" />

      <p
        className="text-[#C4FF61] font-medium text-sm uppercase tracking-[0.2em] mb-4"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out',
        }}
      >
        The Architecture Studio
      </p>

      <h2
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out 0.1s',
        }}
      >
        Proven{' '}
        <span className="relative inline-block">
          Architectures
          <svg
            className="absolute -bottom-2 left-0 w-full"
            viewBox="0 0 200 12"
            fill="none"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 0.6s ease-out 0.5s',
            }}
          >
            <path
              d="M2 10C50 2 150 2 198 10"
              stroke="#C4FF61"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                strokeDasharray: 200,
                strokeDashoffset: isVisible ? 0 : 200,
                transition: 'stroke-dashoffset 1s ease-out 0.6s',
              }}
            />
          </svg>
        </span>
      </h2>

      <p
        className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out 0.2s',
        }}
      >
        Every pattern battle-tested. Every solution documented. Every outcome measured.
      </p>

      {/* Counter display */}
      <div
        className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease-out 0.3s',
        }}
      >
        <div className="text-4xl md:text-5xl font-bold text-[#C4FF61] font-mono">
          {count}+
        </div>
        <div className="text-left">
          <div className="text-white font-semibold">Enterprise Deployments</div>
          <div className="text-white/50 text-sm">across {PLAYBOOKS.length} architecture patterns</div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PlaybookVaultSection() {
  const [activePlaybook, setActivePlaybook] = useState<PlaybookData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  // Track mouse position for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-24 md:py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0A1628 0%, #001529 50%, #0A1628 100%)',
        }}
      >
        {/* Animated background */}
        <AnimatedBackground />

        {/* Gradient overlays */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 82, 204, 0.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(196, 255, 97, 0.1) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <SectionHeader />

          {/* Playbook Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLAYBOOKS.map((playbook, index) => (
              <PlaybookCard
                key={playbook.id}
                playbook={playbook}
                index={index}
                isActive={activePlaybook?.id === playbook.id}
                isAnyActive={activePlaybook !== null}
                onSelect={() => setActivePlaybook(playbook)}
                mousePosition={mousePosition}
              />
            ))}
          </div>

          {/* Footer CTA */}
          <div
            className="mt-16 text-center"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.8s both',
            }}
          >
            <p className="text-white/40 text-sm mb-6">
              Can't find your exact scenario? We've documented 100+ patterns beyond these 8.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-[#0052CC] text-white font-semibold hover:text-[#C4FF61] transition-all duration-300 cursor-pointer group"
              >
                <span className="w-2 h-2 rounded-full bg-[#C4FF61] group-hover:scale-125 transition-transform" />
                Talk to an Architect
              </Link>
              <Link
                href="/playbooks"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-transparent border border-white text-white font-medium hover:border-[#C4FF61] hover:text-[#C4FF61] transition-all duration-300 cursor-pointer"
              >
                Explore All Playbooks
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shine {
            to {
              transform: translateX(200%);
            }
          }

          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </section>

      {/* Expanded Panel */}
      {activePlaybook && (
        <ExpandedPanel
          playbook={activePlaybook}
          onClose={() => setActivePlaybook(null)}
        />
      )}
    </>
  );
}

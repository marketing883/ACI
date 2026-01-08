'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { X, ChevronRight, Sparkles } from 'lucide-react';

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
  },
];

// ============================================================================
// FLOATING PARTICLES BACKGROUND
// ============================================================================

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    pulse: number;
  }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particleCount = 60;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.pulse += 0.02;

        if (particle.x < 0) particle.x = canvas.offsetWidth;
        if (particle.x > canvas.offsetWidth) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight;
        if (particle.y > canvas.offsetHeight) particle.y = 0;

        const pulseOpacity = particle.opacity * (0.7 + 0.3 * Math.sin(particle.pulse));

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 180, 255, ${pulseOpacity})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 180, 255, ${pulseOpacity * 0.15})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// ============================================================================
// HOLOGRAPHIC CARD COMPONENT
// ============================================================================

interface HolographicCardProps {
  playbook: PlaybookData;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function HolographicCard({ playbook, index, isSelected, onSelect }: HolographicCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [localMouse, setLocalMouse] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setLocalMouse({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const rotateX = isHovered ? (localMouse.y - 0.5) * -15 : 0;
  const rotateY = isHovered ? (localMouse.x - 0.5) * 15 : 0;

  return (
    <button
      ref={cardRef}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setLocalMouse({ x: 0.5, y: 0.5 });
      }}
      onMouseMove={handleMouseMove}
      className="group relative w-full text-left focus:outline-none cursor-pointer"
      style={{ perspective: '1000px' }}
    >
      <div
        className="relative rounded-2xl p-6 transition-all duration-500 ease-out"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? '30px' : '0'}) scale(${isHovered ? 1.02 : 1})`,
          transformStyle: 'preserve-3d',
          background: isSelected
            ? 'linear-gradient(135deg, rgba(0, 82, 204, 0.4) 0%, rgba(30, 58, 95, 0.95) 100%)'
            : isHovered
              ? 'linear-gradient(135deg, rgba(30, 58, 95, 0.9) 0%, rgba(20, 40, 70, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(20, 45, 80, 0.7) 0%, rgba(15, 30, 55, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid',
          borderColor: isSelected
            ? 'rgba(100, 180, 255, 0.7)'
            : isHovered
              ? 'rgba(100, 180, 255, 0.5)'
              : 'rgba(100, 180, 255, 0.2)',
          boxShadow: isSelected
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px rgba(100, 180, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : isHovered
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(100, 180, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 10px 40px -10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        {/* Holographic shine effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${localMouse.x * 100}% ${localMouse.y * 100}%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`
              : 'none',
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Glowing border effect on hover */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(100, 180, 255, 0.3) 0%, transparent 50%, rgba(150, 100, 255, 0.2) 100%)',
            opacity: isHovered || isSelected ? 1 : 0,
            transition: 'opacity 0.5s ease',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMaskComposite: 'xor',
            padding: '1px',
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Deployment badge */}
          <div className="flex items-center justify-between mb-4">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold"
              style={{
                background: 'linear-gradient(135deg, rgba(100, 180, 255, 0.2) 0%, rgba(100, 150, 255, 0.1) 100%)',
                border: '1px solid rgba(100, 180, 255, 0.3)',
                color: '#64B4FF',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: '#4ADE80',
                  boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              {playbook.deployments}x Deployed
            </div>

            {/* Arrow indicator */}
            <ChevronRight
              className="w-5 h-5 transition-all duration-300"
              style={{
                color: isHovered || isSelected ? '#64B4FF' : 'rgba(255, 255, 255, 0.3)',
                transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
              }}
            />
          </div>

          {/* Title */}
          <h3
            className="text-xl font-bold mb-3 transition-colors duration-300"
            style={{
              color: isHovered || isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.9)',
              textShadow: isHovered || isSelected ? '0 0 20px rgba(100, 180, 255, 0.3)' : 'none',
            }}
          >
            {playbook.displayTitle}
          </h3>

          {/* Industries preview */}
          <div className="flex flex-wrap gap-2 mb-4">
            {playbook.industries.slice(0, 3).map((industry, i) => (
              <span
                key={i}
                className="text-xs px-2 py-1 rounded-md transition-all duration-300"
                style={{
                  background: isHovered
                    ? 'rgba(100, 180, 255, 0.15)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isHovered ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)',
                  border: `1px solid ${isHovered ? 'rgba(100, 180, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                }}
              >
                {industry}
              </span>
            ))}
            {playbook.industries.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-md" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                +{playbook.industries.length - 3}
              </span>
            )}
          </div>

          {/* Click to explore hint */}
          <div
            className="flex items-center gap-2 text-xs transition-all duration-300"
            style={{
              color: isHovered ? '#64B4FF' : 'rgba(255, 255, 255, 0.3)',
              opacity: isHovered ? 1 : 0.6,
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>{isSelected ? 'Click to close' : 'Click to explore'}</span>
          </div>
        </div>

        {/* Bottom light trail */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: isHovered || isSelected
              ? 'linear-gradient(90deg, transparent 0%, rgba(100, 180, 255, 0.8) 50%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(100, 180, 255, 0.2) 50%, transparent 100%)',
            transition: 'all 0.5s ease',
          }}
        />
      </div>
    </button>
  );
}

// ============================================================================
// EXPANDED DETAIL PANEL WITH SMOOTH PERSPECTIVE ANIMATION
// ============================================================================

function ExpandedDetailPanel({
  playbook,
  onClose,
  isVisible,
}: {
  playbook: PlaybookData;
  onClose: () => void;
  isVisible: boolean;
}) {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setContentVisible(true), 150);
      return () => clearTimeout(timer);
    } else {
      setContentVisible(false);
    }
  }, [isVisible]);

  return (
    <div
      className="overflow-hidden"
      style={{
        perspective: '2000px',
        perspectiveOrigin: 'center top',
      }}
    >
      <div
        className="relative rounded-2xl transition-all ease-out"
        style={{
          transitionDuration: '800ms',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: isVisible ? '700px' : '0',
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? 'rotateX(0deg) translateY(0) scale(1)'
            : 'rotateX(-15deg) translateY(-30px) scale(0.95)',
          transformOrigin: 'center top',
          background: 'linear-gradient(135deg, rgba(20, 45, 80, 0.95) 0%, rgba(10, 25, 50, 0.98) 100%)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(100, 180, 255, 0.3)',
          boxShadow: isVisible
            ? '0 30px 60px -20px rgba(0, 0, 0, 0.5), 0 0 80px rgba(100, 180, 255, 0.15)'
            : 'none',
          marginTop: isVisible ? '24px' : '0',
          marginBottom: isVisible ? '24px' : '0',
        }}
      >
        {/* Animated border glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.5s ease 0.3s',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(100, 180, 255, 0.3), transparent)',
              animation: isVisible ? 'shimmer 2s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        {/* Header */}
        <div
          className="relative flex items-start justify-between p-8 pb-6 border-b border-white/10"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.5s ease 0.2s',
          }}
        >
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono font-bold mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.2) 0%, rgba(74, 222, 128, 0.1) 100%)',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                color: '#4ADE80',
                boxShadow: '0 0 20px rgba(74, 222, 128, 0.2)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: '#4ADE80',
                  boxShadow: '0 0 8px rgba(74, 222, 128, 0.8)',
                }}
              />
              DEPLOYED {playbook.deployments}x
            </div>
            <h3
              className="text-3xl md:text-4xl font-bold text-white"
              style={{ textShadow: '0 0 30px rgba(100, 180, 255, 0.2)' }}
            >
              {playbook.displayTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-xl transition-all duration-300 hover:scale-110"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <X className="w-6 h-6 text-white/70 hover:text-white" />
          </button>
        </div>

        {/* Content Grid */}
        <div
          className="relative p-8 grid md:grid-cols-3 gap-8"
          style={{
            opacity: contentVisible ? 1 : 0,
            transform: contentVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.3s',
          }}
        >
          {/* Column 1: Challenge & Learnings */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-white/90 mb-4">
                Challenge Pattern
              </h4>
              <ul className="space-y-3">
                {playbook.challengePattern.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                    <span className="text-blue-400 mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-white/90 mb-4">
                Key Learnings
              </h4>
              <ul className="space-y-3">
                {playbook.keyLearnings.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70 text-sm">
                    <span className="text-emerald-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Outcomes */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-white/90 mb-4">
                Outcomes Achieved
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {playbook.outcomes.map((outcome, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl text-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(100, 180, 255, 0.1) 0%, rgba(100, 150, 255, 0.05) 100%)',
                      border: '1px solid rgba(100, 180, 255, 0.2)',
                    }}
                  >
                    <div
                      className="text-2xl font-bold font-mono mb-1"
                      style={{ color: '#64B4FF', textShadow: '0 0 15px rgba(100, 180, 255, 0.4)' }}
                    >
                      {outcome.metric}
                    </div>
                    <div className="text-xs text-white/50">{outcome.description}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-white/90 mb-4">
                Industries
              </h4>
              <div className="flex flex-wrap gap-2">
                {playbook.industries.map((ind, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg text-xs text-white/70"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Architecture & CTA */}
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold tracking-wider text-white/90 mb-4">
                Architecture Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {playbook.architecture.map((comp, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono"
                    style={{
                      background: 'linear-gradient(135deg, rgba(150, 100, 255, 0.15) 0%, rgba(100, 150, 255, 0.1) 100%)',
                      border: '1px solid rgba(150, 100, 255, 0.3)',
                      color: 'rgba(200, 180, 255, 0.9)',
                    }}
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
            <div className="pt-4">
              <Link
                href={`/contact?playbook=${playbook.id}`}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #0052CC 0%, #0066FF 100%)',
                  boxShadow: '0 10px 30px -10px rgba(0, 82, 204, 0.5), 0 0 20px rgba(0, 102, 255, 0.2)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: '#C4FF61',
                    boxShadow: '0 0 8px rgba(196, 255, 97, 0.6)',
                  }}
                />
                Talk to the Architect
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PlaybookVaultSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  // Split playbooks into rows
  const row1Playbooks = PLAYBOOKS.slice(0, 4);
  const row2Playbooks = PLAYBOOKS.slice(4, 8);

  // Determine which row the selected playbook is in
  const selectedRow = selectedId
    ? row1Playbooks.find(p => p.id === selectedId) ? 1 : 2
    : null;

  const selectedPlaybook = PLAYBOOKS.find((p) => p.id === selectedId);

  const handleSelect = (id: string) => {
    if (selectedId === id) {
      setSelectedId(null);
    } else {
      setSelectedId(id);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0A1628 0%, #0D1F3C 50%, #0A1628 100%)',
      }}
    >
      {/* Animated gradient orbs */}
      <div
        className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(100, 180, 255, 0.08) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(150, 100, 255, 0.08) 0%, transparent 70%)',
          animation: 'float 25s ease-in-out infinite reverse',
        }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono mb-6"
            style={{
              background: 'rgba(100, 180, 255, 0.1)',
              border: '1px solid rgba(100, 180, 255, 0.3)',
              color: '#64B4FF',
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: '#4ADE80', boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)' }}
            />
            BATTLE-TESTED ARCHITECTURES
          </div>
          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
            style={{ textShadow: '0 0 40px rgba(100, 180, 255, 0.15)' }}
          >
            Proven Playbooks
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-4">
            100+ enterprise deployments. Every challenge documented.
            <br />
            Every solution battle-tested.
          </p>
          <p className="text-sm text-white/40 max-w-3xl mx-auto">
            Browse the playbooks. See how many times we've deployed each one. See how the approach improved with each deployment. See the outcomes.
          </p>
        </div>

        {/* Row 1 Cards */}
        <div ref={row1Ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {row1Playbooks.map((playbook, index) => (
            <HolographicCard
              key={playbook.id}
              playbook={playbook}
              index={index}
              isSelected={selectedId === playbook.id}
              onSelect={() => handleSelect(playbook.id)}
            />
          ))}
        </div>

        {/* Expanded Panel for Row 1 */}
        {selectedPlaybook && selectedRow === 1 && (
          <ExpandedDetailPanel
            playbook={selectedPlaybook}
            onClose={() => setSelectedId(null)}
            isVisible={true}
          />
        )}

        {/* Row 2 Cards */}
        <div ref={row2Ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {row2Playbooks.map((playbook, index) => (
            <HolographicCard
              key={playbook.id}
              playbook={playbook}
              index={index + 4}
              isSelected={selectedId === playbook.id}
              onSelect={() => handleSelect(playbook.id)}
            />
          ))}
        </div>

        {/* Expanded Panel for Row 2 */}
        {selectedPlaybook && selectedRow === 2 && (
          <ExpandedDetailPanel
            playbook={selectedPlaybook}
            onClose={() => setSelectedId(null)}
            isVisible={true}
          />
        )}

        {/* Footer CTA */}
        <div
          className="mt-16 p-8 rounded-2xl text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 45, 80, 0.6) 0%, rgba(15, 30, 55, 0.7) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(100, 180, 255, 0.2)',
          }}
        >
          <p className="text-xl font-semibold text-white mb-2">
            Can't find your exact scenario?
          </p>
          <p className="text-white/50 mb-6">
            We've documented 100+ patterns beyond these 8.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #0052CC 0%, #0066FF 100%)',
                boxShadow: '0 10px 30px -10px rgba(0, 82, 204, 0.5)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: '#C4FF61', boxShadow: '0 0 8px rgba(196, 255, 97, 0.6)' }}
              />
              Talk to an Architect
            </Link>
            <Link
              href="/playbooks"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              View All Playbooks
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(5%, 5%) rotate(2deg); }
          50% { transform: translate(0, 10%) rotate(0deg); }
          75% { transform: translate(-5%, 5%) rotate(-2deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}

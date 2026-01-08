'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

// ============================================================================
// PLAYBOOK DATA
// ============================================================================

interface PlaybookData {
  id: string;
  name: string;
  shortName: string;
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
// ANIMATED BLUEPRINT ROLL SVG (No box, just the roll)
// ============================================================================

function BlueprintRollIcon({ isHovered = false, isCompressed = false }: { isHovered?: boolean; isCompressed?: boolean }) {
  const size = isCompressed ? 36 : 56;
  const id = `roll-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 80 56" fill="none" className="transition-transform duration-500">
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0a3d62">
            <animate attributeName="stop-color" values="#0a3d62;#0d4a75;#0a3d62" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor={isHovered ? "#40a9ff" : "#1890FF"}>
            <animate attributeName="stop-color" values="#1890FF;#40a9ff;#1890FF" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#0a3d62">
            <animate attributeName="stop-color" values="#0a3d62;#0d4a75;#0a3d62" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer glow on hover */}
      {isHovered && (
        <ellipse cx="40" cy="28" rx="38" ry="24" fill="none" stroke="#1890FF" strokeWidth="1" opacity="0.3" filter={`url(#${id}-glow)`}>
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
      )}

      {/* Main roll body - cylinder effect */}
      <ellipse cx="10" cy="28" rx="8" ry="22" fill="#0a3d62" stroke="#1890FF" strokeWidth="1.5">
        <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <rect x="10" y="6" width="60" height="44" fill={`url(#${id}-grad)`} />
      <ellipse cx="70" cy="28" rx="8" ry="22" fill="#0d4a75" stroke="#1890FF" strokeWidth="1.5">
        <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </ellipse>

      {/* Blueprint grid lines on roll surface */}
      <g opacity="0.4">
        <line x1="18" y1="12" x2="62" y2="12" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="18" y1="20" x2="62" y2="20" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        <line x1="18" y1="28" x2="62" y2="28" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" begin="0.5s" />
        </line>
        <line x1="18" y1="36" x2="62" y2="36" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
        <line x1="18" y1="44" x2="62" y2="44" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" begin="1s" />
        </line>

        {/* Vertical lines */}
        <line x1="26" y1="8" x2="26" y2="48" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="40" y1="8" x2="40" y2="48" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
        <line x1="54" y1="8" x2="54" y2="48" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
      </g>

      {/* Highlight line */}
      <line x1="10" y1="14" x2="70" y2="14" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
    </svg>
  );
}

// ============================================================================
// ANIMATED BACKGROUND ELEMENTS
// ============================================================================

function AnimatedBackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-[#1890FF] rounded-full opacity-30"
          style={{
            left: `${10 + (i * 8)}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float ${4 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}

      {/* Scanning line */}
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1890FF] to-transparent opacity-20"
        style={{
          animation: 'scan 8s linear infinite',
        }}
      />

      {/* Corner brackets */}
      <svg className="absolute top-8 left-8 w-12 h-12 text-[#1890FF] opacity-20">
        <path d="M0 12 L0 0 L12 0" fill="none" stroke="currentColor" strokeWidth="1">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
        </path>
      </svg>
      <svg className="absolute top-8 right-8 w-12 h-12 text-[#1890FF] opacity-20">
        <path d="M12 0 L24 0 L24 12" fill="none" stroke="currentColor" strokeWidth="1" transform="translate(-12, 0)">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" begin="0.5s" />
        </path>
      </svg>
      <svg className="absolute bottom-8 left-8 w-12 h-12 text-[#1890FF] opacity-20">
        <path d="M0 0 L0 12 L12 12" fill="none" stroke="currentColor" strokeWidth="1" transform="translate(0, 0)">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" begin="1s" />
        </path>
      </svg>
      <svg className="absolute bottom-8 right-8 w-12 h-12 text-[#1890FF] opacity-20">
        <path d="M0 12 L12 12 L12 0" fill="none" stroke="currentColor" strokeWidth="1">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" begin="1.5s" />
        </path>
      </svg>
    </div>
  );
}

// ============================================================================
// EXPANDED PLAYBOOK CONTENT
// ============================================================================

function ExpandedPlaybook({
  playbook,
  onClose,
  isVisible
}: {
  playbook: PlaybookData;
  onClose: () => void;
  isVisible: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={contentRef}
      className="relative overflow-hidden"
      style={{
        maxHeight: isVisible ? '600px' : '0px',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scaleY(1) translateY(0)' : 'scaleY(0.8) translateY(-20px)',
        transformOrigin: 'top center',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="relative rounded-lg border border-[#1890FF]/50 bg-gradient-to-b from-[#001020] to-[#001529] overflow-hidden">
        {/* Animated border glow */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(24,144,255,0.1), transparent)',
            animation: 'shimmer 3s linear infinite',
          }}
        />

        {/* Blueprint grid overlay with animation */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(24,144,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(24,144,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            animation: 'gridPulse 4s ease-in-out infinite',
          }}
        />

        {/* Header */}
        <div className="relative flex items-center justify-between p-4 border-b border-[#1890FF]/20">
          <div className="flex items-center gap-4">
            <div className="relative">
              <BlueprintRollIcon isHovered={true} />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">
                {playbook.name}
              </h3>
              <span className="text-[#C4FF61] text-sm font-mono">
                Deployed {playbook.deployments}x
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-[#1890FF]/30 hover:border-[#1890FF] hover:bg-[#1890FF]/10 transition-all duration-300 group"
          >
            <X className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Content Grid */}
        <div
          className="relative p-5 grid md:grid-cols-3 gap-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-out 0.3s',
          }}
        >
          {/* Column 1: Challenge & Learnings */}
          <div className="space-y-5">
            <div>
              <h4 className="text-white/90 text-sm font-medium mb-3">
                Challenge pattern
              </h4>
              <ul className="space-y-1.5">
                {playbook.challengePattern.map((item, i) => (
                  <li
                    key={i}
                    className="text-white/70 text-sm flex items-start gap-2"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                      transition: `all 0.4s ease-out ${0.4 + i * 0.1}s`,
                    }}
                  >
                    <span className="text-[#1890FF] mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white/90 text-sm font-medium mb-3">
                Key learnings
              </h4>
              <ul className="space-y-1.5">
                {playbook.keyLearnings.map((item, i) => (
                  <li
                    key={i}
                    className="text-white/70 text-sm flex items-start gap-2"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-10px)',
                      transition: `all 0.4s ease-out ${0.6 + i * 0.1}s`,
                    }}
                  >
                    <span className="text-[#C4FF61]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2: Outcomes & Industries */}
          <div className="space-y-5">
            <div>
              <h4 className="text-white/90 text-sm font-medium mb-3">
                Outcomes achieved
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {playbook.outcomes.map((outcome, i) => (
                  <div
                    key={i}
                    className="p-2 rounded bg-[#1890FF]/10 border border-[#1890FF]/20 text-center"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'scale(1)' : 'scale(0.8)',
                      transition: `all 0.4s ease-out ${0.5 + i * 0.1}s`,
                    }}
                  >
                    <div className="text-[#C4FF61] font-mono text-lg font-bold">
                      {outcome.metric}
                    </div>
                    <div className="text-white/50 text-[10px] leading-tight">
                      {outcome.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white/90 text-sm font-medium mb-3">
                Industries
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {playbook.industries.map((ind, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded text-xs bg-[#1890FF]/10 border border-[#1890FF]/20 text-white/70"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: `opacity 0.3s ease-out ${0.7 + i * 0.05}s`,
                    }}
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Architecture & CTA */}
          <div className="space-y-5">
            <div>
              <h4 className="text-white/90 text-sm font-medium mb-3">
                Architecture stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {playbook.architecture.map((comp, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded text-xs font-mono bg-[#1890FF]/10 border border-[#1890FF]/30 text-white/80"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                      transition: `all 0.3s ease-out ${0.6 + i * 0.05}s`,
                    }}
                  >
                    {comp}
                  </div>
                ))}
              </div>
            </div>
            <div
              className="pt-2"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.4s ease-out 0.9s',
              }}
            >
              <Link
                href={`/contact?playbook=${playbook.id}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#1890FF] text-white text-sm font-semibold hover:bg-[#40a9ff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(24,144,255,0.4)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C4FF61] animate-pulse" />
                Talk to the architect who built this
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleExpand = (id: string) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }

    setTimeout(() => setIsAnimating(false), 600);
  };

  const expandedPlaybook = PLAYBOOKS.find(p => p.id === expandedId);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#001529]">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(24,144,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(24,144,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Animated background elements */}
      <AnimatedBackgroundElements />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Matching other sections */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-[var(--font-title)]">
            Proven Architectures
          </h2>
          <p className="text-lg text-white/85 mb-3">
            100+ enterprise deployments. Every challenge. Every solution. Documented.
          </p>
          <p className="text-white/50 text-sm max-w-2xl mx-auto">
            Browse the playbooks. See how many times we've deployed each one.
            See how the approach improved with each deployment. See the outcomes.
          </p>
        </div>

        {/* Expanded Playbook (at TOP with unroll animation) */}
        {expandedPlaybook && (
          <div className="mb-8">
            <ExpandedPlaybook
              playbook={expandedPlaybook}
              onClose={() => handleExpand(expandedPlaybook.id)}
              isVisible={!!expandedId}
            />
          </div>
        )}

        {/* Blueprint Rolls Grid - NO BOXES */}
        <div
          className={`grid gap-4 transition-all duration-500 ${
            expandedId
              ? 'grid-cols-4 md:grid-cols-7'
              : 'grid-cols-2 md:grid-cols-4'
          }`}
        >
          {PLAYBOOKS.map((playbook) => {
            const isExpanded = expandedId === playbook.id;
            const isCompressed = expandedId && !isExpanded;

            if (isExpanded) return null;

            return (
              <button
                key={playbook.id}
                onClick={() => handleExpand(playbook.id)}
                onMouseEnter={() => setHoveredId(playbook.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  relative flex flex-col items-center text-center
                  transition-all duration-500 ease-out
                  ${isCompressed ? 'py-2 px-1' : 'py-4 px-2'}
                  ${hoveredId === playbook.id ? '-translate-y-2' : ''}
                  group
                `}
              >
                {/* Roll Icon - NO BOX WRAPPER */}
                <div
                  className="transition-all duration-500"
                  style={{
                    filter: hoveredId === playbook.id ? 'drop-shadow(0 0 12px rgba(24,144,255,0.5))' : 'none',
                  }}
                >
                  <BlueprintRollIcon
                    isHovered={hoveredId === playbook.id}
                    isCompressed={!!isCompressed}
                  />
                </div>

                {/* Name */}
                <div className={`mt-3 font-semibold text-white leading-tight transition-all duration-300 ${
                  isCompressed ? 'text-[9px]' : 'text-xs md:text-sm'
                } ${hoveredId === playbook.id ? 'text-[#40a9ff]' : ''}`}>
                  {isCompressed ? playbook.shortName.split(' ')[0] : playbook.shortName}
                </div>

                {/* Deployment count */}
                <div className={`text-[#C4FF61] font-mono transition-all duration-300 ${
                  isCompressed ? 'text-[8px] mt-0.5' : 'text-xs mt-1'
                }`}>
                  {isCompressed ? `${playbook.deployments}x` : `${playbook.deployments}x deployed`}
                </div>

                {/* Hover indicator line */}
                <div
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-[#1890FF] transition-all duration-300 ${
                    hoveredId === playbook.id ? 'w-12 opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Section Footer */}
        <div className="mt-12 p-6 rounded-lg border border-[#1890FF]/20 text-center bg-[#001020]/50">
          <p className="text-white text-lg font-semibold mb-1">
            Can't find your exact scenario?
          </p>
          <p className="text-white/50 text-sm mb-5">
            We've documented 100+ patterns beyond these 8.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1890FF] text-white font-semibold text-sm hover:bg-[#40a9ff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(24,144,255,0.4)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4FF61] animate-pulse" />
              Talk to an Architect
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-white/20 text-white font-semibold text-sm hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              See all Playbooks
            </Link>
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-15px) translateX(3px); }
        }
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gridPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}

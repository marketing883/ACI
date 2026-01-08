'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ChevronRight } from 'lucide-react';

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
// REALISTIC BLUEPRINT SCROLL ICON - Using CSS gradients for 3D effect
// ============================================================================

function BlueprintScrollIcon({ isHovered = false, size = 64 }: { isHovered?: boolean; size?: number }) {
  return (
    <div
      className="relative transition-transform duration-500"
      style={{
        width: size,
        height: size * 0.75,
        transform: isHovered ? 'scale(1.1) rotateY(-5deg)' : 'scale(1)',
        transformStyle: 'preserve-3d',
        perspective: '200px',
      }}
    >
      {/* Main scroll body */}
      <div
        className="absolute inset-0 rounded-sm overflow-hidden"
        style={{
          background: `linear-gradient(135deg,
            #1a4a6e 0%,
            #0d3a5c 15%,
            #1a5a7e 30%,
            #0d3a5c 50%,
            #1a5a7e 70%,
            #0d3a5c 85%,
            #1a4a6e 100%
          )`,
          boxShadow: isHovered
            ? '0 8px 32px rgba(24, 144, 255, 0.4), inset 0 2px 4px rgba(255,255,255,0.1)'
            : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255,255,255,0.05)',
          border: '1px solid rgba(24, 144, 255, 0.3)',
        }}
      >
        {/* Blueprint grid lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(24,144,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(24,144,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '8px 8px',
          }}
        />

        {/* Horizontal blueprint lines */}
        <div className="absolute inset-x-2 top-[20%] h-px bg-white/20" />
        <div className="absolute inset-x-2 top-[40%] h-px bg-white/10" />
        <div className="absolute inset-x-2 top-[60%] h-px bg-white/20" />
        <div className="absolute inset-x-2 top-[80%] h-px bg-white/10" />

        {/* Shine effect */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Left scroll roll end */}
      <div
        className="absolute left-0 top-0 bottom-0 w-3 rounded-l-full"
        style={{
          background: 'linear-gradient(90deg, #0a2a3e 0%, #1a5a7e 40%, #0d3a5c 100%)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.3), inset 1px 0 2px rgba(255,255,255,0.1)',
          border: '1px solid rgba(24, 144, 255, 0.4)',
          borderRight: 'none',
        }}
      />

      {/* Right scroll roll end */}
      <div
        className="absolute right-0 top-0 bottom-0 w-3 rounded-r-full"
        style={{
          background: 'linear-gradient(90deg, #0d3a5c 0%, #1a5a7e 60%, #0a2a3e 100%)',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.3), inset -1px 0 2px rgba(255,255,255,0.1)',
          border: '1px solid rgba(24, 144, 255, 0.4)',
          borderLeft: 'none',
        }}
      />

      {/* Glow effect on hover */}
      {isHovered && (
        <div
          className="absolute -inset-2 rounded-lg pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(24, 144, 255, 0.2) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// EXPANDED PLAYBOOK CONTENT WITH SMOOTH PERSPECTIVE ANIMATION
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
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setContentReady(true), 400);
      return () => clearTimeout(timer);
    } else {
      setContentReady(false);
    }
  }, [isVisible]);

  return (
    <div
      className="overflow-hidden"
      style={{
        perspective: '1500px',
        perspectiveOrigin: 'center top',
      }}
    >
      <div
        className="relative rounded-xl border border-[#1890FF]/40 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #001020 0%, #001529 50%, #001830 100%)',
          transform: isVisible
            ? 'rotateX(0deg) translateY(0) scaleY(1)'
            : 'rotateX(-30deg) translateY(-50px) scaleY(0.8)',
          opacity: isVisible ? 1 : 0,
          maxHeight: isVisible ? '600px' : '0px',
          transformOrigin: 'center top',
          transition: `
            transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1),
            opacity 0.5s ease-out,
            max-height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)
          `,
          boxShadow: isVisible
            ? '0 20px 60px -20px rgba(24, 144, 255, 0.3), 0 0 40px rgba(24, 144, 255, 0.1)'
            : 'none',
        }}
      >
        {/* Animated top edge - unfurling effect */}
        <div
          className="absolute top-0 left-0 right-0 h-1 z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(24, 144, 255, 0.6), transparent)',
            transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.6s ease-out 0.2s',
          }}
        />

        {/* Blueprint grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(24,144,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(24,144,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Header */}
        <div
          className="relative flex items-center justify-between p-5 border-b border-[#1890FF]/20"
          style={{
            opacity: contentReady ? 1 : 0,
            transform: contentReady ? 'translateY(0)' : 'translateY(-20px)',
            transition: 'all 0.5s ease-out 0.3s',
          }}
        >
          <div className="flex items-center gap-4">
            <BlueprintScrollIcon isHovered={true} size={48} />
            <div>
              <h3 className="text-xl font-bold text-white">
                {playbook.displayTitle}
              </h3>
              <span className="text-[#C4FF61] text-sm font-mono">
                Deployed {playbook.deployments}x
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border border-[#1890FF]/30 hover:border-[#1890FF] hover:bg-[#1890FF]/10 transition-all duration-300"
          >
            <X className="w-5 h-5 text-white/70 hover:text-white" />
          </button>
        </div>

        {/* Content Grid */}
        <div
          className="relative p-6 grid md:grid-cols-3 gap-6"
          style={{
            opacity: contentReady ? 1 : 0,
            transform: contentReady ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out 0.4s',
          }}
        >
          {/* Column 1: Challenge & Learnings */}
          <div className="space-y-5">
            <div>
              <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">
                Challenge Pattern
              </h4>
              <ul className="space-y-2">
                {playbook.challengePattern.map((item, i) => (
                  <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                    <span className="text-[#1890FF] mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">
                Key Learnings
              </h4>
              <ul className="space-y-2">
                {playbook.keyLearnings.map((item, i) => (
                  <li key={i} className="text-white/70 text-sm flex items-start gap-2">
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
              <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">
                Outcomes Achieved
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {playbook.outcomes.map((outcome, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#1890FF]/10 border border-[#1890FF]/20 text-center"
                  >
                    <div className="text-[#C4FF61] font-mono text-xl font-bold">
                      {outcome.metric}
                    </div>
                    <div className="text-white/50 text-xs">
                      {outcome.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">
                Industries
              </h4>
              <div className="flex flex-wrap gap-2">
                {playbook.industries.map((ind, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded text-xs bg-white/5 border border-white/10 text-white/70"
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
              <h4 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">
                Architecture Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {playbook.architecture.map((comp, i) => (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded text-xs font-mono bg-[#1890FF]/10 border border-[#1890FF]/30 text-white/80"
                  >
                    {comp}
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-3">
              <Link
                href={`/contact?playbook=${playbook.id}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#0052CC] text-white text-sm font-semibold hover:bg-[#0066FF] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,82,204,0.5)]"
              >
                <span className="w-2 h-2 rounded-full bg-[#C4FF61]" />
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
// PLAYBOOK CARD
// ============================================================================

function PlaybookCard({
  playbook,
  isExpanded,
  isCompressed,
  onExpand,
  isHovered,
  onHover,
}: {
  playbook: PlaybookData;
  isExpanded: boolean;
  isCompressed: boolean;
  onExpand: () => void;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}) {
  if (isExpanded) return null;

  return (
    <button
      onClick={onExpand}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`
        group relative text-left transition-all duration-500 ease-out
        ${isCompressed ? 'p-3' : 'p-4'}
        rounded-xl border border-[#1890FF]/20
        hover:border-[#1890FF]/50 hover:bg-[#1890FF]/5
        cursor-pointer
      `}
      style={{
        background: isHovered
          ? 'linear-gradient(135deg, rgba(24,144,255,0.1) 0%, rgba(0,21,41,0.95) 100%)'
          : 'linear-gradient(135deg, rgba(0,21,41,0.8) 0%, rgba(0,21,41,0.95) 100%)',
        boxShadow: isHovered
          ? '0 10px 40px -10px rgba(24, 144, 255, 0.3)'
          : '0 4px 20px -5px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Scroll Icon */}
      <div className={`flex ${isCompressed ? 'justify-center' : 'justify-start'} mb-3`}>
        <BlueprintScrollIcon
          isHovered={isHovered}
          size={isCompressed ? 40 : 56}
        />
      </div>

      {/* Content */}
      {!isCompressed && (
        <>
          <h3 className="text-white font-semibold text-base mb-2 group-hover:text-[#40a9ff] transition-colors line-clamp-2">
            {playbook.displayTitle}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-[#C4FF61] text-xs font-mono">
              {playbook.deployments}x deployed
            </span>
            <ChevronRight
              className={`w-4 h-4 text-white/40 group-hover:text-[#1890FF] transition-all duration-300 ${
                isHovered ? 'translate-x-1' : ''
              }`}
            />
          </div>

          {/* Click hint */}
          <div
            className="mt-3 pt-3 border-t border-white/10 text-xs text-white/40 group-hover:text-white/60 transition-colors"
          >
            Click to explore playbook
          </div>
        </>
      )}

      {isCompressed && (
        <div className="text-center">
          <span className="text-[#C4FF61] text-[10px] font-mono block">
            {playbook.deployments}x
          </span>
        </div>
      )}
    </button>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PlaybookVaultSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const row1Playbooks = PLAYBOOKS.slice(0, 4);
  const row2Playbooks = PLAYBOOKS.slice(4, 8);

  const expandedRow = expandedId
    ? row1Playbooks.find(p => p.id === expandedId) ? 1 : 2
    : null;

  const handleExpand = (id: string) => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }

    setTimeout(() => setIsAnimating(false), 800);
  };

  const expandedPlaybook = PLAYBOOKS.find(p => p.id === expandedId);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[#001529]">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(24,144,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(24,144,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute top-1/4 left-1/4 w-1/2 h-1/2 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(24, 144, 255, 0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Proven Architectures
          </h2>
          <p className="text-lg text-white/70 mb-3">
            100+ enterprise deployments. Every challenge. Every solution. Documented.
          </p>
          <p className="text-white/40 text-sm max-w-2xl mx-auto">
            Browse the playbooks. See how many times we've deployed each one.
            See how the approach improved with each deployment. See the outcomes.
          </p>
        </div>

        {/* Row 1 */}
        <div
          ref={row1Ref}
          className={`grid gap-4 mb-4 transition-all duration-500 ${
            expandedId && expandedRow !== 1
              ? 'grid-cols-4 md:grid-cols-8'
              : 'grid-cols-2 md:grid-cols-4'
          }`}
        >
          {row1Playbooks.map((playbook) => (
            <PlaybookCard
              key={playbook.id}
              playbook={playbook}
              isExpanded={expandedId === playbook.id}
              isCompressed={!!(expandedId && expandedId !== playbook.id && expandedRow !== 1)}
              onExpand={() => handleExpand(playbook.id)}
              isHovered={hoveredId === playbook.id}
              onHover={(h) => setHoveredId(h ? playbook.id : null)}
            />
          ))}
        </div>

        {/* Expanded Panel for Row 1 */}
        {expandedPlaybook && expandedRow === 1 && (
          <div className="mb-4">
            <ExpandedPlaybook
              playbook={expandedPlaybook}
              onClose={() => handleExpand(expandedPlaybook.id)}
              isVisible={true}
            />
          </div>
        )}

        {/* Row 2 */}
        <div
          ref={row2Ref}
          className={`grid gap-4 transition-all duration-500 ${
            expandedId && expandedRow !== 2
              ? 'grid-cols-4 md:grid-cols-8'
              : 'grid-cols-2 md:grid-cols-4'
          }`}
        >
          {row2Playbooks.map((playbook) => (
            <PlaybookCard
              key={playbook.id}
              playbook={playbook}
              isExpanded={expandedId === playbook.id}
              isCompressed={!!(expandedId && expandedId !== playbook.id && expandedRow !== 2)}
              onExpand={() => handleExpand(playbook.id)}
              isHovered={hoveredId === playbook.id}
              onHover={(h) => setHoveredId(h ? playbook.id : null)}
            />
          ))}
        </div>

        {/* Expanded Panel for Row 2 */}
        {expandedPlaybook && expandedRow === 2 && (
          <div className="mt-4">
            <ExpandedPlaybook
              playbook={expandedPlaybook}
              onClose={() => handleExpand(expandedPlaybook.id)}
              isVisible={true}
            />
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-14 text-center">
          <p className="text-white/50 text-sm mb-4">
            Can't find your exact scenario? We've documented 100+ patterns beyond these 8.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0052CC] text-white font-semibold hover:bg-[#0066FF] transition-all duration-300"
            >
              <span className="w-2 h-2 rounded-full bg-[#C4FF61]" />
              Talk to an Architect
            </Link>
            <Link
              href="/playbooks"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white/80 font-medium hover:border-white/40 hover:bg-white/5 transition-all"
            >
              View All Playbooks
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}

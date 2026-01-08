'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

// ============================================================================
// PLAYBOOK DATA
// ============================================================================

interface PlaybookData {
  id: string;
  name: string;
  shortName: string;
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
// BLUEPRINT ROLL ICON SVG
// ============================================================================

function BlueprintRollIcon({ size = 48, isHovered = false }: { size?: number; isHovered?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id={`rollGrad-${isHovered}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0a3d62" />
          <stop offset="40%" stopColor={isHovered ? "#40a9ff" : "#1890FF"} />
          <stop offset="60%" stopColor={isHovered ? "#40a9ff" : "#1890FF"} />
          <stop offset="100%" stopColor="#0a3d62" />
        </linearGradient>
      </defs>
      {/* Outer roll body */}
      <rect x="6" y="10" width="36" height="28" rx="3"
        fill={`url(#rollGrad-${isHovered})`}
        stroke="#1890FF"
        strokeWidth="1.5"
      />
      {/* Left cap */}
      <ellipse cx="6" cy="24" rx="3" ry="14" fill="#0a3d62" stroke="#1890FF" strokeWidth="1" />
      {/* Right cap */}
      <ellipse cx="42" cy="24" rx="3" ry="14" fill="#0d4a75" stroke="#1890FF" strokeWidth="1" />
      {/* Blueprint lines */}
      <line x1="12" y1="16" x2="36" y2="16" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="12" y1="22" x2="36" y2="22" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="12" y1="28" x2="36" y2="28" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <line x1="12" y1="34" x2="36" y2="34" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      {/* Vertical lines */}
      <line x1="18" y1="12" x2="18" y2="36" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1="24" y1="12" x2="24" y2="36" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <line x1="30" y1="12" x2="30" y2="36" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    </svg>
  );
}

// ============================================================================
// ARCHITECTURE DIAGRAM (COMPACT)
// ============================================================================

function ArchitectureDiagram({ components }: { components: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {components.map((comp, i) => (
        <div
          key={i}
          className="px-3 py-1.5 rounded text-xs font-mono bg-[#1890FF]/15 border border-[#1890FF]/40 text-white/90"
        >
          {comp}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PlaybookVaultSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const expandedPlaybook = PLAYBOOKS.find(p => p.id === expandedId);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#001529]">
      {/* Blueprint grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(24,144,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(24,144,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            THE PLAYBOOK VAULT
          </h2>
          <p className="text-lg text-white/85 mb-2">
            19 years. 100+ deployments. Every pattern documented.
          </p>
          <p className="text-white/60 text-sm max-w-2xl mx-auto">
            Not theory. Not best practices from books. Actual blueprints from systems we've built dozens of times.
          </p>
        </div>

        {/* Expanded Playbook (at TOP) */}
        {expandedPlaybook && (
          <div
            className="mb-8 animate-in slide-in-from-top duration-300"
            style={{
              animation: 'unroll 0.4s ease-out',
            }}
          >
            <div className="relative rounded-lg border-2 border-[#1890FF] bg-[#001020] overflow-hidden">
              {/* Blueprint grid overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(24,144,255,0.06) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(24,144,255,0.06) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Header */}
              <div className="relative flex items-center justify-between p-4 border-b border-[#1890FF]/30 bg-[#1890FF]/10">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    {expandedPlaybook.name}
                  </h3>
                  <span className="text-[#C4FF61] text-sm font-mono">
                    Deployed {expandedPlaybook.deployments}x
                  </span>
                </div>
                <button
                  onClick={() => setExpandedId(null)}
                  className="p-2 rounded-lg border border-[#1890FF]/50 hover:border-[#1890FF] hover:bg-[#1890FF]/20 transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content Grid */}
              <div className="relative p-5 grid md:grid-cols-3 gap-6">
                {/* Column 1: Challenge & Learnings */}
                <div className="space-y-5">
                  <div>
                    <h4 className="text-[#1890FF] text-xs font-semibold uppercase tracking-wider mb-3">
                      Challenge Pattern
                    </h4>
                    <ul className="space-y-1.5">
                      {expandedPlaybook.challengePattern.map((item, i) => (
                        <li key={i} className="text-white/80 text-sm flex items-start gap-2">
                          <span className="text-[#1890FF] mt-0.5">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[#1890FF] text-xs font-semibold uppercase tracking-wider mb-3">
                      Key Learnings
                    </h4>
                    <ul className="space-y-1.5">
                      {expandedPlaybook.keyLearnings.map((item, i) => (
                        <li key={i} className="text-white/80 text-sm flex items-start gap-2">
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
                    <h4 className="text-[#1890FF] text-xs font-semibold uppercase tracking-wider mb-3">
                      Outcomes Achieved
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {expandedPlaybook.outcomes.map((outcome, i) => (
                        <div key={i} className="p-2 rounded bg-[#1890FF]/10 border border-[#1890FF]/30 text-center">
                          <div className="text-[#C4FF61] font-mono text-lg font-bold">
                            {outcome.metric}
                          </div>
                          <div className="text-white/60 text-[10px] leading-tight">
                            {outcome.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[#1890FF] text-xs font-semibold uppercase tracking-wider mb-3">
                      Industries
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {expandedPlaybook.industries.map((ind, i) => (
                        <span key={i} className="px-2 py-1 rounded text-xs bg-[#1890FF]/10 border border-[#1890FF]/30 text-white/80">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 3: Architecture & CTA */}
                <div className="space-y-5">
                  <div>
                    <h4 className="text-[#1890FF] text-xs font-semibold uppercase tracking-wider mb-3">
                      Architecture Stack
                    </h4>
                    <ArchitectureDiagram components={expandedPlaybook.architecture} />
                  </div>
                  <div className="pt-2">
                    <Link
                      href={`/contact?playbook=${expandedPlaybook.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#1890FF] text-white text-sm font-semibold hover:bg-[#40a9ff] transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C4FF61]" />
                      Talk to Architect
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blueprint Rolls Grid */}
        <div
          className={`grid gap-3 transition-all duration-300 ${
            expandedId
              ? 'grid-cols-4 md:grid-cols-8'  // Compressed when one is open
              : 'grid-cols-2 md:grid-cols-4'   // Normal 4x2 grid
          }`}
        >
          {PLAYBOOKS.map((playbook) => {
            const isExpanded = expandedId === playbook.id;
            const isCompressed = expandedId && !isExpanded;

            if (isExpanded) return null; // Don't show in grid, it's above

            return (
              <button
                key={playbook.id}
                onClick={() => setExpandedId(playbook.id)}
                onMouseEnter={() => setHoveredId(playbook.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  relative rounded-lg border-2 transition-all duration-300 text-left
                  ${hoveredId === playbook.id
                    ? 'border-[#1890FF] shadow-[0_0_20px_rgba(24,144,255,0.3)] -translate-y-1'
                    : 'border-[#1890FF]/30 hover:border-[#1890FF]/60'
                  }
                  ${isCompressed ? 'p-2' : 'p-4'}
                  bg-gradient-to-br from-[#001529] to-[#002140]
                `}
              >
                {/* Grid overlay */}
                <div
                  className="absolute inset-0 rounded-lg pointer-events-none opacity-30"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(24,144,255,0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(24,144,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '10px 10px',
                  }}
                />

                <div className="relative flex flex-col items-center text-center">
                  {/* Roll Icon */}
                  <div className={`transition-transform duration-300 ${isCompressed ? 'scale-75' : ''}`}>
                    <BlueprintRollIcon
                      size={isCompressed ? 32 : 48}
                      isHovered={hoveredId === playbook.id}
                    />
                  </div>

                  {/* Name */}
                  <div className={`mt-2 font-semibold text-white leading-tight transition-all duration-300 ${
                    isCompressed ? 'text-[10px]' : 'text-xs md:text-sm'
                  }`}>
                    {isCompressed ? playbook.shortName.split(' ')[0] : playbook.shortName}
                  </div>

                  {/* Deployment count */}
                  <div className={`text-[#C4FF61] font-mono transition-all duration-300 ${
                    isCompressed ? 'text-[9px] mt-0.5' : 'text-xs mt-1'
                  }`}>
                    {isCompressed ? `${playbook.deployments}x` : `Deployed ${playbook.deployments}x`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Section Footer */}
        <div className="mt-12 p-6 rounded-lg border-2 border-dashed border-[#1890FF]/30 text-center">
          <p className="text-white text-lg font-semibold mb-1">
            Can't find your exact scenario?
          </p>
          <p className="text-white/60 text-sm mb-5">
            We've documented 100+ patterns beyond these 8.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1890FF] text-white font-semibold text-sm hover:bg-[#40a9ff] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4FF61]" />
              Talk to an Architect
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border-2 border-white/30 text-white font-semibold text-sm hover:border-white/60 hover:bg-white/5 transition-all"
            >
              See All Case Studies
            </Link>
          </div>
        </div>
      </div>

      {/* Unroll animation keyframes */}
      <style jsx>{`
        @keyframes unroll {
          0% {
            transform: scaleX(0.1) scaleY(0.8);
            opacity: 0;
          }
          50% {
            transform: scaleX(1) scaleY(0.9);
            opacity: 0.8;
          }
          100% {
            transform: scaleX(1) scaleY(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronRight } from 'lucide-react';

// ============================================================================
// PLAYBOOK DATA
// ============================================================================

interface PlaybookData {
  id: string;
  name: string;
  shortName: string;
  deployments: number;
  challengePattern: string[];
  evolution: { version: string; year: string; details: string }[];
  keyLearnings: string[];
  outcomes: { metric: string; description: string }[];
  industries: string[];
  architectureComponents: string[];
}

const PLAYBOOKS: PlaybookData[] = [
  {
    id: 'post-acquisition',
    name: 'Post-Acquisition System Consolidation',
    shortName: 'Post-Acquisition',
    deployments: 23,
    challengePattern: [
      '30-50 disparate systems post-merger/acquisition',
      'Multiple data formats, inconsistent standards',
      'Finance teams manually reconciling across systems',
      'Regulatory compliance requires unified audit trails',
      'High risk of disruption to ongoing operations',
    ],
    evolution: [
      { version: 'v1.0', year: '2016', details: '24-month timeline, 60% manual effort reduction' },
      { version: 'v8.0', year: '2019', details: '20-month timeline, 70% manual effort reduction' },
      { version: 'v15.0', year: '2021', details: '16-month timeline, 75% manual effort reduction' },
      { version: 'v23.0', year: '2024', details: '14-month timeline, 80% manual effort reduction' },
    ],
    keyLearnings: [
      'Phased migration with parallel runs eliminates cutover risk',
      'Automated data quality gates catch 95% of issues before production',
      'SOX compliance must be designed in, not retrofitted',
      'Schema mapping requires domain expertise, not just ETL engineers',
    ],
    outcomes: [
      { metric: '$9.2M', description: 'Avg year-one savings' },
      { metric: '0', description: 'Reporting disruptions' },
      { metric: '14.8mo', description: 'Avg timeline' },
      { metric: '78%', description: 'Manual effort reduced' },
    ],
    industries: ['Financial Services', 'Private Equity', 'Healthcare', 'Manufacturing'],
    architectureComponents: ['SAP S/4HANA', 'Python ETL', 'Azure/AWS Data Lakes', 'PowerBI/Tableau', 'Automated Reconciliation', 'Audit Logging'],
  },
  {
    id: 'multi-location',
    name: 'Multi-Location Real-Time Data Platform',
    shortName: 'Real-Time Platform',
    deployments: 47,
    challengePattern: [
      '300-1000+ physical locations generating transaction data',
      'Zero tolerance for payment processing downtime',
      'Marketing needs real-time customer behavior insights',
      'Legacy batch ETL creating 12-24 hour data latency',
      'Personalization requires sub-second data availability',
    ],
    evolution: [
      { version: 'v1.0', year: '2018', details: '18-month timeline, 40% latency reduction' },
      { version: 'v15.0', year: '2020', details: '14-month timeline, 50% latency reduction' },
      { version: 'v31.0', year: '2022', details: '10-month timeline, 60% latency reduction' },
      { version: 'v47.0', year: '2024', details: '7-month timeline, 70% latency reduction' },
    ],
    keyLearnings: [
      'Payment processing integration requires dual-write pattern for reliability',
      'Auto-scaling must account for weekend traffic spikes (3x typical load)',
      'Dynatrace observability setup prevents 90% of common production issues',
      'Location-by-location rollout reduces risk, enables fast rollback',
    ],
    outcomes: [
      { metric: '64%', description: 'Avg latency reduction' },
      { metric: '0', description: 'Payment disruptions' },
      { metric: '7.3mo', description: 'Avg timeline' },
      { metric: '99.97%', description: 'Uptime maintained' },
    ],
    industries: ['Retail', 'QSR/Fast Food', 'Convenience Stores', 'Hospitality', 'Healthcare Networks'],
    architectureComponents: ['Kafka/Kinesis', 'Databricks Lakehouse', 'Delta Lake', 'Salesforce/Braze CDP', 'Dynatrace', 'Real-time Dashboards'],
  },
  {
    id: 'global-unification',
    name: 'Global Data Unification',
    shortName: 'Global Unification',
    deployments: 31,
    challengePattern: [
      'Operations across 40-60 countries with regional data silos',
      'Inconsistent data standards across geographies',
      'No unified view of global operations',
      'Supply chain visibility limited to individual regions',
      'Executive reporting requires weeks of manual consolidation',
    ],
    evolution: [
      { version: 'v1.0', year: '2015', details: '22-month timeline, regional coverage' },
      { version: 'v10.0', year: '2018', details: '18-month timeline, improved data quality' },
      { version: 'v20.0', year: '2021', details: '14-month timeline, automated governance' },
      { version: 'v31.0', year: '2024', details: '12-month timeline, full global coverage' },
    ],
    keyLearnings: [
      'Master data management must be established before integration',
      'Regional compliance requirements vary significantly (GDPR, local laws)',
      'API-based integration more flexible than batch for global systems',
      'Data quality automation reduces manual effort by 85%',
    ],
    outcomes: [
      { metric: '50%', description: 'Faster decisions' },
      { metric: '100%', description: 'Supply chain visibility' },
      { metric: '65%', description: 'Duplicate reduction' },
      { metric: '12.4mo', description: 'Avg timeline' },
    ],
    industries: ['Hospitality/Food Services', 'Manufacturing', 'Logistics', 'Professional Services'],
    architectureComponents: ['Informatica IICS', 'Master Data Management', 'Cloud Data Lakes', 'API Gateway', 'Global Dashboards', 'Regional Integration'],
  },
  {
    id: 'self-service-analytics',
    name: 'Enterprise Self-Service Analytics',
    shortName: 'Self-Service Analytics',
    deployments: 19,
    challengePattern: [
      '5,000-15,000 end users needing data access',
      'Every analytics request goes through IT (2-week backlogs)',
      'Users can\'t respond to customer questions in real-time',
      'Traditional BI tools too rigid for diverse needs',
      'Row-level security required for multi-tenant access',
    ],
    evolution: [
      { version: 'v1.0', year: '2017', details: '16-month timeline, 70% request reduction' },
      { version: 'v7.0', year: '2019', details: '12-month timeline, 80% request reduction' },
      { version: 'v13.0', year: '2021', details: '9-month timeline, 85% request reduction' },
      { version: 'v19.0', year: '2024', details: '7-month timeline, 90% request reduction' },
    ],
    keyLearnings: [
      'Row-level security implementation must be designed upfront',
      'Pre-configured dashboards cover 80% of use cases',
      'Power user training creates internal champions',
      'Complete audit logging essential for HIPAA/compliance',
    ],
    outcomes: [
      { metric: '88%', description: 'IT request reduction' },
      { metric: '92%', description: 'User satisfaction' },
      { metric: '2hrs', description: 'Time-to-insight (was 2wks)' },
      { metric: '0', description: 'Security incidents' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Insurance', 'Retail', 'Professional Services'],
    architectureComponents: ['Databricks Lakehouse', 'Power BI/Tableau', 'Row-level Security', 'Real-time Refresh', 'Pre-built Dashboards', 'HIPAA Logging'],
  },
  {
    id: 'healthcare-data',
    name: 'Multi-Jurisdiction Healthcare Data',
    shortName: 'Healthcare Data',
    deployments: 12,
    challengePattern: [
      'Patient data across multiple countries/jurisdictions',
      'Different compliance requirements per region (HIPAA, GDPR)',
      'No unified patient identity across systems',
      'Clinical data standards vary by country',
      'Audit requirements extremely stringent',
    ],
    evolution: [
      { version: 'v1.0', year: '2019', details: '18-month timeline, regional compliance' },
      { version: 'v5.0', year: '2021', details: '14-month timeline, improved security' },
      { version: 'v9.0', year: '2023', details: '11-month timeline, automated compliance' },
      { version: 'v12.0', year: '2024', details: '10-month timeline, multi-jurisdiction' },
    ],
    keyLearnings: [
      'Jurisdiction-specific compliance must be automated, not manual',
      'Master patient index with fuzzy matching reduces duplicates 60%',
      'Encryption at rest and in transit is baseline, not optional',
      'API gateway design critical for clinical system integration',
    ],
    outcomes: [
      { metric: '100%', description: 'Patient identity unified' },
      { metric: '58%', description: 'Duplicate reduction' },
      { metric: '10.3mo', description: 'Avg timeline' },
      { metric: '0', description: 'HIPAA/GDPR violations' },
    ],
    industries: ['Healthcare Services', 'Healthcare Tech', 'Clinical Research', 'Pharma'],
    architectureComponents: ['Patient MDM', 'Multi-jurisdiction Compliance', 'Encrypted Storage', 'API Gateway', 'Clinical Integration', 'Audit Logging'],
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Visibility',
    shortName: 'Supply Chain',
    deployments: 28,
    challengePattern: [
      'Supply chain data scattered across procurement, logistics, inventory',
      'No end-to-end visibility from supplier to customer',
      'Demand forecasting based on outdated data',
      'Inventory optimization requires weeks of analysis',
      'Disruption response time measured in days',
    ],
    evolution: [
      { version: 'v1.0', year: '2017', details: '20-month timeline, basic visibility' },
      { version: 'v10.0', year: '2019', details: '15-month timeline, real-time tracking' },
      { version: 'v18.0', year: '2021', details: '12-month timeline, predictive analytics' },
      { version: 'v28.0', year: '2024', details: '9-month timeline, AI-powered optimization' },
    ],
    keyLearnings: [
      'IoT integration for real-time location tracking reduces blind spots',
      'Supplier data standardization critical before integration',
      'Demand forecasting requires ML models, not just historical trends',
      'Real-time alerts enable proactive disruption management',
    ],
    outcomes: [
      { metric: '100%', description: 'End-to-end visibility' },
      { metric: '25%', description: 'Carrying cost reduction' },
      { metric: '40%', description: 'Forecast accuracy gain' },
      { metric: '4hrs', description: 'Disruption response (was 3d)' },
    ],
    industries: ['Food & Beverage', 'Manufacturing', 'Retail', 'Automotive', 'Pharmaceuticals'],
    architectureComponents: ['Snowflake/Databricks', 'IoT Integration', 'SAP/Oracle ERP', 'ML Forecasting', 'Tableau/PowerBI', 'Real-time Alerting'],
  },
  {
    id: 'cloud-migration',
    name: 'Legacy to Cloud Migration',
    shortName: 'Cloud Migration',
    deployments: 52,
    challengePattern: [
      'On-premise Hadoop, Teradata, or Oracle infrastructure aging',
      'Infrastructure costs growing 15-20% annually',
      'Scaling requires 6-12 month hardware procurement',
      'Maintenance consuming 40%+ of team time',
      'Modern analytics tools incompatible with legacy systems',
    ],
    evolution: [
      { version: 'v1.0', year: '2015', details: '24-month timeline, lift-and-shift approach' },
      { version: 'v15.0', year: '2017', details: '18-month timeline, partial re-architecture' },
      { version: 'v30.0', year: '2020', details: '12-month timeline, cloud-native design' },
      { version: 'v52.0', year: '2024', details: '8-month timeline, optimized for cloud' },
    ],
    keyLearnings: [
      'Lift-and-shift fastest but misses cloud benefits (not recommended)',
      'Re-architecture delivers 3x better ROI despite longer timeline',
      'Zero-downtime migration requires parallel run strategy',
      'Cloud cost optimization must be designed in, not added later',
    ],
    outcomes: [
      { metric: '68%', description: 'Infrastructure cost cut' },
      { metric: '10x', description: 'Processing speed gain' },
      { metric: '70%', description: 'Maintenance reduced' },
      { metric: '$3.2M', description: '3-year TCO savings' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Retail', 'Education', 'Government'],
    architectureComponents: ['AWS/Azure/GCP', 'Databricks/Snowflake', 'Migration Tools', 'Data Validation', 'Terraform IaC', 'Cost Optimization'],
  },
  {
    id: 'data-integration',
    name: 'Multi-Source Data Integration',
    shortName: 'Data Integration',
    deployments: 34,
    challengePattern: [
      'Data scattered across 20-40 disparate source systems',
      'SaaS applications, on-prem databases, spreadsheets, APIs',
      'No unified data model or standards',
      'Data quality varies dramatically by source',
      'Real-time and batch requirements mixed',
    ],
    evolution: [
      { version: 'v1.0', year: '2016', details: '16-month timeline, batch-only integration' },
      { version: 'v12.0', year: '2019', details: '13-month timeline, hybrid batch/real-time' },
      { version: 'v22.0', year: '2021', details: '10-month timeline, automated quality gates' },
      { version: 'v34.0', year: '2024', details: '7-month timeline, self-healing pipelines' },
    ],
    keyLearnings: [
      'Source system discovery takes 3x longer than expected (plan for it)',
      'Data quality issues always surface during integration (automate detection)',
      'Change data capture (CDC) required for real-time sources',
      'Self-healing pipelines reduce operational overhead 80%',
    ],
    outcomes: [
      { metric: '32', description: 'Avg systems integrated' },
      { metric: '85%', description: 'Data quality improvement' },
      { metric: '99.8%', description: 'Pipeline reliability' },
      { metric: '75%', description: 'Ops overhead reduced' },
    ],
    industries: ['Technology Services', 'Financial Services', 'Healthcare', 'Retail', 'Professional Services'],
    architectureComponents: ['Fivetran/Airbyte', 'Informatica/Mulesoft', 'Databricks/Snowflake', 'Great Expectations', 'Unified Data Model', 'Self-healing Pipelines'],
  },
];

// ============================================================================
// ARCHITECTURE DIAGRAM COMPONENT
// ============================================================================

interface ArchitectureDiagramProps {
  components: string[];
  isVisible: boolean;
}

function ArchitectureDiagram({ components, isVisible }: ArchitectureDiagramProps) {
  const boxWidth = 140;
  const boxHeight = 50;
  const gapX = 40;
  const gapY = 30;
  const cols = 3;
  const startX = 30;
  const startY = 30;

  const getBoxPosition = (index: number) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    return {
      x: startX + col * (boxWidth + gapX),
      y: startY + row * (boxHeight + gapY),
    };
  };

  const svgWidth = startX * 2 + cols * boxWidth + (cols - 1) * gapX;
  const rows = Math.ceil(components.length / cols);
  const svgHeight = startY * 2 + rows * boxHeight + (rows - 1) * gapY;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full h-auto"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        transition: 'opacity 0.4s ease-out 0.4s, transform 0.4s ease-out 0.4s',
      }}
    >
      {/* Grid pattern */}
      <defs>
        <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="rgba(24, 144, 255, 0.15)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprintGrid)" />

      {/* Connection lines */}
      {components.slice(0, -1).map((_, index) => {
        const current = getBoxPosition(index);
        const next = getBoxPosition(index + 1);
        const currentCol = index % cols;
        const nextCol = (index + 1) % cols;

        // Horizontal connection within same row
        if (nextCol > currentCol) {
          const x1 = current.x + boxWidth;
          const y1 = current.y + boxHeight / 2;
          const x2 = next.x;
          const y2 = next.y + boxHeight / 2;

          return (
            <g key={`line-${index}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#1890FF"
                strokeWidth="2"
                strokeDasharray={isVisible ? '0' : '1000'}
                strokeDashoffset={isVisible ? '0' : '1000'}
                style={{
                  transition: 'stroke-dashoffset 0.6s ease-out 0.5s',
                }}
              />
              {/* Arrow */}
              <polygon
                points={`${x2 - 8},${y2 - 4} ${x2},${y2} ${x2 - 8},${y2 + 4}`}
                fill="#1890FF"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: 'opacity 0.3s ease-out 0.8s',
                }}
              />
            </g>
          );
        }

        // Vertical + horizontal connection to next row
        const x1 = current.x + boxWidth / 2;
        const y1 = current.y + boxHeight;
        const x2 = next.x + boxWidth / 2;
        const y2 = next.y;

        return (
          <g key={`line-${index}`}>
            <path
              d={`M ${x1} ${y1} L ${x1} ${y1 + gapY / 2} L ${x2} ${y1 + gapY / 2} L ${x2} ${y2}`}
              fill="none"
              stroke="#1890FF"
              strokeWidth="2"
              strokeDasharray={isVisible ? '0' : '1000'}
              strokeDashoffset={isVisible ? '0' : '1000'}
              style={{
                transition: 'stroke-dashoffset 0.6s ease-out 0.5s',
              }}
            />
            {/* Arrow */}
            <polygon
              points={`${x2 - 4},${y2 - 8} ${x2},${y2} ${x2 + 4},${y2 - 8}`}
              fill="#1890FF"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease-out 0.8s',
              }}
            />
          </g>
        );
      })}

      {/* Component boxes */}
      {components.map((component, index) => {
        const pos = getBoxPosition(index);
        return (
          <g
            key={component}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.8)',
              transformOrigin: `${pos.x + boxWidth / 2}px ${pos.y + boxHeight / 2}px`,
              transition: `opacity 0.3s ease-out ${0.3 + index * 0.08}s, transform 0.3s ease-out ${0.3 + index * 0.08}s`,
            }}
          >
            <rect
              x={pos.x}
              y={pos.y}
              width={boxWidth}
              height={boxHeight}
              fill="rgba(24, 144, 255, 0.1)"
              stroke="#1890FF"
              strokeWidth="2"
              rx="4"
            />
            <text
              x={pos.x + boxWidth / 2}
              y={pos.y + boxHeight / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="11"
              fontFamily="ui-monospace, monospace"
            >
              {component.length > 18 ? component.slice(0, 16) + '...' : component}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================================
// BLUEPRINT ROLL COMPONENT
// ============================================================================

interface BlueprintRollProps {
  playbook: PlaybookData;
  isExpanded: boolean;
  onClick: () => void;
  onClose: () => void;
}

function BlueprintRoll({ playbook, isExpanded, onClick, onClose }: BlueprintRollProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded]);

  return (
    <div
      className={`
        relative transition-all duration-500 ease-out
        ${isExpanded ? 'col-span-full' : ''}
      `}
    >
      {/* Collapsed State - Roll Card */}
      <button
        onClick={onClick}
        className={`
          w-full text-left group
          ${isExpanded ? 'hidden' : 'block'}
        `}
      >
        <div
          className="
            relative p-6 rounded-[4px] border-2 border-[#1890FF]/30
            bg-gradient-to-br from-[#001529] to-[#002140]
            hover:border-[#1890FF] hover:shadow-[0_0_20px_rgba(24,144,255,0.2)]
            transition-all duration-300
            hover:-translate-y-1
          "
        >
          {/* Blueprint roll icon */}
          <div className="flex items-center gap-4 mb-3">
            <div className="relative">
              <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#1890FF]">
                {/* Roll cylinder */}
                <ellipse cx="20" cy="8" rx="16" ry="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M 4 8 L 4 32 A 16 6 0 0 0 36 32 L 36 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <ellipse cx="20" cy="32" rx="16" ry="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Grid lines on roll */}
                <line x1="10" y1="12" x2="10" y2="28" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                <line x1="20" y1="10" x2="20" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                <line x1="30" y1="12" x2="30" y2="28" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm leading-tight">
                {playbook.shortName}
              </h3>
              <p className="text-[#C4FF61] text-xs font-mono mt-1">
                Deployed: {playbook.deployments}x
              </p>
            </div>
            <ChevronRight
              className="w-5 h-5 text-[#1890FF] group-hover:translate-x-1 transition-transform"
              strokeWidth={1.5}
            />
          </div>

          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 rounded-[4px] pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(24,144,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(24,144,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />
        </div>
      </button>

      {/* Expanded State - Full Blueprint */}
      <div
        className={`
          overflow-hidden transition-all duration-500 ease-out
          ${isExpanded ? 'opacity-100' : 'opacity-0 h-0'}
        `}
        style={{
          maxHeight: isExpanded ? `${contentHeight + 100}px` : '0px',
        }}
      >
        <div
          ref={contentRef}
          className="
            relative p-8 rounded-[4px] border-2 border-[#1890FF]
            bg-gradient-to-br from-[#001529] to-[#002140]
          "
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="
              absolute top-4 right-4 p-2 rounded-full
              border border-[#1890FF]/50 hover:border-[#1890FF]
              hover:bg-[#1890FF]/10 transition-all
            "
          >
            <X className="w-5 h-5 text-white" strokeWidth={1.5} />
          </button>

          {/* Blueprint grid overlay */}
          <div
            className="absolute inset-0 rounded-[4px] pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(24,144,255,0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(24,144,255,0.08) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Header */}
          <div className="relative mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-[#C4FF61]" />
              <span className="text-[#C4FF61] text-sm font-mono">
                PLAYBOOK v{playbook.evolution[playbook.evolution.length - 1].version}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {playbook.name}
            </h2>
            <p className="text-[#1890FF] font-mono text-sm">
              Deployed {playbook.deployments} times across enterprise clients
            </p>
          </div>

          <div className="relative grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Challenge Pattern */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded border border-[#1890FF] flex items-center justify-center text-xs text-[#1890FF] font-mono">
                    01
                  </span>
                  Challenge Pattern
                </h3>
                <ul className="space-y-2">
                  {playbook.challengePattern.map((challenge, i) => (
                    <li
                      key={i}
                      className="text-white/85 text-sm flex items-start gap-2"
                      style={{
                        opacity: isExpanded ? 1 : 0,
                        transform: isExpanded ? 'translateX(0)' : 'translateX(-10px)',
                        transition: `opacity 0.3s ease-out ${0.6 + i * 0.05}s, transform 0.3s ease-out ${0.6 + i * 0.05}s`,
                      }}
                    >
                      <span className="text-[#1890FF] mt-1">→</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Learnings */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded border border-[#1890FF] flex items-center justify-center text-xs text-[#1890FF] font-mono">
                    02
                  </span>
                  Key Learnings Codified
                </h3>
                <ul className="space-y-2">
                  {playbook.keyLearnings.map((learning, i) => (
                    <li
                      key={i}
                      className="text-white/85 text-sm flex items-start gap-2"
                      style={{
                        opacity: isExpanded ? 1 : 0,
                        transform: isExpanded ? 'translateX(0)' : 'translateX(-10px)',
                        transition: `opacity 0.3s ease-out ${0.8 + i * 0.05}s, transform 0.3s ease-out ${0.8 + i * 0.05}s`,
                      }}
                    >
                      <span className="text-[#C4FF61]">•</span>
                      {learning}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Evolution Timeline */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded border border-[#1890FF] flex items-center justify-center text-xs text-[#1890FF] font-mono">
                    03
                  </span>
                  Playbook Evolution
                </h3>
                <div className="relative pl-4 border-l-2 border-[#1890FF]/30 space-y-3">
                  {playbook.evolution.map((evo, i) => (
                    <div
                      key={i}
                      className="relative"
                      style={{
                        opacity: isExpanded ? 1 : 0,
                        transition: `opacity 0.3s ease-out ${1 + i * 0.1}s`,
                      }}
                    >
                      <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-[#001529] border-2 border-[#1890FF]" />
                      <div className="flex items-baseline gap-2">
                        <span className="text-[#1890FF] font-mono text-sm font-semibold">
                          {evo.version}
                        </span>
                        <span className="text-white/50 text-xs">({evo.year})</span>
                      </div>
                      <p className="text-white/70 text-sm">{evo.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Outcomes */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded border border-[#1890FF] flex items-center justify-center text-xs text-[#1890FF] font-mono">
                    04
                  </span>
                  Outcomes Achieved
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {playbook.outcomes.map((outcome, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-[4px] bg-[#1890FF]/10 border border-[#1890FF]/30"
                      style={{
                        opacity: isExpanded ? 1 : 0,
                        transform: isExpanded ? 'scale(1)' : 'scale(0.9)',
                        transition: `opacity 0.3s ease-out ${0.7 + i * 0.08}s, transform 0.3s ease-out ${0.7 + i * 0.08}s`,
                      }}
                    >
                      <div className="text-[#C4FF61] font-mono text-xl font-bold">
                        {outcome.metric}
                      </div>
                      <div className="text-white/70 text-xs mt-1">
                        {outcome.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Diagram */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded border border-[#1890FF] flex items-center justify-center text-xs text-[#1890FF] font-mono">
                    05
                  </span>
                  Architecture Components
                </h3>
                <div className="rounded-[4px] border border-[#1890FF]/30 bg-[#001020] p-4">
                  <ArchitectureDiagram
                    components={playbook.architectureComponents}
                    isVisible={isExpanded}
                  />
                </div>
              </div>

              {/* Industries */}
              <div>
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded border border-[#1890FF] flex items-center justify-center text-xs text-[#1890FF] font-mono">
                    06
                  </span>
                  Industries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {playbook.industries.map((industry, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[#1890FF]/10 text-[#1890FF] border border-[#1890FF]/30"
                      style={{
                        opacity: isExpanded ? 1 : 0,
                        transition: `opacity 0.3s ease-out ${0.9 + i * 0.05}s`,
                      }}
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div
                className="pt-4"
                style={{
                  opacity: isExpanded ? 1 : 0,
                  transition: 'opacity 0.3s ease-out 1.2s',
                }}
              >
                <Link
                  href={`/contact?playbook=${playbook.id}`}
                  className="
                    inline-flex items-center gap-2 px-5 py-3 rounded-[6px]
                    bg-[#0052CC] text-white font-semibold text-sm
                    hover:bg-[#003D99] hover:-translate-y-0.5
                    hover:shadow-[0_4px_12px_rgba(0,82,204,0.25)]
                    transition-all duration-200
                  "
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4FF61]" />
                  Talk to Architect Who Built This
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN SECTION COMPONENT
// ============================================================================

export default function PlaybookVaultSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleExpand = (id: string) => {
    setExpandedId(id);
  };

  const handleClose = () => {
    setExpandedId(null);
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[#001529]">
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
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-12 bg-[#C4FF61]" />
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              THE PLAYBOOK VAULT
            </h2>
          </div>
          <p className="text-lg md:text-xl text-white/85 max-w-3xl">
            19 years. 100+ deployments. Every pattern documented.
          </p>
          <p className="text-white/60 mt-2 max-w-3xl">
            Not theory. Not best practices from books. Actual blueprints from systems we've built dozens of times.
          </p>
        </div>

        {/* Playbooks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {PLAYBOOKS.map((playbook) => (
            <BlueprintRoll
              key={playbook.id}
              playbook={playbook}
              isExpanded={expandedId === playbook.id}
              onClick={() => handleExpand(playbook.id)}
              onClose={handleClose}
            />
          ))}
        </div>

        {/* Section Footer */}
        <div
          className="
            relative p-8 rounded-[4px] border-2 border-dashed border-[#1890FF]/30
            text-center
          "
        >
          <p className="text-white text-lg font-semibold mb-2">
            Can't find your exact scenario?
          </p>
          <p className="text-white/60 mb-6">
            We've documented 100+ patterns beyond these 8.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-[6px]
                bg-[#0052CC] text-white font-semibold
                hover:bg-[#003D99] hover:-translate-y-0.5
                hover:shadow-[0_4px_12px_rgba(0,82,204,0.25)]
                transition-all duration-200
              "
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4FF61]" />
              Talk to an Architect
            </Link>
            <Link
              href="/case-studies"
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-[6px]
                border-2 border-white/30 text-white font-semibold
                hover:border-white/80 hover:bg-white/5 hover:-translate-y-0.5
                transition-all duration-200
              "
            >
              See All Case Studies
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Playbook catalog: pure data, no React. Extracted from
 * PlaybookVaultSection.tsx so the Atheros content indexer
 * (scripts/index-content.ts, a node script) can import it without
 * pulling in a client component. The section component and the nav
 * re-export or import from here.
 */

export interface PlaybookData {
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
  category: 'data' | 'cloud' | 'analytics' | 'integration' | 'ai';
  gradient: string;
  iconType: 'zap' | 'radio' | 'globe' | 'barchart' | 'shield' | 'truck' | 'cloud' | 'gitmerge' | 'sparkles';
  arqaiAcceleration?: string;
}

export const PLAYBOOKS: PlaybookData[] = [
  {
    id: 'post-acquisition',
    name: 'Post-Acquisition System Consolidation',
    shortName: 'Post-Acquisition',
    displayTitle: 'Post-Acquisition ERP Unification',
    arqaiAcceleration: 'AI maps schema differences across ERPs and auto-generates reconciliation rules.',
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
      { metric: '99.8%', description: 'Uptime through migration' },
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
    displayTitle: 'Real-Time Inventory Platform',
    arqaiAcceleration: 'AI auto-tunes pipeline parameters and predicts bottlenecks before they hit production.',
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
      { metric: '47', description: 'Deployments' },
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
    displayTitle: 'Multi-Region Data Consolidation',
    arqaiAcceleration: 'AI-powered entity resolution and fuzzy matching finds duplicates rule-based systems miss.',
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
    displayTitle: 'Self-Service Analytics',
    arqaiAcceleration: 'AI auto-generates data dictionaries and powers natural language exploration.',
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
    id: 'agentic-ai',
    name: 'Enterprise Agentic AI Deployment',
    shortName: 'Agentic AI',
    displayTitle: 'Agentic AI Deployment',
    arqaiAcceleration: 'ArqAI provides the evaluation harness and guardrails that get agents past pilot.',
    slug: 'agentic-ai-deployment',
    deployments: 18,
    challengePattern: [
      'Agents deciding with only 20% of needed context',
      'Multi-agent orchestration without handoff protocols',
      'Legacy systems lacking real-time APIs',
      'No boundaries for autonomous vs. human decisions',
    ],
    keyLearnings: [
      'Context access beats model selection',
      'Bounded autonomy beats full autonomy',
      'Orchestration is architecture, not prompts',
    ],
    outcomes: [
      { metric: '40-60%', description: 'Faster operations' },
      { metric: '2-3x', description: 'Scale without headcount' },
      { metric: '100%', description: 'Audit coverage' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Retail', 'Technology'],
    architecture: ['LangChain/LlamaIndex', 'Azure OpenAI/Bedrock', 'Vector DBs', 'Agent Orchestration', 'API Gateways', 'Monitoring'],
    category: 'ai',
    gradient: 'from-emerald-500 to-teal-600',
    iconType: 'sparkles',
  },
  {
    id: 'ai-governance',
    name: 'Enterprise AI Governance & Compliance',
    shortName: 'AI Governance',
    displayTitle: 'AI Governance & Compliance',
    arqaiAcceleration: 'Automated bias detection, drift monitoring, and audit trail generation.',
    slug: 'enterprise-ai-governance',
    deployments: 14,
    challengePattern: [
      'Shadow AI proliferating without oversight',
      'No inventory of AI including vendor-embedded',
      'EU AI Act, CCPA, HIPAA overlapping deadlines',
      'Manual audit evidence taking weeks',
    ],
    keyLearnings: [
      'Shadow AI is the real risk, not known models',
      'Prohibition drives AI underground',
      'Risk tiering prevents bottlenecks',
    ],
    outcomes: [
      { metric: '100%', description: 'AI visibility' },
      { metric: '70%', description: 'Faster audits' },
      { metric: '<5 days', description: 'Governance cycle' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Insurance', 'Government'],
    architecture: ['AI Discovery', 'MLflow/W&B', 'Model Monitoring', 'GRC Integration', 'Audit Trail', 'Compliance Automation'],
    category: 'ai',
    gradient: 'from-amber-500 to-orange-600',
    iconType: 'shield',
  },
  {
    id: 'healthcare-data',
    name: 'Multi-Jurisdiction Healthcare Data',
    shortName: 'Healthcare Data',
    displayTitle: 'Healthcare Data Platform',
    arqaiAcceleration: 'AI handles HL7/FHIR mapping with entity resolution and auto-generates compliance docs.',
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
      { metric: 'HIPAA', description: 'Compliant from day one' },
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
    displayTitle: 'Supply Chain Visibility',
    arqaiAcceleration: 'ML-powered demand forecasting and anomaly detection on supply signals.',
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
    displayTitle: 'Mainframe-to-Cloud Migration',
    arqaiAcceleration: 'AI scans legacy code, maps dependencies, and validates behavioral parity before cutover.',
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
      { metric: '$20M', description: '3yr savings' },
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
    arqaiAcceleration: 'AI auto-classifies source schemas and generates transformation logic.',
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

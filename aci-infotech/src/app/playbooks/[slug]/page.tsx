'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Download, CheckCircle2, Loader2, X, Mail, Building2, User } from 'lucide-react';
import Button from '@/components/ui/Button';

// Playbook detailed data
const playbooksData: Record<string, PlaybookDetail> = {
  'post-acquisition-consolidation': {
    slug: 'post-acquisition-consolidation',
    id: 'post-acquisition',
    displayTitle: '40 Systems → One',
    fullTitle: 'Post-Acquisition System Consolidation',
    deployments: 23,
    description: 'Complete playbook for consolidating 30-50 disparate systems post-merger with zero disruption to financial reporting.',
    overview: 'When companies merge or acquire, the immediate challenge isn\'t strategy but rather the chaos of 30-50 disparate systems that don\'t talk to each other. Finance teams spend 40% of their time manually reconciling data across systems, executives can\'t get a unified view of the combined entity, and regulatory compliance becomes a nightmare with no unified audit trail. This playbook documents our battle-tested approach refined across 23 enterprise deployments in financial services, private equity portfolio companies, healthcare, and manufacturing.',
    challengePattern: [
      '30-50 disparate systems from merged entities requiring consolidation with no clear integration path',
      'Multiple data formats with inconsistent standards, definitions, and business rules across legacy systems',
      'Finance teams spending 40%+ of time manually reconciling data instead of strategic analysis',
      'Regulatory compliance (SOX, GDPR, HIPAA) requiring unified audit trails that don\'t exist',
      'Executive mandate for aggressive 12-18 month timeline without any business disruption',
      'Political complexity with different teams owning different systems and resistant to change',
    ],
    solutionApproach: [
      'Phase 1 - Discovery & Assessment: Comprehensive inventory of all systems, data flows, dependencies, and ownership. Identify quick wins vs. complex integrations. Map regulatory requirements.',
      'Phase 2 - Architecture Design: Design target state architecture with unified data model. Define integration patterns (real-time vs. batch). Establish data governance framework.',
      'Phase 3 - Phased Migration: Execute parallel runs with automated validation before each cutover. Start with non-critical systems, build confidence, then migrate core systems.',
      'Phase 4 - Data Quality Gates: Implement automated checks catching 95%+ of issues before they impact downstream systems. Continuous monitoring and alerting.',
      'Phase 5 - Compliance & Audit: SOX compliance by design with audit logging, segregation of duties, and control frameworks built in from day one.',
      'Phase 6 - Change Management: Stakeholder communication plan, user training program, and organizational change management to ensure adoption.',
    ],
    keyLearnings: [
      'Phased migration with parallel runs eliminates cutover risk. Never do "big bang" migrations, they fail 70% of the time.',
      'Automated data quality gates catch 95% of issues before they become business problems. Invest in quality early.',
      'SOX compliance must be designed in from day one. Retrofitting compliance after the fact is 3x more expensive.',
      'Executive sponsorship is critical. Weekly steering committee meetings with C-level attendance ensure blockers are removed fast.',
      'Plan for 30% more complexity than initial assessment suggests. Hidden integrations and undocumented processes always surface.',
      'Political challenges are harder than technical ones. Invest in change management and stakeholder alignment early.',
    ],
    outcomes: [
      { metric: '$9.2M', description: 'Average year-one savings', detail: 'Achieved through process automation, system consolidation, and reduced manual reconciliation effort' },
      { metric: 'Zero', description: 'Financial reporting disruptions', detail: 'All quarterly closes completed on time during migration. No restatements required.' },
      { metric: '78%', description: 'Manual effort reduced', detail: 'Finance team time freed from reconciliation to focus on strategic analysis and business partnering' },
      { metric: '5 days', description: 'Monthly close cycle', detail: 'Reduced from 15 days to 5 days through automated reconciliation and unified reporting' },
    ],
    industries: ['Financial Services', 'Private Equity', 'Healthcare', 'Manufacturing'],
    technologies: ['SAP S/4HANA', 'Python ETL', 'Azure/AWS Data Lakes', 'PowerBI', 'Auto Reconciliation', 'Audit Logging'],
    category: 'Data Engineering',
    timeline: '12-18 months typical',
    teamSize: '15-25 consultants',
    relatedPlaybooks: ['multi-source-integration', 'legacy-cloud-migration'],
    downloadAvailable: false,
  },
  'real-time-data-platform': {
    slug: 'real-time-data-platform',
    id: 'multi-location',
    displayTitle: '600 Stores, Real-Time',
    fullTitle: 'Multi-Location Real-Time Data Platform',
    deployments: 47,
    description: 'Battle-tested architecture for real-time data across 300-1000+ locations with zero tolerance for payment downtime.',
    overview: 'When you operate 300-1000+ physical locations, your data challenges are unique. Every store generates thousands of transactions per hour. Payment processing cannot fail, ever. Marketing wants real-time customer behavior insights, but your legacy batch ETL creates 12-24 hour latency. Weekend traffic spikes hit 3x normal volume, and your infrastructure buckles. This playbook, deployed 47 times across retail chains, QSR franchises, convenience stores, and hospitality groups, provides the battle-tested architecture for distributed real-time data at massive scale.',
    challengePattern: [
      '300-1000+ physical locations each generating thousands of daily transactions that need central visibility',
      'Zero tolerance for payment processing downtime. Even 30 seconds of failure means lost revenue and customer trust.',
      'Marketing and operations need real-time customer behavior insights for personalization and inventory decisions',
      'Legacy batch ETL creates 12-24hr latency, meaning yesterday\'s data drives today\'s decisions',
      'Weekend and holiday traffic spikes hit 3x normal volume, overwhelming infrastructure designed for average load',
      'Store-level connectivity is unreliable. Systems must work when the network doesn\'t.',
    ],
    solutionApproach: [
      'Dual-Write Pattern: Payment data captured at both POS and central platform simultaneously. If central fails, POS continues. Data syncs when connection restores.',
      'Event-Driven Architecture: Kafka/Kinesis streams process transactions in real-time. Events flow to analytics, inventory, and customer platforms within seconds.',
      'Auto-Scaling Infrastructure: Pre-configured scaling policies anticipate predictable traffic patterns. Black Friday, weekends, and lunch rushes handled automatically.',
      'Edge Processing: Critical business logic runs at store level for resilience. Stores operate independently when disconnected, sync when reconnected.',
      'Customer Data Platform: Real-time customer profiles enable instant personalization. Purchase history, preferences, and segments updated within minutes.',
      'Observability First: Dynatrace integration with automated anomaly detection. Issues identified and alerted before customers notice.',
    ],
    keyLearnings: [
      'Payment integration requires dual-write pattern. Never create a single point of failure for revenue-critical systems.',
      'Auto-scaling must be pre-configured for predictable spikes. Reactive scaling is too slow for Black Friday.',
      'Dynatrace observability prevents 90% of production issues before customer impact. Invest in monitoring early.',
      'Store-level edge processing is essential for resilience. Network connectivity to 600+ stores will fail somewhere, always.',
      'Start with 5-10 pilot stores, validate for 4-6 weeks, then roll out in waves of 50-100 stores.',
      'Change data capture (CDC) from POS systems is harder than expected. Budget 30% more time for POS integration.',
    ],
    outcomes: [
      { metric: '<5 min', description: 'Data latency', detail: 'Reduced from 12-24hr batch processing to near real-time streaming' },
      { metric: '99.97%', description: 'Uptime maintained', detail: 'During rollout across all locations with zero payment disruptions' },
      { metric: '3x', description: 'Peak capacity handled', detail: 'Weekend and holiday traffic spikes managed automatically without intervention' },
      { metric: '23%', description: 'Revenue lift', detail: 'From real-time personalization and inventory optimization' },
    ],
    industries: ['Retail', 'QSR/Fast Food', 'Convenience Stores', 'Hospitality'],
    technologies: ['Kafka/Kinesis', 'Databricks Lakehouse', 'Delta Lake', 'Salesforce/Braze CDP', 'Dynatrace', 'Real-time Dashboards'],
    category: 'Data Engineering',
    timeline: '9-15 months typical',
    teamSize: '18-30 consultants',
    relatedPlaybooks: ['global-data-unification', 'self-service-analytics'],
    downloadAvailable: false,
  },
  'global-data-unification': {
    slug: 'global-data-unification',
    id: 'global-unification',
    displayTitle: '55 Countries, One System',
    fullTitle: 'Global Data Unification',
    deployments: 31,
    description: 'Proven approach for unifying data across 40-60 countries with regional silos and inconsistent standards.',
    overview: 'Global enterprises face a unique data challenge: operations span 40-60 countries, each with its own systems, data standards, and compliance requirements. Regional silos mean executives wait weeks for consolidated reports while competitors make decisions in hours. GDPR in Europe, data residency laws in Asia, and varying local regulations create a compliance maze. This playbook, refined through 31 deployments across hospitality chains, manufacturing conglomerates, logistics networks, and professional services firms, provides the proven architecture for global data unification.',
    challengePattern: [
      '40-60 countries operating with independent regional data silos built over decades of local operations',
      'Inconsistent data standards and definitions. "Customer" means different things in different regions.',
      'No unified view of global operations. Executives make decisions based on incomplete, outdated information.',
      'Executive reporting takes 2-3 weeks to compile manually, aggregating spreadsheets from each region',
      'Regional compliance requirements vary dramatically. GDPR in Europe, data residency in Asia, sector regulations everywhere.',
      'Time zone complexity means 24/7 operations with no single "maintenance window" for updates',
    ],
    solutionApproach: [
      'MDM First: Establish master data management for customers, products, and locations before any integration. You cannot integrate what you cannot identify.',
      'Regional Hub Architecture: Data remains in-region for compliance but federates to global view. Respects data residency while enabling global analytics.',
      'Semantic Layer: Business-friendly unified data model that translates regional terminology. "Client" in UK equals "Customer" in US equals "Kunde" in Germany.',
      'API-First Integration: REST/GraphQL APIs for flexibility over rigid batch interfaces. Regions can evolve while maintaining global contract.',
      'Compliance Automation: Built-in data classification, residency enforcement, and audit logging. Compliance is automatic, not manual.',
      'Regional Centers of Excellence: Local teams trained to maintain, extend, and support. Global standards with local ownership.',
    ],
    keyLearnings: [
      'MDM must be established before integration. Attempting to integrate without common identifiers creates a bigger mess.',
      'Regional compliance varies more than expected. Budget 40% more time for compliance mapping and automation.',
      'API integration is more flexible than batch for global deployments. Requirements change constantly in different regions.',
      'Local champions in each region accelerate adoption by 3x. Global mandates without local buy-in fail.',
      'Time zone complexity requires 24/7 support model planning from day one. There is no global maintenance window.',
      'Language and translation affect data quality. "Automated translation" of data values causes more problems than it solves.',
    ],
    outcomes: [
      { metric: 'Same-day', description: 'Executive reporting', detail: 'Reduced from 2-3 weeks manual compilation to automated same-day global dashboards' },
      { metric: '100%', description: 'Global visibility', detail: 'Single unified view across all 55 countries with drill-down to regional detail' },
      { metric: '65%', description: 'Duplicate reduction', detail: 'Master data management eliminated duplicate customer, product, and location records' },
      { metric: 'Zero', description: 'Compliance violations', detail: 'Automated data residency and GDPR compliance with full audit trail' },
    ],
    industries: ['Hospitality', 'Manufacturing', 'Logistics', 'Professional Services'],
    technologies: ['Informatica IICS', 'Master Data Management', 'Cloud Data Lakes', 'API Gateway', 'Global Dashboards', 'Regional Integration'],
    category: 'Data Engineering',
    timeline: '18-24 months typical',
    teamSize: '25-40 consultants',
    relatedPlaybooks: ['real-time-data-platform', 'multi-source-integration'],
    downloadAvailable: false,
  },
  'self-service-analytics': {
    slug: 'self-service-analytics',
    id: 'self-service-analytics',
    displayTitle: '10K Users, Self-Served',
    fullTitle: 'Enterprise Self-Service Analytics',
    deployments: 19,
    description: 'Architecture for enabling 5,000-15,000 users with self-service analytics while maintaining row-level security.',
    overview: 'Your business users are drowning while waiting for data. Every question requires an IT ticket, a 2-week wait, and often a response that doesn\'t quite answer what they needed. Meanwhile, competitors are making data-driven decisions in hours, not weeks. But simply giving everyone access to raw data creates security nightmares, compliance violations, and analysis chaos. This playbook, proven across 19 enterprise deployments, shows how to enable 10,000+ users with self-service analytics while maintaining iron-clad security and governance.',
    challengePattern: [
      '5,000-15,000 end users need regular data access but every request goes through IT',
      'IT data request backlog averages 2 weeks. By the time answers arrive, the business question has changed.',
      'Business users cannot answer time-sensitive questions in real-time, losing competitive opportunities',
      'Row-level security is required. Sales reps should only see their territory. Managers see their team. Executives see everything.',
      'Data literacy varies dramatically. Finance analysts write SQL. Marketing managers need point-and-click.',
      'Shadow IT and spreadsheet chaos emerge as users try to work around IT bottlenecks',
    ],
    solutionApproach: [
      'Row-Level Security by Design: Security model designed upfront based on organizational hierarchy, territory, and role. Every query automatically filtered.',
      'Tiered Access Model: Pre-built dashboards for casual users (80%), self-service exploration for analysts (15%), direct data access for power users (5%).',
      'Semantic Layer: Business-friendly data models hiding joins, calculations, and technical complexity. "Revenue" means the same thing everywhere.',
      'Power User Program: Training and certification creates departmental data champions who help others and reduce IT load.',
      'Governance Framework: Clear policies for data access, sharing, export, and retention. Self-service within guardrails.',
      'Performance Optimization: Pre-aggregated data marts and caching ensure dashboards load in seconds, not minutes.',
    ],
    keyLearnings: [
      'Row-level security must be designed upfront. Retrofitting security after users have access is 3x more expensive and creates compliance gaps.',
      'Pre-configured dashboards satisfy 80% of users. Focus self-service investment on the 20% who need exploration capabilities.',
      'Power user training creates internal champions who drive adoption and reduce IT support burden by 60%.',
      'Semantic layer is essential. Without business-friendly definitions, users create conflicting metrics and lose trust.',
      'Start with one department, prove value, document ROI, then expand. Big-bang rollouts fail.',
      'Performance matters more than features. If dashboards take 30 seconds to load, users abandon them.',
    ],
    outcomes: [
      { metric: '88%', description: 'IT request reduction', detail: 'Users self-serve routine data needs. IT focuses on complex analysis and platform improvements.' },
      { metric: '2 hours', description: 'Time-to-insight', detail: 'Business questions answered in hours instead of 2-week IT backlog' },
      { metric: '92%', description: 'User satisfaction', detail: 'Measured via quarterly surveys. Users report feeling "data empowered."' },
      { metric: '10K+', description: 'Active users', detail: 'Scaled to organization-wide deployment with maintained performance' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Insurance', 'Retail'],
    technologies: ['Databricks Lakehouse', 'Power BI/Tableau', 'Row-Level Security', 'Real-time Refresh', 'Pre-built Dashboards', 'HIPAA Logging'],
    category: 'Analytics',
    timeline: '9-12 months typical',
    teamSize: '12-20 consultants',
    relatedPlaybooks: ['healthcare-data-platform', 'global-data-unification'],
    downloadAvailable: false,
  },
  'healthcare-data-platform': {
    slug: 'healthcare-data-platform',
    id: 'healthcare-data',
    displayTitle: 'HIPAA + GDPR + More',
    fullTitle: 'Multi-Jurisdiction Healthcare Data',
    deployments: 12,
    description: 'Comprehensive playbook for managing patient data across multiple countries with different compliance requirements.',
    overview: 'Healthcare data is uniquely challenging. Patient privacy isn\'t just good practice; it\'s federal law with criminal penalties. And when you operate across borders, you face a patchwork of regulations: HIPAA in the US, GDPR in Europe, PIPEDA in Canada, and dozens of local laws. One misstep means fines, lawsuits, and destroyed trust. Meanwhile, clinical care depends on unified patient data, but your systems have created duplicate records, inconsistent identities, and dangerous gaps. This playbook, refined through 12 deployments across healthcare systems, healthtech companies, clinical research organizations, and pharmaceutical companies, provides the compliance-first architecture for multi-jurisdiction healthcare data.',
    challengePattern: [
      'Patient data distributed across multiple countries, each with different privacy laws and handling requirements',
      'HIPAA in the US, GDPR in Europe, plus dozens of local healthcare privacy regulations that conflict and overlap',
      'No unified patient identity. The same patient appears as 3-5 different records across systems, risking care gaps.',
      'Audit requirements are extremely stringent. Every access must be logged, justified, and reportable for 7+ years.',
      'Clinical system integration requires HL7/FHIR compliance, but legacy systems speak proprietary protocols',
      'Data scientists need access for population health analytics, but PHI exposure risks are significant',
    ],
    solutionApproach: [
      'Compliance-First Architecture: Data classification, handling rules, and access controls are foundational, not afterthoughts. Every data element tagged by sensitivity.',
      'Master Patient Index: Probabilistic matching across name variations, addresses, and demographics creates golden patient record. Reduces duplicates 58%.',
      'Encryption Everywhere: AES-256 at rest, TLS 1.3 in transit. Encryption keys managed through HSM with automatic rotation. No exceptions.',
      'Complete Audit Trail: Every data access logged with user, timestamp, justification, and data accessed. Retention for 7+ years with immutable storage.',
      'Clinical Integration Hub: HL7v2 and FHIR R4 connectors for EHR/EMR systems. Bidirectional sync with conflict resolution.',
      'Research Data Sandbox: De-identified datasets for analytics with re-identification risk monitoring. Researchers get insights without PHI exposure.',
    ],
    keyLearnings: [
      'Compliance must be automated from day one. Manual compliance processes fail at scale and create audit gaps.',
      'Master patient index with fuzzy/probabilistic matching is essential. Exact matching misses 40% of duplicates.',
      'Encryption is baseline, not a feature. Any system handling healthcare data must assume breach attempts.',
      'Audit trail requirements are more extensive than initially understood. Plan for 10x expected storage.',
      'Clinical staff involvement in design is critical. Systems that don\'t fit clinical workflow get worked around.',
      'Data de-identification for research is harder than expected. Re-identification risk assessment is required.',
    ],
    outcomes: [
      { metric: '100%', description: 'Patient identity unified', detail: 'Golden patient record established across all systems and jurisdictions' },
      { metric: '58%', description: 'Duplicate reduction', detail: 'Master patient index eliminated duplicate and fragmented records' },
      { metric: 'Zero', description: 'Compliance violations', detail: 'HIPAA, GDPR, and local healthcare privacy compliance maintained through 3 audits' },
      { metric: '100%', description: 'Audit coverage', detail: 'Every data access logged with complete chain of custody' },
    ],
    industries: ['Healthcare Services', 'Healthcare Tech', 'Clinical Research', 'Pharma'],
    technologies: ['Patient MDM', 'Compliance Automation', 'Encrypted Storage', 'API Gateway', 'Clinical Integration', 'Audit Logging'],
    category: 'Healthcare',
    timeline: '15-24 months typical',
    teamSize: '20-35 consultants',
    relatedPlaybooks: ['self-service-analytics', 'global-data-unification'],
    downloadAvailable: false,
  },
  'supply-chain-visibility': {
    slug: 'supply-chain-visibility',
    id: 'supply-chain',
    displayTitle: 'Supplier → Customer',
    fullTitle: 'Supply Chain Visibility',
    deployments: 28,
    description: 'End-to-end supply chain visibility platform integrating IoT, forecasting, and real-time alerting.',
    overview: 'Supply chain disruptions cost enterprises millions daily. A single container stuck in port, a supplier quality issue, or a demand spike can cascade through your entire operation. Yet most companies operate blind: procurement, logistics, and inventory live in separate systems. Forecasts rely on last quarter\'s data. Disruption response takes days because nobody knows there\'s a problem until customer orders fail. This playbook, battle-tested through 28 deployments across food and beverage, manufacturing, retail, and automotive companies, establishes true end-to-end visibility from raw material supplier to end customer.',
    challengePattern: [
      'Supply chain data scattered across procurement, logistics, inventory, and sales systems with no integration',
      'No end-to-end visibility. When a shipment is delayed, nobody knows until it misses delivery.',
      'Forecasting relies on outdated historical data. Demand spikes and drops create costly stockouts and overstock.',
      'Disruption response is measured in days, not hours. Problems are discovered reactively through customer complaints.',
      'Multiple ERP systems from acquisitions with inconsistent item codes, supplier IDs, and units of measure',
      'Supplier data is unreliable. Lead times, capacity, and quality vary but systems assume static values.',
    ],
    solutionApproach: [
      'Control Tower: Single unified dashboard showing end-to-end supply chain status. From raw material to customer delivery in one view.',
      'IoT Integration: Real-time location and condition tracking for shipments. Temperature, humidity, and shock sensors for sensitive goods.',
      'Supplier Portal: Single source of truth for supplier data. Capacity, lead times, quality scores, and risk indicators updated continuously.',
      'ML Demand Forecasting: Machine learning models incorporating external signals (weather, events, economic indicators) outperform historical trends by 40%.',
      'Real-Time Alerting: Automated detection and escalation of disruptions. Potential issues identified and routed to decision-makers within minutes.',
      'Scenario Planning: What-if simulation for supply chain decisions. Model impact of supplier changes, route alternatives, and demand shifts before committing.',
    ],
    keyLearnings: [
      'IoT integration eliminates blind spots. Sensors cost $10-50 each but save millions in lost shipments and quality issues.',
      'Supplier data standardization is harder than internal data. Budget 2x expected time for supplier onboarding.',
      'ML forecasting models beat historical trends after 6 months of training data. Start collecting signal data early.',
      'Real-time alerting requires clear escalation procedures. Technology without process creates noise, not action.',
      'Start with highest-impact supply chain segments. Prove value in one product line before expanding.',
      'External signals matter. Weather, port congestion, and economic data improve forecasts significantly.',
    ],
    outcomes: [
      { metric: '100%', description: 'E2E visibility', detail: 'Complete tracking from supplier shipment through customer delivery' },
      { metric: '25%', description: 'Carrying cost reduction', detail: 'Optimized inventory levels through accurate demand forecasting' },
      { metric: '4 hours', description: 'Disruption response', detail: 'Reduced from 3 days average to same-day resolution' },
      { metric: '40%', description: 'Forecast accuracy gain', detail: 'ML models outperform historical methods across all product categories' },
    ],
    industries: ['Food & Beverage', 'Manufacturing', 'Retail', 'Automotive'],
    technologies: ['Snowflake/Databricks', 'IoT Integration', 'SAP/Oracle ERP', 'ML Forecasting', 'Tableau/PowerBI', 'Real-time Alerting'],
    category: 'Supply Chain',
    timeline: '12-18 months typical',
    teamSize: '18-28 consultants',
    relatedPlaybooks: ['real-time-data-platform', 'multi-source-integration'],
    downloadAvailable: false,
  },
  'legacy-cloud-migration': {
    slug: 'legacy-cloud-migration',
    id: 'cloud-migration',
    displayTitle: 'Hadoop → Cloud',
    fullTitle: 'Legacy to Cloud Migration',
    deployments: 52,
    description: 'Our most deployed playbook - migrating from aging on-prem Hadoop/Teradata/Oracle to modern cloud with 3x better ROI.',
    overview: 'Your on-premise data platform is becoming a liability. Hadoop clusters need constant care and feeding. Teradata licensing costs grow 15-20% annually. Oracle DBAs are retiring faster than you can hire replacements. Scaling requires 6-12 month hardware procurement cycles while cloud competitors spin up capacity in minutes. Your best data engineers are leaving for companies with modern stacks. This playbook, our most deployed with 52 successful migrations, provides the proven path from legacy on-premise data platforms to modern cloud architectures with zero downtime and 3x better ROI than lift-and-shift.',
    challengePattern: [
      'On-premise Hadoop/Teradata/Oracle platforms are 5-10 years old, approaching end of vendor support',
      'Infrastructure and licensing costs growing 15-20% annually with no corresponding capability improvement',
      'Scaling requires 6-12 month hardware procurement cycles. Business needs capacity now, not next fiscal year.',
      'Maintenance consumes 40%+ of data team time. Engineers patch and tune instead of building value.',
      'Talent retention is failing. Top engineers want cloud experience; they leave for modern shops.',
      'Technical debt accumulates. Workarounds and patches make the platform increasingly fragile.',
    ],
    solutionApproach: [
      'Assessment & Planning: Comprehensive workload analysis categorizing each job by complexity, criticality, and cloud-readiness. Build migration roadmap based on risk and value.',
      'Re-Architecture: Transform workloads for cloud-native benefits. Lift-and-shift misses 70% of cloud value. Re-architecting delivers 3x better ROI.',
      'Parallel Run Strategy: New cloud platform runs alongside legacy for 3-6 months. Results validated against production before cutover.',
      'Automated Migration: Tooling for schema conversion, data movement, and code translation. Manual migration doesn\'t scale.',
      'FinOps from Day One: Cloud cost optimization practices established before migration starts. Prevents cost surprises post-migration.',
      'Team Upskilling: Training and certification program starts 3 months before migration. Teams migrate with knowledge, not fear.',
    ],
    keyLearnings: [
      'Lift-and-shift misses 70% of cloud benefits. Re-architecture is more work upfront but delivers 3x better ROI.',
      'Zero-downtime migration requires parallel run strategy. Plan for 3-6 months of dual operation.',
      'FinOps practices must be established before migration. Cloud costs can exceed on-prem without governance.',
      'Team upskilling should start 3 months before migration. Migrating to a platform nobody understands fails.',
      'Legacy SQL and stored procedures need modernization. Porting bad patterns to cloud creates expensive bad patterns.',
      'Data validation automation is critical. Manual comparison of billion-row tables isn\'t feasible.',
    ],
    outcomes: [
      { metric: '68%', description: 'Cost reduction', detail: 'Infrastructure, licensing, and operational savings versus legacy platform' },
      { metric: '10x', description: 'Processing speed', detail: 'Cloud-native architecture delivers order of magnitude performance improvement' },
      { metric: '$3.2M', description: '3-year savings', detail: 'Average total cost of ownership reduction over legacy platform' },
      { metric: 'Zero', description: 'Downtime', detail: 'Parallel run strategy enables seamless cutover with no business disruption' },
    ],
    industries: ['Financial Services', 'Healthcare', 'Retail', 'Education'],
    technologies: ['AWS/Azure/GCP', 'Databricks/Snowflake', 'Automated Migration Tools', 'Data Validation', 'Terraform IaC', 'Cost Optimization'],
    category: 'Cloud',
    timeline: '9-18 months typical',
    teamSize: '15-30 consultants',
    relatedPlaybooks: ['post-acquisition-consolidation', 'multi-source-integration'],
    downloadAvailable: false,
  },
  'multi-source-integration': {
    slug: 'multi-source-integration',
    id: 'data-integration',
    displayTitle: '40 Sources, One Truth',
    fullTitle: 'Multi-Source Data Integration',
    deployments: 34,
    description: 'Playbook for integrating 20-40 disparate source systems with automated quality detection and self-healing pipelines.',
    overview: 'Your company runs on 40 different systems. Salesforce for CRM. SAP for ERP. Workday for HR. NetSuite for finance. Plus a dozen SaaS tools, legacy databases, Excel spreadsheets from acquisitions, and APIs that seemed like a good idea at the time. Each system is the "source of truth" for something, but they all disagree. Customer names don\'t match. Product codes vary. Revenue numbers never reconcile. This playbook, proven through 34 deployments, provides the architecture for integrating 20-40 disparate systems into a true single source of truth.',
    challengePattern: [
      '20-40 disparate source systems each claiming to be "the source of truth" for different data domains',
      'Mixed landscape: Enterprise SaaS, legacy on-prem databases, department spreadsheets, partner APIs, and acquired company systems',
      'No unified data model. "Customer" has 15 different definitions. "Revenue" calculates differently in every system.',
      'Data quality varies dramatically. CRM is 60% accurate. ERP is 95%. Spreadsheets are anybody\'s guess.',
      'Manual integration processes: analysts copy/paste between systems, creating errors and delays',
      'New data requests take weeks because nobody knows where the data lives or which version is correct',
    ],
    solutionApproach: [
      'Source Discovery: Comprehensive inventory of all data sources, owners, refresh schedules, and data quality. Plan for 3x expected time.',
      'Unified Data Model: Canonical data model that bridges semantic differences across sources. "Customer" means one thing everywhere.',
      'Integration Patterns: Right tool for each source. Batch for daily systems. CDC for real-time. API for SaaS. Direct connect for databases.',
      'Automated Data Quality: Great Expectations or similar for validation. Every record checked against business rules on every load.',
      'Self-Healing Pipelines: Automated retry, error handling, and notification. Failed jobs recover without human intervention 95% of the time.',
      'Data Catalog: Searchable inventory of all data assets. Business users find data in minutes, not weeks.',
    ],
    keyLearnings: [
      'Source system discovery takes 3x longer than expected. Every company has shadow systems nobody documented.',
      'Data quality issues always surface during integration. Automate detection from day one or drown in manual fixes.',
      'CDC (change data capture) is essential for any source requiring real-time or near real-time updates.',
      'Self-healing pipelines reduce operational overhead by 80%. Without them, engineers become babysitters.',
      'Involve source system owners early. They know the edge cases, data quirks, and business rules not documented anywhere.',
      'Data contracts are essential. Source systems must notify before schema changes or face broken integrations.',
    ],
    outcomes: [
      { metric: '32', description: 'Average systems integrated', detail: 'Unified data platform connecting all enterprise data sources' },
      { metric: '85%', description: 'Data quality improvement', detail: 'Automated validation catches issues before they propagate' },
      { metric: '99.8%', description: 'Pipeline reliability', detail: 'Self-healing architecture minimizes downtime and manual intervention' },
      { metric: '80%', description: 'Operational reduction', detail: 'Automation eliminates manual data engineering toil' },
    ],
    industries: ['Technology', 'Financial Services', 'Healthcare', 'Retail'],
    technologies: ['Fivetran/Airbyte', 'Informatica/Mulesoft', 'Databricks/Snowflake', 'Great Expectations', 'Unified Data Model', 'Self-healing Pipelines'],
    category: 'Data Engineering',
    timeline: '6-12 months typical',
    teamSize: '10-20 consultants',
    relatedPlaybooks: ['post-acquisition-consolidation', 'global-data-unification'],
    downloadAvailable: false,
  },
};

interface PlaybookDetail {
  slug: string;
  id: string;
  displayTitle: string;
  fullTitle: string;
  deployments: number;
  description: string;
  overview: string;
  challengePattern: string[];
  solutionApproach: string[];
  keyLearnings: string[];
  outcomes: { metric: string; description: string; detail: string }[];
  industries: string[];
  technologies: string[];
  category: string;
  timeline: string;
  teamSize: string;
  relatedPlaybooks: string[];
  downloadAvailable: boolean;
}

// Download Modal Component
function DownloadModal({
  isOpen,
  onClose,
  playbookTitle,
  playbookSlug,
}: {
  isOpen: boolean;
  onClose: () => void;
  playbookTitle: string;
  playbookSlug: string;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    // Check for work email (basic check)
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    if (personalDomains.includes(emailDomain)) {
      setError('Please use your work email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/playbook-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          playbook_slug: playbookSlug,
          playbook_title: playbookTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      const data = await response.json();

      // Redirect to thank you page with download token
      window.location.href = `/playbooks/thank-you?token=${data.downloadToken}&playbook=${playbookSlug}`;
    } catch {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-[#1890FF]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-[#1890FF]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--aci-secondary)]">
              Download Playbook
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              {playbookTitle}
            </p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">Check your email for the download link!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
                    placeholder="Acme Corp"
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[var(--aci-primary)] text-white font-semibold rounded-lg hover:bg-[var(--aci-primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Get Playbook PDF
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                By downloading, you agree to receive occasional updates from ACI Infotech.
                Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlaybookPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [playbook, setPlaybook] = useState<PlaybookDetail | null>(null);

  useEffect(() => {
    if (slug && playbooksData[slug]) {
      setPlaybook(playbooksData[slug]);
    }
  }, [slug]);

  if (!playbook) {
    return (
      <main className="min-h-screen">
        <section className="bg-[#001529] pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-[#1890FF] font-medium mb-4">Playbook</p>
            <h1 className="text-4xl font-bold text-white mb-6">Playbook Not Found</h1>
            <p className="text-xl text-gray-400 mb-8">
              The playbook you're looking for doesn't exist or has been moved.
            </p>
            <Button href="/playbooks" variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Playbooks
            </Button>
          </div>
        </section>
      </main>
    );
  }

  const relatedPlaybooks = playbook.relatedPlaybooks
    ?.map(slug => playbooksData[slug])
    .filter(Boolean) || [];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#001529] pt-32 pb-20 relative overflow-hidden">
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

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            href="/playbooks"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Playbooks
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-[#1890FF]/20 text-[#1890FF] text-sm font-medium rounded">
              {playbook.category}
            </span>
            <span className="text-[#C4FF61] font-mono font-bold">
              {playbook.deployments}x deployed
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {playbook.displayTitle}
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            {playbook.fullTitle}
          </p>
          <p className="text-gray-500">
            {playbook.description}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-700">
            <div>
              <div className="text-sm text-gray-400 mb-1">Deployments</div>
              <div className="text-xl font-semibold text-white">{playbook.deployments}x</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Timeline</div>
              <div className="text-xl font-semibold text-white">{playbook.timeline}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Team Size</div>
              <div className="text-xl font-semibold text-white">{playbook.teamSize}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400 mb-1">Category</div>
              <div className="text-xl font-semibold text-white">{playbook.category}</div>
            </div>
          </div>

          {/* Download CTA */}
          {playbook.downloadAvailable && (
            <div className="mt-8">
              <button
                onClick={() => setShowDownloadModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C4FF61] text-[#001529] font-bold rounded-lg hover:bg-[#d4ff81] transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Playbook PDF
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Key Outcomes */}
      <section className="py-16 bg-[var(--aci-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-white text-lg font-medium mb-8">Typical Outcomes Achieved</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {playbook.outcomes.map((outcome, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{outcome.metric}</div>
                <div className="text-blue-100">{outcome.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--aci-secondary)] mb-6">Overview</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{playbook.overview}</p>
        </div>
      </section>

      {/* Challenge Pattern */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Challenge Pattern</h2>
          </div>
          <p className="text-lg text-gray-600 mb-8">
            This playbook addresses organizations facing these common challenges:
          </p>
          <ul className="space-y-4">
            {playbook.challengePattern.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Solution Approach */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Solution Approach</h2>
          </div>
          <ul className="space-y-4 mb-8">
            {playbook.solutionApproach.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Key Learnings */}
      <section className="py-20 bg-[#001529]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#1890FF]/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Key Learnings</h2>
          </div>
          <p className="text-gray-400 mb-8">
            Hard-won insights from {playbook.deployments} deployments:
          </p>
          <div className="space-y-4">
            {playbook.keyLearnings.map((learning, index) => (
              <div
                key={index}
                className="p-4 bg-white/5 border border-[#1890FF]/30 rounded-lg"
              >
                <p className="text-white">{learning}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 bg-white border-y">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-6">Technologies Used</h2>
          <div className="flex flex-wrap gap-3">
            {playbook.technologies.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[var(--aci-secondary)] mb-6">Industries Served</h2>
          <div className="flex flex-wrap gap-3">
            {playbook.industries.map((industry) => (
              <span
                key={industry}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Results */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h2 className="text-3xl font-bold text-[var(--aci-secondary)]">Results & Impact</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {playbook.outcomes.map((result, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="text-3xl font-bold text-[var(--aci-primary)] mb-2">{result.metric}</div>
                <div className="font-semibold text-[var(--aci-secondary)] mb-2">{result.description}</div>
                <p className="text-sm text-gray-500">{result.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Playbooks */}
      {relatedPlaybooks.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--aci-secondary)] mb-8">Related Playbooks</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPlaybooks.map((related) => (
                <Link
                  key={related.slug}
                  href={`/playbooks/${related.slug}`}
                  className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-2 py-1 bg-[#1890FF]/10 text-[#1890FF] text-xs font-medium rounded">
                      {related.category}
                    </span>
                    <span className="text-[#C4FF61] text-sm font-mono bg-[#001529] px-2 py-1 rounded">
                      {related.deployments}x
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--aci-secondary)] group-hover:text-[var(--aci-primary)] transition-colors mb-2">
                    {related.displayTitle}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{related.fullTitle}</p>
                  <span className="text-[var(--aci-primary)] text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Playbook <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-[var(--aci-primary)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Implement This Playbook?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Talk to an architect who has deployed this pattern {playbook.deployments} times.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={`/contact?playbook=${playbook.id}`} variant="secondary" size="lg">
              Talk to the Architect
            </Button>
            {playbook.downloadAvailable && (
              <button
                onClick={() => setShowDownloadModal(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/20 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Download Modal */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        playbookTitle={playbook.fullTitle}
        playbookSlug={playbook.slug}
      />
    </main>
  );
}

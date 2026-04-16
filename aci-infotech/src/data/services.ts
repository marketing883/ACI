/**
 * Atheros content index: service entries.
 *
 * Source of truth for every service page ACI ships. Extracted from the
 * per-page const arrays (caseStudies, offerings, keyOutcomes, faqs, processPhases)
 * during Part 2 of the Co-Pilot rebuild.
 *
 * Part 4 will refactor each src/app/services/<slug>/page.tsx into a thin
 * wrapper that reads from this file; for now the pages still carry their
 * own inline copies. The Atheros indexer reads from this file.
 *
 * Client names are intentionally replaced with client_descriptor per the
 * site-wide "no client names" rule. Descriptor copy is seeded from industry
 * and may be refined by the content team.
 */
import type { ServiceEntry, ServiceClusterId } from './types';

export const services: Record<ServiceClusterId, ServiceEntry> = {
  'data-engineering': {
    id: 'data-engineering',
    slug: 'data-engineering',
    title: 'Data Engineering',
    tagline: '',
    description: '',
    keyOutcomes: [
  'Cut data latency 30%+ with real-time pipelines',
  'Unify scattered data into single source of truth',
  'Enable AI-ready data products from day one',
  'Instrument observability so you see issues before users',
],
    offerings: [
  {
    id: 'unified-lakehouse',
    title: 'Unified Data Lakehouse',
    description: 'Consolidate scattered data warehouses into one governed lakehouse built on Databricks or Snowflake.',
    technologies: ['Azure Databricks', 'Delta Lake', 'Snowflake', 'Apache Iceberg', 'dbt'],
    outcomes: ['30-40% storage cost reduction', 'Single source of truth', 'AI-ready data products'],
  },
  {
    id: 'real-time-pipelines',
    title: 'Real-Time Data Pipelines',
    description: 'Streaming data pipelines that feed dashboards, ML models, and operational systems with millisecond latency.',
    technologies: ['Kafka', 'Spark Streaming', 'AWS Kinesis', 'Azure Event Hubs'],
    outcomes: ['<1 second data latency', 'Real-time insights', 'Self-healing pipelines'],
  },
  {
    id: 'data-observability',
    title: 'Data Observability & Quality',
    description: 'Monitor data lineage, freshness, and SLAs end-to-end with Dynatrace or similar platforms.',
    technologies: ['Dynatrace', 'Great Expectations', 'Monte Carlo', 'DataHub'],
    outcomes: ['90% reduction in quality incidents', 'Full lineage tracking', 'SLA compliance visibility'],
  },
  {
    id: 'dataops-automation',
    title: 'DataOps & Automation',
    description: 'CI/CD pipelines for data with automated testing, deployment, and monitoring.',
    technologies: ['GitLab CI/CD', 'Terraform', 'Airflow', 'Dagster'],
    outcomes: ['40% faster pipeline development', 'Automated testing', 'Version-controlled infrastructure'],
  },
  {
    id: 'data-governance',
    title: 'Data Governance & Cataloging',
    description: 'Enterprise data governance with Unity Catalog, Collibra, or Alation.',
    technologies: ['Unity Catalog', 'Collibra', 'Alation', 'Apache Atlas'],
    outcomes: ['100% data cataloged', 'Automated PII classification', 'Audit-ready logs'],
  },
  {
    id: 'cloud-data-migration',
    title: 'Cloud Data Migration',
    description: 'Migrate on-premises data warehouses to cloud with zero downtime.',
    technologies: ['AWS DMS', 'Azure Data Migration', 'Snowflake Migration'],
    outcomes: ['Zero-downtime migration', '30-50% cost reduction', 'Legacy decommissioning'],
  },
],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Financial Services Client',
    industry: 'Financial Services',
    challenge: '40+ finance systems post-acquisitions needed consolidation into unified platform',
    results: [
      {
        metric: '$12M',
        description: 'Operational savings in year one'
      },
      {
        metric: '18 months',
        description: 'Delivery timeline'
      },
      {
        metric: 'Zero',
        description: 'Financial reporting disruptions'
      }
    ],
    technologies: [
      'SAP S/4HANA',
      'Python',
      'Azure DevOps'
    ],
    slug: 'modernizes-finance-reporting-with-sap-transformation'
  },
  {
    client_descriptor: 'Fortune 500 Retail Client',
    industry: 'Retail',
    challenge: 'Payment systems across 600+ locations needed real-time data with zero downtime',
    results: [
      {
        metric: '30%',
        description: 'Reduction in data latency'
      },
      {
        metric: '600+',
        description: 'Locations with zero downtime'
      },
      {
        metric: 'Real-time',
        description: 'Inventory visibility'
      }
    ],
    technologies: [
      'Databricks',
      'Kafka',
      'AWS',
      'Braze'
    ],
    slug: 'databricks-modernization-ai-enablement-for-leading-c-store-chain'
  },
  {
    client_descriptor: 'Fortune 500 Hospitality Client',
    industry: 'Hospitality',
    challenge: 'Global operations with data scattered across regional silos',
    results: [
      {
        metric: 'Single',
        description: 'Source of truth'
      },
      {
        metric: 'Global',
        description: 'Supply chain visibility'
      },
      {
        metric: '50%',
        description: 'Faster decision-making'
      }
    ],
    technologies: [
      'Informatica IICS',
      'MDM',
      'Cloud Integration'
    ],
    slug: 'global-food-facilities-data-intelligence'
  }
],
    processPhases: [
  {
    number: 1,
    title: 'Discovery & Architecture',
    duration: 'Weeks 1-4',
    description: 'Assess your current data landscape, understand business requirements, and design the target architecture.',
  },
  {
    number: 2,
    title: 'Foundation & Setup',
    duration: 'Weeks 5-12',
    description: 'Platform provisioning, security framework, governance setup. The foundation everything builds on.',
  },
  {
    number: 3,
    title: 'Build & Iterate',
    duration: 'Months 4-8',
    description: 'Iterative development in 2-week sprints. Build pipelines, transform data, create data products.',
  },
  {
    number: 4,
    title: 'Launch & Stabilize',
    duration: 'Weeks 9-12',
    description: 'Production deployment with monitoring, alerting, and runbooks. We stabilize until SLAs are met.',
  },
  {
    number: 5,
    title: 'Optimize & Scale',
    duration: 'Ongoing',
    description: 'Continuous optimization, cost management, and feature enhancements.',
  },
],
    faqs: [
  {
    question: 'How long does a typical data platform project take?',
    answer: '6-12 months for enterprise-scale lakehouse consolidation. Smaller projects (single pipeline, specific integration) can be 3-6 months.',
  },
  {
    question: "What's the ROI of a modern data platform?",
    answer: 'Typical clients see 30-40% reduction in storage costs, 50%+ faster time to insights, and 3-5x improvement in data analyst productivity.',
  },
  {
    question: 'Do we need to migrate everything at once?',
    answer: "No. We use a phased approach, critical systems first, then expand. You'll see value within 3-4 months.",
  },
  {
    question: 'Can you work with our existing cloud provider?',
    answer: "Yes. We're certified on AWS, Azure, and GCP. We design for your environment and can handle multi-cloud.",
  },
],
  },
  'applied-ai-ml': {
    id: 'applied-ai-ml',
    slug: 'applied-ai-ml',
    title: 'Applied AI ML',
    tagline: '',
    description: '',
    keyOutcomes: [
  'Ship models to production, not pilot purgatory',
  'GenAI chatbots with enterprise security',
  'MLOps pipelines with automated retraining',
  'AI governance that satisfies regulators',
],
    offerings: [
  {
    id: 'genai-solutions',
    title: 'GenAI & LLM Solutions',
    description: 'Enterprise chatbots, document processing, code generation powered by Azure OpenAI, AWS Bedrock, or private LLMs.',
    technologies: ['Azure OpenAI', 'AWS Bedrock', 'Claude', 'LangChain'],
    outcomes: ['40% reduction in support tickets', 'Automated document processing', 'Enterprise security controls'],
  },
  {
    id: 'predictive-analytics',
    title: 'Predictive Analytics',
    description: 'Forecasting engines for demand, churn, and risk. ML models that run in production with continuous learning.',
    technologies: ['Databricks ML', 'Python', 'TensorFlow', 'scikit-learn'],
    outcomes: ['30% improvement in forecast accuracy', 'Real-time predictions', 'Automated model refresh'],
  },
  {
    id: 'recommendation-systems',
    title: 'Recommendation Systems',
    description: 'Personalization engines for retail, media, and financial services. Real-time recommendations at scale.',
    technologies: ['Spark MLlib', 'TensorFlow Recommenders', 'Feature Stores'],
    outcomes: ['25% increase in conversion', 'Real-time personalization', 'A/B testing built-in'],
  },
  {
    id: 'mlops',
    title: 'MLOps & Model Management',
    description: 'CI/CD for ML with automated testing, deployment, and monitoring. MLflow, Kubeflow, or custom platforms.',
    technologies: ['MLflow', 'Kubeflow', 'Databricks Mosaic AI', 'SageMaker'],
    outcomes: ['5x faster model deployment', 'Automated retraining', 'Version-controlled models'],
  },
  {
    id: 'ai-governance',
    title: 'AI Governance & ArqAI',
    description: 'Policy-as-code, bias monitoring, drift detection. EU AI Act, GDPR compliant from day one.',
    technologies: ['ArqAI', 'MLflow Governance', 'Great Expectations'],
    outcomes: ['Audit-ready AI systems', 'Automated compliance checks', 'Bias monitoring'],
  },
  {
    id: 'intelligent-automation',
    title: 'Intelligent Process Automation',
    description: 'Document AI, intelligent OCR, and AI-powered workflows that augment human decision-making.',
    technologies: ['Document AI', 'UiPath AI', 'Power Automate AI'],
    outcomes: ['80% reduction in manual processing', 'Human-in-the-loop where needed', 'Measurable ROI'],
  },
],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Financial Services Client',
    industry: 'Financial Services',
    challenge: 'Forecasting models took weeks to retrain and deploy, missing market changes',
    results: [
      {
        metric: '30%',
        description: 'Improvement in forecast accuracy'
      },
      {
        metric: 'Daily',
        description: 'Automated model retraining'
      },
      {
        metric: '$5M',
        description: 'Annual cost savings'
      }
    ],
    technologies: [
      'Databricks ML',
      'MLflow',
      'Python'
    ],
    slug: 'financial-forecasting'
  },
  {
    client_descriptor: 'Fortune 500 Healthcare Client',
    industry: 'Healthcare',
    challenge: 'Manual claims processing taking 72 hours average',
    results: [
      {
        metric: '4 hours',
        description: 'Reduced processing time'
      },
      {
        metric: '95%',
        description: 'Automated accuracy'
      },
      {
        metric: '80%',
        description: 'Reduction in manual work'
      }
    ],
    technologies: [
      'Document AI',
      'Azure OpenAI',
      'Python'
    ],
    slug: 'document-processing'
  }
],
    processPhases: [],
    faqs: [
  {
    question: 'How do you handle AI governance and compliance?',
    answer: 'We use ArqAI, our purpose-built AI governance platform, to implement policy-as-code, automated bias monitoring, and audit trails. This ensures compliance with EU AI Act, GDPR, and industry-specific regulations from day one.',
  },
  {
    question: 'Can we use private LLMs for sensitive data?',
    answer: 'Yes. We deploy private LLMs on your infrastructure (Azure OpenAI, AWS Bedrock, or on-prem) with full data residency controls. Your data never leaves your environment.',
  },
  {
    question: 'What about model drift and retraining?',
    answer: 'Every model includes automated drift detection and retraining pipelines. Most models refresh daily or weekly depending on your data velocity. You see performance metrics in real-time dashboards.',
  },
  {
    question: 'How long does a typical AI project take?',
    answer: '3-6 months for most AI implementations. GenAI chatbots can be faster (8-12 weeks). Complex ML systems with custom models take 6-12 months.',
  },
],
  },
  'cloud-modernization': {
    id: 'cloud-modernization',
    slug: 'cloud-modernization',
    title: 'Cloud Modernization',
    tagline: '',
    description: '',
    keyOutcomes: [
  'On-time, on-budget cloud migrations with zero downtime',
  'Multi-cloud architectures without vendor lock-in',
  '30-50% infrastructure cost reduction',
  'Security and compliance built in from day one',
],
    offerings: [
  {
    id: 'cloud-migration',
    title: 'Cloud Migration',
    description: 'Lift and shift, replatform, or refactor, we migrate your workloads to AWS, Azure, or GCP with zero downtime.',
    technologies: ['AWS', 'Azure', 'GCP', 'VMware Cloud'],
    outcomes: ['Zero-downtime migration', '30-50% cost reduction', 'Legacy decommissioning'],
  },
  {
    id: 'application-modernization',
    title: 'Application Modernization',
    description: 'Refactor monoliths to microservices, containerize legacy applications, and enable CI/CD pipelines.',
    technologies: ['Kubernetes', 'Docker', 'Terraform', 'GitOps'],
    outcomes: ['10x faster deployments', 'Improved scalability', 'Reduced tech debt'],
  },
  {
    id: 'kubernetes-platform',
    title: 'Kubernetes Platform Engineering',
    description: 'Enterprise-grade Kubernetes platforms with service mesh, observability, and security.',
    technologies: ['EKS', 'AKS', 'GKE', 'OpenShift', 'Istio'],
    outcomes: ['Self-service developer platform', 'Automated scaling', 'Multi-cluster management'],
  },
  {
    id: 'infrastructure-as-code',
    title: 'Infrastructure as Code',
    description: 'Terraform, Pulumi, and CloudFormation for reproducible, version-controlled infrastructure.',
    technologies: ['Terraform', 'Pulumi', 'CloudFormation', 'Ansible'],
    outcomes: ['Reproducible environments', 'Automated provisioning', 'Drift detection'],
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security & Compliance',
    description: 'Security posture management, compliance automation, and zero-trust architectures.',
    technologies: ['AWS Security Hub', 'Azure Security Center', 'CIS Benchmarks'],
    outcomes: ['Audit-ready compliance', 'Automated security scanning', 'Zero-trust architecture'],
  },
  {
    id: 'cloud-cost-optimization',
    title: 'Cloud Cost Optimization',
    description: 'FinOps practices to reduce cloud spend without sacrificing performance.',
    technologies: ['AWS Cost Explorer', 'Azure Cost Management', 'Spot Instances'],
    outcomes: ['30-50% cost savings', 'Right-sizing recommendations', 'Reserved instance strategy'],
  },
],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Insurance Client',
    industry: 'Insurance',
    challenge: 'Legacy data center costing $20M annually with aging hardware',
    results: [
      {
        metric: '$8M',
        description: 'Annual savings'
      },
      {
        metric: 'Zero',
        description: 'Downtime during migration'
      },
      {
        metric: '18 months',
        description: 'Data center exit'
      }
    ],
    technologies: [
      'AWS',
      'Terraform',
      'Kubernetes'
    ],
    slug: 'insurance-cloud-migration'
  },
  {
    client_descriptor: 'Fortune 500 Retail Client',
    industry: 'Retail',
    challenge: 'Monolithic e-commerce platform unable to handle peak traffic',
    results: [
      {
        metric: '10x',
        description: 'Improved scalability'
      },
      {
        metric: '99.99%',
        description: 'Uptime achieved'
      },
      {
        metric: '5x',
        description: 'Faster deployment cycles'
      }
    ],
    technologies: [
      'Azure',
      'Kubernetes',
      'Microservices'
    ],
    slug: 'retail-modernization'
  },
  {
    client_descriptor: 'Fortune 500 Manufacturing Client',
    industry: 'Manufacturing',
    challenge: 'Locked into single cloud vendor with no disaster recovery',
    results: [
      {
        metric: 'Multi-cloud',
        description: 'Architecture deployed'
      },
      {
        metric: 'Active-active',
        description: 'Disaster recovery'
      },
      {
        metric: '40%',
        description: 'Cost reduction'
      }
    ],
    technologies: [
      'AWS',
      'Azure',
      'Terraform',
      'Consul'
    ],
    slug: 'manufacturing-multicloud'
  }
],
    processPhases: [],
    faqs: [
  {
    question: 'How long does a cloud migration take?',
    answer: '6-18 months depending on complexity. Simple lift-and-shift can be faster. Full application modernization takes longer. We can show you a detailed timeline after discovery.',
  },
  {
    question: 'Which cloud should we choose?',
    answer: "It depends on your existing investments, workload requirements, and regulatory needs. We're platform-agnostic and will recommend what's best for your specific situation.",
  },
  {
    question: 'How do you handle security during migration?',
    answer: 'Security is built in, not bolted on. We implement identity management, encryption, network segmentation, and compliance controls before any data moves.',
  },
  {
    question: 'What about vendor lock-in?',
    answer: 'We design for portability where it matters. Container-based workloads, infrastructure as code, and open standards help you avoid lock-in while still leveraging cloud-native services.',
  },
],
  },
  'martech-cdp': {
    id: 'martech-cdp',
    slug: 'martech-cdp',
    title: 'MarTech CDP',
    tagline: '',
    description: '',
    keyOutcomes: [
  '1:1 personalization at scale',
  'Unified customer view across all touchpoints',
  'Real-time journey orchestration',
  'Measurable lift in conversion and retention',
],
    offerings: [
  {
    id: 'cdp-implementation',
    title: 'CDP Implementation',
    description: 'Salesforce Data Cloud, Adobe Real-Time CDP, or Segment implementations with unified customer profiles.',
    technologies: ['Salesforce Data Cloud', 'Adobe RT-CDP', 'Segment', 'mParticle'],
    outcomes: ['360° customer view', 'Real-time profile updates', 'Privacy-compliant activation'],
  },
  {
    id: 'journey-orchestration',
    title: 'Journey Orchestration',
    description: 'Multi-channel customer journeys that respond in real-time to behavior signals.',
    technologies: ['Salesforce Journey Builder', 'Adobe Journey Optimizer', 'Braze Canvas'],
    outcomes: ['20% lift in engagement', 'Automated lifecycle marketing', 'Cross-channel consistency'],
  },
  {
    id: 'personalization-engine',
    title: 'Personalization Engine',
    description: 'AI-driven personalization for web, email, mobile, and paid media.',
    technologies: ['Einstein AI', 'Adobe Sensei', 'Dynamic Yield'],
    outcomes: ['25% increase in conversion', 'Product recommendations', 'Next-best-action'],
  },
  {
    id: 'email-marketing',
    title: 'Email & Messaging',
    description: 'High-deliverability email programs with dynamic content and A/B testing.',
    technologies: ['Salesforce Marketing Cloud', 'Braze', 'Klaviyo', 'SendGrid'],
    outcomes: ['Improved deliverability', 'Higher open rates', 'Reduced unsubscribes'],
  },
  {
    id: 'loyalty-crm',
    title: 'Loyalty & CRM',
    description: 'Loyalty program design and CRM integrations that drive repeat purchase.',
    technologies: ['Salesforce CRM', 'Loyalty Management', 'Service Cloud'],
    outcomes: ['Increased LTV', 'Higher retention', 'Unified service experience'],
  },
  {
    id: 'analytics-attribution',
    title: 'Analytics & Attribution',
    description: 'Marketing mix modeling, multi-touch attribution, and campaign analytics.',
    technologies: ['Adobe Analytics', 'Google Analytics 4', 'Tableau', 'Looker'],
    outcomes: ['Clear ROI measurement', 'Channel optimization', 'Budget allocation'],
  },
],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Retail Client',
    industry: 'Retail',
    challenge: 'Fragmented customer data across 600+ locations, no unified view',
    results: [
      {
        metric: '30%',
        description: 'Reduction in data latency'
      },
      {
        metric: '25%',
        description: 'Improvement in promotions'
      },
      {
        metric: '600+',
        description: 'Locations integrated'
      }
    ],
    technologies: [
      'Salesforce',
      'Braze',
      'AWS',
      'Databricks'
    ],
    slug: 'databricks-modernization-ai-enablement-for-leading-c-store-chain'
  },
  {
    client_descriptor: 'Fortune 500 Hospitality Client',
    industry: 'Hospitality',
    challenge: 'Loyalty program data siloed from marketing systems',
    results: [
      {
        metric: 'Unified',
        description: 'Customer profile'
      },
      {
        metric: '20%',
        description: 'Increase in bookings'
      },
      {
        metric: 'Real-time',
        description: 'Personalization'
      }
    ],
    technologies: [
      'Salesforce',
      'Marketing Cloud',
      'Data Cloud'
    ],
    slug: 'hospitality-loyalty'
  }
],
    processPhases: [],
    faqs: [
  {
    question: 'Which CDP should we choose?',
    answer: 'It depends on your existing stack. Salesforce Data Cloud for Salesforce-heavy orgs, Adobe RT-CDP for Adobe shops, Segment for flexibility. We help you evaluate based on your specific requirements.',
  },
  {
    question: 'How long does a CDP implementation take?',
    answer: '6-9 months for enterprise implementations. Simpler deployments can be faster. The timeline depends on data sources, use cases, and integration complexity.',
  },
  {
    question: 'What about data privacy and compliance?',
    answer: 'Privacy is built in. We implement consent management, data residency controls, and ensure GDPR/CCPA compliance from day one.',
  },
  {
    question: 'Can you work with our existing marketing tools?',
    answer: 'Yes. We integrate with your existing stack and add capabilities incrementally. No need to rip and replace.',
  },
],
  },
  'digital-transformation': {
    id: 'digital-transformation',
    slug: 'digital-transformation',
    title: 'Digital Transformation',
    tagline: '',
    description: '',
    keyOutcomes: [
  '40% reduction in manual processes',
  'Straight-through processing for routine tasks',
  'Human-in-the-loop where judgment matters',
  'Measurable ROI on automation investments',
],
    offerings: [
  {
    id: 'servicenow',
    title: 'ServiceNow Implementation',
    description: 'ITSM, HRSD, Customer Service Management, workflows that actually get used.',
    technologies: ['ServiceNow', 'ITSM', 'HRSD', 'CSM'],
    outcomes: ['50% faster ticket resolution', 'Self-service adoption', 'Unified service experience'],
  },
  {
    id: 'rpa',
    title: 'Robotic Process Automation',
    description: 'UiPath, Power Automate, Automation Anywhere, bots that free humans for higher-value work.',
    technologies: ['UiPath', 'Power Automate', 'Automation Anywhere'],
    outcomes: ['80% reduction in manual work', '24/7 processing', 'Zero-error execution'],
  },
  {
    id: 'document-ai',
    title: 'Intelligent Document Processing',
    description: 'OCR, document classification, and data extraction at scale.',
    technologies: ['Azure Document AI', 'AWS Textract', 'Google Document AI'],
    outcomes: ['95% extraction accuracy', 'Hours to seconds', 'Human review for exceptions'],
  },
  {
    id: 'workflow-automation',
    title: 'Workflow Automation',
    description: 'End-to-end process automation connecting systems, people, and decisions.',
    technologies: ['Power Platform', 'Camunda', 'Nintex'],
    outcomes: ['Automated approvals', 'Process visibility', 'Compliance tracking'],
  },
  {
    id: 'process-mining',
    title: 'Process Mining & Discovery',
    description: 'Understand your actual processes before automating. Data-driven improvement.',
    technologies: ['Celonis', 'UiPath Process Mining', 'Power BI'],
    outcomes: ['Process visibility', 'Bottleneck identification', 'ROI prioritization'],
  },
  {
    id: 'integration',
    title: 'Integration & APIs',
    description: 'MuleSoft, Workato, and custom APIs that connect your systems.',
    technologies: ['MuleSoft', 'Workato', 'Azure Logic Apps'],
    outcomes: ['Connected systems', 'Real-time data flow', 'API governance'],
  },
],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Financial Services Client',
    industry: 'Financial Services',
    challenge: 'Manual accounts payable processing taking 5 days average',
    results: [
      {
        metric: '80%',
        description: 'Reduction in processing time'
      },
      {
        metric: '$2M',
        description: 'Annual savings'
      },
      {
        metric: '0.1%',
        description: 'Error rate'
      }
    ],
    technologies: [
      'UiPath',
      'Azure Document AI',
      'SAP'
    ],
    slug: 'finance-automation'
  },
  {
    client_descriptor: 'Fortune 500 Manufacturing Client',
    industry: 'Manufacturing',
    challenge: 'HR requests lost in email, no visibility on status',
    results: [
      {
        metric: '60%',
        description: 'Faster request resolution'
      },
      {
        metric: 'Self-service',
        description: 'Employee portal'
      },
      {
        metric: '90%',
        description: 'Employee satisfaction'
      }
    ],
    technologies: [
      'ServiceNow',
      'HRSD',
      'Integration Hub'
    ],
    slug: 'hr-transformation'
  },
  {
    client_descriptor: 'Fortune 500 Insurance Client',
    industry: 'Insurance',
    challenge: 'Claims processing backlog growing, customer complaints rising',
    results: [
      {
        metric: '50%',
        description: 'Faster claims processing'
      },
      {
        metric: '40%',
        description: 'Reduction in backlog'
      },
      {
        metric: '25%',
        description: 'Improvement in NPS'
      }
    ],
    technologies: [
      'ServiceNow CSM',
      'Document AI',
      'RPA'
    ],
    slug: 'customer-service'
  }
],
    processPhases: [],
    faqs: [
  {
    question: 'Where should we start with automation?',
    answer: 'Start with process discovery. We help you identify high-volume, repetitive processes with clear ROI. Typical quick wins: accounts payable, employee onboarding, report generation.',
  },
  {
    question: 'How long does an RPA implementation take?',
    answer: '4-8 weeks for initial bot deployment. Enterprise-wide programs take 6-12 months. We recommend starting small, proving value, then scaling.',
  },
  {
    question: 'What about change management?',
    answer: "Automation changes how people work. We include change management in every project, communication, training, and support to ensure adoption.",
  },
  {
    question: 'How do you measure automation ROI?',
    answer: 'We track hours saved, error rates reduced, and cycle times improved. Every project has a business case with measurable outcomes that we track post-implementation.',
  },
],
  },
  'cyber-security': {
    id: 'cyber-security',
    slug: 'cyber-security',
    title: 'Cyber Security',
    tagline: '',
    description: '',
    keyOutcomes: [
  'Security built in from day one, not bolted on later',
  'SOC 2, ISO 27001, HIPAA compliant architectures',
  'Reduced security incidents with proactive monitoring',
  'Audit-ready documentation and controls',
],
    offerings: [
  {
    id: 'devsecops',
    title: 'DevSecOps Implementation',
    description: 'Security integrated into CI/CD pipelines. Automated scanning, vulnerability detection, and secure deployments.',
    technologies: ['Snyk', 'SonarQube', 'Checkmarx', 'GitLab Security'],
    outcomes: ['Shift-left security', 'Automated vulnerability scanning', 'Secure by default'],
  },
  {
    id: 'security-observability',
    title: 'Security Observability',
    description: 'Real-time threat detection, SIEM integration, and incident response with Dynatrace and Splunk.',
    technologies: ['Dynatrace', 'Splunk', 'CrowdStrike', 'Microsoft Sentinel'],
    outcomes: ['Real-time threat detection', 'Automated alerting', 'Incident response'],
  },
  {
    id: 'identity-access',
    title: 'Identity & Access Management',
    description: 'Zero-trust architecture, SSO, MFA, and privileged access management.',
    technologies: ['Okta', 'Azure AD', 'CyberArk', 'Ping Identity'],
    outcomes: ['Zero-trust architecture', 'Centralized identity', 'Reduced attack surface'],
  },
  {
    id: 'compliance',
    title: 'Compliance & Audit',
    description: 'SOC 2, ISO 27001, HIPAA, PCI-DSS compliance frameworks and audit preparation.',
    technologies: ['Compliance Frameworks', 'GRC Platforms', 'Audit Tools'],
    outcomes: ['Audit-ready documentation', 'Continuous compliance', 'Risk management'],
  },
  {
    id: 'vulnerability-mgmt',
    title: 'Vulnerability Management',
    description: 'Continuous vulnerability scanning, penetration testing, and remediation tracking.',
    technologies: ['Qualys', 'Tenable', 'Burp Suite', 'OWASP Tools'],
    outcomes: ['Reduced vulnerabilities', 'Prioritized remediation', 'Risk-based approach'],
  },
  {
    id: 'cloud-security',
    title: 'Cloud Security Posture',
    description: 'CSPM, workload protection, and cloud-native security for AWS, Azure, and GCP.',
    technologies: ['AWS Security Hub', 'Azure Security Center', 'Prisma Cloud'],
    outcomes: ['Cloud visibility', 'Automated compliance', 'Misconfiguration detection'],
  },
],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Healthcare Client',
    industry: 'Healthcare',
    challenge: 'HIPAA compliance gaps identified in security audit',
    results: [
      {
        metric: '100%',
        description: 'Compliance achieved'
      },
      {
        metric: '60%',
        description: 'Reduction in vulnerabilities'
      },
      {
        metric: 'Zero',
        description: 'Audit findings'
      }
    ],
    technologies: [
      'Azure Security',
      'CyberArk',
      'Splunk'
    ],
    slug: 'healthcare-compliance'
  },
  {
    client_descriptor: 'Fortune 500 Financial Client',
    industry: 'Financial',
    challenge: 'Security slowing down release cycles, developers bypassing controls',
    results: [
      {
        metric: '70%',
        description: 'Faster secure releases'
      },
      {
        metric: '90%',
        description: 'Automated security checks'
      },
      {
        metric: '0',
        description: 'Security bypasses'
      }
    ],
    technologies: [
      'Snyk',
      'GitLab',
      'SonarQube'
    ],
    slug: 'financial-devsecops'
  },
  {
    client_descriptor: 'Fortune 500 Retail Client',
    industry: 'Retail',
    challenge: 'Breach concerns with remote workforce and third-party access',
    results: [
      {
        metric: 'Zero-trust',
        description: 'Architecture deployed'
      },
      {
        metric: '80%',
        description: 'Reduction in attack surface'
      },
      {
        metric: 'MFA',
        description: 'Everywhere'
      }
    ],
    technologies: [
      'Okta',
      'CrowdStrike',
      'Zscaler'
    ],
    slug: 'retail-zerotrust'
  }
],
    processPhases: [],
    faqs: [
  {
    question: 'How do you balance security with development speed?',
    answer: 'By integrating security into CI/CD pipelines. Automated scanning catches issues early when they are cheap to fix. Developers get fast feedback without waiting for security review.',
  },
  {
    question: 'How long does SOC 2 compliance take?',
    answer: '6-12 months for initial certification depending on your starting point. We help you implement controls, document policies, and prepare for audit.',
  },
  {
    question: 'What about existing security tools?',
    answer: 'We integrate with your existing stack. Most enterprises have multiple security tools, we help you rationalize, integrate, and get value from your investments.',
  },
  {
    question: 'Do you provide ongoing security support?',
    answer: 'Yes. We offer managed security services, 24/7 monitoring, and incident response. Security is not a one-time project.',
  },
  {
    question: 'Do you run NOC and SOC operations, or just set them up?',
    answer: "Both. We design, implement, and operate. For clients who want ACI to stay on post-deployment, we provide 24/7 NOC and SOC coverage backed by SLAs, using the same observability stack we built for you. No handoff to a separate managed services team that doesn't know your environment.",
  },
],
  },
  'app-development': {
    id: 'app-development',
    slug: 'app-development',
    title: 'App Development',
    tagline: '',
    description: '',
    keyOutcomes: [
  'Enterprise applications that survive production scale',
  'AI-powered features that ship, not PoC demos',
  'Applications integrated with your data and AI stack from day one',
  'SLA-backed delivery, not fire-and-forget project closures',
],
    offerings: [
  {
    id: 'enterprise-applications',
    title: 'Enterprise Applications',
    description: 'Custom web and enterprise applications built for Fortune 500 operations. Production-grade from day one, not polished prototypes.',
    technologies: ['Next.js', 'React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    outcomes: ['Production-ready on launch', '99.9% uptime SLAs', 'Scales to millions of users'],
  },
  {
    id: 'ai-powered-applications',
    title: 'AI-Powered Applications',
    description: 'Applications with real AI embedded, not just an LLM chat widget bolted onto a marketing site. Copilots, agents, recommendation engines, intelligent workflows.',
    technologies: ['OpenAI', 'Anthropic', 'LangChain', 'Pinecone', 'Azure OpenAI'],
    outcomes: ['Measurable business impact', 'Integrated with your data', 'Governed AI responses'],
  },
  {
    id: 'custom-business-apps',
    title: 'Custom Business Applications',
    description: 'Internal tools, workflow automation, and line-of-business applications that replace spreadsheets, legacy systems, and manual processes.',
    technologies: ['React', 'Python', 'FastAPI', '.NET', 'GraphQL'],
    outcomes: ['Replaces 5+ manual tools', 'Reduces process time 50%+', 'Full audit trail'],
  },
  {
    id: 'api-development',
    title: 'API & Integration Platforms',
    description: 'Enterprise-grade APIs, GraphQL gateways, and integration layers that connect your applications, data, and partner systems.',
    technologies: ['GraphQL', 'REST', 'gRPC', 'Kafka', 'MuleSoft'],
    outcomes: ['<100ms API latency', 'Full OpenAPI documentation', 'Automated contract testing'],
  },
  {
    id: 'legacy-modernization',
    title: 'Legacy Application Modernization',
    description: 'Modernize aging Java, .NET, and mainframe applications into cloud-native, microservices-based systems — without big-bang rewrites.',
    technologies: ['Kubernetes', 'Docker', 'Spring Boot', 'Strangler Pattern'],
    outcomes: ['Zero-downtime migration', 'Phased modernization', '40-60% cost reduction'],
  },
  {
    id: 'platform-engineering',
    title: 'Platform Engineering',
    description: 'Internal developer platforms, DX tooling, and engineering productivity systems that help your teams ship faster with fewer bugs.',
    technologies: ['Backstage', 'GitHub Actions', 'Terraform', 'ArgoCD'],
    outcomes: ['2x faster deployment', 'Self-service tooling', 'Standardized delivery'],
  },
],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Retail — Convenience Client',
    industry: 'Retail — Convenience',
    challenge: 'Needed a unified digital guest experience and loyalty platform across 600+ locations with real-time personalization at the point of sale.',
    results: [
      {
        metric: '600+',
        description: 'Locations with zero downtime'
      },
      {
        metric: '25%',
        description: 'Improvement in promotion effectiveness'
      },
      {
        metric: '2.5x',
        description: 'Email engagement lift'
      }
    ],
    technologies: [
      'Salesforce',
      'Braze',
      'Databricks',
      'AWS',
      'Kafka'
    ],
    slug: 'databricks-modernization-ai-enablement-for-leading-c-store-chain'
  }
],
    processPhases: [
  {
    number: 1,
    title: 'Discovery & Design',
    duration: 'Weeks 1-3',
    description: 'Understand the business problem, user journeys, and existing data/AI infrastructure. Design for production from day one.',
  },
  {
    number: 2,
    title: 'Architecture & Foundation',
    duration: 'Weeks 4-6',
    description: 'Technical architecture, CI/CD, observability, security, and data integration foundations before any feature code.',
  },
  {
    number: 3,
    title: 'Iterative Build',
    duration: 'Months 2-6',
    description: 'Two-week sprints with working software at the end of each. Real users testing, not mockups in Figma.',
  },
  {
    number: 4,
    title: 'Launch & Stabilize',
    duration: 'Weeks before go-live',
    description: 'Production hardening, load testing, runbooks, and SLA baseline. We stay on the release, not offshore while you cut over.',
  },
  {
    number: 5,
    title: 'Operate & Evolve',
    duration: 'Ongoing',
    description: 'Post-launch operations, feature evolution, and continuous optimization. We run what we build.',
  },
],
    faqs: [
  {
    question: "What makes ACI different from a development agency?",
    answer: "We're not an agency. We're an engineering firm that builds applications for enterprises that already have complex data and AI infrastructure. Our applications sit on top of that infrastructure and integrate with it natively — we don't do greenfield startup products or marketing sites.",
  },
  {
    question: 'Do you build mobile applications or e-commerce platforms?',
    answer: 'Mobile-first consumer apps and e-commerce platforms are not our focus. We build enterprise applications, AI-powered systems, and internal platforms for Fortune 500 operations. If you need a mobile-first consumer app, we can refer you to a better-fit partner.',
  },
  {
    question: 'What technology stack do you prefer?',
    answer: 'We work primarily in Next.js/React/TypeScript for frontend, Node.js/Python/.NET for backend, and whatever cloud and data platform you already use. We meet you where you are — we don\'t impose a stack just because we like it.',
  },
  {
    question: 'What happens after the application launches?',
    answer: 'This is where most firms disappear. We don\'t. Post-launch operations, SLA-backed support, and continuous optimization are part of how we engage. See "Beyond Delivery" above — we run what we build.',
  },
],
  },
  'quality-engineering': {
    id: 'quality-engineering',
    slug: 'quality-engineering',
    title: 'Quality Engineering',
    tagline: 'Quality, engineered in.',
    description: 'Quality as an engineering discipline, not a test phase. AI-augmented, continuous, and owned by the team that ships.',
    keyOutcomes: [
      'Tests that run on every commit, not once at release',
      'AI agents that generate, maintain, and self-heal suites',
      'Production telemetry feeding test strategy, not guesswork',
      'Zero regressions as a default, not a promise',
    ],
    offerings: [
      {
        id: 'in-sprint-automation',
        title: 'In-sprint test automation',
        description: 'End-to-end, integration, and unit suites written the same sprint the feature lands. Executable tests on every commit, not a spreadsheet of manual steps.',
        technologies: ['Playwright', 'Cypress', 'Jest', 'Pytest', 'Selenium'],
        outcomes: ['90%+ automation as a default', 'Tests run in under 10 minutes', 'Zero flaky-test policy'],
      },
      {
        id: 'agentic-ai-coverage',
        title: 'Agentic AI test coverage',
        description: 'Autonomous agents that generate, execute, and maintain suites. Reads user stories, code, and past defects to find the cases your team did not think of.',
        technologies: ['Mabl', 'Testim', 'Applitools', 'Custom agents'],
        outcomes: ['Coverage up 3x', 'Self-healing UI selectors', 'Predictive defect analysis'],
      },
      {
        id: 'cicd-quality-gates',
        title: 'CI/CD quality gates',
        description: 'Tests wired into pull request checks, deploy stages, and post-deploy smoke. Bad merges blocked at source; every merge hits production with confidence.',
        technologies: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'ArgoCD'],
        outcomes: ['Automated quality gates', 'Bad merges blocked at source', 'Deployment confidence'],
      },
      {
        id: 'performance-engineering',
        title: 'Performance and load engineering',
        description: 'Real-scale validation before production finds it for you. Load testing, performance benchmarking, capacity planning, all part of delivery.',
        technologies: ['k6', 'JMeter', 'Gatling', 'Locust', 'BlazeMeter'],
        outcomes: ['Validated scale targets', 'Performance SLA baselines', 'No surprise outages'],
      },
      {
        id: 'security-as-engineering',
        title: 'Security testing as engineering',
        description: 'SAST, DAST, dependency scanning, and penetration testing in the pipeline. A continuous discipline, not a late-stage audit.',
        technologies: ['OWASP ZAP', 'Snyk', 'Checkmarx', 'Burp Suite'],
        outcomes: ['Vulnerabilities caught pre-prod', 'Continuous security scanning', 'Compliance-ready audits'],
      },
      {
        id: 'observability-fed-quality',
        title: 'Observability-fed quality',
        description: 'Production telemetry loops back into test strategy. Coverage gaps get detected from real traffic; flakiness quarantined before it breaks trust in CI.',
        technologies: ['Datadog', 'SonarQube', 'Grafana', 'Custom dashboards'],
        outcomes: ['Coverage driven by real traffic', 'Flaky tests quarantined fast', 'Quality trends, not hunches'],
      },
    ],
    caseStudies: [],
    processPhases: [],
    faqs: [
      {
        question: 'How is Quality Engineering different from QA and testing?',
        answer: 'QA ran at the end, by a separate team, against a spreadsheet of manual cases. QE runs throughout delivery, owned by the same engineers who write the code, with automated suites and AI agents maintaining coverage. Same engineers, same repo, same accountability.',
      },
      {
        question: 'Do you do manual regression testing?',
        answer: 'Not as a standalone service. A short exploratory pass is part of any healthy QE practice, but we are not a manual regression shop. If that is what you need, we will tell you upfront and point you at a better-fit partner.',
      },
      {
        question: 'What stack do you default to?',
        answer: 'Playwright for end-to-end, Jest or Pytest for unit and integration, k6 or JMeter for performance, OWASP tooling for security. We meet you where you are; if your team runs Cypress or Selenium we plug into that rather than forcing a swap.',
      },
      {
        question: 'How does agentic AI fit in practically?',
        answer: 'Month one: self-healing UI selectors so your team stops babysitting drift. Month two or three: coverage gap detection from production traffic. Once the baseline suite is stable, agentic generation from user stories and defect clustering. Not all of it on day one.',
      },
      {
        question: 'How do you plug into our CI/CD pipeline?',
        answer: 'Whatever you run. GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure DevOps. Quality gates wire into pull request checks, deploy stages, and post-deploy smoke. Results flow back into your existing tools; no context switching.',
      },
    ],
  }
};

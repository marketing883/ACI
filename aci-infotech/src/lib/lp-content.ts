// Landing Page Content Data Structure

export interface LPPainPoint {
  title: string;
  description: string;
  icon: string;
}

export interface LPStat {
  value: string;
  label: string;
}

export interface LPBenefit {
  title: string;
  description: string;
  icon: string;
}

export interface LPFAQ {
  question: string;
  answer: string;
}

export interface LPProof {
  headline: string;
  description: string;
  industry?: string;
}

export interface LPContent {
  // Core identifiers
  slug: string;
  serviceCluster: string;
  keyword: string;

  // Meta
  metaTitle: string;
  metaDescription: string;

  // Hero section
  headline: string;
  subheadline: string;
  ctoText: string;
  ctoSecondaryText?: string;

  // Pain points section
  painPointsHeadline: string;
  painPoints: LPPainPoint[];

  // Solution section
  solutionHeadline: string;
  solutionDescription: string;
  processSteps: Array<{ step: string; title: string; description: string }>;

  // Stats section
  stats: LPStat[];

  // Benefits section
  benefitsHeadline: string;
  benefits: LPBenefit[];

  // Proof section (anonymous case studies)
  proofItems: LPProof[];

  // FAQ section
  faqs: LPFAQ[];

  // Trust signals
  certifications: string[];

  // Variations
  industryVariants?: Record<string, Partial<LPContent>>;
  roleVariants?: Record<string, Partial<LPContent>>;
  painPointVariants?: Record<string, Partial<LPContent>>;
}

// Default service cluster content
export const LP_CONTENT: Record<string, LPContent> = {
  // ==========================================
  // DATA ENGINEERING
  // ==========================================
  'data-engineering-services': {
    slug: 'data-engineering-services',
    serviceCluster: 'data-engineering',
    keyword: 'data engineering services',

    metaTitle: 'Enterprise Data Engineering Services | ACI Infotech',
    metaDescription: 'Transform your data infrastructure with scalable, reliable data engineering services. Modern data platforms, pipelines, and architecture from certified experts.',

    headline: 'Transform Your Data Infrastructure',
    subheadline: 'Build scalable, reliable data pipelines that power real-time analytics and drive business decisions.',
    ctoText: 'Get Your Data Modernization Roadmap',
    ctoSecondaryText: 'See Your Cost Savings Potential',

    painPointsHeadline: 'Are You Struggling With...',
    painPoints: [
      {
        title: 'Legacy Data Systems',
        description: 'Outdated infrastructure that can\'t keep up with modern analytics demands and slows down your entire organization.',
        icon: 'database',
      },
      {
        title: 'Data Pipeline Failures',
        description: 'Unreliable pipelines causing data delays, quality issues, and frustrated stakeholders waiting for insights.',
        icon: 'alert-triangle',
      },
      {
        title: 'Scaling Bottlenecks',
        description: 'Data volumes growing faster than your infrastructure can handle, leading to performance degradation.',
        icon: 'trending-up',
      },
      {
        title: 'High Infrastructure Costs',
        description: 'Overpaying for underperforming data infrastructure while competitors optimize their spend.',
        icon: 'dollar-sign',
      },
    ],

    solutionHeadline: 'Modern Data Engineering, Delivered',
    solutionDescription: 'We design, build, and optimize enterprise data platforms that scale with your business.',
    processSteps: [
      { step: '01', title: 'Assess', description: 'Comprehensive audit of your current data infrastructure, identifying bottlenecks and opportunities.' },
      { step: '02', title: 'Architect', description: 'Design a modern, scalable data architecture tailored to your specific business requirements.' },
      { step: '03', title: 'Build', description: 'Implement robust data pipelines, warehouses, and lakes using best-in-class technologies.' },
      { step: '04', title: 'Optimize', description: 'Continuous monitoring and optimization to ensure peak performance and cost efficiency.' },
    ],

    stats: [
      { value: '500+', label: 'Data Projects Delivered' },
      { value: '40%', label: 'Average Cost Reduction' },
      { value: '99.9%', label: 'Pipeline Reliability' },
      { value: '10x', label: 'Query Performance Improvement' },
    ],

    benefitsHeadline: 'What You Get',
    benefits: [
      {
        title: 'Scalable Architecture',
        description: 'Infrastructure that grows with your data volumes without performance degradation.',
        icon: 'layers',
      },
      {
        title: 'Real-Time Insights',
        description: 'Sub-second data processing enabling real-time analytics and decision making.',
        icon: 'zap',
      },
      {
        title: 'Reduced Costs',
        description: 'Optimized infrastructure that cuts cloud spend while improving performance.',
        icon: 'trending-down',
      },
      {
        title: 'Expert Team',
        description: 'Certified engineers with deep expertise in Snowflake, Databricks, and cloud platforms.',
        icon: 'users',
      },
    ],

    proofItems: [
      {
        headline: '62% Cost Reduction',
        description: 'A Fortune 500 healthcare company reduced their data processing costs by 62% while improving pipeline reliability to 99.9% uptime.',
        industry: 'healthcare',
      },
      {
        headline: 'Real-Time Inventory',
        description: 'A leading retail chain unified 47 data sources into a single platform, enabling real-time inventory insights across 2,000+ stores.',
        industry: 'retail',
      },
    ],

    faqs: [
      {
        question: 'How long does a typical data engineering project take?',
        answer: 'Timeline varies based on scope. A focused data pipeline project typically takes 4-8 weeks, while a full platform modernization can take 3-6 months. We provide a detailed timeline after our initial assessment.',
      },
      {
        question: 'Which platforms and technologies do you work with?',
        answer: 'We\'re certified partners with Snowflake, Databricks, AWS, Azure, and GCP. We work with modern data stack tools including dbt, Airflow, Spark, Kafka, and more.',
      },
      {
        question: 'Do you offer ongoing support after implementation?',
        answer: 'Yes, we offer flexible support options including 24/7 monitoring, on-call support, and managed services. Many clients also engage us for continuous optimization.',
      },
      {
        question: 'How do you ensure data security and compliance?',
        answer: 'Security is built into every solution. We implement encryption, access controls, audit logging, and can meet HIPAA, SOC 2, GDPR, and other compliance requirements.',
      },
    ],

    certifications: ['Snowflake Partner', 'Databricks Partner', 'AWS Advanced Partner', 'Azure Partner', 'SOC 2 Compliant'],

    industryVariants: {
      healthcare: {
        headline: 'HIPAA-Compliant Data Engineering for Healthcare',
        subheadline: 'Unify patient data across systems while maintaining strict compliance and security standards.',
        painPoints: [
          {
            title: 'Siloed Patient Data',
            description: 'EHR, claims, and clinical data scattered across systems, preventing holistic patient insights.',
            icon: 'database',
          },
          {
            title: 'HIPAA Compliance Burden',
            description: 'Maintaining compliance while modernizing infrastructure creates project risk and delays.',
            icon: 'shield',
          },
          {
            title: 'Legacy System Integration',
            description: 'Critical healthcare systems built on outdated technology that\'s expensive to maintain and integrate.',
            icon: 'link',
          },
          {
            title: 'Reporting Delays',
            description: 'Quality measures and regulatory reports taking weeks instead of hours due to data issues.',
            icon: 'clock',
          },
        ],
        stats: [
          { value: '45%', label: 'Faster Regulatory Reporting' },
          { value: '99.9%', label: 'HIPAA Audit Pass Rate' },
          { value: '60%', label: 'Reduction in Data Prep Time' },
          { value: '100%', label: 'PHI Security Compliance' },
        ],
      },
      finance: {
        headline: 'Real-Time Data Engineering for Financial Services',
        subheadline: 'Sub-second data processing for trading, risk management, and regulatory compliance.',
        painPoints: [
          {
            title: 'Data Latency',
            description: 'Market data and transaction processing too slow for real-time trading and risk decisions.',
            icon: 'clock',
          },
          {
            title: 'Regulatory Reporting',
            description: 'Complex compliance requirements (SOX, PCI, Basel) creating data lineage and audit challenges.',
            icon: 'file-text',
          },
          {
            title: 'Data Accuracy',
            description: 'Reconciliation issues between systems causing reporting errors and audit findings.',
            icon: 'alert-circle',
          },
          {
            title: 'Legacy Core Systems',
            description: 'Mainframe and legacy systems that are costly to maintain and difficult to integrate.',
            icon: 'server',
          },
        ],
        stats: [
          { value: '<100ms', label: 'Processing Latency' },
          { value: '100%', label: 'Audit Trail Coverage' },
          { value: '99.99%', label: 'Data Accuracy' },
          { value: '50%', label: 'Faster Trade Settlement' },
        ],
      },
    },

    roleVariants: {
      cfo: {
        headline: 'Cut Data Infrastructure Costs by 40%',
        subheadline: 'Optimize your data spend while improving performance and reliability.',
        ctoText: 'See Your Cost Savings Potential',
      },
      cto: {
        headline: 'Architect a Scalable Data Platform',
        subheadline: 'Modern, cloud-native data infrastructure that scales with your technical requirements.',
        ctoText: 'Get Your Architecture Assessment',
      },
    },
  },

  // ==========================================
  // POWER BI / DATA ANALYTICS
  // ==========================================
  'power-bi-consulting': {
    slug: 'power-bi-consulting',
    serviceCluster: 'data-analytics',
    keyword: 'power bi consulting',

    metaTitle: 'Power BI Consulting Services | Dashboard Development | ACI Infotech',
    metaDescription: 'Expert Power BI consulting and dashboard development. Transform your data into actionable insights with certified Microsoft partners.',

    headline: 'Unlock the Power of Your Data with Power BI',
    subheadline: 'Transform complex data into clear, actionable insights with expert-designed dashboards and reports.',
    ctoText: 'Receive Your Dashboard Blueprint',
    ctoSecondaryText: 'See Sample Dashboards',

    painPointsHeadline: 'Are You Struggling With...',
    painPoints: [
      {
        title: 'Scattered Reports',
        description: 'Multiple spreadsheets and reports that don\'t connect, making it impossible to see the full picture.',
        icon: 'file-spreadsheet',
      },
      {
        title: 'Slow Reporting',
        description: 'Manual report creation taking days or weeks, with data already outdated by the time it\'s delivered.',
        icon: 'clock',
      },
      {
        title: 'Poor Adoption',
        description: 'BI tools that users avoid because they\'re too complex or don\'t answer the questions they have.',
        icon: 'users',
      },
      {
        title: 'Limited Self-Service',
        description: 'Business users dependent on IT for every report, creating bottlenecks and frustration.',
        icon: 'lock',
      },
    ],

    solutionHeadline: 'Power BI Excellence, Delivered',
    solutionDescription: 'We design and implement Power BI solutions that users love and actually use.',
    processSteps: [
      { step: '01', title: 'Discover', description: 'Understand your business questions, data sources, and user needs.' },
      { step: '02', title: 'Design', description: 'Create intuitive dashboard designs focused on actionable insights.' },
      { step: '03', title: 'Develop', description: 'Build optimized data models and visually compelling reports.' },
      { step: '04', title: 'Deploy', description: 'Roll out with training, governance, and adoption support.' },
    ],

    stats: [
      { value: '200+', label: 'Dashboards Delivered' },
      { value: '85%', label: 'User Adoption Rate' },
      { value: '70%', label: 'Faster Decision Making' },
      { value: '10x', label: 'Report Generation Speed' },
    ],

    benefitsHeadline: 'What You Get',
    benefits: [
      {
        title: 'Intuitive Dashboards',
        description: 'User-friendly designs that answer business questions at a glance.',
        icon: 'layout',
      },
      {
        title: 'Real-Time Data',
        description: 'Live connections to your data sources for always-current insights.',
        icon: 'refresh-cw',
      },
      {
        title: 'Self-Service Analytics',
        description: 'Empower users to explore data and create their own reports.',
        icon: 'sliders',
      },
      {
        title: 'Mobile Access',
        description: 'Access your insights anywhere with Power BI mobile apps.',
        icon: 'smartphone',
      },
    ],

    proofItems: [
      {
        headline: 'From 5 Days to 5 Minutes',
        description: 'A manufacturing company reduced their monthly reporting cycle from 5 days of manual work to automated 5-minute updates.',
        industry: 'manufacturing',
      },
      {
        headline: '90% User Adoption',
        description: 'An enterprise achieved 90% self-service BI adoption within 3 months, freeing IT from ad-hoc report requests.',
        industry: 'technology',
      },
    ],

    faqs: [
      {
        question: 'Do we need Power BI Premium?',
        answer: 'It depends on your needs. We\'ll assess your requirements and recommend the right licensing. Many organizations start with Pro licenses and upgrade as needed.',
      },
      {
        question: 'Can you connect to our existing data sources?',
        answer: 'Yes, Power BI connects to 100+ data sources including SQL Server, Salesforce, SAP, Oracle, cloud platforms, and even Excel. We\'ll ensure optimal connections.',
      },
      {
        question: 'How do you ensure report performance?',
        answer: 'We optimize data models, implement incremental refresh, and follow Power BI best practices. Most reports load in under 3 seconds.',
      },
      {
        question: 'Do you provide training for our team?',
        answer: 'Yes, we offer comprehensive training from basic report consumption to advanced DAX development, tailored to each user role.',
      },
    ],

    certifications: ['Microsoft Gold Partner', 'Power BI Certified', 'Azure Partner'],
  },

  // ==========================================
  // CLOUD MODERNIZATION
  // ==========================================
  'cloud-migration-services': {
    slug: 'cloud-migration-services',
    serviceCluster: 'cloud-modernization',
    keyword: 'cloud migration services',

    metaTitle: 'Cloud Migration Services | AWS, Azure, GCP | ACI Infotech',
    metaDescription: 'Seamless cloud migration services for AWS, Azure, and GCP. Minimize risk, maximize ROI with certified cloud architects.',

    headline: 'Migrate to Cloud with Confidence',
    subheadline: 'De-risk your cloud journey with proven migration strategies and certified cloud architects.',
    ctoText: 'Get Your Migration Assessment',
    ctoSecondaryText: 'See Your Cloud ROI Projection',

    painPointsHeadline: 'Are You Struggling With...',
    painPoints: [
      {
        title: 'Migration Complexity',
        description: 'Hundreds of applications and dependencies making it hard to know where to start.',
        icon: 'git-branch',
      },
      {
        title: 'Business Disruption Risk',
        description: 'Fear of downtime and performance issues during migration affecting business operations.',
        icon: 'alert-octagon',
      },
      {
        title: 'Cost Uncertainty',
        description: 'Unknown cloud costs making it difficult to build a business case and budget.',
        icon: 'help-circle',
      },
      {
        title: 'Skills Gap',
        description: 'Team lacks cloud expertise needed to plan and execute a successful migration.',
        icon: 'users',
      },
    ],

    solutionHeadline: 'Proven Cloud Migration Methodology',
    solutionDescription: 'We\'ve migrated 500+ workloads to cloud. Our proven approach minimizes risk and accelerates time-to-value.',
    processSteps: [
      { step: '01', title: 'Assess', description: 'Comprehensive discovery of applications, dependencies, and migration readiness.' },
      { step: '02', title: 'Plan', description: 'Detailed migration roadmap with wave planning and risk mitigation strategies.' },
      { step: '03', title: 'Migrate', description: 'Execute migrations using proven tools and methodologies with minimal disruption.' },
      { step: '04', title: 'Optimize', description: 'Post-migration optimization for performance, security, and cost efficiency.' },
    ],

    stats: [
      { value: '500+', label: 'Workloads Migrated' },
      { value: '99.9%', label: 'Migration Success Rate' },
      { value: '35%', label: 'Average Cost Savings' },
      { value: '60%', label: 'Faster Time to Market' },
    ],

    benefitsHeadline: 'What You Get',
    benefits: [
      {
        title: 'Risk-Free Migration',
        description: 'Proven methodology with rollback plans and zero-downtime strategies.',
        icon: 'shield',
      },
      {
        title: 'Cost Optimization',
        description: 'Right-sized infrastructure from day one, avoiding cloud cost surprises.',
        icon: 'dollar-sign',
      },
      {
        title: 'Faster Innovation',
        description: 'Modern cloud architecture enabling rapid feature development and deployment.',
        icon: 'rocket',
      },
      {
        title: 'Expert Guidance',
        description: 'Certified architects across AWS, Azure, and GCP to guide your journey.',
        icon: 'award',
      },
    ],

    proofItems: [
      {
        headline: 'Zero-Downtime Migration',
        description: 'Migrated a financial services company\'s core trading platform to AWS with zero downtime, reducing infrastructure costs by 40%.',
        industry: 'finance',
      },
      {
        headline: '200+ Apps in 6 Months',
        description: 'Successfully migrated 200+ applications to Azure for a healthcare organization while maintaining HIPAA compliance throughout.',
        industry: 'healthcare',
      },
    ],

    faqs: [
      {
        question: 'Which cloud platform is best for us?',
        answer: 'It depends on your requirements, existing investments, and goals. We\'re certified across AWS, Azure, and GCP and will recommend the best fit during our assessment.',
      },
      {
        question: 'How long does a typical migration take?',
        answer: 'Timeline varies by scope. A single application might take 2-4 weeks, while an enterprise-wide migration can span 6-18 months with multiple waves.',
      },
      {
        question: 'How do you minimize business disruption?',
        answer: 'We use proven strategies including parallel running, incremental migration, automated testing, and off-hours cutover windows.',
      },
      {
        question: 'Can you help with hybrid cloud strategies?',
        answer: 'Absolutely. Many clients maintain hybrid environments. We design architectures that seamlessly connect on-premise and cloud resources.',
      },
    ],

    certifications: ['AWS Advanced Partner', 'Azure Expert MSP', 'Google Cloud Partner', 'VMware Partner'],
  },

  // ==========================================
  // DYNAMICS 365
  // ==========================================
  'dynamics-365-implementation': {
    slug: 'dynamics-365-implementation',
    serviceCluster: 'dynamics-365',
    keyword: 'dynamics 365 implementation',

    metaTitle: 'Dynamics 365 Implementation Services | Microsoft Partner | ACI Infotech',
    metaDescription: 'Expert Dynamics 365 implementation services from a certified Microsoft partner. CRM, ERP, and business applications tailored to your needs.',

    headline: 'Accelerate Your Digital Transformation with Dynamics 365',
    subheadline: 'Unified CRM and ERP solutions that streamline operations and drive growth.',
    ctoText: 'Get Your D365 Readiness Report',
    ctoSecondaryText: 'See Implementation Timeline',

    painPointsHeadline: 'Are You Struggling With...',
    painPoints: [
      {
        title: 'Disconnected Systems',
        description: 'Sales, service, and operations running on separate systems with no single view of the customer.',
        icon: 'unlink',
      },
      {
        title: 'Manual Processes',
        description: 'Time-consuming manual data entry and workflows that should be automated.',
        icon: 'edit-3',
      },
      {
        title: 'Limited Visibility',
        description: 'No real-time insight into sales pipeline, inventory, or financial performance.',
        icon: 'eye-off',
      },
      {
        title: 'Scalability Issues',
        description: 'Current systems can\'t keep up with business growth and expanding requirements.',
        icon: 'trending-up',
      },
    ],

    solutionHeadline: 'End-to-End Dynamics 365 Expertise',
    solutionDescription: 'From strategy to implementation to support, we deliver Dynamics 365 solutions that transform your business.',
    processSteps: [
      { step: '01', title: 'Envision', description: 'Define your business goals and map them to Dynamics 365 capabilities.' },
      { step: '02', title: 'Configure', description: 'Customize and configure D365 to match your unique business processes.' },
      { step: '03', title: 'Integrate', description: 'Connect D365 with your existing systems and data sources.' },
      { step: '04', title: 'Enable', description: 'Train users, migrate data, and ensure successful adoption.' },
    ],

    stats: [
      { value: '150+', label: 'D365 Implementations' },
      { value: '95%', label: 'On-Time Delivery' },
      { value: '40%', label: 'Productivity Improvement' },
      { value: '30%', label: 'Sales Cycle Reduction' },
    ],

    benefitsHeadline: 'What You Get',
    benefits: [
      {
        title: 'Unified Platform',
        description: 'Single platform for sales, service, marketing, finance, and operations.',
        icon: 'box',
      },
      {
        title: 'AI-Powered Insights',
        description: 'Built-in AI and analytics for predictive insights and recommendations.',
        icon: 'cpu',
      },
      {
        title: 'Rapid Deployment',
        description: 'Accelerated implementation using our proven methodology and templates.',
        icon: 'zap',
      },
      {
        title: 'Seamless Integration',
        description: 'Native integration with Microsoft 365, Power Platform, and Azure.',
        icon: 'link',
      },
    ],

    proofItems: [
      {
        headline: '50% Faster Quote-to-Cash',
        description: 'A manufacturing company reduced their quote-to-cash cycle by 50% with Dynamics 365 Sales and Finance integration.',
        industry: 'manufacturing',
      },
      {
        headline: '360° Customer View',
        description: 'A services company unified 5 legacy CRM systems into Dynamics 365, finally achieving a single customer view.',
        industry: 'technology',
      },
    ],

    faqs: [
      {
        question: 'Which Dynamics 365 apps do you implement?',
        answer: 'We implement the full Dynamics 365 suite including Sales, Customer Service, Field Service, Finance, Supply Chain, and Business Central.',
      },
      {
        question: 'Can you migrate from our current CRM/ERP?',
        answer: 'Yes, we have extensive experience migrating from Salesforce, SAP, Oracle, legacy Microsoft products, and custom solutions.',
      },
      {
        question: 'How long does implementation take?',
        answer: 'A focused implementation (e.g., Sales) typically takes 8-12 weeks. Full enterprise deployments range from 4-12 months depending on scope.',
      },
      {
        question: 'Do you provide post-implementation support?',
        answer: 'Yes, we offer managed services, training, and continuous improvement programs to maximize your D365 investment.',
      },
    ],

    certifications: ['Microsoft Gold Partner', 'Dynamics 365 Certified', 'Power Platform Partner'],
  },

  // ==========================================
  // GENERATIVE AI
  // ==========================================
  'generative-ai-consulting': {
    slug: 'generative-ai-consulting',
    serviceCluster: 'gen-ai',
    keyword: 'generative ai consulting',

    metaTitle: 'Generative AI Consulting | Enterprise LLM Implementation | ACI Infotech',
    metaDescription: 'Enterprise generative AI consulting and LLM implementation. Transform your business with AI copilots, chatbots, and content automation.',

    headline: 'Harness the Power of Generative AI',
    subheadline: 'Transform your enterprise with production-ready AI solutions that drive real business outcomes.',
    ctoText: 'Get Your Gen AI Use Case Analysis',
    ctoSecondaryText: 'See Your Productivity Multiplier',

    painPointsHeadline: 'Are You Struggling With...',
    painPoints: [
      {
        title: 'AI Hype vs. Reality',
        description: 'Overwhelmed by AI possibilities but unsure which use cases will actually deliver ROI.',
        icon: 'help-circle',
      },
      {
        title: 'Data Security Concerns',
        description: 'Worried about sensitive data exposure when using AI tools and LLMs.',
        icon: 'shield-off',
      },
      {
        title: 'Integration Complexity',
        description: 'Struggling to integrate AI into existing workflows and enterprise systems.',
        icon: 'puzzle',
      },
      {
        title: 'Talent Shortage',
        description: 'Lack of in-house AI expertise to evaluate, build, and maintain AI solutions.',
        icon: 'users',
      },
    ],

    solutionHeadline: 'Enterprise-Grade Generative AI',
    solutionDescription: 'We help enterprises move from AI experimentation to production with secure, scalable solutions.',
    processSteps: [
      { step: '01', title: 'Identify', description: 'Discover high-impact use cases aligned with your business goals.' },
      { step: '02', title: 'Prototype', description: 'Rapid proof-of-concept development to validate feasibility and value.' },
      { step: '03', title: 'Build', description: 'Production-grade implementation with security, monitoring, and governance.' },
      { step: '04', title: 'Scale', description: 'Enterprise rollout with training, change management, and continuous improvement.' },
    ],

    stats: [
      { value: '50+', label: 'Gen AI Projects Delivered' },
      { value: '10x', label: 'Productivity Gains Achieved' },
      { value: '80%', label: 'Reduction in Manual Work' },
      { value: '4 Weeks', label: 'Average Time to POC' },
    ],

    benefitsHeadline: 'What You Get',
    benefits: [
      {
        title: 'Secure AI',
        description: 'Enterprise-grade security with private deployments and data protection.',
        icon: 'lock',
      },
      {
        title: 'Custom Solutions',
        description: 'AI tailored to your industry, data, and specific business processes.',
        icon: 'settings',
      },
      {
        title: 'Quick Wins',
        description: 'Start with high-impact, low-risk use cases that deliver fast ROI.',
        icon: 'target',
      },
      {
        title: 'Future-Proof',
        description: 'Architecture designed to evolve with rapidly advancing AI capabilities.',
        icon: 'layers',
      },
    ],

    proofItems: [
      {
        headline: '80% Faster Document Processing',
        description: 'A legal services firm automated contract review with AI, reducing document processing time by 80%.',
        industry: 'finance',
      },
      {
        headline: 'AI-Powered Customer Service',
        description: 'An enterprise deployed an AI copilot that handles 60% of customer inquiries, improving response time by 5x.',
        industry: 'technology',
      },
    ],

    faqs: [
      {
        question: 'Is our data safe with generative AI?',
        answer: 'Yes, we implement private deployments, data encryption, and strict access controls. Your data never trains public models.',
      },
      {
        question: 'Which LLMs do you work with?',
        answer: 'We work with OpenAI, Anthropic Claude, Google Gemini, and open-source models. We recommend the best fit for your use case.',
      },
      {
        question: 'How do you ensure AI accuracy?',
        answer: 'We implement RAG (Retrieval Augmented Generation), fine-tuning, guardrails, and human-in-the-loop validation based on requirements.',
      },
      {
        question: 'What\'s a realistic timeline for production?',
        answer: 'POC in 4-6 weeks, production deployment in 8-12 weeks for most use cases. Complex enterprise rollouts take longer.',
      },
    ],

    certifications: ['OpenAI Partner', 'Azure AI Partner', 'AWS ML Competency'],
  },

  // Add more service clusters...
  // (AI/ML, Agentic AI, Data Integration, Data Observability, ERP Transformation)
};

// Get content for a specific landing page with personalization applied
export function getLPContent(slug: string): LPContent | null {
  return LP_CONTENT[slug] || null;
}

// Get all available landing page slugs
export function getAllLPSlugs(): string[] {
  return Object.keys(LP_CONTENT);
}

// Get content with industry variant applied
export function getPersonalizedContent(slug: string, industry?: string, role?: string): LPContent | null {
  const baseContent = LP_CONTENT[slug];
  if (!baseContent) return null;

  let content = { ...baseContent };

  // Apply industry variant
  if (industry && baseContent.industryVariants?.[industry]) {
    content = { ...content, ...baseContent.industryVariants[industry] };
  }

  // Apply role variant
  if (role && baseContent.roleVariants?.[role]) {
    content = { ...content, ...baseContent.roleVariants[role] };
  }

  return content;
}

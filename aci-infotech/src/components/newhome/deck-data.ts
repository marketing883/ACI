// Content from the "ACI Infotech Data and AI Capability" deck (2026),
// used by the new homepage. Kept close to the deck's own wording, with
// grammar fixes and the site's voice rules applied. Deliberately left
// out: the deck's case studies and client logos (homepage brief: no case
// studies), and the ArqAI Labs accelerator pages (ArqAI Labs internals
// are confidential and stay out of this repo).

/** Corporate overview figures (deck slide 4). */
export const DECK_STATS = [
  { value: '20 yrs', label: 'In business', note: 'Founded 2006' },
  { value: '280+', label: 'Production deployments', note: 'Built, shipped, and run' },
  { value: '95%', label: 'Client retention', note: 'Clients who stay' },
  { value: '35+', label: 'Global markets', note: 'Across 4 regions' },
];

export const MISSION =
  'ACI Infotech helps businesses build next-gen applications and digital experiences through innovation-led solutions. Our values put innovation and measurable impact first.';
export const FOOTPRINT =
  'ACI Infotech operates as one global partnership with offices across 4 regions, combining global delivery capability with local presence to support enterprise clients worldwide.';
export const INNOVATION =
  'We build custom frameworks and accelerators through our innovation labs and micro technology centres.';

export const SERVICE_BREADTH = [
  'Big Data & Analytics',
  'Digital Transformation',
  'AI',
  'IT Service Management',
  'DevOps',
  'Enterprise Applications',
  'Managed Infrastructure',
];

/** Verticals named in the deck that have no industry page on the site. */
export const MORE_VERTICALS = ['Hi-Tech', 'Media', 'Public Sector', 'Telecom', 'E-commerce & Logistics', 'Higher Education'];

export type Offering = {
  key: string;
  title: string;
  tagline: string;
  offerings: string[];
  value: string[];
  image: string;
  href: string;
};

/** The seven Data & AI offerings (deck slides 7 and 8). */
export const OFFERINGS: Offering[] = [
  {
    key: 'strategy',
    title: 'Data Strategy and Architecture',
    tagline: 'Assess what your data could change, map it to the outcomes that matter, and turn it into insight you can act on.',
    offerings: ['Agile Data Strategy', 'Architecture Blueprinting', 'Cloud Data Platforms', 'Data Warehouses', 'Data Hubs and Catalogs', 'Analytics Process Optimization', 'Platform Health Checks'],
    value: ['Data warehousing options', 'Existing data architecture assessment', 'Change management coaching for analytics', 'Data-driven decision-making', 'External entity data policy analysis'],
    image: '/images/new-home/offer-strategy.jpg',
    href: '/services/advisory-strategy',
  },
  {
    key: 'modernization',
    title: 'Data Stack Modernization',
    tagline: 'Transform data infrastructure within weeks and move to a data-centric way of working.',
    offerings: ['Architecture & Design', 'Cloud Migration', 'Data Warehouse and Data Lake Implementation', 'Data Governance', 'DevOps'],
    value: ['Automation with DevOps tooling', 'Lower costs on cloud technologies', 'Scalability and flexibility'],
    image: '/images/new-home/offer-modernization.jpg',
    href: '/services/data-engineering',
  },
  {
    key: 'genai',
    title: 'Generative AI and Agentic AI',
    tagline: 'Turn early concepts into working solutions, quickly and cost-effectively.',
    offerings: ['AI Consulting Services', 'Automations & GenAI Integrations', 'GenAI Product Development & Experience Design', 'AI Transformation'],
    value: ['AI-first products to market faster', 'Digital transformation', 'Automation that streamlines business processes', 'Personalized customer experience'],
    image: '/images/new-home/offer-genai.jpg',
    href: '/services/applied-ai-ml',
  },
  {
    key: 'bi',
    title: 'Business Intelligence and Data Visualization',
    tagline: 'Real-time, actionable data for precise decisions, in customized and highly visual dashboards.',
    offerings: ['Intuitive Data Visualizations', 'Customized BI Solutions', 'Self-service Analytics', 'Data Modeling', 'Automated Reports & Dashboards'],
    value: ['Better decision-making', 'Easy access to real-time, actionable data', 'Data access for every stakeholder, across silos', 'Insight that supports growth'],
    image: '/images/new-home/offer-bi.jpg',
    href: '/services/data-engineering',
  },
  {
    key: 'product',
    title: 'Data Product Development',
    tagline: 'Dedicated teams of highly skilled architects and engineers who speed up your data product development.',
    offerings: ['End-to-End Product Development', 'Dedicated Data Engineering Teams', 'Connectors & Integrations'],
    value: ['Product engineering DNA, with measurable KPIs and reporting', 'Faster time to market through automated releases', 'A well-balanced engineering resource mix', 'An innovation garage and design thinking'],
    image: '/images/new-home/offer-product.jpg',
    href: '/services/data-engineering',
  },
  {
    key: 'aiml',
    title: 'AI and ML',
    tagline: 'The right blend of data and AI-driven intelligence for better decisions and business outcomes.',
    offerings: ['Advanced Text Analysis & Speech Recognition', 'ML Models for Data Classification', 'Natural Language Processing', 'Forecasting and Recommendation Systems', 'Chatbots', 'AIOps: Operational Analytics'],
    value: ['Standardized, consistent data quality for decisions', 'Personalized insights', 'Security and operational risks detected and mitigated', 'New business opportunities and reduced business risk'],
    image: '/images/new-home/offer-aiml.jpg',
    href: '/services/applied-ai-ml',
  },
  {
    key: 'mlops',
    title: 'MLOps',
    tagline: 'Efficient processing, monitoring, and simple maintenance for machine learning in production.',
    offerings: ['Orchestrated Experiments', 'Automated ML Pipelines', 'Connected DataOps and MLOps Pipelines', 'CI & CD for Machine Learning', 'Continuous Training & Model Governance', 'Monitoring and Observability'],
    value: ['More efficient models, code, and data', 'Automated, streamlined ML workflows', 'Ongoing training and monitoring', 'Continuous integration, deployment, and maintenance for production ML'],
    image: '/images/new-home/offer-mlops.jpg',
    href: '/services/applied-ai-ml',
  },
];

export type Accelerator = { from: string; to: string; gain: string; desc: string };

/** Accelerator portfolio: 11 modernization offers (deck slide 20). The
 *  deck prints each figure as an upward gain without naming the metric,
 *  so the page shows it the same way. */
export const ACCELERATORS: Accelerator[] = [
  { from: 'SAS', to: 'PySpark', gain: '35%', desc: 'Automates SAS code modernization into scalable PySpark, preserving analytical logic and reducing SAS dependency.' },
  { from: 'Synapse', to: 'Databricks', gain: '45%', desc: 'Modernizes Synapse workloads into the Databricks Lakehouse through automated pipeline refactoring.' },
  { from: 'Oracle', to: 'Power BI', gain: '35%', desc: 'End-to-end automation: complexity analysis, report specs, semantic models, and visualizations.' },
  { from: 'Oracle', to: 'SSRS', gain: '50%', desc: 'Pixel-perfect rebuild through automated specification generation, preserving layouts and calculations.' },
  { from: 'Oracle', to: 'Jasper', gain: '30%', desc: 'Automation-led logic preservation and structured spec generation reduce formatting errors.' },
  { from: 'Tableau', to: 'Power BI', gain: '35%', desc: 'Keeps dashboard usability and KPI logic while moving analytics into governed Power BI.' },
  { from: 'Cognos', to: 'Power BI', gain: '45%', desc: 'Automated metadata extraction, logic preservation, and semantic model generation.' },
  { from: 'Crystal', to: 'Power BI', gain: '20%', desc: 'Spec-driven modernization preserves report logic, layouts, and data accuracy.' },
  { from: 'AAS', to: 'Power BI', gain: '50%', desc: 'Gets past native migration limits, preserving complex measures and editable relationships.' },
  { from: 'Access', to: 'Power BI', gain: '30%', desc: 'Turns desktop Access into governed, scalable Power BI analytics.' },
  { from: 'Data Estate', to: 'Analyzer', gain: '70%', desc: 'Scores complexity from SQL patterns, join depth, procedural logic, and cross-object dependencies.' },
];

export type Framework = {
  key: string;
  title: string;
  problem: string[];
  summary: string;
  benefits: string[];
};

/** Key solutions and frameworks (deck slides 21 to 24). */
export const FRAMEWORKS: Framework[] = [
  {
    key: 'observability',
    title: 'Data Observability Framework',
    summary: 'Seamless, reliable pipelines, with every stage of the data watched end to end.',
    problem: ['Complex data pipelines make issues hard to trace', 'Data silos limit observability', 'Observability has to scale to big data', 'It has to fit the tools already in place'],
    benefits: ['Data quality monitoring', 'End-to-end data lineage', 'Performance and latency tracking', 'Error handling and root cause analysis', 'Scalability and reliability metrics', 'Greater trust in data'],
  },
  {
    key: 'quality',
    title: 'Data Quality Framework',
    summary: 'Custom and standard metrics, audit logs, and drift metrics feed dashboards and automated alerts, so issues are caught and resolved early.',
    problem: ['Inaccurate insights and poor decisions', 'Regulatory and compliance risk', 'Operational inefficiency', 'Loss of customer trust', 'Duplicated and inconsistent data'],
    benefits: ['Better decisions on qualified data', 'Stronger regulatory compliance', 'Operational efficiency through reporting', 'More customer trust', 'Less data inefficiency, more resilience'],
  },
  {
    key: 'lineage',
    title: 'Data Lineage Solution',
    summary: 'Automated lineage for Spark SQL using Spline, with an interactive web UI, scalable storage, and a REST API.',
    problem: ['Lineage is missing for logic embedded in Python and Spark code', 'That gap creates compliance and audit risk', 'Enterprise lineage tools are costly'],
    benefits: ['Column-level and table-level lineage on open-source technology', 'End-to-end Spark lineage', 'Programmatic access through a REST API'],
  },
  {
    key: 'fabric',
    title: 'Microsoft Fabric Assessment Framework',
    summary: 'A consultancy package that speeds up Microsoft Fabric adoption, run by a certified Data Platform Solution Architect, a Data Platform Consultant, and a Project Manager.',
    problem: ['Deciding whether to move to Microsoft Fabric', 'Needing a clear implementation roadmap', 'Needing a partner to guide the journey'],
    benefits: ['Strategy: use-case review, data environments, infrastructure prerequisites', 'Design & Setup: OneLake landing zone, ingestion and cleansing, data modelling', 'Deployment: targeted labs, hands-on mentoring, monitoring, billing, and governance review', 'Well-defined deliverables, timelines, and roles'],
  },
];

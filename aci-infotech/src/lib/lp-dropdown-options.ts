// Job Title Dropdown Options
export const JOB_TITLE_OPTIONS = [
  { value: 'c-suite', label: 'C-Suite (CEO, CTO, CIO, CDO, CFO)' },
  { value: 'vp-engineering', label: 'VP/Director of Engineering' },
  { value: 'vp-data', label: 'VP/Director of Data' },
  { value: 'vp-it', label: 'VP/Director of IT' },
  { value: 'vp-analytics', label: 'VP/Director of Analytics' },
  { value: 'data-manager', label: 'Data/Analytics Manager' },
  { value: 'technical-lead', label: 'Technical Lead/Architect' },
  { value: 'developer', label: 'Developer/Engineer' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'other', label: 'Other' },
];

// "Looking For" Options by Service Cluster
export const LOOKING_FOR_OPTIONS: Record<string, { value: string; label: string }[]> = {
  'dynamics-365': [
    { value: 'implementation', label: 'D365 Implementation' },
    { value: 'migration', label: 'D365 Migration from Legacy' },
    { value: 'customization', label: 'D365 Customization & Extensions' },
    { value: 'integration', label: 'D365 Integration Services' },
    { value: 'support', label: 'D365 Support & Maintenance' },
    { value: 'training', label: 'D365 Training & Adoption' },
    { value: 'exploring', label: 'Just Exploring Options' },
  ],
  'data-analytics': [
    { value: 'power-bi-implementation', label: 'Power BI Implementation' },
    { value: 'dashboard-development', label: 'Dashboard Development' },
    { value: 'analytics-strategy', label: 'Analytics Strategy' },
    { value: 'data-visualization', label: 'Data Visualization' },
    { value: 'bi-migration', label: 'BI Tool Migration' },
    { value: 'self-service-bi', label: 'Self-Service BI Setup' },
    { value: 'exploring', label: 'Just Exploring Options' },
  ],
  'data-integration': [
    { value: 'etl-pipelines', label: 'ETL Pipeline Development' },
    { value: 'api-integration', label: 'API Integration Services' },
    { value: 'data-unification', label: 'Data Unification & Consolidation' },
    { value: 'real-time-integration', label: 'Real-time Data Integration' },
    { value: 'cloud-integration', label: 'Cloud Data Integration' },
    { value: 'legacy-integration', label: 'Legacy System Integration' },
    { value: 'exploring', label: 'Just Exploring Options' },
  ],
  'data-engineering': [
    { value: 'platform-modernization', label: 'Data Platform Modernization' },
    { value: 'warehouse-migration', label: 'Data Warehouse Migration' },
    { value: 'data-lake', label: 'Data Lake Implementation' },
    { value: 'pipeline-development', label: 'Pipeline Development' },
    { value: 'cost-optimization', label: 'Cost Optimization' },
    { value: 'team-augmentation', label: 'Team Augmentation' },
    { value: 'exploring', label: 'Just Exploring Options' },
  ],
  'data-observability': [
    { value: 'data-quality', label: 'Data Quality Monitoring' },
    { value: 'pipeline-monitoring', label: 'Pipeline Monitoring & Alerting' },
    { value: 'data-governance', label: 'Data Governance Setup' },
    { value: 'lineage-tracking', label: 'Data Lineage Implementation' },
    { value: 'compliance', label: 'Compliance & Audit Readiness' },
    { value: 'assessment', label: 'Data Health Assessment' },
    { value: 'exploring', label: 'Just Exploring Options' },
  ],
  'ai-ml': [
    { value: 'ai-strategy', label: 'AI Strategy & Roadmap' },
    { value: 'ml-development', label: 'ML Model Development' },
    { value: 'predictive-analytics', label: 'Predictive Analytics' },
    { value: 'mlops', label: 'MLOps Implementation' },
    { value: 'poc', label: 'AI Proof of Concept' },
    { value: 'team-augmentation', label: 'AI Team Augmentation' },
    { value: 'exploring', label: 'Just Exploring Options' },
  ],
  'gen-ai': [
    { value: 'gen-ai-strategy', label: 'Gen AI Strategy' },
    { value: 'llm-implementation', label: 'LLM Implementation' },
    { value: 'copilot-development', label: 'AI Copilot Development' },
    { value: 'rag-implementation', label: 'RAG Implementation' },
    { value: 'chatbot', label: 'Enterprise Chatbot' },
    { value: 'content-automation', label: 'Content Automation' },
    { value: 'exploring', label: 'Just Exploring Options' },
  ],
  'agentic-ai': [
    { value: 'ai-agents', label: 'AI Agent Development' },
    { value: 'workflow-automation', label: 'AI Workflow Automation' },
    { value: 'autonomous-systems', label: 'Autonomous AI Systems' },
    { value: 'multi-agent', label: 'Multi-Agent Orchestration' },
    { value: 'feasibility', label: 'Feasibility Assessment' },
    { value: 'poc', label: 'Agentic AI POC' },
    { value: 'exploring', label: 'Just Exploring Options' },
  ],
  'cloud-modernization': [
    { value: 'cloud-migration', label: 'Cloud Migration' },
    { value: 'app-modernization', label: 'Application Modernization' },
    { value: 'infrastructure', label: 'Cloud Infrastructure Setup' },
    { value: 'optimization', label: 'Cloud Cost Optimization' },
    { value: 'multi-cloud', label: 'Multi-Cloud Strategy' },
    { value: 'containerization', label: 'Containerization & Kubernetes' },
    { value: 'exploring', label: 'Just Exploring Options' },
  ],
  'erp-transformation': [
    { value: 'erp-modernization', label: 'ERP Modernization' },
    { value: 'erp-migration', label: 'ERP Migration' },
    { value: 'erp-integration', label: 'ERP Integration' },
    { value: 'process-optimization', label: 'Business Process Optimization' },
    { value: 'sap-services', label: 'SAP Services' },
    { value: 'assessment', label: 'ERP Assessment' },
    { value: 'exploring', label: 'Just Exploring Options' },
  ],
  // Default fallback
  'default': [
    { value: 'consultation', label: 'Initial Consultation' },
    { value: 'assessment', label: 'Technical Assessment' },
    { value: 'implementation', label: 'Implementation Services' },
    { value: 'support', label: 'Support & Maintenance' },
    { value: 'strategy', label: 'Strategy & Roadmap' },
    { value: 'exploring', label: 'Just Exploring Options' },
  ],
};

// Get looking for options for a specific service cluster
export function getLookingForOptions(serviceCluster: string): { value: string; label: string }[] {
  return LOOKING_FOR_OPTIONS[serviceCluster] || LOOKING_FOR_OPTIONS['default'];
}

// Personal email domains to block
export const BLOCKED_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'protonmail.com',
  'zoho.com',
  'yandex.com',
  'gmx.com',
  'live.com',
  'msn.com',
  'me.com',
  'inbox.com',
  'fastmail.com',
  'tutanota.com',
  'hey.com',
];

// Check if email is a work email
export function isWorkEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return !BLOCKED_EMAIL_DOMAINS.includes(domain);
}

// Industry options for URL parameters
export const INDUSTRY_OPTIONS = [
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Financial Services' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'technology', label: 'Technology' },
  { value: 'logistics', label: 'Logistics & Transportation' },
  { value: 'media', label: 'Media & Entertainment' },
];

// Role options for URL parameters
export const ROLE_OPTIONS = [
  { value: 'cto', label: 'CTO / Technical Leader' },
  { value: 'cio', label: 'CIO / IT Leader' },
  { value: 'cdo', label: 'CDO / Data Leader' },
  { value: 'cfo', label: 'CFO / Business Leader' },
  { value: 'vp', label: 'VP / Director' },
  { value: 'architect', label: 'Architect' },
];

// Pain point options for URL parameters
export const PAIN_POINT_OPTIONS = [
  { value: 'legacy', label: 'Legacy System Modernization' },
  { value: 'cost', label: 'Cost Reduction' },
  { value: 'scale', label: 'Scaling Challenges' },
  { value: 'speed', label: 'Speed to Insights' },
  { value: 'compliance', label: 'Compliance & Governance' },
  { value: 'quality', label: 'Data Quality Issues' },
  { value: 'silos', label: 'Data Silos' },
  { value: 'talent', label: 'Talent Gap' },
];

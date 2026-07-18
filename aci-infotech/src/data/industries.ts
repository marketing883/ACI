/**
 * Atheros content index: industry entries.
 * See src/data/services.ts for extraction notes.
 */
import type { IndustryEntry, IndustryId } from './types';

export const industries: Record<IndustryId, IndustryEntry> = {
  'financial-services': {
    id: 'financial-services',
    slug: 'financial-services',
    title: 'Financial Services Technology Solutions',
    tagline: 'Enterprise data, AI, and cloud solutions for banks, insurance companies, and asset managers',
    description: 'Enterprise data, AI, and cloud solutions for banks, insurance companies, and asset managers. Regulatory compliance, fraud detection, and digital transformation.',
    painPoints: [],
    useCases: [],
    relevantServices: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Asset Management Client',
    industry: 'Asset Management',
    challenge: '40+ finance systems post-acquisitions needed consolidation with zero disruption to financial reporting',
    solution: 'SAP S/4HANA implementation with automated data quality gates and real-time integration pipelines',
    results: [
      {
        metric: '$180K',
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
      'Azure DevOps',
      'Databricks'
    ],
    slug: 'asset-management-proof'
  },
  {
    client_descriptor: 'Fortune 500 Banking Client',
    industry: 'Banking',
    challenge: 'Rising fraud losses, slow manual review process, high false positive rates',
    solution: 'ML-based fraud detection with real-time scoring and explainable AI for compliance',
    results: [
      {
        metric: '$230K',
        description: 'Annual fraud loss reduction'
      },
      {
        metric: '52%',
        description: 'Reduction in false positives'
      },
      {
        metric: '<100ms',
        description: 'Transaction scoring time'
      }
    ],
    technologies: [
      'Python',
      'TensorFlow',
      'Kafka',
      'Databricks'
    ],
    slug: 'banking-proof'
  }
],
    faqs: [],
  },
  'healthcare': {
    id: 'healthcare',
    slug: 'healthcare',
    title: 'Healthcare & Life Sciences Technology Solutions',
    tagline: 'HIPAA-compliant data, AI, and cloud solutions for healthcare providers, payers, and life sciences',
    description: 'Healthcare technology consulting for providers, payers, and life sciences: HIPAA-compliant data platforms, EHR and FHIR integration, and claims analytics.',
    painPoints: [],
    useCases: [],
    relevantServices: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Healthcare Provider Client',
    industry: 'Healthcare Provider',
    challenge: 'Fragmented patient data across 12 hospitals preventing coordinated care',
    solution: 'HIPAA-compliant data platform on AWS with FHIR APIs and real-time integration',
    results: [
      {
        metric: 'Unified',
        description: 'Patient records across all facilities'
      },
      {
        metric: '99.7%',
        description: 'Platform uptime achieved'
      },
      {
        metric: 'HIPAA',
        description: 'Full compliance maintained'
      }
    ],
    technologies: [
      'AWS',
      'Snowflake',
      'FHIR',
      'Kafka'
    ],
    slug: 'healthcare-provider-proof'
  },
  {
    client_descriptor: 'Fortune 500 Life Sciences Client',
    industry: 'Life Sciences',
    challenge: 'Siloed research data slowing drug discovery timelines',
    solution: 'Unified data lake on Databricks with automated lineage tracking and collaboration',
    results: [
      {
        metric: '24%',
        description: 'Faster research data access'
      },
      {
        metric: '100%',
        description: 'Data lineage compliance'
      },
      {
        metric: '2x',
        description: 'Researcher productivity'
      }
    ],
    technologies: [
      'Databricks',
      'Delta Lake',
      'Python',
      'Airflow'
    ],
    slug: 'life-sciences-proof'
  }
],
    faqs: [],
  },
  'retail': {
    id: 'retail',
    slug: 'retail',
    title: 'Retail & Consumer Technology Solutions',
    tagline: 'Enterprise data, AI, and cloud solutions for retailers',
    description: 'Enterprise data, AI, and cloud solutions for retailers. Customer data platforms, demand forecasting, personalization, and supply chain optimization.',
    painPoints: [],
    useCases: [
  {
    title: 'POS Data Integration',
    description: 'Real-time transaction data'
  },
  {
    title: 'Loyalty Analytics',
    description: 'Customer lifetime value'
  },
  {
    title: 'E-commerce Platforms',
    description: 'Shopify, Magento, custom'
  },
  {
    title: 'Inventory Systems',
    description: 'SAP, Oracle, Manhattan'
  },
  {
    title: 'Marketing Platforms',
    description: 'Salesforce, Adobe, Braze'
  },
  {
    title: 'Supply Chain',
    description: 'Blue Yonder, Kinaxis'
  }
],
    relevantServices: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Convenience Retail Client',
    industry: 'Convenience Retail',
    challenge: 'Fragmented customer data across 800+ locations preventing personalized engagement',
    solution: 'Salesforce Marketing Cloud with custom CDP integration and journey automation',
    results: [
      {
        metric: '$175K',
        description: 'Incremental revenue from personalization'
      },
      {
        metric: '35%',
        description: 'Increase in customer engagement'
      },
      {
        metric: 'Unified',
        description: 'Customer profiles across all locations'
      }
    ],
    technologies: [
      'Salesforce Marketing Cloud',
      'Snowflake',
      'AWS'
    ],
    slug: 'convenience-retail-proof'
  },
  {
    client_descriptor: 'Fortune 500 Department Store Client',
    industry: 'Department Store',
    challenge: 'Manual forecasting causing $50M+ in inventory inefficiencies annually',
    solution: 'ML-powered demand forecasting on Databricks with AutoML pipeline',
    results: [
      {
        metric: '$220K',
        description: 'Annual savings from forecast accuracy'
      },
      {
        metric: '85%',
        description: 'Forecast accuracy achieved'
      },
      {
        metric: '23%',
        description: 'Reduction in stockouts'
      }
    ],
    technologies: [
      'Databricks',
      'Python',
      'MLflow',
      'Snowflake'
    ],
    slug: 'department-store-proof'
  }
],
    faqs: [],
  },
  'manufacturing': {
    id: 'manufacturing',
    slug: 'manufacturing',
    title: 'Manufacturing Technology Solutions',
    tagline: 'Industry 4',
    description: 'Industry 4.0 solutions for manufacturers. IoT analytics, predictive maintenance, quality analytics, and smart factory implementations.',
    painPoints: [],
    useCases: [
  {
    title: 'SCADA/PLC Integration',
    description: 'Industrial control systems'
  },
  {
    title: 'MES Platforms',
    description: 'Siemens, Rockwell, SAP'
  },
  {
    title: 'IoT Platforms',
    description: 'Azure IoT, AWS IoT, PTC'
  },
  {
    title: 'ERP Systems',
    description: 'SAP, Oracle, Microsoft'
  },
  {
    title: 'Quality Systems',
    description: 'QMS integration'
  },
  {
    title: 'Edge Computing',
    description: 'Real-time processing'
  }
],
    relevantServices: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Discrete Manufacturing Client',
    industry: 'Discrete Manufacturing',
    challenge: 'Unplanned equipment failures causing significant production losses and safety risks',
    solution: 'IoT data platform with ML-based predictive maintenance across 50+ production lines',
    results: [
      {
        metric: '28%',
        description: 'Reduction in unplanned downtime'
      },
      {
        metric: '$210K',
        description: 'Annual savings from avoided failures'
      },
      {
        metric: '99.2%',
        description: 'Equipment availability'
      }
    ],
    technologies: [
      'Azure IoT Hub',
      'Databricks',
      'Python',
      'Power BI'
    ],
    slug: 'discrete-manufacturing-proof'
  },
  {
    client_descriptor: 'Fortune 500 Heavy Manufacturing Client',
    industry: 'Heavy Manufacturing',
    challenge: 'Quality issues not detected until final inspection, causing rework and delays',
    solution: 'Computer vision quality inspection with real-time defect detection and alerting',
    results: [
      {
        metric: '21%',
        description: 'Reduction in defect rate'
      },
      {
        metric: '35%',
        description: 'Faster defect detection'
      },
      {
        metric: '$160K',
        description: 'Annual savings from reduced rework'
      }
    ],
    technologies: [
      'AWS SageMaker',
      'OpenCV',
      'Snowflake',
      'Kafka'
    ],
    slug: 'heavy-manufacturing-proof'
  }
],
    faqs: [],
  },
  'hospitality': {
    id: 'hospitality',
    slug: 'hospitality',
    title: 'Hospitality & Food Services Technology Solutions',
    tagline: 'Enterprise data, AI, and cloud solutions for hotels, restaurants, and food service companies',
    description: 'Hospitality technology consulting for hotels, restaurants, and food service: guest data unification, POS and PMS integration, and loyalty personalization.',
    painPoints: [],
    useCases: [
  {
    title: 'Multi-Brand Management',
    description: 'Unified systems across brands'
  },
  {
    title: 'Global Operations',
    description: 'Multi-region, multi-currency'
  },
  {
    title: 'POS Integration',
    description: 'All major systems supported'
  },
  {
    title: 'Food Safety Compliance',
    description: 'HACCP & regulatory tracking'
  },
  {
    title: 'Guest Privacy',
    description: 'GDPR & CCPA compliant'
  },
  {
    title: 'Franchise Analytics',
    description: 'Owner & operator dashboards'
  }
],
    relevantServices: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Global Food Services Client',
    industry: 'Global Food Services',
    challenge: 'Unify data across 400,000+ employees in 53 countries to enable real-time workforce analytics and operational visibility',
    solution: 'Enterprise data platform on Azure with Databricks, enabling global HR analytics and operational dashboards',
    results: [
      {
        metric: '400K+',
        description: 'Employees on unified platform'
      },
      {
        metric: '53',
        description: 'Countries connected'
      },
      {
        metric: 'Real-time',
        description: 'Global visibility achieved'
      }
    ],
    technologies: [
      'Azure',
      'Databricks',
      'Power BI',
      'SAP Integration'
    ],
    slug: 'global-food-services-proof'
  },
  {
    client_descriptor: 'Fortune 500 Hospitality Client',
    industry: 'Hospitality',
    challenge: 'Fragmented guest data across properties preventing personalized experiences and loyalty optimization',
    solution: 'Customer data platform with unified guest profiles powering personalized marketing and service delivery',
    results: [
      {
        metric: '18%',
        description: 'Increase in loyalty engagement'
      },
      {
        metric: '1.8x',
        description: 'ROI on marketing spend'
      },
      {
        metric: '22%',
        description: 'Faster guest recognition'
      }
    ],
    technologies: [
      'Salesforce CDP',
      'AWS',
      'Snowflake',
      'Braze'
    ],
    slug: 'hospitality-proof'
  }
],
    faqs: [],
  },
  'energy': {
    id: 'energy',
    slug: 'energy',
    title: 'Energy & Utilities Technology Solutions',
    tagline: 'Secure, compliant technology solutions for energy companies and utilities',
    description: 'Energy technology consulting for utilities and energy companies: NERC CIP and FERC compliance, OT/IT convergence, grid analytics, and renewable integration.',
    painPoints: [],
    useCases: [],
    relevantServices: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Electric Utility Client',
    industry: 'Electric Utility',
    challenge: 'NERC CIP compliance gaps putting critical infrastructure at risk',
    solution: 'Comprehensive cybersecurity program with automated evidence collection and continuous monitoring',
    results: [
      {
        metric: '100%',
        description: 'NERC CIP compliance achieved'
      },
      {
        metric: 'Zero',
        description: 'Critical findings in audit'
      },
      {
        metric: '60%',
        description: 'Reduction in compliance effort'
      }
    ],
    technologies: [
      'Splunk',
      'Azure',
      'ServiceNow',
      'Custom tools'
    ],
    slug: 'electric-utility-proof'
  },
  {
    client_descriptor: 'Fortune 500 Gas & Electric Client',
    industry: 'Gas & Electric',
    challenge: 'Aging infrastructure causing unplanned outages and safety risks',
    solution: 'IoT-based asset monitoring with ML predictive maintenance',
    results: [
      {
        metric: '24%',
        description: 'Reduction in unplanned outages'
      },
      {
        metric: '$190K',
        description: 'Annual savings from optimized maintenance'
      },
      {
        metric: '99.5%',
        description: 'Grid reliability achieved'
      }
    ],
    technologies: [
      'Azure IoT',
      'Databricks',
      'Power BI',
      'OSIsoft PI'
    ],
    slug: 'gas-electric-proof'
  }
],
    faqs: [],
  },
  'transportation': {
    id: 'transportation',
    slug: 'transportation',
    title: 'Transportation & Logistics Technology Solutions',
    tagline: 'Enterprise data, AI, and cloud solutions for logistics companies, freight carriers, and supply chain operators',
    description: 'Transportation technology consulting for carriers and logistics operators: TMS, telematics, and EDI integration, route optimization, and OTIF improvement.',
    painPoints: [],
    useCases: [
  {
    title: 'TMS Integration',
    description: 'All major systems supported'
  },
  {
    title: 'ELD Compliance',
    description: 'Hours of service tracking'
  },
  {
    title: 'IoT & Telematics',
    description: 'Real-time sensor data'
  },
  {
    title: 'EDI/API Connectivity',
    description: 'Partner integrations'
  },
  {
    title: 'FMCSA Compliance',
    description: 'Regulatory requirements'
  },
  {
    title: 'Multi-Modal Support',
    description: 'Truck, rail, air, ocean'
  }
],
    relevantServices: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Freight & Logistics Client',
    industry: 'Freight & Logistics',
    challenge: 'Rising fuel costs and inefficient routing costing millions annually, with limited visibility into fleet performance',
    solution: 'AI-powered route optimization platform with real-time fleet tracking and predictive analytics',
    results: [
      {
        metric: '$250K',
        description: 'Annual fuel cost savings'
      },
      {
        metric: '16%',
        description: 'Improvement in on-time delivery'
      },
      {
        metric: '18%',
        description: 'Reduction in empty miles'
      }
    ],
    technologies: [
      'AWS',
      'Databricks',
      'IoT Sensors',
      'Python ML'
    ],
    slug: 'freight-logistics-proof'
  },
  {
    client_descriptor: 'Fortune 500 Transportation Client',
    industry: 'Transportation',
    challenge: 'High maintenance costs and unexpected breakdowns disrupting operations and customer commitments',
    solution: 'Predictive maintenance system using telematics data and ML to forecast vehicle service needs',
    results: [
      {
        metric: '26%',
        description: 'Reduction in breakdowns'
      },
      {
        metric: '$195K',
        description: 'Annual maintenance savings'
      },
      {
        metric: '15%',
        description: 'Extended vehicle lifespan'
      }
    ],
    technologies: [
      'Azure IoT',
      'Snowflake',
      'TensorFlow',
      'Power BI'
    ],
    slug: 'transportation-proof'
  }
],
    faqs: [],
  }
};

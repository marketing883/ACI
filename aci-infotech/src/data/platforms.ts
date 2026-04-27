/**
 * Atheros content index: platform entries.
 * See src/data/services.ts for extraction notes.
 */
import type { PlatformEntry, PlatformId } from './types';

export const platforms: Record<PlatformId, PlatformEntry> = {
  'databricks': {
    id: 'databricks',
    slug: 'databricks',
    title: 'Databricks Implementation Services',
    tagline: 'ACI Infotech is an exclusive Databricks partner',
    description: 'ACI Infotech is an exclusive Databricks partner. Lakehouse architecture, Delta Lake, MLflow, and Spark optimization for enterprise.',
    capabilities: [
  {
    title: 'Lakehouse Architecture',
    description: 'Design and implement unified analytics platforms on Delta Lake that combine the best of data lakes and warehouses.'
  },
  {
    title: 'Unity Catalog & Governance',
    description: 'Implement enterprise-grade data governance with Unity Catalog for security, lineage, and compliance.'
  },
  {
    title: 'MLflow & MLOps',
    description: 'Build production ML pipelines with experiment tracking, model registry, and automated deployment.'
  },
  {
    title: 'Spark Optimization',
    description: 'Optimize Spark workloads for performance and cost efficiency with our deep platform expertise.'
  },
  {
    title: 'Migration Services',
    description: 'Migrate from legacy platforms like Hadoop, on-premise data warehouses, or other cloud platforms.'
  },
  {
    title: 'Managed Services',
    description: 'Ongoing support and optimization for your Databricks environment with SLA-backed services.'
  }
],
    useCases: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Retail Client',
    industry: 'Retail',
    challenge: 'Manual forecasting causing $50M+ in inventory inefficiencies',
    solution: 'ML-powered demand forecasting on Databricks with AutoML pipeline',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'retail-proof'
  },
  {
    client_descriptor: 'Fortune 500 Healthcare Client',
    industry: 'Healthcare',
    challenge: 'Siloed research data slowing drug discovery',
    solution: 'Unified data lake on Databricks with automated lineage tracking',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'healthcare-proof'
  }
],
  },
  'snowflake': {
    id: 'snowflake',
    slug: 'snowflake',
    title: 'Snowflake Implementation Services',
    tagline: 'ACI Infotech is a Snowflake Select Partner',
    description: 'ACI Infotech is a Snowflake Select Partner. Data Cloud architecture, data sharing, Snowpark, and enterprise analytics solutions.',
    capabilities: [
  {
    title: 'Data Cloud Architecture',
    description: 'Design scalable, performant Snowflake architectures that support analytics, data sharing, and AI/ML workloads.'
  },
  {
    title: 'Data Sharing & Marketplace',
    description: 'Enable secure data sharing across organizations and monetize data through Snowflake Marketplace.'
  },
  {
    title: 'Snowpark Development',
    description: 'Build data pipelines and ML models directly in Snowflake using Python, Java, or Scala.'
  },
  {
    title: 'Performance Optimization',
    description: 'Optimize query performance and reduce costs with our deep Snowflake expertise.'
  },
  {
    title: 'Migration Services',
    description: 'Migrate from legacy data warehouses like Teradata, Oracle, or Netezza to Snowflake.'
  },
  {
    title: 'Managed Services',
    description: 'Ongoing Snowflake administration, monitoring, and optimization with SLA-backed support.'
  }
],
    useCases: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Financial Services Client',
    industry: 'Financial Services',
    challenge: 'Legacy Teradata warehouse with $2M+ annual costs and limited scalability',
    solution: 'Full migration to Snowflake with automated data pipelines and real-time dashboards',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'financial-services-proof'
  },
  {
    client_descriptor: 'Fortune 500 Retail Client',
    industry: 'Retail',
    challenge: 'Siloed data preventing unified customer analytics across channels',
    solution: 'Snowflake data mesh with secure data sharing between business units',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'retail-proof'
  }
],
  },
  'aws': {
    id: 'aws',
    slug: 'aws',
    title: 'AWS Cloud Services',
    tagline: 'ACI Infotech is an AWS Advanced Consulting Partner',
    description: 'ACI Infotech is an AWS Advanced Consulting Partner. Cloud migration, data lakes, serverless architecture, and managed AWS services.',
    capabilities: [
  {
    title: 'Cloud Migration',
    description: 'Migrate workloads to AWS with minimal disruption using proven methodologies and tools.'
  },
  {
    title: 'Data Lakes & Analytics',
    description: 'Build scalable data lakes on S3 with Glue, Athena, and Redshift for enterprise analytics.'
  },
  {
    title: 'Serverless Architecture',
    description: 'Design event-driven, serverless applications that scale automatically and reduce costs.'
  },
  {
    title: 'Machine Learning on AWS',
    description: 'Deploy ML models at scale using SageMaker, Bedrock, and AWS AI services.'
  },
  {
    title: 'DevOps & Infrastructure',
    description: 'Implement CI/CD pipelines and infrastructure as code for reliable deployments.'
  },
  {
    title: 'Managed Services',
    description: 'Ongoing AWS management, monitoring, and optimization with 24/7 support.'
  }
],
    useCases: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Healthcare Client',
    industry: 'Healthcare',
    challenge: 'On-premise infrastructure limiting ability to scale telehealth services',
    solution: 'Full AWS migration with HIPAA-compliant architecture and auto-scaling',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'healthcare-proof'
  },
  {
    client_descriptor: 'Fortune 500 Retail Client',
    industry: 'Retail',
    challenge: 'Legacy infrastructure unable to handle peak shopping periods',
    solution: 'Serverless architecture on AWS with auto-scaling and CDN optimization',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'retail-proof'
  }
],
  },
  'azure': {
    id: 'azure',
    slug: 'azure',
    title: 'Microsoft Azure Cloud Services',
    tagline: 'ACI Infotech is a Microsoft Gold Partner',
    description: 'ACI Infotech is a Microsoft Gold Partner. Azure migration, Synapse Analytics, Power Platform, and enterprise cloud solutions.',
    capabilities: [
  {
    title: 'Azure Migration',
    description: 'Migrate workloads to Azure using Azure Migrate and proven migration methodologies.'
  },
  {
    title: 'Azure Synapse Analytics',
    description: 'Build unified analytics platforms with Synapse for data warehousing and big data.'
  },
  {
    title: 'Azure Data Factory',
    description: 'Design and deploy enterprise ETL/ELT pipelines for hybrid data integration.'
  },
  {
    title: 'Azure AI & Cognitive Services',
    description: 'Implement AI solutions using Azure OpenAI, Cognitive Services, and Azure ML.'
  },
  {
    title: 'Power Platform',
    description: 'Enable citizen development with Power BI, Power Apps, and Power Automate.'
  },
  {
    title: 'Azure DevOps',
    description: 'Implement CI/CD pipelines and DevOps practices with Azure DevOps services.'
  }
],
    useCases: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Financial Services Client',
    industry: 'Financial Services',
    challenge: '40+ finance systems post-acquisitions requiring consolidation',
    solution: 'Azure-based SAP S/4HANA implementation with Azure DevOps CI/CD',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'financial-services-proof'
  },
  {
    client_descriptor: 'Fortune 500 Manufacturing Client',
    industry: 'Manufacturing',
    challenge: 'Disconnected factory data preventing operational visibility',
    solution: 'Azure IoT Hub and Synapse Analytics for unified manufacturing intelligence',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'manufacturing-proof'
  }
],
  },
  'salesforce': {
    id: 'salesforce',
    slug: 'salesforce',
    title: 'Salesforce Implementation Services',
    tagline: 'ACI Infotech is a Salesforce Consulting Partner',
    description: 'ACI Infotech is a Salesforce Consulting Partner. Sales Cloud, Service Cloud, Marketing Cloud, and Data Cloud implementation and integration.',
    capabilities: [
  {
    title: 'Sales Cloud Implementation',
    description: 'Deploy and customize Sales Cloud to accelerate revenue and improve sales productivity.'
  },
  {
    title: 'Service Cloud Solutions',
    description: 'Transform customer service with omnichannel support and AI-powered case management.'
  },
  {
    title: 'Marketing Cloud',
    description: 'Deliver personalized customer journeys across email, mobile, social, and advertising.'
  },
  {
    title: 'Data Cloud (CDP)',
    description: 'Unify customer data across all touchpoints for a true single customer view.'
  },
  {
    title: 'Integration Services',
    description: 'Connect Salesforce with your enterprise systems using MuleSoft or custom integrations.'
  },
  {
    title: 'Managed Services',
    description: 'Ongoing Salesforce administration, optimization, and support with certified experts.'
  }
],
    useCases: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Retail Client',
    industry: 'Retail',
    challenge: 'Fragmented customer data across 800+ locations preventing personalized engagement',
    solution: 'Salesforce Marketing Cloud with custom CDP integration and journey automation',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'retail-proof'
  },
  {
    client_descriptor: 'Fortune 500 Financial Services Client',
    industry: 'Financial Services',
    challenge: 'Manual processes and disconnected systems slowing sales cycles',
    solution: 'Sales Cloud + CPQ implementation with ERP and data warehouse integration',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'financial-services-proof'
  }
],
  },
  'sap': {
    id: 'sap',
    slug: 'sap',
    title: 'SAP Implementation Services',
    tagline: 'ACI Infotech is an SAP Partner',
    description: 'ACI Infotech is an SAP Partner. S/4HANA implementation, migration, integration, and managed services for enterprise.',
    capabilities: [
  {
    title: 'S/4HANA Implementation',
    description: 'Greenfield and brownfield S/4HANA implementations with industry best practices.'
  },
  {
    title: 'S/4HANA Migration',
    description: 'Migrate from ECC to S/4HANA with minimal business disruption.'
  },
  {
    title: 'SAP Integration',
    description: 'Connect SAP to cloud platforms, data warehouses, and enterprise applications.'
  },
  {
    title: 'SAP Analytics',
    description: 'Implement SAP Analytics Cloud and embedded analytics for real-time insights.'
  },
  {
    title: 'SAP on Cloud',
    description: 'Deploy and manage SAP workloads on AWS, Azure, or Google Cloud.'
  },
  {
    title: 'Managed Services',
    description: 'Ongoing SAP Basis administration, monitoring, and support.'
  }
],
    useCases: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Financial Services Client',
    industry: 'Financial Services',
    challenge: '40+ finance systems post-acquisitions requiring consolidation with zero disruption',
    solution: 'SAP S/4HANA implementation with automated data quality gates and real-time integration',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'financial-services-proof'
  },
  {
    client_descriptor: 'Fortune 500 Manufacturing Client',
    industry: 'Manufacturing',
    challenge: 'Legacy ECC system limiting digital transformation and operational efficiency',
    solution: 'System conversion to S/4HANA with selective data migration and process optimization',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'manufacturing-proof'
  }
],
  },
  'servicenow': {
    id: 'servicenow',
    slug: 'servicenow',
    title: 'ServiceNow Implementation Services',
    tagline: 'ACI Infotech is a ServiceNow Elite Partner',
    description: 'ACI Infotech is a ServiceNow Elite Partner. ITSM, ITOM, HR Service Delivery, and workflow automation implementation and optimization.',
    capabilities: [
  {
    title: 'ITSM Implementation',
    description: 'Deploy ServiceNow IT Service Management for streamlined incident, problem, and change management.'
  },
  {
    title: 'ITOM & Discovery',
    description: 'Gain visibility into your IT infrastructure with automated discovery and event management.'
  },
  {
    title: 'HR Service Delivery',
    description: 'Transform employee experiences with self-service HR and automated workflows.'
  },
  {
    title: 'App Engine & Low-Code',
    description: 'Build custom applications rapidly with ServiceNow App Engine and Flow Designer.'
  },
  {
    title: 'Security Operations',
    description: 'Streamline security incident response with ServiceNow SecOps integration.'
  },
  {
    title: 'Managed Services',
    description: 'Ongoing ServiceNow administration, optimization, and support with certified experts.'
  }
],
    useCases: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Financial Services Client',
    industry: 'Financial Services',
    challenge: 'Manual IT processes causing slow ticket resolution and poor employee satisfaction',
    solution: 'Full ITSM implementation with AI-powered virtual agent and self-service portal',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'financial-services-proof'
  },
  {
    client_descriptor: 'Fortune 500 Manufacturing Client',
    industry: 'Manufacturing',
    challenge: 'No visibility into IT assets and infrastructure dependencies',
    solution: 'ServiceNow ITOM with Discovery and Service Mapping across hybrid infrastructure',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'manufacturing-proof'
  }
],
  },
  'braze': {
    id: 'braze',
    slug: 'braze',
    title: 'Braze Implementation Services',
    tagline: 'ACI Infotech is a Braze Alloy Partner',
    description: 'ACI Infotech is a Braze Alloy Partner. Customer engagement, lifecycle marketing, and real-time personalization implementation.',
    capabilities: [
  {
    title: 'Platform Implementation',
    description: 'End-to-end Braze implementation with SDK integration, data pipelines, and campaign setup.'
  },
  {
    title: 'Customer Journey Orchestration',
    description: 'Design and implement automated customer journeys across email, push, SMS, and in-app.'
  },
  {
    title: 'Data Integration',
    description: 'Connect Braze to your data warehouse, CDP, and enterprise systems for real-time personalization.'
  },
  {
    title: 'Personalization at Scale',
    description: 'Implement dynamic content, recommendation engines, and AI-powered send time optimization.'
  },
  {
    title: 'Migration Services',
    description: 'Migrate from legacy ESPs or competing platforms to Braze with zero disruption.'
  },
  {
    title: 'Managed Services',
    description: 'Ongoing Braze optimization, campaign management, and strategic support.'
  }
],
    useCases: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Retail Client',
    industry: 'Retail',
    challenge: 'Fragmented engagement across 800+ convenience stores with no real-time capabilities',
    solution: 'Braze implementation with real-time triggers, location-based messaging, and loyalty integration',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'retail-proof'
  },
  {
    client_descriptor: 'Fortune 500 Retail Client',
    industry: 'Retail',
    challenge: 'Low email engagement and no mobile push strategy',
    solution: 'Full Braze implementation with lifecycle campaigns and predictive send time',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'retail-proof'
  }
],
  },
  'microsoft-dynamics': {
    id: 'microsoft-dynamics',
    slug: 'microsoft-dynamics',
    title: 'Microsoft Dynamics',
    tagline: '',
    description: '',
    capabilities: [
  {
    title: 'Microsoft Copilot',
    description: 'Implement AI-powered assistants across Dynamics 365 and Power Platform for enhanced productivity.'
  },
  {
    title: 'Dynamics 365 AI ERP',
    description: 'Modern ERP solutions with intelligent automation and real-time insights for finance and operations.'
  },
  {
    title: 'Dynamics 365 CRM',
    description: 'Customer relationship management with AI-driven insights and seamless integrations.'
  },
  {
    title: 'Microsoft Fabric',
    description: 'Unified analytics platform bringing together data engineering, science, and business intelligence.'
  },
  {
    title: 'Power Platform',
    description: 'Low-code solutions for rapid application development and business process automation.'
  },
  {
    title: 'Integration & AI',
    description: 'Connect systems and infuse AI capabilities across your Microsoft ecosystem.'
  }
],
    useCases: [],
    caseStudies: [
  {
    client_descriptor: 'Fortune 500 Manufacturing Client',
    industry: 'Manufacturing',
    challenge: 'Disconnected systems causing delays in order-to-cash cycle',
    solution: 'Dynamics 365 Finance & Supply Chain with Power Automate workflows',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'd365-manufacturing-ordertocash'
  },
  {
    client_descriptor: 'Fortune 500 Services Client',
    industry: 'Services',
    challenge: 'Manual resource allocation and project tracking',
    solution: 'Dynamics 365 Project Operations with Copilot integration',
    results: [
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      },
      {
        metric: '',
        description: ''
      }
    ],
    technologies: [],
    slug: 'd365-services-project-ops'
  }
],
  }
};

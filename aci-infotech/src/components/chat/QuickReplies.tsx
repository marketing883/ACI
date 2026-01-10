'use client';

import { motion, AnimatePresence } from 'framer-motion';

export type ConversationStage =
  | 'greeting'
  | 'discovery'
  | 'collecting_name'
  | 'collecting_email'
  | 'collecting_company'
  | 'collecting_job_title'
  | 'collecting_location'
  | 'scheduling'
  | 'qualified'
  | 'general_chat';

export interface PageContext {
  path: string;
  title?: string;
  type?: 'home' | 'service' | 'industry' | 'platform' | 'case-study' | 'blog' | 'whitepaper' | 'contact' | 'other';
  slug?: string;
}

interface QuickRepliesProps {
  stage: ConversationStage;
  onSelect: (reply: string) => void;
  lastMessage?: string;
  leadInfo?: {
    serviceInterest?: string;
  };
  pageContext?: PageContext;
  disabled?: boolean;
}

// Page-specific quick replies for greeting stage
const PAGE_SPECIFIC_REPLIES: Record<string, string[]> = {
  // Home page
  '/': [
    'Data & Analytics solutions',
    'AI/ML implementation',
    'Cloud modernization',
    'Schedule a consultation',
  ],
  // Services pages
  '/services': [
    'Which service fits my needs?',
    'See relevant case studies',
    'Schedule a consultation',
  ],
  '/services/data-engineering': [
    'Data platform modernization',
    'Databricks implementation',
    'Real-time analytics setup',
    'Schedule a data strategy call',
  ],
  '/services/applied-ai-ml': [
    'AI readiness assessment',
    'GenAI use cases',
    'ML model deployment',
    'Schedule an AI strategy call',
  ],
  '/services/cloud-modernization': [
    'Cloud migration assessment',
    'Multi-cloud strategy',
    'Cost optimization review',
    'Schedule a cloud strategy call',
  ],
  '/services/martech-cdp': [
    'CDP implementation options',
    'Marketing automation setup',
    'Customer data unification',
    'Schedule a MarTech call',
  ],
  '/services/digital-transformation': [
    'SAP S/4HANA migration',
    'Process automation',
    'Legacy modernization',
    'Schedule a transformation call',
  ],
  '/services/cyber-security': [
    'Security assessment',
    'Zero trust implementation',
    'Compliance requirements',
    'Schedule a security call',
  ],
  // Industry pages
  '/industries/financial-services': [
    'Compliance & regulatory solutions',
    'Risk analytics platforms',
    'Real-time fraud detection',
    'Schedule an industry call',
  ],
  '/industries/healthcare': [
    'Healthcare data integration',
    'HIPAA-compliant solutions',
    'Patient analytics platforms',
    'Schedule a healthcare call',
  ],
  '/industries/retail': [
    'Customer 360 solutions',
    'Retail analytics platforms',
    'Inventory optimization',
    'Schedule a retail call',
  ],
  '/industries/manufacturing': [
    'IoT & sensor data platforms',
    'Predictive maintenance',
    'Supply chain analytics',
    'Schedule a manufacturing call',
  ],
  '/industries/energy': [
    'Energy grid analytics',
    'Asset performance management',
    'Sustainability reporting',
    'Schedule an energy call',
  ],
  // Platform pages
  '/platforms/databricks': [
    'Databricks implementation',
    'Data lakehouse architecture',
    'Migration from Spark',
    'Schedule a Databricks call',
  ],
  '/platforms/snowflake': [
    'Snowflake implementation',
    'Data warehouse migration',
    'Cost optimization',
    'Schedule a Snowflake call',
  ],
  '/platforms/aws': [
    'AWS data platform',
    'Serverless architecture',
    'AWS migration',
    'Schedule an AWS call',
  ],
  '/platforms/azure': [
    'Azure Synapse solutions',
    'Azure ML implementation',
    'Hybrid cloud setup',
    'Schedule an Azure call',
  ],
  // Contact page
  '/contact': [
    'Schedule a call instead',
    'General inquiry',
    'Partnership opportunities',
  ],
};

// Quick reply options based on conversation stage and context
const QUICK_REPLIES: Record<ConversationStage, string[]> = {
  greeting: [
    'Data & Analytics solutions',
    'AI/ML implementation',
    'Cloud modernization',
    'Schedule a consultation',
  ],
  discovery: [
    'Tell me more',
    'See relevant case studies',
    'What makes you different?',
    'Schedule a call with an expert',
  ],
  collecting_name: [
    'Why do you need my name?',
    'Skip for now',
  ],
  collecting_email: [
    'Why do you need my email?',
    'I prefer to schedule a call first',
  ],
  collecting_company: [
    'Skip for now',
  ],
  collecting_job_title: [
    'Skip for now',
  ],
  collecting_location: [
    'United States',
    'Europe',
    'Asia Pacific',
    'Other',
  ],
  scheduling: [
    'Morning works best',
    'Afternoon is better',
    'Send me available slots',
  ],
  qualified: [
    'Schedule a call',
    'Send me relevant resources',
    'I have more questions',
  ],
  general_chat: [
    'Learn about your services',
    'See case studies',
    'Talk to an expert',
  ],
};

// Context-aware additional replies based on detected service interest
const SERVICE_SPECIFIC_REPLIES: Record<string, string[]> = {
  'Data Engineering': [
    'Tell me about Databricks solutions',
    'Data platform modernization',
  ],
  'Applied AI & ML': [
    'AI governance capabilities',
    'GenAI implementation',
  ],
  'Cloud Modernization': [
    'Cloud migration approach',
    'Multi-cloud strategies',
  ],
  'MarTech & CDP': [
    'CDP implementation process',
    'Marketing automation',
  ],
  'Digital Transformation': [
    'SAP S/4HANA expertise',
    'Process automation',
  ],
  'Cyber Security': [
    'Zero trust implementation',
    'Compliance expertise',
  ],
};

export default function QuickReplies({
  stage,
  onSelect,
  lastMessage,
  leadInfo,
  pageContext,
  disabled = false,
}: QuickRepliesProps) {
  // Get base replies for current stage
  let replies = [...(QUICK_REPLIES[stage] || QUICK_REPLIES.general_chat)];

  // For greeting stage, prioritize page-specific replies
  if (stage === 'greeting' && pageContext?.path) {
    const pageReplies = PAGE_SPECIFIC_REPLIES[pageContext.path];
    if (pageReplies) {
      replies = pageReplies;
    } else {
      // Check for partial path matches (e.g., /case-studies/*)
      const pathPrefix = Object.keys(PAGE_SPECIFIC_REPLIES).find(
        key => pageContext.path.startsWith(key) && key !== '/'
      );
      if (pathPrefix) {
        replies = PAGE_SPECIFIC_REPLIES[pathPrefix];
      }
    }
  }

  // Add service-specific replies if we know the user's interest
  if (leadInfo?.serviceInterest && SERVICE_SPECIFIC_REPLIES[leadInfo.serviceInterest]) {
    const serviceReplies = SERVICE_SPECIFIC_REPLIES[leadInfo.serviceInterest];
    // Insert service-specific replies at the beginning, but limit total
    replies = [...serviceReplies.slice(0, 2), ...replies].slice(0, 4);
  }

  // Don't show replies if disabled or no replies available
  if (disabled || replies.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex flex-wrap gap-2 mt-3 ml-11"
      >
        {replies.map((reply, index) => (
          <motion.button
            key={reply}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 * index }}
            onClick={() => onSelect(reply)}
            disabled={disabled}
            className="text-xs px-3 py-1.5 bg-white border border-[#0052CC]/30 text-[#0052CC] rounded-full
                       hover:bg-[#0052CC] hover:text-white hover:border-[#0052CC]
                       transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-sm hover:shadow-md"
          >
            {reply}
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

// Time slot suggestions for scheduling
export function TimeSlotSuggestions({
  onSelect,
  disabled = false,
}: {
  onSelect: (slot: string) => void;
  disabled?: boolean;
}) {
  const timeSlots = [
    'Tomorrow morning',
    'Tomorrow afternoon',
    'This week',
    'Next week',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 mt-3 ml-11"
    >
      {timeSlots.map((slot, index) => (
        <motion.button
          key={slot}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.1 * index }}
          onClick={() => onSelect(slot)}
          disabled={disabled}
          className="text-xs px-3 py-1.5 bg-[#C4FF61]/20 border border-[#C4FF61]/50 text-gray-700 rounded-full
                     hover:bg-[#C4FF61] hover:text-gray-900 hover:border-[#C4FF61]
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {slot}
        </motion.button>
      ))}
    </motion.div>
  );
}

// Page-specific initial messages - Direct, peer-level voice
const PAGE_INITIAL_MESSAGES: Record<string, string> = {
  '/': "Data platforms, AI systems, cloud architecture. Senior architects, production code, real SLAs. What are you working on?",
  '/services': "We cover the full stack - data, AI, cloud, transformation. What's the problem you're trying to solve?",
  '/services/data-engineering': "Databricks, Snowflake, data mesh - we've built it all at scale. Evaluating platforms or dealing with a specific data challenge?",
  '/services/applied-ai-ml': "MLOps, GenAI, LLM deployments, AI governance. Most AI projects fail on data foundation, not the models. Where are you in the journey?",
  '/services/cloud-modernization': "AWS, Azure, multi-cloud, K8s. Migration, optimization, or architecting something new?",
  '/services/martech-cdp': "Customer data unification is messy work. Salesforce, Braze, CDPs - what's the integration challenge?",
  '/services/digital-transformation': "SAP S/4HANA, ServiceNow, MuleSoft. The real question is always change management. What's driving your timeline?",
  '/services/cyber-security': "Zero trust, DevSecOps, compliance. Security that doesn't slow down engineering. What's the priority?",
  '/industries/financial-services': "Regulatory compliance, real-time risk, data governance. We know the constraints. What's the initiative?",
  '/industries/healthcare': "HIPAA, interoperability, clinical analytics. Complexity is the norm here. What are you building?",
  '/industries/retail': "Customer 360, inventory optimization, omnichannel data. Where's the friction in your current setup?",
  '/industries/manufacturing': "IoT, predictive maintenance, supply chain analytics. Shop floor to cloud. What's the use case?",
  '/industries/energy': "Grid analytics, asset management, sustainability reporting. What's driving the project?",
  '/platforms/databricks': "Certified partner, deep Lakehouse experience. Greenfield implementation or migrating from something?",
  '/platforms/snowflake': "Data Cloud, data sharing, cost optimization. What's the current state of your Snowflake?",
  '/platforms/aws': "We've built at scale on AWS - data lakes, ML pipelines, serverless. What's the architecture challenge?",
  '/platforms/azure': "Synapse, Fabric, ML Studio - the full ecosystem. What are you trying to stand up?",
  '/platforms/salesforce': "Data integration is where Salesforce gets complicated. Syncing issues or broader data strategy?",
  '/platforms/sap': "S/4HANA migrations, data extraction, integration. These projects have a way of expanding. What's your scope?",
  '/contact': "Ready to talk specifics. Anything you want to cover before connecting with the team?",
  '/case-studies': "Real outcomes, real architectures. Looking for something specific - industry, tech stack, type of result?",
  '/blog': "Digging into the details. Questions on anything you're reading?",
  '/whitepapers': "Going deep. What's the research focus?",
};

// Helper function to get page-specific initial message
export function getPageInitialMessage(pageContext: PageContext): string {
  // First try exact path match
  if (PAGE_INITIAL_MESSAGES[pageContext.path]) {
    return PAGE_INITIAL_MESSAGES[pageContext.path];
  }

  // Try prefix match for dynamic routes
  const pathPrefix = Object.keys(PAGE_INITIAL_MESSAGES).find(
    key => pageContext.path.startsWith(key) && key !== '/'
  );

  if (pathPrefix) {
    return PAGE_INITIAL_MESSAGES[pathPrefix];
  }

  // Handle dynamic routes by type
  if (pageContext.type === 'case-study') {
    return "Real architecture, real outcomes. Questions on how we approached it, or thinking about something similar?";
  }

  if (pageContext.type === 'blog') {
    return "Digging into the details - good. What's on your mind?";
  }

  if (pageContext.type === 'whitepaper') {
    return "Going deep on the topic. Anything specific you're trying to figure out?";
  }

  // Default message
  return "Data, AI, cloud, transformation. Senior architects, production systems. What's the challenge?";
}

// Helper to detect page context from pathname
export function detectPageContext(pathname: string): PageContext {
  const context: PageContext = {
    path: pathname,
    type: 'other',
  };

  if (pathname === '/') {
    context.type = 'home';
  } else if (pathname.startsWith('/services')) {
    context.type = 'service';
    context.slug = pathname.split('/')[2];
  } else if (pathname.startsWith('/industries')) {
    context.type = 'industry';
    context.slug = pathname.split('/')[2];
  } else if (pathname.startsWith('/platforms')) {
    context.type = 'platform';
    context.slug = pathname.split('/')[2];
  } else if (pathname.startsWith('/case-studies')) {
    context.type = 'case-study';
    context.slug = pathname.split('/')[2];
  } else if (pathname.startsWith('/blog')) {
    context.type = 'blog';
    context.slug = pathname.split('/')[2];
  } else if (pathname.startsWith('/whitepapers') || pathname.startsWith('/playbooks')) {
    context.type = 'whitepaper';
    context.slug = pathname.split('/')[2];
  } else if (pathname === '/contact') {
    context.type = 'contact';
  }

  return context;
}

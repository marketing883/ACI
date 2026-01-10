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

// Page-specific initial messages
const PAGE_INITIAL_MESSAGES: Record<string, string> = {
  '/': "Hi! I'm here to help you explore how ACI Infotech can accelerate your data and AI initiatives. What brings you here today?",
  '/services': "Looking to find the right solution for your business? I can help you navigate our services and find the perfect fit. What challenge are you looking to solve?",
  '/services/data-engineering': "I see you're exploring our Data Engineering capabilities. We've helped Fortune 500 companies build production-grade data platforms. What's your current data challenge?",
  '/services/applied-ai-ml': "Interested in AI/ML? We specialize in taking AI from prototype to production at enterprise scale. Are you looking to implement new AI capabilities or optimize existing ones?",
  '/services/cloud-modernization': "Cloud modernization can transform your business agility. Whether it's migration, optimization, or multi-cloud strategy - I can help guide you. What's your current cloud situation?",
  '/services/martech-cdp': "MarTech and CDP implementations are our specialty. We've unified customer data for major brands. Are you looking to improve your customer data strategy?",
  '/services/digital-transformation': "Digital transformation is a journey. From SAP S/4HANA to process automation, we've guided enterprises through it all. What transformation goals do you have in mind?",
  '/services/cyber-security': "Security is foundational to everything we do. From zero trust to compliance, how can I help secure your digital assets?",
  '/industries/financial-services': "I see you're in financial services. We understand the unique challenges of regulatory compliance, real-time risk analytics, and data governance. How can we help your organization?",
  '/industries/healthcare': "Healthcare data presents unique challenges around HIPAA compliance and patient privacy. We've built compliant data platforms for major health systems. What are you working on?",
  '/industries/retail': "Retail is all about understanding your customer. From Customer 360 to inventory optimization, we've helped major retailers transform. What's your focus area?",
  '/industries/manufacturing': "Manufacturing analytics can transform operations. From IoT to predictive maintenance, what operational challenges are you looking to solve?",
  '/industries/energy': "Energy sector analytics require specialized expertise in grid management and sustainability reporting. How can we help your energy organization?",
  '/platforms/databricks': "You're looking at Databricks - excellent choice for unified analytics. We're a certified Databricks partner with deep implementation experience. Planning a new implementation or migration?",
  '/platforms/snowflake': "Snowflake is powerful for modern data warehousing. We've helped enterprises maximize their Snowflake investment. What's your Snowflake journey looking like?",
  '/platforms/aws': "AWS offers tremendous capabilities for data and AI. As AWS partners, we've built scalable platforms on AWS. What are you building?",
  '/platforms/azure': "Azure's data ecosystem is robust for enterprise needs. We've implemented Azure Synapse, ML, and more. What Azure capabilities interest you?",
  '/platforms/salesforce': "Salesforce integration and data optimization can unlock customer insights. Are you looking to better leverage your Salesforce data?",
  '/platforms/sap': "SAP transformations require deep expertise. From S/4HANA migrations to data integration, we've done it all. What's your SAP situation?",
  '/contact': "I see you're ready to get in touch! I can help you prepare for a productive conversation with our team. What would you like to discuss?",
  '/case-studies': "Our case studies showcase real results. I can help you find the most relevant examples for your industry or challenge. What kind of outcomes are you looking for?",
  '/blog': "Great to see you exploring our insights! Is there a specific topic you're researching? I can point you to relevant resources.",
  '/whitepapers': "Our whitepapers offer deep dives into enterprise data and AI. Looking for guidance on a specific topic?",
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
    return `I see you're reading one of our case studies. These showcase real enterprise transformations. Have questions about how we achieved these results or how they might apply to your situation?`;
  }

  if (pageContext.type === 'blog') {
    return `Great article, right? I can help you dive deeper into this topic or connect you with our experts who specialize in this area. What questions do you have?`;
  }

  if (pageContext.type === 'whitepaper') {
    return `Whitepapers are great for in-depth knowledge. I can help clarify concepts or discuss how these insights apply to your organization. What interests you most?`;
  }

  // Default message
  return "Hi! I'm here to help you explore how ACI Infotech can accelerate your data and AI initiatives. What can I help you with today?";
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

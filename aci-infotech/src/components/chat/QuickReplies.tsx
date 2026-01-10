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

interface QuickRepliesProps {
  stage: ConversationStage;
  onSelect: (reply: string) => void;
  lastMessage?: string;
  leadInfo?: {
    serviceInterest?: string;
  };
  disabled?: boolean;
}

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
  disabled = false,
}: QuickRepliesProps) {
  // Get base replies for current stage
  let replies = [...(QUICK_REPLIES[stage] || QUICK_REPLIES.general_chat)];

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

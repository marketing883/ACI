'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, CheckCircle2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageRenderer from './MessageRenderer';
import QuickReplies, {
  type ConversationStage,
  type PageContext,
  TimeSlotSuggestions,
  getPageInitialMessage,
  detectPageContext,
} from './QuickReplies';
import { getTriggerEngine, type TriggerEvent } from '@/lib/analytics/engagement-triggers';
import { useTracker } from '@/components/analytics/VisitorTracker';
import { streamAtherosReply, copilotV2Active } from '@/lib/copilot/clientStream';
import dynamic from 'next/dynamic';
import type { ChatColumnMessage } from '@/components/copilot/ChatColumn';

// Desktop shell is lazy-loaded and only mounted when the flag is on and
// the viewport is >= 1024 px. Zero bytes on the initial bundle.
const ConsultationShell = dynamic(
  () => import('@/components/copilot/ConsultationShell'),
  { ssr: false },
);

// Mobile pill is lazy-loaded and only mounted when the flag is on and
// the viewport is < 1024 px. The idle pill is ~4 KB gzipped on its own;
// the converse sheet is pulled in on first interaction.
const MobilePill = dynamic(
  () => import('@/components/copilot/mobile/MobilePill'),
  { ssr: false },
);

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  showQuickReplies?: boolean;
  isProactive?: boolean; // Flag for proactive messages
}

interface LeadInfo {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  jobTitle?: string;
  location?: string;
  serviceInterest?: string;
  requirements?: string;
  preferredTime?: string;
}

// Storage keys for persistence
const STORAGE_KEYS = {
  messages: 'aci_chat_messages',
  leadInfo: 'aci_chat_leadInfo',
  stage: 'aci_chat_stage',
  sessionId: 'aci_chat_sessionId',
  lastActivity: 'aci_chat_lastActivity',
  entryPage: 'aci_chat_entryPage',
  pagesVisited: 'aci_chat_pagesVisited',
};

// Session timeout in milliseconds (24 hours)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

// Create initial message based on page context
function createInitialMessage(pageContext: PageContext): Message {
  return {
    id: '0',
    role: 'assistant',
    content: getPageInitialMessage(pageContext),
    timestamp: new Date(),
    showQuickReplies: true,
  };
}

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONSUMER_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'mail.com', 'protonmail.com'];

function isWorkEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? !CONSUMER_EMAIL_DOMAINS.includes(domain) : false;
}

export default function ChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({});
  const [stage, setStage] = useState<ConversationStage>('greeting');
  const [leadSaved, setLeadSaved] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext>({ path: '/', type: 'home' });
  const [entryPage, setEntryPage] = useState<string>('/');
  const [pagesVisited, setPagesVisited] = useState<string[]>([]);
  const [proactiveTriggerId, setProactiveTriggerId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Desktop viewport detection for the Atheros Part-4 consultation shell.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 1024px)');
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  const [showProactiveIndicator, setShowProactiveIndicator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialized = useRef(false);
  const hasInteractedThisSession = useRef(false);
  const tracker = useTracker();

  // Initialize session and restore state from localStorage
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Detect current page context
    const currentPageContext = detectPageContext(pathname);
    setPageContext(currentPageContext);

    try {
      const storedLastActivity = localStorage.getItem(STORAGE_KEYS.lastActivity);
      const lastActivity = storedLastActivity ? parseInt(storedLastActivity, 10) : 0;
      const isExpired = Date.now() - lastActivity > SESSION_TIMEOUT;

      if (isExpired) {
        // Clear old session and start fresh
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
        const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
        localStorage.setItem(STORAGE_KEYS.sessionId, newSessionId);

        // Set entry page and initial message for new session
        setEntryPage(pathname);
        setPagesVisited([pathname]);
        localStorage.setItem(STORAGE_KEYS.entryPage, pathname);
        localStorage.setItem(STORAGE_KEYS.pagesVisited, JSON.stringify([pathname]));

        // Create page-aware initial message
        setMessages([createInitialMessage(currentPageContext)]);
      } else {
        // Restore session
        const storedSessionId = localStorage.getItem(STORAGE_KEYS.sessionId);
        const storedMessages = localStorage.getItem(STORAGE_KEYS.messages);
        const storedLeadInfo = localStorage.getItem(STORAGE_KEYS.leadInfo);
        const storedStage = localStorage.getItem(STORAGE_KEYS.stage);
        const storedEntryPage = localStorage.getItem(STORAGE_KEYS.entryPage);
        const storedPagesVisited = localStorage.getItem(STORAGE_KEYS.pagesVisited);

        if (storedSessionId) {
          setSessionId(storedSessionId);
        } else {
          const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          setSessionId(newSessionId);
          localStorage.setItem(STORAGE_KEYS.sessionId, newSessionId);
        }

        if (storedMessages) {
          const parsed = JSON.parse(storedMessages);
          setMessages(parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) })));
        } else {
          // No messages stored, create initial message
          setMessages([createInitialMessage(currentPageContext)]);
        }

        if (storedLeadInfo) {
          setLeadInfo(JSON.parse(storedLeadInfo));
        }

        if (storedStage) {
          setStage(storedStage as ConversationStage);
        }

        if (storedEntryPage) {
          setEntryPage(storedEntryPage);
        }

        if (storedPagesVisited) {
          const pages = JSON.parse(storedPagesVisited) as string[];
          // Add current page if not already visited
          if (!pages.includes(pathname)) {
            pages.push(pathname);
            localStorage.setItem(STORAGE_KEYS.pagesVisited, JSON.stringify(pages));
          }
          setPagesVisited(pages);
        } else {
          setPagesVisited([pathname]);
          localStorage.setItem(STORAGE_KEYS.pagesVisited, JSON.stringify([pathname]));
        }
      }

      // Update last activity
      localStorage.setItem(STORAGE_KEYS.lastActivity, Date.now().toString());
    } catch (error) {
      console.error('Failed to restore chat state:', error);
      const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      setMessages([createInitialMessage(currentPageContext)]);
    }
  }, [pathname]);

  // Track page navigation
  useEffect(() => {
    if (!isInitialized.current) return;

    const newPageContext = detectPageContext(pathname);
    setPageContext(newPageContext);

    // Track pages visited
    setPagesVisited(prev => {
      if (!prev.includes(pathname)) {
        const updated = [...prev, pathname];
        localStorage.setItem(STORAGE_KEYS.pagesVisited, JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, [pathname]);

  // Persist state changes to localStorage
  useEffect(() => {
    if (!sessionId) return;
    try {
      localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
      localStorage.setItem(STORAGE_KEYS.leadInfo, JSON.stringify(leadInfo));
      localStorage.setItem(STORAGE_KEYS.stage, stage);
      localStorage.setItem(STORAGE_KEYS.lastActivity, Date.now().toString());
    } catch (error) {
      console.error('Failed to persist chat state:', error);
    }
  }, [messages, leadInfo, stage, sessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Listen for proactive engagement triggers
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleEngagementTrigger = (event: CustomEvent<TriggerEvent>) => {
      // Don't show proactive messages if user has already interacted
      if (hasInteractedThisSession.current) return;

      // Don't show if chat is already open
      if (isOpen) return;

      const { trigger, message } = event.detail;

      // Store the trigger ID for tracking
      setProactiveTriggerId(trigger.id);

      // Show the proactive indicator on the chat button
      setShowProactiveIndicator(true);

      // If trigger action is to open chat with message
      if (trigger.action_type === 'chat_proactive') {
        // Add proactive message to messages
        const proactiveMessage: Message = {
          id: `proactive_${Date.now()}`,
          role: 'assistant',
          content: message,
          timestamp: new Date(),
          showQuickReplies: true,
          isProactive: true,
        };

        setMessages(prev => {
          // Don't add if there's already a proactive message
          if (prev.some(m => m.isProactive)) return prev;
          return [...prev, proactiveMessage];
        });

        // Auto-open chat after a brief delay
        setTimeout(() => {
          setIsOpen(true);
          tracker.trackChatOpen();
        }, 500);
      }
    };

    window.addEventListener('aci:engagement_trigger', handleEngagementTrigger as EventListener);

    return () => {
      window.removeEventListener('aci:engagement_trigger', handleEngagementTrigger as EventListener);
    };
  }, [isOpen, tracker]);

  // Track when user interacts with chat
  const markInteraction = useCallback(() => {
    hasInteractedThisSession.current = true;
    setShowProactiveIndicator(false);

    // Record engagement if this was triggered by a proactive message
    if (proactiveTriggerId) {
      const triggerEngine = getTriggerEngine();
      triggerEngine.recordEngagement(proactiveTriggerId);
      setProactiveTriggerId(null);
    }
  }, [proactiveTriggerId]);

  // Save lead to database
  const saveLead = useCallback(async (info: LeadInfo, conversationHistory: Message[]) => {
    if (leadSaved || !info.email) return;

    try {
      const response = await fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          leadInfo: info,
          conversation: conversationHistory.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp.toISOString(),
          })),
          pageUrl: window.location.href,
          referrer: document.referrer,
          entryPage,
          pagesVisited,
          currentPage: pageContext,
        }),
      });

      if (response.ok) {
        setLeadSaved(true);
      }
    } catch (error) {
      console.error('Failed to save lead:', error);
    }
  }, [sessionId, leadSaved, entryPage, pagesVisited, pageContext]);

  // Process user response and determine next action
  const processResponse = useCallback((userMessage: string, currentStage: ConversationStage, currentLead: LeadInfo): {
    followUp: string | null;
    nextStage: ConversationStage;
    updatedLead: LeadInfo;
    shouldCallAI: boolean;
  } => {
    const updatedLead = { ...currentLead };
    let followUp: string | null = null;
    let nextStage = currentStage;
    let shouldCallAI = true;

    // Extract email if present in message
    const emailMatch = userMessage.match(EMAIL_REGEX);
    if (emailMatch) {
      updatedLead.email = emailMatch[0];
    }

    // Extract phone if present
    const phoneMatch = userMessage.match(/(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/);
    if (phoneMatch) {
      updatedLead.phone = phoneMatch[0];
    }

    // Detect service interest
    const messageLower = userMessage.toLowerCase();
    if (messageLower.includes('data') || messageLower.includes('analytics') || messageLower.includes('warehouse') || messageLower.includes('databricks') || messageLower.includes('snowflake')) {
      updatedLead.serviceInterest = 'Data Engineering';
    } else if (messageLower.includes('ai') || messageLower.includes('ml') || messageLower.includes('machine learning') || messageLower.includes('artificial') || messageLower.includes('genai')) {
      updatedLead.serviceInterest = 'Applied AI & ML';
    } else if (messageLower.includes('cloud') || messageLower.includes('aws') || messageLower.includes('azure') || messageLower.includes('gcp') || messageLower.includes('kubernetes')) {
      updatedLead.serviceInterest = 'Cloud Modernization';
    } else if (messageLower.includes('marketing') || messageLower.includes('cdp') || messageLower.includes('customer') || messageLower.includes('braze') || messageLower.includes('salesforce marketing')) {
      updatedLead.serviceInterest = 'MarTech & CDP';
    } else if (messageLower.includes('security') || messageLower.includes('cyber') || messageLower.includes('compliance')) {
      updatedLead.serviceInterest = 'Cyber Security';
    } else if (messageLower.includes('transform') || messageLower.includes('automat') || messageLower.includes('sap') || messageLower.includes('servicenow')) {
      updatedLead.serviceInterest = 'Digital Transformation';
    }

    // Detect scheduling intent
    if (messageLower.includes('schedule') || messageLower.includes('call') || messageLower.includes('meeting') || messageLower.includes('talk to') || messageLower.includes('consultation')) {
      if (!updatedLead.name) {
        nextStage = 'collecting_name';
        followUp = "Let's set that up. Who should we be reaching out to?";
        shouldCallAI = false;
        return { followUp, nextStage, updatedLead, shouldCallAI };
      }
    }

    // Handle time preferences
    if (messageLower.includes('morning') || messageLower.includes('afternoon') || messageLower.includes('tomorrow') || messageLower.includes('next week') || messageLower.includes('this week')) {
      updatedLead.preferredTime = userMessage;
    }

    // Stage-based logic
    switch (currentStage) {
      case 'greeting':
        if (userMessage.length > 5) {
          nextStage = 'discovery';
        }
        break;

      case 'discovery':
        // After discovery, start collecting info
        nextStage = 'collecting_name';
        shouldCallAI = true;
        break;

      case 'collecting_name':
        if (messageLower.includes('skip') || messageLower.includes('why')) {
          followUp = "Fair enough. Let's keep going - what else can I help you with?";
          nextStage = 'general_chat';
          shouldCallAI = false;
        } else if (userMessage.length > 1 && userMessage.length < 50 && !userMessage.includes('@')) {
          // Extract name from common patterns like "I'm Habib", "My name is John", "It's Sarah", "Call me Mike"
          let extractedName = userMessage;

          // Common name introduction patterns (case-insensitive)
          const namePatterns = [
            /^(?:i'?m|i am|(?:my )?name is|this is|it'?s|call me|hey,? i'?m|hi,? i'?m|hello,? i'?m)\s+(.+)$/i,
            /^(.+?)(?:\s+here|\s+speaking)$/i,
          ];

          for (const pattern of namePatterns) {
            const match = userMessage.match(pattern);
            if (match && match[1]) {
              extractedName = match[1].trim();
              break;
            }
          }

          // Capitalize each word properly
          updatedLead.name = extractedName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          nextStage = 'collecting_email';
          followUp = `${updatedLead.name} - good to connect. Best work email to reach you? Helps us route things to the right team.`;
          shouldCallAI = false;
        } else {
          followUp = "Who am I speaking with?";
          shouldCallAI = false;
        }
        break;

      case 'collecting_email':
        if (messageLower.includes('skip') || messageLower.includes('prefer') || messageLower.includes('call first')) {
          nextStage = 'scheduling';
          followUp = "Works for me. When's good for a call?";
          shouldCallAI = false;
          setShowTimeSlots(true);
        } else if (updatedLead.email) {
          if (!isWorkEmail(updatedLead.email)) {
            followUp = "Work email would be better for routing to the right team. Mind sharing that instead?";
            updatedLead.email = undefined; // Clear the consumer email
            shouldCallAI = false;
          } else {
            nextStage = 'collecting_company';
            followUp = "Got it. Which company?";
            shouldCallAI = false;
          }
        } else if (messageLower.includes('why')) {
          followUp = "Just helps us route things properly - relevant resources, right specialist. We don't spam.";
          shouldCallAI = false;
        } else {
          followUp = "Didn't catch that. Work email?";
          shouldCallAI = false;
        }
        break;

      case 'collecting_company':
        if (messageLower.includes('skip')) {
          nextStage = 'collecting_job_title';
          followUp = "Sure. What's your role?";
          shouldCallAI = false;
        } else if (userMessage.length > 1 && userMessage.length < 100) {
          updatedLead.company = userMessage;
          nextStage = 'collecting_job_title';
          followUp = `${updatedLead.company}. And your role there?`;
          shouldCallAI = false;
        } else {
          followUp = "Which company?";
          shouldCallAI = false;
        }
        break;

      case 'collecting_job_title':
        if (messageLower.includes('skip')) {
          nextStage = 'collecting_location';
          followUp = "Last one - where are you based?";
          shouldCallAI = false;
        } else if (userMessage.length > 1 && userMessage.length < 100) {
          updatedLead.jobTitle = userMessage;
          nextStage = 'collecting_location';
          followUp = `Got it. Location? We have teams across the US and globally.`;
          shouldCallAI = false;
        }
        break;

      case 'collecting_location':
        if (userMessage.length > 1) {
          updatedLead.location = userMessage;
          nextStage = 'qualified';
          shouldCallAI = true;
        }
        break;

      case 'scheduling':
        if (updatedLead.preferredTime || messageLower.includes('morning') || messageLower.includes('afternoon') || messageLower.includes('slot')) {
          updatedLead.preferredTime = userMessage;
          if (!updatedLead.email) {
            nextStage = 'collecting_email';
            followUp = `Noted. Work email for the calendar invite?`;
            shouldCallAI = false;
            setShowTimeSlots(false);
          } else {
            nextStage = 'qualified';
            shouldCallAI = true;
            setShowTimeSlots(false);
          }
        }
        break;

      case 'qualified':
      case 'general_chat':
        shouldCallAI = true;
        break;
    }

    return { followUp, nextStage, updatedLead, shouldCallAI };
  }, []);

  async function handleSend(content?: string) {
    const messageContent = content || input.trim();
    if (!messageContent || isLoading) return;

    // Mark user interaction
    markInteraction();
    tracker.trackChatMessage(true);

    setShowTimeSlots(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      const { followUp, nextStage, updatedLead, shouldCallAI } = processResponse(messageContent, stage, leadInfo);

      setLeadInfo(updatedLead);
      setStage(nextStage);

      let assistantContent: string;

      if (followUp && !shouldCallAI) {
        assistantContent = followUp;
      } else {
        // Atheros v2 dark launch: when the flag is on for this visitor, we
        // stream from /api/chat/v2 and ignore UI-only tool calls. When the
        // flag is off we fall through to the v1 endpoint unchanged.
        let v2Content: string | null = null;
        if (copilotV2Active(sessionId)) {
          const v2Res = await streamAtherosReply({
            sessionId,
            visitorId: sessionId,
            pageContext: {
              path: typeof window !== 'undefined' ? window.location.pathname : pageContext,
            },
            leadState: updatedLead as Record<string, unknown>,
            messages: currentMessages.map(m => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
            turnIndex: currentMessages.length,
          });
          if (v2Res.status === 'ok' && v2Res.text.trim().length > 0) {
            v2Content = v2Res.text;
          }
        }

        if (v2Content !== null) {
          assistantContent = v2Content;
        } else {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: currentMessages.map(m => ({
                role: m.role,
                content: m.content,
              })),
              leadInfo: updatedLead,
              stage: nextStage,
              pageContext: {
                currentPage: pageContext,
                entryPage,
                pagesVisited,
              },
            }),
          });

          const data = await response.json();
          assistantContent = data.message || "Something's off on my end. [Reach out directly](/contact) - faster anyway.";
        }

        // If in discovery, prompt for info naturally
        if (nextStage === 'collecting_name' && !followUp) {
          assistantContent += "\n\nBy the way - who am I talking to?";
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
        showQuickReplies: nextStage !== 'scheduling',
      };

      const finalMessages = [...currentMessages, assistantMessage];
      setMessages(finalMessages);

      // Save lead if we have enough info
      if (updatedLead.email && (updatedLead.name || updatedLead.company)) {
        saveLead(updatedLead, finalMessages);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Connection issue on my end. [Reach out directly](/contact) - it's faster.",
        timestamp: new Date(),
        showQuickReplies: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const getPlaceholder = () => {
    switch (stage) {
      case 'collecting_name': return "Your name...";
      case 'collecting_email': return "your.name@company.com";
      case 'collecting_company': return "Company name...";
      case 'collecting_job_title': return "Your role...";
      case 'collecting_location': return "City, Country...";
      case 'scheduling': return "Preferred time...";
      default: return "Type a message...";
    }
  };

  // When Atheros v2 is active for this visitor, the Part-4 desktop shell
  // and the Part-5 mobile pill take over the surface entirely; the legacy
  // "closed = floating button" path is skipped and the flag branches
  // below decide the render.
  const atherosActive = copilotV2Active(sessionId);

  // Closed state - floating button. Only rendered when the v2 flag is
  // off for this visitor; otherwise MobilePill or ConsultationShell
  // manages its own idle surface (the pill itself IS the trigger).
  if (!isOpen && !atherosActive) {
    return (
      <motion.div className="fixed bottom-6 right-6 z-50">
        {/* Proactive message bubble */}
        <AnimatePresence>
          {showProactiveIndicator && messages.some(m => m.isProactive) && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full right-0 mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="p-3 bg-gradient-to-r from-[#0052CC]/5 to-[#C4FF61]/10 border-b border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Sparkles className="w-3 h-3 text-[#0052CC]" />
                  <span>ACI Assistant</span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {messages.find(m => m.isProactive)?.content}
                </p>
              </div>
              <div className="px-4 pb-4 flex gap-2">
                <button
                  onClick={() => {
                    setIsOpen(true);
                    markInteraction();
                    tracker.trackChatOpen();
                  }}
                  className="flex-1 px-4 py-2 bg-[#0052CC] text-white text-sm font-medium rounded-lg hover:bg-[#003D99] transition-colors"
                >
                  Chat now
                </button>
                <button
                  onClick={() => {
                    setShowProactiveIndicator(false);
                    if (proactiveTriggerId) {
                      const triggerEngine = getTriggerEngine();
                      triggerEngine.recordDismissal(proactiveTriggerId);
                    }
                  }}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            setIsOpen(true);
            tracker.trackChatOpen();
          }}
          className="relative bg-[#0052CC] text-white p-4 rounded-full shadow-lg hover:bg-[#003D99] transition-colors group"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          {showProactiveIndicator ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-[#C4FF61] rounded-full border-2 border-white flex items-center justify-center"
            >
              <span className="text-[10px] font-bold text-gray-800">1</span>
            </motion.span>
          ) : (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C4FF61] rounded-full border-2 border-white animate-pulse" />
          )}
          {!showProactiveIndicator && (
            <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
              Chat with us
            </span>
          )}
        </motion.button>
      </motion.div>
    );
  }

  // Atheros Part-4 desktop split-consultation shell. Mounted only when
  // the flag is active for this visitor and the viewport is >= 1024 px.
  // Flag off or smaller viewport falls through to the legacy floating
  // widget below. Zero bytes in the initial bundle (dynamic import).
  if (isDesktop && atherosActive) {
    const atherosInitial: ChatColumnMessage[] = messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    }));
    // The shell stays mounted across open/close so chat state persists.
    // AnimatePresence inside the shell handles entrance/exit; body scroll
    // lock + focus trap only fire while `open` is true. The trigger button
    // is only rendered when closed.
    return (
      <>
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Atheros"
            className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--aci-secondary,#0A1628)] px-4 py-2.5 text-sm font-semibold text-white shadow-2xl transition hover:bg-[var(--aci-primary,#0052CC)]"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            <span>Ask Atheros</span>
            <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-[var(--aci-lime,#C4FF61)]" aria-hidden />
          </button>
        )}
        <ConsultationShell
          sessionId={sessionId}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          initialMessages={atherosInitial}
          pageContext={{
            path: typeof window !== 'undefined' ? window.location.pathname : pageContext.path,
            entryPage,
            cluster: undefined,
          }}
          leadState={leadInfo as Record<string, unknown>}
        />
      </>
    );
  }

  // Atheros Part-5 mobile pill. Mounted only when the flag is active
  // for this visitor and the viewport is < 1024 px. Three-state machine
  // (pill / converse / peek) lives inside MobilePill; the legacy
  // widget is skipped entirely on mobile when the flag is active.
  if (!isDesktop && atherosActive) {
    const atherosInitial: ChatColumnMessage[] = messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    }));
    return (
      <MobilePill
        sessionId={sessionId}
        initialMessages={atherosInitial}
        leadState={leadInfo as Record<string, unknown>}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 overflow-hidden ${
        isMinimized ? 'w-80 h-14' : 'w-[380px] h-[550px] max-h-[80vh]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#0052CC] to-[#003D99] text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">ACI Assistant</h3>
            {!isMinimized && (
              <div className="flex items-center gap-1 text-[10px] text-blue-100">
                <span className="w-1.5 h-1.5 bg-[#C4FF61] rounded-full animate-pulse" />
                Online now
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Lead captured indicator */}
            {leadSaved && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-3 py-2 bg-[#C4FF61]/20 border-b border-[#C4FF61]/30 flex items-center gap-2 text-gray-700 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Thanks! Our team will reach out soon.</span>
              </motion.div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message, index) => (
                <div key={message.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-gray-100'
                          : 'bg-gradient-to-br from-[#0052CC] to-[#003D99]'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-4 h-4 text-gray-600" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] p-3 text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'bg-[#0052CC] text-white rounded-2xl rounded-br-md'
                          : 'bg-gray-50 text-gray-800 rounded-2xl rounded-bl-md border border-gray-100'
                      }`}
                    >
                      <MessageRenderer content={message.content} isUser={message.role === 'user'} />
                    </div>
                  </motion.div>

                  {/* Quick replies after assistant messages */}
                  {message.role === 'assistant' &&
                    message.showQuickReplies !== false &&
                    index === messages.length - 1 &&
                    !isLoading && (
                      showTimeSlots ? (
                        <TimeSlotSuggestions
                          onSelect={handleSend}
                          disabled={isLoading}
                        />
                      ) : (
                        <QuickReplies
                          stage={stage}
                          onSelect={handleSend}
                          leadInfo={leadInfo}
                          pageContext={pageContext}
                          disabled={isLoading}
                        />
                      )
                    )}
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#0052CC] to-[#003D99]">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl rounded-bl-md border border-gray-100">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={getPlaceholder()}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052CC]/50 focus:border-[#0052CC] text-sm bg-gray-50"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 bg-[#0052CC] text-white rounded-xl hover:bg-[#003D99] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 text-center">
                Powered by AI • <a href="/contact" className="underline hover:text-[#0052CC]">Talk to a human</a>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

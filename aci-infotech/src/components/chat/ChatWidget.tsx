'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, CheckCircle2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageRenderer from './MessageRenderer';
import QuickReplies, { type ConversationStage, TimeSlotSuggestions } from './QuickReplies';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  showQuickReplies?: boolean;
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
};

// Session timeout in milliseconds (24 hours)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: "Hi! I'm the ACI Assistant. I help connect businesses with the right **data**, **AI**, and **cloud** solutions.\n\nWhat brings you here today?",
  timestamp: new Date(),
  showQuickReplies: true,
};

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONSUMER_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'mail.com', 'protonmail.com'];

function isWorkEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? !CONSUMER_EMAIL_DOMAINS.includes(domain) : false;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({});
  const [stage, setStage] = useState<ConversationStage>('greeting');
  const [leadSaved, setLeadSaved] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialized = useRef(false);

  // Initialize session and restore state from localStorage
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    try {
      const storedLastActivity = localStorage.getItem(STORAGE_KEYS.lastActivity);
      const lastActivity = storedLastActivity ? parseInt(storedLastActivity, 10) : 0;
      const isExpired = Date.now() - lastActivity > SESSION_TIMEOUT;

      if (isExpired) {
        // Clear old session
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
        const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(newSessionId);
        localStorage.setItem(STORAGE_KEYS.sessionId, newSessionId);
      } else {
        // Restore session
        const storedSessionId = localStorage.getItem(STORAGE_KEYS.sessionId);
        const storedMessages = localStorage.getItem(STORAGE_KEYS.messages);
        const storedLeadInfo = localStorage.getItem(STORAGE_KEYS.leadInfo);
        const storedStage = localStorage.getItem(STORAGE_KEYS.stage);

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
        }

        if (storedLeadInfo) {
          setLeadInfo(JSON.parse(storedLeadInfo));
        }

        if (storedStage) {
          setStage(storedStage as ConversationStage);
        }
      }

      // Update last activity
      localStorage.setItem(STORAGE_KEYS.lastActivity, Date.now().toString());
    } catch (error) {
      console.error('Failed to restore chat state:', error);
      const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
    }
  }, []);

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
        }),
      });

      if (response.ok) {
        setLeadSaved(true);
      }
    } catch (error) {
      console.error('Failed to save lead:', error);
    }
  }, [sessionId, leadSaved]);

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
        followUp = "I'd love to set that up! First, who do I have the pleasure of speaking with?";
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
          followUp = "No problem! Your name just helps me personalize our chat. You can share it anytime, or we can continue exploring how we can help.";
          nextStage = 'general_chat';
          shouldCallAI = false;
        } else if (userMessage.length > 1 && userMessage.length < 50 && !userMessage.includes('@')) {
          updatedLead.name = userMessage.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          nextStage = 'collecting_email';
          followUp = `Great to meet you, ${updatedLead.name}! What's the best **work email** to reach you? This helps us send relevant resources and connect you with the right specialist.`;
          shouldCallAI = false;
        } else {
          followUp = "I'd love to know who I'm chatting with. What's your name?";
          shouldCallAI = false;
        }
        break;

      case 'collecting_email':
        if (messageLower.includes('skip') || messageLower.includes('prefer') || messageLower.includes('call first')) {
          nextStage = 'scheduling';
          followUp = "Sure thing! When works best for a quick call? Our architects are available most mornings and afternoons.";
          shouldCallAI = false;
          setShowTimeSlots(true);
        } else if (updatedLead.email) {
          if (!isWorkEmail(updatedLead.email)) {
            followUp = `Thanks! For the best experience with our enterprise team, could you share your **work email**? We'll keep your info secure and only send relevant content.`;
            updatedLead.email = undefined; // Clear the consumer email
            shouldCallAI = false;
          } else {
            nextStage = 'collecting_company';
            followUp = "Perfect! And which company are you with?";
            shouldCallAI = false;
          }
        } else if (messageLower.includes('why')) {
          followUp = "Great question! Your email helps us:\n- Send you relevant case studies and resources\n- Connect you with a specialist in your area\n- Keep track of our conversation\n\nWe never spam - just helpful content!";
          shouldCallAI = false;
        } else {
          followUp = "I didn't catch that. Could you share your work email? It helps us connect you with the right team.";
          shouldCallAI = false;
        }
        break;

      case 'collecting_company':
        if (messageLower.includes('skip')) {
          nextStage = 'collecting_job_title';
          followUp = "No worries! What's your role? This helps me understand how we can best support you.";
          shouldCallAI = false;
        } else if (userMessage.length > 1 && userMessage.length < 100) {
          updatedLead.company = userMessage;
          nextStage = 'collecting_job_title';
          followUp = `${updatedLead.company} - got it! What's your role there? This helps me connect you with the right specialist.`;
          shouldCallAI = false;
        } else {
          followUp = "What company or organization are you with?";
          shouldCallAI = false;
        }
        break;

      case 'collecting_job_title':
        if (messageLower.includes('skip')) {
          nextStage = 'collecting_location';
          followUp = "No problem! Last question - where are you based? We have teams across the US and globally.";
          shouldCallAI = false;
        } else if (userMessage.length > 1 && userMessage.length < 100) {
          updatedLead.jobTitle = userMessage;
          nextStage = 'collecting_location';
          followUp = `${updatedLead.jobTitle} - excellent! Where are you based? We have teams across the US and globally.`;
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
            followUp = `Great! I'll note that down. To send you a calendar invite, what's your work email?`;
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
          }),
        });

        const data = await response.json();
        assistantContent = data.message || "I apologize, but I'm having trouble responding. Please try again or [contact us directly](/contact).";

        // If in discovery, prompt for info naturally
        if (nextStage === 'collecting_name' && !followUp) {
          assistantContent += "\n\nBy the way, I'd love to personalize our chat. What's your name?";
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
        content: "I apologize, but I'm having trouble connecting. Please try again or [reach out to us directly](/contact).",
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

  // Closed state - floating button
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#0052CC] text-white p-4 rounded-full shadow-lg hover:bg-[#003D99] transition-colors group"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C4FF61] rounded-full border-2 border-white animate-pulse" />
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          Chat with us
        </span>
      </motion.button>
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

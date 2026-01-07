'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, CheckCircle2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface LeadInfo {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  jobTitle?: string;
  serviceInterest?: string;
  requirements?: string;
}

type ConversationStage =
  | 'greeting'
  | 'discovery'
  | 'collecting_name'
  | 'collecting_email'
  | 'collecting_company'
  | 'qualified'
  | 'general_chat';

const INITIAL_MESSAGE: Message = {
  id: '0',
  role: 'assistant',
  content: "Hi! I'm the ACI Infotech assistant. I'm here to help you explore our AI, data, and cloud solutions. What brings you here today?",
  timestamp: new Date(),
};

const SUGGESTED_QUESTIONS = [
  "I need help with data engineering",
  "Tell me about AI/ML solutions",
  "I'm looking for cloud modernization",
  "What industries do you work with?",
];

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({});
  const [stage, setStage] = useState<ConversationStage>('greeting');
  const [leadSaved, setLeadSaved] = useState(false);
  const [sessionId] = useState(() => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    // Extract phone if present (basic pattern)
    const phoneMatch = userMessage.match(/(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/);
    if (phoneMatch) {
      updatedLead.phone = phoneMatch[0];
    }

    // Detect service interest
    const messageLower = userMessage.toLowerCase();
    if (messageLower.includes('data') || messageLower.includes('analytics') || messageLower.includes('warehouse')) {
      updatedLead.serviceInterest = 'Data Engineering';
    } else if (messageLower.includes('ai') || messageLower.includes('ml') || messageLower.includes('machine learning') || messageLower.includes('artificial')) {
      updatedLead.serviceInterest = 'Applied AI & ML';
    } else if (messageLower.includes('cloud') || messageLower.includes('aws') || messageLower.includes('azure')) {
      updatedLead.serviceInterest = 'Cloud Modernization';
    } else if (messageLower.includes('marketing') || messageLower.includes('cdp') || messageLower.includes('customer')) {
      updatedLead.serviceInterest = 'MarTech & CDP';
    } else if (messageLower.includes('security') || messageLower.includes('cyber')) {
      updatedLead.serviceInterest = 'Cyber Security';
    } else if (messageLower.includes('transform') || messageLower.includes('automat')) {
      updatedLead.serviceInterest = 'Digital Transformation';
    }

    // Stage-based logic
    switch (currentStage) {
      case 'greeting':
        // After first substantive question, move to discovery
        if (userMessage.length > 10) {
          nextStage = 'discovery';
        }
        break;

      case 'discovery':
        // After a few exchanges, start collecting info
        nextStage = 'collecting_name';
        shouldCallAI = true;
        break;

      case 'collecting_name':
        // Try to extract name from response
        if (userMessage.length > 1 && userMessage.length < 50 && !userMessage.includes('@')) {
          // Likely a name
          updatedLead.name = userMessage.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          nextStage = 'collecting_email';
          followUp = `Nice to meet you, ${updatedLead.name}! What's the best email to reach you at? I can have our team send you relevant resources.`;
          shouldCallAI = false;
        } else {
          followUp = "I'd love to personalize our conversation. What's your name?";
          shouldCallAI = false;
        }
        break;

      case 'collecting_email':
        if (updatedLead.email) {
          nextStage = 'collecting_company';
          followUp = "Great! And which company are you with?";
          shouldCallAI = false;
        } else if (messageLower.includes('no') || messageLower.includes("don't") || messageLower.includes('skip')) {
          nextStage = 'general_chat';
          followUp = "No problem! Feel free to ask me anything about our services, or let me know if you'd like to speak with our team.";
          shouldCallAI = false;
        } else {
          followUp = "I didn't catch a valid email. Could you share your work email? We promise not to spam - just helpful resources!";
          shouldCallAI = false;
        }
        break;

      case 'collecting_company':
        if (userMessage.length > 1 && userMessage.length < 100) {
          updatedLead.company = userMessage;
          nextStage = 'qualified';
          shouldCallAI = true;
        } else {
          followUp = "What company or organization are you with?";
          shouldCallAI = false;
        }
        break;

      case 'qualified':
      case 'general_chat':
        // Continue with AI responses
        shouldCallAI = true;
        break;
    }

    return { followUp, nextStage, updatedLead, shouldCallAI };
  }, []);

  async function handleSend(content?: string) {
    const messageContent = content || input.trim();
    if (!messageContent || isLoading) return;

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
      // Process the response to determine next action
      const { followUp, nextStage, updatedLead, shouldCallAI } = processResponse(messageContent, stage, leadInfo);

      setLeadInfo(updatedLead);
      setStage(nextStage);

      let assistantContent: string;

      if (followUp && !shouldCallAI) {
        // Use the follow-up directly without calling AI
        assistantContent = followUp;
      } else {
        // Call AI for response
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
        assistantContent = data.message || "I apologize, but I'm having trouble responding. Please try again or contact us directly.";

        // If we're in discovery stage and AI responded, prompt for info
        if (nextStage === 'collecting_name' && !followUp) {
          assistantContent += "\n\nBy the way, I'd love to personalize our conversation. What's your name?";
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
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
        content: "I apologize, but I'm having trouble connecting. Please try again or reach out to us at info@aciinfotech.com",
        timestamp: new Date(),
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

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[var(--aci-primary)] text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 group"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with us!
        </span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
        isMinimized ? 'w-80 h-14' : 'w-96 h-[600px] max-h-[80vh]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[var(--aci-primary)] to-blue-700 text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">ACI Assistant</h3>
            {!isMinimized && (
              <div className="flex items-center gap-1 text-xs text-blue-100">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Online now
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Lead captured indicator */}
          {leadSaved && (
            <div className="px-4 py-2 bg-green-50 border-b border-green-100 flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thanks! Our team will reach out soon.</span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-gray-200'
                      : 'bg-gradient-to-br from-[var(--aci-primary)] to-blue-700'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-[var(--aci-primary)] text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--aci-primary)] to-blue-700">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions - only show at start */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">I can help with:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSend(question)}
                    className="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[var(--aci-primary)] rounded-full transition-colors border border-blue-100"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  stage === 'collecting_name' ? "Your name..." :
                  stage === 'collecting_email' ? "your@email.com" :
                  stage === 'collecting_company' ? "Company name..." :
                  "Type a message..."
                }
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-[var(--aci-primary)] text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Powered by AI • <a href="/contact" className="underline hover:text-[var(--aci-primary)]">Talk to a human</a>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

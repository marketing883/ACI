'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import MessageRenderer from '@/components/chat/MessageRenderer';
import ActionChips from './ActionChips';
import InlineField from './InlineField';
import CitationPill from './CitationPill';
import { streamAtherosReply } from '@/lib/copilot/clientStream';
import { resolveWelcome } from '@/lib/copilot/welcome';
import { subscribeAdminLive } from '@/lib/copilot/realtime';
import type {
  OfferActionButtonsArgs,
  RequestFieldArgs,
  CiteSourceArgs,
  ShowContentPanelArgs,
  QualifyLeadArgs,
} from '@/lib/copilot/tools';
import { log } from '@/lib/copilot/logger';

export interface ChatColumnMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thought?: string;
  citations?: CiteSourceArgs[];
  actionButtons?: OfferActionButtonsArgs['buttons'];
  requestField?: RequestFieldArgs;
  isStreaming?: boolean;
}

export interface ChatColumnProps {
  sessionId: string;
  initialMessages: ChatColumnMessage[];
  pageContext: Record<string, unknown>;
  leadState: Record<string, unknown>;
  onPanelRequest: (panel: ShowContentPanelArgs) => void;
  onLeadCaptured?: (fields: QualifyLeadArgs) => void;
  onClose?: () => void;
  /** Optional pill contextual copy rendered at the top of the chat column. */
  subtitle?: string;
}

/** localStorage key for thread persistence. Versioned so a future schema bump can be hard-rolled. */
const THREAD_KEY_PREFIX = 'atheros_thread_v1_';
/** Hard cap on persisted thread length to bound localStorage growth. */
const MAX_PERSISTED = 50;
/** Match the legacy widget's 24h session timeout. */
const THREAD_TTL_MS = 24 * 60 * 60 * 1000;

interface PersistedThread {
  savedAt: number;
  messages: ChatColumnMessage[];
}

function buildWelcomeMessage(pathname: string | null): ChatColumnMessage {
  const w = resolveWelcome(pathname);
  return { id: 'welcome', role: 'assistant', content: w.text };
}

function humanizeSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bMl\b/g, 'ML')
    .replace(/\bAws\b/g, 'AWS')
    .replace(/\bSap\b/g, 'SAP')
    .replace(/\bApi\b/g, 'API')
    .replace(/\bErp\b/g, 'ERP')
    .replace(/\bCdp\b/g, 'CDP')
    .replace(/\bMartech\b/g, 'MarTech');
}

/**
 * Contextual fallback for turns where the model fired a panel but emitted
 * no prose. Varies per panel type and entity name so the bubble never
 * looks like a stock response. Used by the onDone handler when content
 * is empty after streaming completes.
 */
function singlePanelFallback(panel: ShowContentPanelArgs): string {
  const name = humanizeSlug(panel.entityRef);
  switch (panel.panelType) {
    case 'diagram':
      return `${name} diagram is on the right. Which node do you want me to walk through first?`;
    case 'service':
      return `${name} page is up. What is the immediate need, cost, latency, or governance?`;
    case 'platform':
      return `${name} is on the right. Are you greenfield, or migrating from something specific?`;
    case 'industry':
      return `${name} patterns are up. Which one mirrors your situation most closely?`;
    case 'case':
      return `Pulled the case study. Want me to translate any part of it to your stack?`;
    case 'comparison':
      return `${name.replace(/-vs-/g, ' vs ')} comparison is up. Which row deserves the closer look?`;
    case 'playbook':
      return `Playbook is on the right. Which step is the sticky one for your team?`;
    case 'timeline':
      return `Timeline is up. Which phase are you closest to right now?`;
    case 'stats':
      return `The numbers are up. Anything stand out you want me to dig into?`;
    case 'resource':
      return `${name} is on the right. Want a quick map of what it covers before you commit to the read?`;
    default:
      return `${name} is on the right. Want me to walk through it?`;
  }
}

/**
 * Fallback when multiple panels fired in a single turn (typical for
 * compound queries like "Dynamics 365 for manufacturing" or "Databricks
 * in healthcare"). We pair the primary (platform / service) with the
 * secondary (industry) in one sentence + a focused follow-up question,
 * so the bubble is never the generic "industry patterns are up" line
 * when the user asked a compound question.
 */
function compoundPanelFallback(panels: readonly ShowContentPanelArgs[]): string {
  const platform = panels.find((p) => p.panelType === 'platform');
  const service = panels.find((p) => p.panelType === 'service');
  const industry = panels.find((p) => p.panelType === 'industry');
  const primary = platform ?? service;

  if (primary && industry) {
    const primaryName = humanizeSlug(primary.entityRef);
    const industryName = humanizeSlug(industry.entityRef);
    return `${primaryName} on the right, with the ${industryName} context alongside. Is the pain more on the platform side, or on the ${industryName.toLowerCase()} workflows?`;
  }
  if (platform && service) {
    return `${humanizeSlug(platform.entityRef)} and the ${humanizeSlug(service.entityRef)} service page are both up. Which one is closer to the immediate need?`;
  }
  // Two of the same type; fall back to the single-panel line on the first.
  return singlePanelFallback(panels[0]);
}

function buildPanelFallback(panels: readonly ShowContentPanelArgs[]): string {
  if (panels.length === 0) {
    return 'I pulled up the most relevant view on the right. Where do you want to start?';
  }
  if (panels.length === 1) return singlePanelFallback(panels[0]);
  return compoundPanelFallback(panels);
}

export default function ChatColumn({
  sessionId,
  initialMessages,
  pageContext,
  leadState,
  onPanelRequest,
  onLeadCaptured,
  onClose,
  subtitle,
}: ChatColumnProps) {
  const pathname = usePathname();
  // Server-safe initial state. The mount effect below either restores a
  // persisted thread or seeds with a page-aware welcome bubble.
  const [messages, setMessages] = useState<ChatColumnMessage[]>(initialMessages);
  const [status, setStatus] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Hydrate from localStorage on first mount; fall back to the welcome.
  // Keyed by sessionId so different visitors do not collide; pathname is
  // captured at mount so the welcome reflects the page the user actually
  // opened the chat on.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = `${THREAD_KEY_PREFIX}${sessionId}`;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedThread;
        const ageMs = Date.now() - (parsed.savedAt ?? 0);
        if (ageMs < THREAD_TTL_MS && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
          setMessages(parsed.messages);
          return;
        }
      }
    } catch {
      // copilot-allow-silent-catch: corrupted localStorage; fall through to seed welcome
    }
    if (initialMessages.length === 0) {
      setMessages([buildWelcomeMessage(pathname ?? null)]);
    }
    // Intentionally only run on sessionId change. We do NOT want a route
    // change to overwrite the user's running thread with a fresh welcome.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Persist on every messages change. Slice to bound storage size.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (messages.length === 0) return;
    const key = `${THREAD_KEY_PREFIX}${sessionId}`;
    try {
      const sliced = messages.slice(-MAX_PERSISTED);
      const payload: PersistedThread = { savedAt: Date.now(), messages: sliced };
      window.localStorage.setItem(key, JSON.stringify(payload));
    } catch {
      // copilot-allow-silent-catch: storage full or private mode
    }
  }, [messages, sessionId]);

  // Live takeover: subscribe to admin messages for this session. When an
  // admin claims the conversation and types a relay message, it lands in
  // chat_messages with role='admin'; we surface it as an amber bubble.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const off = subscribeAdminLive({
      onMessageInsert: (row) => {
        if ((row as { session_id?: string }).session_id !== sessionId) return;
        const role = (row as { role?: string }).role;
        if (role !== 'admin') return;
        const content = (row as { content?: string }).content ?? '';
        const messageId =
          (row as { message_id?: string }).message_id ?? `admin_${Date.now()}`;
        setMessages((m) => {
          if (m.some((x) => x.id === messageId)) return m;
          return [
            ...m,
            { id: messageId, role: 'assistant', content },
          ];
        });
      },
    });
    return off;
  }, [sessionId]);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, status]);

  const clearStatusSoon = useCallback(() => {
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatus(null), 2400);
  }, []);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || busy) return;
      setBusy(true);
      setStatus(null);
      const userMsg: ChatColumnMessage = {
        id: `u_${Date.now()}`,
        role: 'user',
        content: text.trim(),
      };
      const pendingAssistantId = `a_${Date.now()}`;
      setMessages((m) => [
        ...m,
        userMsg,
        { id: pendingAssistantId, role: 'assistant', content: '', isStreaming: true },
      ]);

      // Track tool-call state per-id so the streaming reply can accumulate
      // citations / action buttons / request_field for the current assistant turn.
      const activeCitations: CiteSourceArgs[] = [];
      let actionButtons: OfferActionButtonsArgs['buttons'] | undefined;
      let requestField: RequestFieldArgs | undefined;
      let thought: string | undefined;
      let panelOpened = false;
      // All panels fired in this turn, in the order the model emitted them.
      // Used to build compound fallbacks when the model skips prose on a
      // platform+industry (or service+industry) combo query.
      const firedPanels: ShowContentPanelArgs[] = [];

      const nextMessages = [...messages, userMsg].map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const result = await streamAtherosReply({
        sessionId,
        visitorId: sessionId,
        pageContext,
        leadState,
        messages: nextMessages,
        turnIndex: messages.length + 1,
        handlers: {
          onStatus: (text) => {
            setStatus(text);
            clearStatusSoon();
          },
          onThought: (text) => {
            thought = text;
            setMessages((m) =>
              m.map((msg) =>
                msg.id === pendingAssistantId ? { ...msg, thought } : msg,
              ),
            );
          },
          onToken: (delta) => {
            setMessages((m) =>
              m.map((msg) =>
                msg.id === pendingAssistantId
                  ? { ...msg, content: msg.content + delta }
                  : msg,
              ),
            );
          },
          onToolCallStart: (_id, name) => {
            setStatus(`Preparing ${name.replace(/_/g, ' ')}…`);
            clearStatusSoon();
          },
          onToolCallEnd: (id, name, resultKind, args) => {
            if (resultKind !== 'ok') {
              log.warn('panel', `tool ${name} returned error`, { extra: { id } });
              return;
            }
            // Route validated args from UI-only tools into the right surface.
            // The server has already Zod-validated; treat each shape as
            // trusted-but-unknown and narrow per tool.
            switch (name) {
              case 'show_content_panel': {
                const panel = args as ShowContentPanelArgs | undefined;
                if (panel?.panelType && panel.entityRef) {
                  onPanelRequest(panel);
                  panelOpened = true;
                  firedPanels.push(panel);
                }
                break;
              }
              case 'offer_action_buttons': {
                const payload = args as OfferActionButtonsArgs | undefined;
                if (payload?.buttons?.length) {
                  actionButtons = payload.buttons;
                }
                break;
              }
              case 'request_field': {
                const payload = args as RequestFieldArgs | undefined;
                if (payload?.fieldName) {
                  requestField = payload;
                }
                break;
              }
              case 'cite_source': {
                const cite = args as CiteSourceArgs | undefined;
                if (cite?.sourceType && cite.slug) {
                  activeCitations.push(cite);
                }
                break;
              }
              case 'qualify_lead': {
                const fields = args as QualifyLeadArgs | undefined;
                if (fields) onLeadCaptured?.(fields);
                break;
              }
              default:
                break;
            }
          },
          onDone: ({ streamIncomplete }) => {
            setMessages((m) =>
              m.map((msg) => {
                if (msg.id !== pendingAssistantId) return msg;
                let content = msg.content;
                if (!content || content.trim().length === 0) {
                  // Model fired tools but produced no prose. Surface a
                  // panel-aware fallback so the bubble is never the same
                  // generic line twice in a row.
                  if (streamIncomplete) {
                    content =
                      "I hit a snag. [Reach out](/contact) and we will keep going.";
                  } else if (panelOpened) {
                    content = buildPanelFallback(firedPanels);
                  } else {
                    content =
                      'One moment. Want to give me a bit more on what you are after?';
                  }
                }
                return {
                  ...msg,
                  isStreaming: false,
                  actionButtons,
                  requestField,
                  citations: activeCitations.length ? activeCitations : undefined,
                  content,
                };
              }),
            );
          },
        },
      });

      // v1 /api/chat fallback was removed when the legacy widget was
      // retired. If the flag is off or the endpoint is unavailable, we
      // surface an honest inline note so the bubble is never empty.
      if (result.status === 'not-enabled' || result.status === 'error') {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === pendingAssistantId
              ? {
                  ...msg,
                  content:
                    "Something is off on my end. [Reach out directly](/contact) and we will keep going.",
                  isStreaming: false,
                }
              : msg,
          ),
        );
      }

      setBusy(false);
      setStatus(null);
    },
    [busy, clearStatusSoon, leadState, messages, onLeadCaptured, onPanelRequest, pageContext, sessionId],
  );

  const onChip = useCallback(
    (value: string, label: string) => {
      void send(`${label} (${value})`);
    },
    [send],
  );

  const renderedMessages = useMemo(() => messages, [messages]);

  return (
    <div className="flex h-full flex-col bg-white/92 backdrop-blur">
      <header className="flex items-center justify-between border-b border-gray-200/70 px-5 py-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--aci-primary,#0052CC)]">
            Atheros
          </div>
          {subtitle ? (
            <div className="text-xs text-gray-500">{subtitle}</div>
          ) : null}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Atheros"
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </header>
      <div ref={messagesRef} className="flex-1 overflow-y-auto px-5 py-4">
        {renderedMessages.map((m) => (
          <div key={m.id} className={`mb-3 ${m.role === 'user' ? 'flex justify-end' : ''}`}>
            {m.thought ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55 }}
                transition={{ duration: 0.2 }}
                className="mb-1 text-[11px] italic text-gray-500"
              >
                ~ {m.thought}
              </motion.div>
            ) : null}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[color:var(--aci-primary,#0052CC)] text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {m.role === 'assistant' ? (
                <MessageRenderer content={m.content} />
              ) : (
                <span>{m.content}</span>
              )}
            </div>
            {m.citations && m.citations.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {m.citations.map((c, i) => (
                  <CitationPill key={i} citation={c} />
                ))}
              </div>
            )}
            {m.actionButtons && (
              <ActionChips buttons={m.actionButtons} onSelect={onChip} />
            )}
            {m.requestField && (
              <InlineField
                field={m.requestField}
                autoFocus
                onSubmit={(value) => {
                  void send(value);
                }}
              />
            )}
          </div>
        ))}
        {status && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            className="mb-2 text-[11px] italic text-gray-500"
          >
            {status}
          </motion.div>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = input;
          setInput('');
          void send(v);
        }}
        className="border-t border-gray-200/70 px-5 py-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const v = input;
                setInput('');
                void send(v);
              }
            }}
            rows={1}
            placeholder="Ask Atheros anything about ACI"
            className="flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[color:var(--aci-primary,#0052CC)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || busy}
            aria-label="Send"
            className="rounded-full bg-[color:var(--aci-primary,#0052CC)] p-2 text-white disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

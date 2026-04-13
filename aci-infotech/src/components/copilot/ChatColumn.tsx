'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X } from 'lucide-react';
import MessageRenderer from '@/components/chat/MessageRenderer';
import ActionChips from './ActionChips';
import InlineField from './InlineField';
import CitationPill from './CitationPill';
import { streamAtherosReply } from '@/lib/copilot/clientStream';
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
  const [messages, setMessages] = useState<ChatColumnMessage[]>(initialMessages);
  const [status, setStatus] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
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
          onToolCallEnd: (id, name, resultKind) => {
            // We do not receive the parsed tool args from the SSE end frame;
            // the server has already validated, executed, and persisted them.
            // For UI-only tools, we rely on the route emitting a follow-up
            // status; for now, we surface the call itself so the UX reflects
            // the server event stream.
            if (resultKind !== 'ok') {
              log.warn('panel', `tool ${name} returned error`, { extra: { id } });
            }
          },
          onDone: ({ streamIncomplete }) => {
            setMessages((m) =>
              m.map((msg) =>
                msg.id === pendingAssistantId
                  ? {
                      ...msg,
                      isStreaming: false,
                      actionButtons,
                      requestField,
                      citations: activeCitations.length ? activeCitations : undefined,
                      content: msg.content || (streamIncomplete
                        ? "I hit a snag. [Reach out](/contact) and we'll keep going."
                        : msg.content),
                    }
                  : msg,
              ),
            );
          },
        },
      });

      // When flag is off or the endpoint returns 404, fall back to the
      // legacy /api/chat so the dark launch never regresses.
      if (result.status === 'not-enabled') {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: nextMessages,
            pageContext,
            leadInfo: leadState,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        setMessages((m) =>
          m.map((msg) =>
            msg.id === pendingAssistantId
              ? {
                  ...msg,
                  content:
                    data.message ??
                    "I'm not on this route right now. [Reach out](/contact) and we'll continue.",
                  isStreaming: false,
                }
              : msg,
          ),
        );
      }

      // Route panel / chip / field payloads from the SSE tool echo. The
      // server-side route delivers tool_args in chat_messages; for Part-4
      // we derive UI-only tool calls from a companion parallel channel.
      // (The edge route echoes tool args inside `argsPreview` on tool_call_start
      // in a future extension; for now, this signal lives purely in the
      // persisted chat_messages row for admin replay in Part 6.)
      void onPanelRequest;
      void onLeadCaptured;
      void actionButtons;
      void requestField;

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

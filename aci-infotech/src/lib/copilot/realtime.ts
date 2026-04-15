/**
 * Atheros admin Realtime helper.
 *
 * Thin wrapper over Supabase Realtime that subscribes the admin live
 * view to inserts/updates on chat_sessions, chat_messages, and
 * chat_errors. Used by /admin/copilot/live and /admin/copilot/errors.
 *
 * Browser-only. No server-side calls.
 *
 * Cross-browser note: iOS Safari throws "The operation is insecure"
 * from `new WebSocket(...)` under Intelligent Tracking Prevention,
 * private browsing, or when cross-site storage is partitioned. That
 * throw propagates out of @supabase/realtime-js's `connect()` as
 * "WebSocket not available: <reason>" and would take down any
 * component that called `subscribeAdminLive`. We wrap every socket-
 * opening call in try/catch so a failed subscription silently no-ops
 * instead of crashing the chat widget. Admin live-takeover is a
 * nice-to-have on visitor-facing chat; losing it is fine, a whole-
 * widget crash is not.
 */

'use client';

import { createClient, type RealtimeChannel } from '@supabase/supabase-js';
import { log } from './logger';

let cachedClient: ReturnType<typeof createClient> | null = null;

function getRealtimeClient() {
  if (cachedClient) return cachedClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  try {
    cachedClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { params: { eventsPerSecond: 10 } },
    });
  } catch (err) {
    // Safari can throw during client init if storage access is
    // restricted. Log and fall through; callers already handle null.
    log.warn('other', err, { extra: { phase: 'realtime-client-init' } });
    return null;
  }
  return cachedClient;
}

export interface ChannelHandlers {
  onSessionUpsert?: (row: Record<string, unknown>) => void;
  onMessageInsert?: (row: Record<string, unknown>) => void;
  onErrorInsert?: (row: Record<string, unknown>) => void;
}

/**
 * Attempt to open a single Realtime channel. Returns the channel on
 * success, null on any failure. Each branch is independently wrapped
 * so a WebSocket failure (iOS Safari ITP, private browsing, etc.)
 * takes down only that channel, not the whole subscription setup.
 */
function safeSubscribe(
  build: () => RealtimeChannel,
  channelName: string,
): RealtimeChannel | null {
  try {
    return build();
  } catch (err) {
    log.warn('other', err, {
      extra: { phase: 'realtime-subscribe', channel: channelName },
    });
    return null;
  }
}

/**
 * Subscribe to admin live events. Returns an unsubscribe function the
 * caller MUST invoke on unmount. Never throws, even if the underlying
 * WebSocket cannot be opened (iOS Safari ITP / private browsing).
 */
export function subscribeAdminLive(handlers: ChannelHandlers): () => void {
  let client: ReturnType<typeof getRealtimeClient> = null;
  try {
    client = getRealtimeClient();
  } catch (err) {
    log.warn('other', err, { extra: { phase: 'realtime-get-client' } });
    return () => undefined;
  }
  if (!client) return () => undefined;

  const channels: RealtimeChannel[] = [];
  const safeClient = client;

  if (handlers.onSessionUpsert) {
    const ch = safeSubscribe(
      () =>
        safeClient
          .channel('atheros:admin:sessions')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'chat_sessions' },
            (payload) => {
              const row = (payload.new ?? payload.old) as
                | Record<string, unknown>
                | null;
              if (row) handlers.onSessionUpsert?.(row);
            },
          )
          .subscribe(),
      'atheros:admin:sessions',
    );
    if (ch) channels.push(ch);
  }

  if (handlers.onMessageInsert) {
    const ch = safeSubscribe(
      () =>
        safeClient
          .channel('atheros:admin:messages')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'chat_messages' },
            (payload) => {
              if (payload.new)
                handlers.onMessageInsert?.(
                  payload.new as Record<string, unknown>,
                );
            },
          )
          .subscribe(),
      'atheros:admin:messages',
    );
    if (ch) channels.push(ch);
  }

  if (handlers.onErrorInsert) {
    const ch = safeSubscribe(
      () =>
        safeClient
          .channel('atheros:admin:errors')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'chat_errors' },
            (payload) => {
              if (payload.new)
                handlers.onErrorInsert?.(
                  payload.new as Record<string, unknown>,
                );
            },
          )
          .subscribe(),
      'atheros:admin:errors',
    );
    if (ch) channels.push(ch);
  }

  return () => {
    for (const ch of channels) {
      try {
        void safeClient.removeChannel(ch);
      } catch (err) {
        log.warn('other', err, {
          extra: { phase: 'realtime-remove-channel' },
        });
      }
    }
  };
}

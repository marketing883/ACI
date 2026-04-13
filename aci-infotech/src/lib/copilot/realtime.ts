/**
 * Atheros admin Realtime helper.
 *
 * Thin wrapper over Supabase Realtime that subscribes the admin live
 * view to inserts/updates on chat_sessions, chat_messages, and
 * chat_errors. Used by /admin/copilot/live and /admin/copilot/errors.
 *
 * Browser-only. No server-side calls.
 */

'use client';

import { createClient, type RealtimeChannel } from '@supabase/supabase-js';

let cachedClient: ReturnType<typeof createClient> | null = null;

function getRealtimeClient() {
  if (cachedClient) return cachedClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  cachedClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { params: { eventsPerSecond: 10 } },
  });
  return cachedClient;
}

export interface ChannelHandlers {
  onSessionUpsert?: (row: Record<string, unknown>) => void;
  onMessageInsert?: (row: Record<string, unknown>) => void;
  onErrorInsert?: (row: Record<string, unknown>) => void;
}

/**
 * Subscribe to admin live events. Returns an unsubscribe function the
 * caller MUST invoke on unmount.
 */
export function subscribeAdminLive(handlers: ChannelHandlers): () => void {
  const client = getRealtimeClient();
  if (!client) return () => undefined;

  const channels: RealtimeChannel[] = [];

  if (handlers.onSessionUpsert) {
    const ch = client
      .channel('atheros:admin:sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_sessions' },
        (payload) => {
          const row = (payload.new ?? payload.old) as Record<string, unknown> | null;
          if (row) handlers.onSessionUpsert?.(row);
        },
      )
      .subscribe();
    channels.push(ch);
  }

  if (handlers.onMessageInsert) {
    const ch = client
      .channel('atheros:admin:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          if (payload.new) handlers.onMessageInsert?.(payload.new as Record<string, unknown>);
        },
      )
      .subscribe();
    channels.push(ch);
  }

  if (handlers.onErrorInsert) {
    const ch = client
      .channel('atheros:admin:errors')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_errors' },
        (payload) => {
          if (payload.new) handlers.onErrorInsert?.(payload.new as Record<string, unknown>);
        },
      )
      .subscribe();
    channels.push(ch);
  }

  return () => {
    for (const ch of channels) {
      void client.removeChannel(ch);
    }
  };
}

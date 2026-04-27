'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, X } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

interface HotLeadAlert {
  id: string;
  company: string | null;
  leadScore: number;
  timestamp: string;
}

/**
 * Subscribes to chat_leads INSERT events via Supabase real-time. When a
 * new row arrives with lead_score >= 70 OR intent = 'high', shows a
 * toast notification in the bottom-right. Auto-dismisses after 15
 * seconds. Mount this in the admin layout.
 */
export default function HotLeadToast() {
  const [alerts, setAlerts] = useState<HotLeadAlert[]>([]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel('hot-lead-alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_leads',
        },
        (payload: { new: Record<string, unknown> }) => {
          const row = payload.new;
          const score = typeof row.lead_score === 'number' ? row.lead_score : 0;
          const intent = typeof row.intent === 'string' ? row.intent : '';
          if (score < 70 && intent !== 'high') return;

          const alert: HotLeadAlert = {
            id: (row.id as string) ?? crypto.randomUUID(),
            company: (row.company as string) ?? null,
            leadScore: score,
            timestamp: new Date().toISOString(),
          };
          setAlerts((prev) => [alert, ...prev].slice(0, 5));

          // Auto-dismiss after 15 seconds.
          setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
          }, 15_000);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-white rounded-xl border border-orange-200 shadow-2xl p-4 flex items-start gap-3 animate-in slide-in-from-right duration-300"
        >
          <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-900">
              Hot lead — score {alert.leadScore}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {alert.company || 'Unknown company'}
            </div>
            <Link
              href="/admin/analytics/drill-down?type=leads&band=hot&since=24h"
              className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
            >
              View hot leads
            </Link>
          </div>
          <button
            type="button"
            onClick={() =>
              setAlerts((prev) => prev.filter((a) => a.id !== alert.id))
            }
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

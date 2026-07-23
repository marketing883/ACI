'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Download,
  Users,
  Ticket,
  Mail,
  Building2,
  Loader2,
  Trophy,
  Trash2,
  Clock,
  Phone,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

interface EventLead {
  id: string;
  created_at: string;
  event_slug: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string;
  job_title: string;
  pain_points: string[];
  pain_point_other: string | null;
  journey_stage: 'exploring' | 'piloting' | 'scaling' | 'optimizing' | null;
  team_challenges?: string | null;
  reporting_challenges?: string | null;
  ai_ml_exploration?: string | null;
  ai_adoption_challenge?: string | null;
  wants_expert_meeting: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  status: string;
}

const STATUSES = ['new', 'contacted', 'attended', 'qualified', 'converted', 'lost'];

const STAGE_LABELS: Record<string, string> = {
  exploring: 'Exploring',
  piloting: 'Piloting',
  scaling: 'Scaling',
  optimizing: 'Optimizing',
};

// Short labels for the four open discovery questions on the LP form.
const DISCOVERY_FIELDS = [
  { key: 'team_challenges', label: 'Team challenges' },
  { key: 'reporting_challenges', label: 'Reporting/analytics' },
  { key: 'ai_ml_exploration', label: 'AI/ML exploration' },
  { key: 'ai_adoption_challenge', label: 'AI adoption blocker' },
] as const;

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-violet-50 text-violet-700 border-violet-200',
  attended: 'bg-amber-50 text-amber-700 border-amber-200',
  qualified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  converted: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  lost: 'bg-gray-100 text-gray-500 border-gray-200',
};

// Demo rows so the page renders before Supabase is wired up.
const mockLeads: EventLead[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    event_slug: 'digital-trust-summit-2026',
    full_name: 'Ananya Rao',
    email: 'ananya.rao@fintechbank.com',
    phone: '+91 98765 43210',
    company_name: 'FinTech Bank',
    job_title: 'CISO',
    pain_points: ['Cybersecurity and digital trust', 'AI risk and compliance'],
    pain_point_other: null,
    journey_stage: 'scaling',
    wants_expert_meeting: true,
    utm_source: 'linkedin',
    utm_medium: 'social',
    utm_campaign: 'aion-2026',
    status: 'new',
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    event_slug: 'digital-trust-summit-2026',
    full_name: 'Vikram Shah',
    email: 'vikram@retailco.in',
    phone: '+91 90000 11111',
    company_name: 'RetailCo',
    job_title: 'VP Engineering',
    pain_points: ['Scaling AI beyond pilots'],
    pain_point_other: null,
    journey_stage: 'piloting',
    wants_expert_meeting: false,
    utm_source: 'email',
    utm_medium: 'newsletter',
    utm_campaign: 'aion-2026',
    status: 'contacted',
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function EventLeadsPage() {
  const [leads, setLeads] = useState<EventLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [meetingOnly, setMeetingOnly] = useState(false);

  useEffect(() => {
    const isConfigured = isSupabaseConfigured();
    setConfigured(isConfigured);
    if (isConfigured) {
      fetchLeads();
    } else {
      setLeads(mockLeads);
      setLoading(false);
    }
  }, []);

  async function fetchLeads() {
    try {
      // Service-role server route: the browser anon client is RLS-denied.
      const res = await fetch('/api/admin/event-leads');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to load registrations');
      setLeads(json.demo ? mockLeads : json.leads || []);
    } catch (error) {
      console.error('Error fetching event registrations:', error);
      setLeads(mockLeads);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const previous = leads;
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    if (!configured) return;
    try {
      const res = await fetch('/api/admin/event-leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed to update');
    } catch (error) {
      console.error('Error updating status:', error);
      setLeads(previous);
    }
  }

  async function deleteLead(id: string) {
    if (!confirm('Delete this registration? This cannot be undone.')) return;
    const previous = leads;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (!configured) return;
    try {
      const res = await fetch(`/api/admin/event-leads?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
    } catch (error) {
      console.error('Error deleting registration:', error);
      setLeads(previous);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (stageFilter !== 'all' && l.journey_stage !== stageFilter) return false;
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (meetingOnly && !l.wants_expert_meeting) return false;
      if (!q) return true;
      return (
        l.full_name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.company_name.toLowerCase().includes(q) ||
        (l.job_title || '').toLowerCase().includes(q)
      );
    });
  }, [leads, search, stageFilter, statusFilter, meetingOnly]);

  const stats = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    return {
      total: leads.length,
      isNew: leads.filter((l) => l.status === 'new').length,
      meetings: leads.filter((l) => l.wants_expert_meeting).length,
      thisWeek: leads.filter((l) => new Date(l.created_at).getTime() >= weekAgo).length,
    };
  }, [leads]);

  function exportCsv() {
    const headers = [
      'Name', 'Email', 'Phone', 'Company', 'Designation', 'Journey stage',
      'Wants 1:1', 'Challenges', 'Other',
      'Team challenges', 'Reporting/analytics challenges', 'AI/ML exploration', 'AI adoption challenge',
      'UTM source', 'UTM campaign', 'Status', 'Registered',
    ];
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = filtered.map((l) => [
      l.full_name, l.email, l.phone || '', l.company_name, l.job_title,
      l.journey_stage ? STAGE_LABELS[l.journey_stage] : '',
      l.wants_expert_meeting ? 'Yes' : 'No',
      (l.pain_points || []).join('; '), l.pain_point_other || '',
      l.team_challenges || '', l.reporting_challenges || '',
      l.ai_ml_exploration || '', l.ai_adoption_challenge || '',
      l.utm_source || '', l.utm_campaign || '', l.status, l.created_at,
    ].map((v) => escape(v as string)).join(','));
    const csv = [headers.map(escape).join(','), ...rows].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `aion-2026-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const statCards = [
    { label: 'Registrations', value: stats.total, icon: Ticket, tint: 'bg-blue-50 text-blue-600' },
    { label: 'New', value: stats.isNew, icon: Users, tint: 'bg-violet-50 text-violet-600' },
    { label: 'Want a 1:1', value: stats.meetings, icon: Trophy, tint: 'bg-amber-50 text-amber-600' },
    { label: 'This week', value: stats.thisWeek, icon: Clock, tint: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Registrations</h1>
          <p className="mt-1 text-gray-500">
            National Digital Trust Summit, AION 2026. Every registration is a lead and a lucky
            draw entry.
          </p>
        </div>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0052CC] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#003d99]"
        >
          <Download className="h-4 w-4" />
          Export draw pool (CSV)
        </button>
      </div>

      {!configured && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Demo mode: showing sample registrations. Configure Supabase to see live entries.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${c.tint}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{loading ? '...' : c.value}</p>
              <p className="mt-1 text-sm text-gray-500">{c.label}</p>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, company..."
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-transparent focus:ring-2 focus:ring-[#0052CC]"
          />
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-[#0052CC]"
        >
          <option value="all">All stages</option>
          {Object.entries(STAGE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm capitalize text-gray-700 focus:ring-2 focus:ring-[#0052CC]"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={meetingOnly}
            onChange={(e) => setMeetingOnly(e.target.checked)}
            className="h-4 w-4 accent-[#0052CC]"
          />
          Wants a 1:1
        </label>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading registrations...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            {leads.length === 0 ? 'No registrations yet.' : 'No registrations match your filters.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50/60 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Attendee</th>
                  <th className="px-5 py-3 font-semibold">Company</th>
                  <th className="px-5 py-3 font-semibold">Challenges</th>
                  <th className="px-5 py-3 font-semibold">Stage</th>
                  <th className="px-5 py-3 font-semibold">Source</th>
                  <th className="px-5 py-3 font-semibold">Registered</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((l) => (
                  <tr key={l.id} className="align-top hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 font-medium text-gray-900">
                        {l.full_name}
                        {l.wants_expert_meeting && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                            <Trophy className="h-3 w-3" /> 1:1
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-gray-500">
                        <Mail className="h-3.5 w-3.5" />
                        <a href={`mailto:${l.email}`} className="hover:text-[#0052CC]">{l.email}</a>
                      </div>
                      {l.phone && (
                        <div className="mt-0.5 flex items-center gap-1.5 text-gray-400">
                          <Phone className="h-3.5 w-3.5" /> {l.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-gray-800">
                        <Building2 className="h-3.5 w-3.5 text-gray-400" /> {l.company_name}
                      </div>
                      <div className="mt-0.5 text-gray-500">{l.job_title}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex max-w-[240px] flex-wrap gap-1">
                        {(l.pain_points || []).map((p) => (
                          <span key={p} className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">
                            {p}
                          </span>
                        ))}
                      </div>
                      {l.pain_point_other && (
                        <p className="mt-1 max-w-[240px] text-[12px] italic text-gray-400">“{l.pain_point_other}”</p>
                      )}
                      {DISCOVERY_FIELDS.filter((f) => l[f.key]).map((f) => (
                        <p key={f.key} className="mt-1 max-w-[240px] text-[12px] text-gray-500">
                          <span className="font-medium text-gray-400">{f.label}:</span> {l[f.key]}
                        </p>
                      ))}
                    </td>
                    <td className="px-5 py-4">
                      {l.journey_stage ? (
                        <span className="rounded-full bg-[#0A1628]/5 px-2.5 py-1 text-xs font-medium text-[#0A1628]">
                          {STAGE_LABELS[l.journey_stage]}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {l.utm_source || <span className="text-gray-300">direct</span>}
                      {l.utm_campaign && <div className="text-[12px] text-gray-400">{l.utm_campaign}</div>}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-gray-500">{formatDate(l.created_at)}</td>
                    <td className="px-5 py-4">
                      <select
                        value={l.status}
                        onChange={(e) => updateStatus(l.id, e.target.value)}
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize outline-none ${
                          STATUS_STYLES[l.status] || 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-white text-gray-700">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => deleteLead(l.id)}
                        className="rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label="Delete registration"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400">
          Showing {filtered.length} of {leads.length} registrations.
        </p>
      )}
    </div>
  );
}

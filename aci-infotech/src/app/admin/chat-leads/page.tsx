'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  MessageSquare,
  Mail,
  Building2,
  MapPin,
  Briefcase,
  Clock,
  ExternalLink,
  Sparkles,
  Loader2,
  User,
  TrendingUp,
  Target,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Globe,
  Linkedin,
  FileText,
  Lightbulb,
  Shield,
  Download,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ChatLead {
  id: string;
  session_id: string;
  created_at: string;
  name: string | null;
  email: string;
  company: string | null;
  job_title: string | null;
  location: string | null;
  service_interest: string | null;
  requirements: string | null;
  preferred_time: string | null;
  conversation: Array<{ role: string; content: string }>;
  entry_page: string | null;
  pages_visited: string[] | null;
  lead_score: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  intelligence?: IntelligenceReport | null;
}

interface IntelligenceReport {
  leadScore: number;
  person: {
    summary: string;
    inferredRole: string;
    seniority: string;
    decisionMaker: boolean;
    linkedInSearch: string;
  };
  company: {
    name: string;
    summary: string;
    industry: string;
    size: string;
    likelyTechStack: string[];
    challenges: string[];
    website: string;
  };
  opportunity: {
    painPoints: string[];
    valueProps: string[];
    relevantServices: string[];
    caseStudies: string[];
    competitors: string;
  };
  engagement: {
    talkingPoints: string[];
    questions: string[];
    objections: string[];
    nextSteps: string[];
  };
  signals: {
    intent: string;
    urgency: string;
    budget: string;
    timeline: string;
  };
  research: {
    sources: string[];
    confidence: string;
  };
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  converted: 'bg-purple-100 text-purple-700',
  lost: 'bg-gray-100 text-gray-500',
};

const intentColors: Record<string, string> = {
  High: 'text-green-600 bg-green-50',
  Medium: 'text-yellow-600 bg-yellow-50',
  Low: 'text-gray-600 bg-gray-50',
};

// Mock data for demo
const mockLeads: ChatLead[] = [
  {
    id: '1',
    session_id: 'chat_123',
    created_at: new Date().toISOString(),
    name: 'Sarah Chen',
    email: 'schen@techcorp.com',
    company: 'TechCorp Industries',
    job_title: 'VP of Data',
    location: 'San Francisco, CA',
    service_interest: 'Data Engineering',
    requirements: 'Looking to modernize our data platform with Databricks',
    preferred_time: 'Tuesday afternoon',
    conversation: [
      { role: 'assistant', content: 'Data platforms, AI systems, cloud architecture. What are you working on?' },
      { role: 'user', content: 'We need to modernize our data stack' },
      { role: 'assistant', content: 'What platforms are you evaluating?' },
      { role: 'user', content: 'Databricks primarily, maybe Snowflake' },
    ],
    entry_page: '/platforms/databricks',
    pages_visited: ['/platforms/databricks', '/services/data-engineering', '/case-studies'],
    lead_score: 85,
    status: 'new',
  },
  {
    id: '2',
    session_id: 'chat_456',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    name: 'Michael Torres',
    email: 'mtorres@retailgiant.com',
    company: 'RetailGiant',
    job_title: 'Director of MarTech',
    location: 'Chicago, IL',
    service_interest: 'MarTech & CDP',
    requirements: 'CDP implementation for customer 360',
    preferred_time: null,
    conversation: [
      { role: 'user', content: 'Need help unifying our customer data' },
      { role: 'assistant', content: 'Customer data unification is messy work. What systems are you trying to connect?' },
    ],
    entry_page: '/services/martech-cdp',
    pages_visited: ['/services/martech-cdp', '/case-studies/racetrac-martech'],
    lead_score: 78,
    status: 'contacted',
  },
];

export default function ChatLeadsPage() {
  const [leads, setLeads] = useState<ChatLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<ChatLead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [configured, setConfigured] = useState(false);
  const [intelligence, setIntelligence] = useState<IntelligenceReport | null>(null);
  const [loadingIntelligence, setLoadingIntelligence] = useState(false);

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
      const { data, error } = await supabase
        .from('chat_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching chat leads:', error);
      setLeads(mockLeads);
    } finally {
      setLoading(false);
    }
  }

  async function fetchIntelligence(lead: ChatLead) {
    // If lead has cached intelligence, use it immediately
    if (lead.intelligence) {
      setIntelligence(lead.intelligence);
      return;
    }

    setLoadingIntelligence(true);
    setIntelligence(null);

    try {
      const response = await fetch('/api/admin/lead-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead: {
            name: lead.name,
            email: lead.email,
            company: lead.company,
            job_title: lead.job_title,
            location: lead.location,
            service_interest: lead.service_interest,
            requirements: lead.requirements,
            conversation: lead.conversation,
            pages_visited: lead.pages_visited,
            entry_page: lead.entry_page,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIntelligence(data);

        // Cache the intelligence in the database
        if (configured && lead.id) {
          supabase
            .from('chat_leads')
            .update({ intelligence: data })
            .eq('id', lead.id)
            .then(() => {
              // Update local state
              setLeads(prev => prev.map(l =>
                l.id === lead.id ? { ...l, intelligence: data } : l
              ));
            });
        }
      }
    } catch (error) {
      console.error('Error fetching intelligence:', error);
    } finally {
      setLoadingIntelligence(false);
    }
  }

  async function updateLeadStatus(id: string, status: ChatLead['status']) {
    if (!configured) {
      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
      if (selectedLead?.id === id) {
        setSelectedLead({ ...selectedLead, status });
      }
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_leads')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
      if (selectedLead?.id === id) {
        setSelectedLead({ ...selectedLead, status });
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  }

  function handleSelectLead(lead: ChatLead) {
    setSelectedLead(lead);
    setIntelligence(null);
    fetchIntelligence(lead);
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchQuery === '' ||
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    avgScore: Math.round(leads.reduce((sum, l) => sum + l.lead_score, 0) / leads.length) || 0,
  };

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function exportCSV() {
    const headers = ['Name', 'Email', 'Company', 'Job Title', 'Location', 'Service Interest', 'Requirements', 'Status', 'Lead Score', 'Date'];
    const rows = filteredLeads.map(l => [
      l.name || '',
      l.email,
      l.company || '',
      l.job_title || '',
      l.location || '',
      l.service_interest || '',
      l.requirements || '',
      l.status,
      l.lead_score,
      formatDate(l.created_at),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Left Panel - Leads List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Chat Leads</h1>
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              title="Export to CSV"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-blue-600">{stats.new}</p>
              <p className="text-xs text-gray-500">New</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-green-600">{stats.qualified}</p>
              <p className="text-xs text-gray-500">Qualified</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-purple-600">{stats.avgScore}</p>
              <p className="text-xs text-gray-500">Avg Score</p>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>

        {/* Leads List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No leads found
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => handleSelectLead(lead)}
                className={`w-full p-4 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${
                  selectedLead?.id === lead.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {lead.name || 'Unknown'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    lead.lead_score >= 80 ? 'bg-green-100 text-green-700' :
                    lead.lead_score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {lead.lead_score}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{lead.email}</p>
                {lead.company && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Building2 className="w-3 h-3" />
                    {lead.company}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">{formatDate(lead.created_at)}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Lead Details & Intelligence */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {!selectedLead ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="w-12 h-12 mb-4 text-gray-300" />
            <p>Select a lead to view details</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Lead Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedLead.name || 'Unknown Contact'}
                  </h2>
                  <p className="text-gray-600">{selectedLead.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedLead.status}
                    onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value as ChatLead['status'])}
                    className={`text-sm font-medium px-3 py-1.5 rounded-lg border-0 ${statusColors[selectedLead.status]}`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              {/* Lead Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {selectedLead.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{selectedLead.company}</span>
                  </div>
                )}
                {selectedLead.job_title && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span>{selectedLead.job_title}</span>
                  </div>
                )}
                {selectedLead.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{selectedLead.location}</span>
                  </div>
                )}
                {selectedLead.service_interest && (
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span>{selectedLead.service_interest}</span>
                  </div>
                )}
                {selectedLead.preferred_time && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{selectedLead.preferred_time}</span>
                  </div>
                )}
              </div>

              {/* Browsing Context */}
              {selectedLead.pages_visited && selectedLead.pages_visited.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mb-2">PAGES VISITED</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLead.pages_visited.map((page, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {page}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Intelligence Report */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-gray-900">AI Intelligence Report</h3>
                </div>
                {intelligence?.research.confidence && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    intelligence.research.confidence === 'High' ? 'bg-green-100 text-green-700' :
                    intelligence.research.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {intelligence.research.confidence} Confidence
                  </span>
                )}
              </div>

              {loadingIntelligence ? (
                <div className="p-8 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-2" />
                  <p className="text-sm text-gray-500">Generating intelligence report...</p>
                </div>
              ) : intelligence ? (
                <div className="p-4 space-y-6">
                  {/* Signals Row */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className={`p-3 rounded-lg ${intentColors[intelligence.signals.intent] || 'bg-gray-50'}`}>
                      <p className="text-xs text-gray-500 mb-1">Intent</p>
                      <p className="font-semibold">{intelligence.signals.intent}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${intentColors[intelligence.signals.urgency] || 'bg-gray-50'}`}>
                      <p className="text-xs text-gray-500 mb-1">Urgency</p>
                      <p className="font-semibold">{intelligence.signals.urgency}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">Budget</p>
                      <p className="font-medium text-sm">{intelligence.signals.budget}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">Timeline</p>
                      <p className="font-medium text-sm">{intelligence.signals.timeline}</p>
                    </div>
                  </div>

                  {/* Person Analysis */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-blue-500" />
                      <h4 className="font-semibold text-gray-900">Person Profile</h4>
                      {intelligence.person.decisionMaker && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          Decision Maker
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{intelligence.person.summary}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Role: {intelligence.person.inferredRole}</span>
                      <span>Seniority: {intelligence.person.seniority}</span>
                    </div>
                    <a
                      href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(intelligence.person.linkedInSearch)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2"
                    >
                      <Linkedin className="w-4 h-4" />
                      Find on LinkedIn
                    </a>
                  </div>

                  {/* Company Analysis */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-4 h-4 text-purple-500" />
                      <h4 className="font-semibold text-gray-900">Company: {intelligence.company.name}</h4>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                        {intelligence.company.size}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{intelligence.company.summary}</p>
                    <p className="text-sm text-gray-500 mb-2">Industry: {intelligence.company.industry}</p>
                    {intelligence.company.likelyTechStack.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-500 mb-1">Likely Tech Stack</p>
                        <div className="flex flex-wrap gap-1">
                          {intelligence.company.likelyTechStack.map((tech, i) => (
                            <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {intelligence.company.website && (
                      <a
                        href={intelligence.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        <Globe className="w-4 h-4" />
                        {intelligence.company.website}
                      </a>
                    )}
                  </div>

                  {/* Opportunity */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-4 h-4 text-green-500" />
                      <h4 className="font-semibold text-gray-900">Opportunity Analysis</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Pain Points</p>
                        <ul className="space-y-1">
                          {intelligence.opportunity.painPoints.map((point, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-1">
                              <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Value Props to Highlight</p>
                        <ul className="space-y-1">
                          {intelligence.opportunity.valueProps.map((prop, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-1">
                              <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {prop}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {intelligence.opportunity.caseStudies.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-gray-500 mb-2">Relevant Case Studies</p>
                        <div className="flex flex-wrap gap-2">
                          {intelligence.opportunity.caseStudies.map((cs, i) => (
                            <span key={i} className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {cs}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Engagement Strategy */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <h4 className="font-semibold text-gray-900">Engagement Strategy</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Talking Points</p>
                        <ul className="space-y-1">
                          {intelligence.engagement.talkingPoints.map((point, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <ChevronRight className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Discovery Questions</p>
                        <ul className="space-y-1">
                          {intelligence.engagement.questions.map((q, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-blue-500">?</span>
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {intelligence.engagement.objections.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">Objection Handlers</p>
                          <ul className="space-y-1">
                            {intelligence.engagement.objections.map((obj, i) => (
                              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                <Shield className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" />
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <h4 className="font-semibold text-green-900">Recommended Next Steps</h4>
                    </div>
                    <ol className="list-decimal list-inside space-y-1">
                      {intelligence.engagement.nextSteps.map((step, i) => (
                        <li key={i} className="text-sm text-green-800">{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Research Sources */}
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    Sources: {intelligence.research.sources.join(' • ')}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Intelligence report not available</p>
                </div>
              )}
            </div>

            {/* Conversation History */}
            {selectedLead.conversation && selectedLead.conversation.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm mt-6 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-gray-500" />
                  <h3 className="font-semibold text-gray-900">Chat Conversation</h3>
                </div>
                <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                  {selectedLead.conversation.map((msg, i) => (
                    <div
                      key={i}
                      className={`text-sm p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-50 text-blue-900 ml-8'
                          : 'bg-gray-50 text-gray-700 mr-8'
                      }`}
                    >
                      <p className="text-xs font-medium text-gray-400 mb-1">
                        {msg.role === 'user' ? 'Lead' : 'AI Assistant'}
                      </p>
                      {msg.content}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

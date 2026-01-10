'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  Mail,
  Phone,
  Building2,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  FileText,
  Users,
  Sparkles,
  Loader2,
  TrendingUp,
  Target,
  Lightbulb,
  Star,
  User,
  Globe,
  Linkedin,
  ChevronRight,
  Shield,
  MapPin,
  Download,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Contact {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  inquiry_type: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  notes: string | null;
  source?: string;
  lead_score?: number;
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
  generatedAt?: string;
}

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

const intentColors: Record<string, string> = {
  High: 'text-green-600 bg-green-50',
  Medium: 'text-yellow-600 bg-yellow-50',
  Low: 'text-gray-600 bg-gray-50',
};

const sourceIcons: Record<string, typeof Users> = {
  contact_form: FileText,
  website_contact_form: FileText,
  chat_widget: MessageSquare,
  newsletter: Mail,
  default: Users,
};

const sourceLabels: Record<string, string> = {
  contact_form: 'Contact Form',
  website_contact_form: 'Contact Form',
  chat_widget: 'Chat',
  newsletter: 'Newsletter',
  website_footer: 'Website',
};

// Mock data for demo
const mockContacts: Contact[] = [
  {
    id: '1',
    created_at: new Date().toISOString(),
    name: 'John Smith',
    email: 'john.smith@acmecorp.com',
    company: 'Acme Corporation',
    phone: '+1 (555) 123-4567',
    inquiry_type: 'Data Engineering',
    message: 'We are looking to modernize our data infrastructure and would like to discuss potential solutions for our enterprise data platform.',
    status: 'new',
    notes: null,
    source: 'contact_form',
    lead_score: 85,
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    name: 'Sarah Johnson',
    email: 'sarah@techstartup.io',
    company: 'TechStartup Inc',
    phone: null,
    inquiry_type: 'Applied AI & ML',
    message: 'Interested in your AI/ML services for building a recommendation engine.',
    status: 'contacted',
    notes: 'Scheduled call for next week',
    source: 'chat_widget',
    lead_score: 72,
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    name: 'Michael Chen',
    email: 'mchen@enterprise.com',
    company: 'Enterprise Solutions LLC',
    phone: '+1 (555) 987-6543',
    inquiry_type: 'Cloud Modernization',
    message: 'We would like to explore cloud migration services for our Fortune 500 company.',
    status: 'qualified',
    notes: 'High potential - Fortune 500 company',
    source: 'contact_form',
    lead_score: 95,
  },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [configured, setConfigured] = useState(false);
  const [intelligence, setIntelligence] = useState<IntelligenceReport | null>(null);
  const [loadingIntelligence, setLoadingIntelligence] = useState(false);

  useEffect(() => {
    const isConfigured = isSupabaseConfigured();
    setConfigured(isConfigured);

    if (isConfigured) {
      fetchContacts();
    } else {
      setContacts(mockContacts);
      setLoading(false);
    }
  }, []);

  async function fetchContacts() {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchIntelligence(contact: Contact) {
    // If contact has cached intelligence, use it
    if (contact.intelligence) {
      setIntelligence(contact.intelligence);
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
            name: contact.name,
            email: contact.email,
            company: contact.company,
            phone: contact.phone,
            inquiry_type: contact.inquiry_type,
            message: contact.message,
            service_interest: contact.inquiry_type,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIntelligence(data);

        // Cache the intelligence in the database
        if (configured && contact.id) {
          supabase
            .from('contacts')
            .update({ intelligence: data })
            .eq('id', contact.id)
            .then(() => {
              // Update local state
              setContacts(prev => prev.map(c =>
                c.id === contact.id ? { ...c, intelligence: data } : c
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

  async function updateContactStatus(id: string, status: Contact['status']) {
    if (!configured) {
      setContacts(contacts.map(c => c.id === id ? { ...c, status } : c));
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
      return;
    }

    try {
      const { error } = await supabase
        .from('contacts')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setContacts(contacts.map(c => c.id === id ? { ...c, status } : c));
      if (selectedContact?.id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  }

  function handleSelectContact(contact: Contact) {
    setSelectedContact(contact);
    setIntelligence(null);
    fetchIntelligence(contact);
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchQuery === '' ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || contact.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Stats
  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    qualified: contacts.filter(c => c.status === 'qualified').length,
    chat: contacts.filter(c => c.source === 'chat_widget').length,
  };

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  }

  function exportCSV() {
    const headers = ['Name', 'Email', 'Company', 'Phone', 'Inquiry Type', 'Status', 'Lead Score', 'Source', 'Date'];
    const rows = filteredContacts.map(c => [
      c.name,
      c.email,
      c.company || '',
      c.phone || '',
      c.inquiry_type,
      c.status,
      c.intelligence?.leadScore || c.lead_score || '',
      sourceLabels[c.source || ''] || c.source || '',
      formatDate(c.created_at),
    ].map(v => `"${v}"`).join(','));

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Left Panel - Contacts List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Lead Management</h1>
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
            <div className="bg-orange-50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-orange-600">{stats.chat}</p>
              <p className="text-xs text-gray-500">Chat</p>
            </div>
          </div>

          {!configured && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 text-sm">Demo Mode</p>
                <p className="text-xs text-yellow-700">Configure Supabase for real data</p>
              </div>
            </div>
          )}

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
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No leads found
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const SourceIcon = sourceIcons[contact.source || 'default'] || Users;
              return (
                <button
                  key={contact.id}
                  onClick={() => handleSelectContact(contact)}
                  className={`w-full p-4 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{contact.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[contact.status]}`}>
                        {contact.status}
                      </span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      (contact.intelligence?.leadScore || contact.lead_score || 0) >= 80 ? 'bg-green-100 text-green-700' :
                      (contact.intelligence?.leadScore || contact.lead_score || 0) >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {contact.intelligence?.leadScore || contact.lead_score || '--'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{contact.email}</p>
                  {contact.company && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Building2 className="w-3 h-3" />
                      {contact.company}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">{formatDate(contact.created_at)}</p>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <SourceIcon className="w-3 h-3" />
                      {sourceLabels[contact.source || ''] || contact.source}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel - Lead Details & Intelligence */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {!selectedContact ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Users className="w-12 h-12 mb-4 text-gray-300" />
            <p>Select a lead to view details</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Lead Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedContact.name}</h2>
                  <p className="text-gray-600">{selectedContact.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedContact.status}
                    onChange={(e) => updateContactStatus(selectedContact.id, e.target.value as Contact['status'])}
                    className={`text-sm font-medium px-3 py-1.5 rounded-lg border-0 ${statusColors[selectedContact.status]}`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg lg:hidden"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lead Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                {selectedContact.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{selectedContact.company}</span>
                  </div>
                )}
                {selectedContact.phone && (
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedContact.phone}</span>
                  </a>
                )}
                {selectedContact.inquiry_type && (
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span>{selectedContact.inquiry_type}</span>
                  </div>
                )}
              </div>

              {/* Original Message */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">ORIGINAL MESSAGE</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedContact.message}</p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: Your inquiry to ACI Infotech`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </a>
                {selectedContact.status === 'new' && (
                  <button
                    onClick={() => updateContactStatus(selectedContact.id, 'contacted')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Contacted
                  </button>
                )}
              </div>
            </div>

            {/* AI Intelligence Report */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold text-gray-900">AI Intelligence Report</h3>
                </div>
                {intelligence?.research?.confidence && (
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
                    <div className={`p-3 rounded-lg ${intentColors[intelligence.signals?.intent] || 'bg-gray-50'}`}>
                      <p className="text-xs text-gray-500 mb-1">Intent</p>
                      <p className="font-semibold">{intelligence.signals?.intent || 'Unknown'}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${intentColors[intelligence.signals?.urgency] || 'bg-gray-50'}`}>
                      <p className="text-xs text-gray-500 mb-1">Urgency</p>
                      <p className="font-semibold">{intelligence.signals?.urgency || 'Unknown'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">Budget</p>
                      <p className="font-medium text-sm">{intelligence.signals?.budget || 'Unknown'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">Timeline</p>
                      <p className="font-medium text-sm">{intelligence.signals?.timeline || 'Unknown'}</p>
                    </div>
                  </div>

                  {/* Person Analysis */}
                  {intelligence.person && (
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
                      {intelligence.person.linkedInSearch && (
                        <a
                          href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(intelligence.person.linkedInSearch)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2"
                        >
                          <Linkedin className="w-4 h-4" />
                          Find on LinkedIn
                        </a>
                      )}
                    </div>
                  )}

                  {/* Company Analysis */}
                  {intelligence.company && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Building2 className="w-4 h-4 text-purple-500" />
                        <h4 className="font-semibold text-gray-900">Company: {intelligence.company.name}</h4>
                        {intelligence.company.size && intelligence.company.size !== 'Unknown' && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                            {intelligence.company.size}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{intelligence.company.summary}</p>
                      {intelligence.company.industry && (
                        <p className="text-sm text-gray-500 mb-2">Industry: {intelligence.company.industry}</p>
                      )}
                      {intelligence.company.likelyTechStack && intelligence.company.likelyTechStack.length > 0 && (
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
                          href={intelligence.company.website.startsWith('http') ? intelligence.company.website : `https://${intelligence.company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          <Globe className="w-4 h-4" />
                          {intelligence.company.website}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Opportunity */}
                  {intelligence.opportunity && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-green-500" />
                        <h4 className="font-semibold text-gray-900">Opportunity Analysis</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {intelligence.opportunity.painPoints && intelligence.opportunity.painPoints.length > 0 && (
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
                        )}
                        {intelligence.opportunity.valueProps && intelligence.opportunity.valueProps.length > 0 && (
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
                        )}
                      </div>
                      {intelligence.opportunity.caseStudies && intelligence.opportunity.caseStudies.length > 0 && (
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
                  )}

                  {/* Engagement Strategy */}
                  {intelligence.engagement && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        <h4 className="font-semibold text-gray-900">Engagement Strategy</h4>
                      </div>
                      <div className="space-y-3">
                        {intelligence.engagement.talkingPoints && intelligence.engagement.talkingPoints.length > 0 && (
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
                        )}
                        {intelligence.engagement.questions && intelligence.engagement.questions.length > 0 && (
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
                        )}
                        {intelligence.engagement.objections && intelligence.engagement.objections.length > 0 && (
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
                  )}

                  {/* Next Steps */}
                  {intelligence.engagement?.nextSteps && intelligence.engagement.nextSteps.length > 0 && (
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
                  )}

                  {/* Research Sources */}
                  {intelligence.research?.sources && intelligence.research.sources.length > 0 && (
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      Sources: {intelligence.research.sources.join(' • ')}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>Intelligence report not available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

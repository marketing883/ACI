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
  BookOpen,
  Star,
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
}

interface LeadIntelligence {
  leadScore: number;
  analysis: {
    summary: string;
    companyInsights: string[] | null;
    recommendations: string[];
    talkingPoints: string[];
    similarCaseStudies: string[];
  };
}

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

const sourceIcons: Record<string, typeof Users> = {
  contact_form: FileText,
  chat_widget: MessageSquare,
  newsletter: Mail,
  default: Users,
};

const sourceLabels: Record<string, string> = {
  contact_form: 'Contact Form',
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
  {
    id: '4',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    name: 'Emily Davis',
    email: 'emily.davis@retailco.com',
    company: 'RetailCo',
    phone: '+1 (555) 456-7890',
    inquiry_type: 'MarTech & CDP',
    message: 'Need help with MarTech stack implementation and CDP integration.',
    status: 'new',
    notes: null,
    source: 'chat_widget',
    lead_score: 78,
  },
  {
    id: '5',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    name: 'David Wilson',
    email: 'dwilson@fintech.com',
    company: 'FinTech Global',
    phone: null,
    inquiry_type: 'Cyber Security',
    message: 'Looking for security consulting for our cloud infrastructure.',
    status: 'closed',
    notes: 'Project completed',
    source: 'contact_form',
    lead_score: 88,
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
  const [intelligence, setIntelligence] = useState<LeadIntelligence | null>(null);
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
        <p className="text-gray-600">Manage and qualify leads from all sources with AI-powered insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Leads</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
              <p className="text-sm text-gray-500">New Leads</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.qualified}</p>
              <p className="text-sm text-gray-500">Qualified</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.chat}</p>
              <p className="text-sm text-gray-500">From Chat</p>
            </div>
          </div>
        </div>
      </div>

      {!configured && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Demo Mode</p>
            <p className="text-sm text-yellow-700">
              Showing sample data. Configure Supabase to manage real leads.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)] focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
            >
              <option value="all">All Sources</option>
              <option value="contact_form">Contact Form</option>
              <option value="chat_widget">Chat Widget</option>
              <option value="newsletter">Newsletter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading leads...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No leads found</div>
        ) : (
          <div className="divide-y">
            {filteredContacts.map((contact) => {
              const SourceIcon = sourceIcons[contact.source || 'default'] || Users;
              return (
                <div
                  key={contact.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelectContact(contact)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[contact.status]}`}>
                          {contact.status}
                        </span>
                        {contact.lead_score && (
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${getScoreColor(contact.lead_score)}`}>
                            {contact.lead_score}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </span>
                        {contact.company && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {contact.company}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(contact.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-1">{contact.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
                        <SourceIcon className="w-3 h-3" />
                        {sourceLabels[contact.source || ''] || contact.source}
                      </span>
                      <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
                        {contact.inquiry_type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contact Detail Sidebar with AI Intelligence */}
      {selectedContact && (
        <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Lead Details</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Lead Score & AI Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    (intelligence?.leadScore || selectedContact.lead_score || 0) >= 80
                      ? 'bg-green-100'
                      : (intelligence?.leadScore || selectedContact.lead_score || 0) >= 60
                        ? 'bg-yellow-100'
                        : 'bg-gray-100'
                  }`}>
                    <span className={`text-2xl font-bold ${
                      (intelligence?.leadScore || selectedContact.lead_score || 0) >= 80
                        ? 'text-green-600'
                        : (intelligence?.leadScore || selectedContact.lead_score || 0) >= 60
                          ? 'text-yellow-600'
                          : 'text-gray-600'
                    }`}>
                      {intelligence?.leadScore || selectedContact.lead_score || '--'}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Lead Score</p>
                    <p className="text-sm text-gray-500">AI-powered qualification</p>
                  </div>
                </div>
                {loadingIntelligence && (
                  <div className="flex items-center gap-2 text-sm text-[var(--aci-primary)]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-3">{selectedContact.name}</h3>
                <div className="space-y-2">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="flex items-center gap-2 text-[var(--aci-primary)] hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    {selectedContact.email}
                  </a>
                  {selectedContact.phone && (
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-[var(--aci-primary)]"
                    >
                      <Phone className="w-4 h-4" />
                      {selectedContact.phone}
                    </a>
                  )}
                  {selectedContact.company && (
                    <p className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      {selectedContact.company}
                    </p>
                  )}
                </div>
              </div>

              {/* AI Intelligence Section */}
              {intelligence && (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <h4 className="font-semibold text-purple-900">AI Summary</h4>
                    </div>
                    <p className="text-sm text-purple-800">{intelligence.analysis.summary}</p>
                  </div>

                  {/* Company Insights */}
                  {intelligence.analysis.companyInsights && intelligence.analysis.companyInsights.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-gray-600" />
                        <h4 className="font-medium text-gray-900">Company Insights</h4>
                      </div>
                      <ul className="space-y-1">
                        {intelligence.analysis.companyInsights.map((insight, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <h4 className="font-medium text-gray-900">Recommended Approach</h4>
                    </div>
                    <ul className="space-y-1">
                      {intelligence.analysis.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Talking Points */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      <h4 className="font-medium text-gray-900">Talking Points</h4>
                    </div>
                    <ul className="space-y-1">
                      {intelligence.analysis.talkingPoints.map((point, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-yellow-500">→</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Similar Case Studies */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-gray-900">Relevant Case Studies</h4>
                    </div>
                    <div className="space-y-2">
                      {intelligence.analysis.similarCaseStudies.map((study, i) => (
                        <div key={i} className="text-sm bg-blue-50 text-blue-800 px-3 py-2 rounded-lg">
                          {study}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedContact.status}
                  onChange={(e) => updateContactStatus(selectedContact.id, e.target.value as Contact['status'])}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--aci-primary)]"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Original Message</label>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg text-sm">{selectedContact.message}</p>
              </div>

              {/* Submitted */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Submitted</label>
                <p className="text-gray-600 text-sm">{formatDate(selectedContact.created_at)}</p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t space-y-3">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: Your inquiry to ACI Infotech`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[var(--aci-primary)] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </a>
                {selectedContact.status === 'new' && (
                  <button
                    onClick={() => updateContactStatus(selectedContact.id, 'contacted')}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Contacted
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

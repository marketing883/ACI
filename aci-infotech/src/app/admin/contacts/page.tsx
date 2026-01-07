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
}

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
};

const inquiryTypes: Record<string, string> = {
  'architecture-call': 'Architecture Call',
  'project-inquiry': 'Project Inquiry',
  'partnership': 'Partnership',
  'careers': 'Careers',
  'general': 'General',
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
    inquiry_type: 'architecture-call',
    message: 'We are looking to modernize our data infrastructure and would like to discuss potential solutions for our enterprise data platform.',
    status: 'new',
    notes: null,
  },
  {
    id: '2',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    name: 'Sarah Johnson',
    email: 'sarah@techstartup.io',
    company: 'TechStartup Inc',
    phone: null,
    inquiry_type: 'project-inquiry',
    message: 'Interested in your AI/ML services for building a recommendation engine.',
    status: 'contacted',
    notes: 'Scheduled call for next week',
  },
  {
    id: '3',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    name: 'Michael Chen',
    email: 'mchen@enterprise.com',
    company: 'Enterprise Solutions LLC',
    phone: '+1 (555) 987-6543',
    inquiry_type: 'partnership',
    message: 'We would like to explore a strategic partnership for cloud migration services.',
    status: 'qualified',
    notes: 'High potential - Fortune 500 company',
  },
  {
    id: '4',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    name: 'Emily Davis',
    email: 'emily.davis@retailco.com',
    company: 'RetailCo',
    phone: '+1 (555) 456-7890',
    inquiry_type: 'project-inquiry',
    message: 'Need help with MarTech stack implementation and CDP integration.',
    status: 'new',
    notes: null,
  },
  {
    id: '5',
    created_at: new Date(Date.now() - 345600000).toISOString(),
    name: 'David Wilson',
    email: 'dwilson@fintech.com',
    company: 'FinTech Global',
    phone: null,
    inquiry_type: 'architecture-call',
    message: 'Looking for security consulting for our cloud infrastructure.',
    status: 'closed',
    notes: 'Project completed',
  },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [configured, setConfigured] = useState(false);

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

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      searchQuery === '' ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
        <p className="text-gray-600">Manage and respond to contact form submissions</p>
      </div>

      {!configured && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-yellow-800">Demo Mode</p>
            <p className="text-sm text-yellow-700">
              Showing sample data. Configure Supabase to manage real contacts.
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 flex flex-col sm:flex-row gap-4">
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
        </div>
      </div>

      {/* Contacts List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading contacts...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No contacts found</div>
        ) : (
          <div className="divide-y">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[contact.status]}`}>
                        {contact.status}
                      </span>
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
                  <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
                    {inquiryTypes[contact.inquiry_type] || contact.inquiry_type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Detail Sidebar */}
      {selectedContact && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Contact Details</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{selectedContact.name}</h3>
                <div className="mt-3 space-y-2">
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

              {/* Inquiry Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
                <p className="text-gray-900">{inquiryTypes[selectedContact.inquiry_type] || selectedContact.inquiry_type}</p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedContact.message}</p>
              </div>

              {/* Submitted */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Submitted</label>
                <p className="text-gray-600">{formatDate(selectedContact.created_at)}</p>
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

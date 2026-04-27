'use client';

import { useState, useEffect } from 'react';
import {
  Zap,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MessageCircle,
  Clock,
  MousePointer,
  ArrowUp,
  Users,
  Target,
  BarChart3,
  Save,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Trigger {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  conditions: Record<string, unknown>;
  target_pages: string[];
  exclude_pages: string[];
  action_type: string;
  message_template: string;
  cooldown_minutes: number;
  max_shows_per_session: number;
  max_shows_per_visitor: number;
  delay_seconds: number;
  priority: number;
  device_types: string[];
  visitor_types: string[];
  is_active: boolean;
  impressions: number;
  engagements: number;
  conversions: number;
}

const TRIGGER_TYPES = [
  { value: 'exit_intent', label: 'Exit Intent', icon: MousePointer, description: 'When visitor moves to leave' },
  { value: 'idle', label: 'Idle Time', icon: Clock, description: 'After period of inactivity' },
  { value: 'scroll_depth', label: 'Scroll Depth', icon: ArrowUp, description: 'When reaching scroll milestone' },
  { value: 'time_on_page', label: 'Time on Page', icon: Clock, description: 'After spending time on page' },
  { value: 'engagement_score', label: 'Engagement Score', icon: BarChart3, description: 'When score reaches threshold' },
  { value: 'return_visitor', label: 'Return Visitor', icon: Users, description: 'For returning visitors' },
  { value: 'section_time', label: 'Section Time', icon: Target, description: 'Time spent in specific section' },
];

export default function TriggersPage() {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTrigger, setEditingTrigger] = useState<Partial<Trigger> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTriggers();
  }, []);

  async function fetchTriggers() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analytics/triggers');
      const data = await response.json();
      setTriggers(data.triggers || []);
    } catch (error) {
      console.error('Failed to fetch triggers:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveTrigger(trigger: Partial<Trigger>) {
    try {
      const method = trigger.id ? 'PATCH' : 'POST';
      const body = trigger.id ? { id: trigger.id, ...trigger } : trigger;

      const response = await fetch('/api/analytics/triggers', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchTriggers();
        setEditingTrigger(null);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Failed to save trigger:', error);
    }
  }

  async function deleteTrigger(id: string) {
    if (!confirm('Are you sure you want to delete this trigger?')) return;

    try {
      await fetch(`/api/analytics/triggers?id=${id}`, { method: 'DELETE' });
      fetchTriggers();
    } catch (error) {
      console.error('Failed to delete trigger:', error);
    }
  }

  async function toggleTrigger(trigger: Trigger) {
    await saveTrigger({ id: trigger.id, is_active: !trigger.is_active });
  }

  function getTriggerIcon(type: string) {
    const found = TRIGGER_TYPES.find((t) => t.value === type);
    return found?.icon || Zap;
  }

  function getConversionRate(trigger: Trigger): string {
    if (trigger.impressions === 0) return '0%';
    return `${Math.round((trigger.conversions / trigger.impressions) * 100)}%`;
  }

  function getEngagementRate(trigger: Trigger): string {
    if (trigger.impressions === 0) return '0%';
    return `${Math.round((trigger.engagements / trigger.impressions) * 100)}%`;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engagement Triggers</h1>
          <p className="text-sm text-gray-500">
            Configure proactive bot messages based on visitor behavior
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingTrigger({
              name: '',
              description: '',
              trigger_type: 'exit_intent',
              conditions: {},
              target_pages: ['*'],
              exclude_pages: [],
              action_type: 'chat_proactive',
              message_template: '',
              cooldown_minutes: 30,
              max_shows_per_session: 1,
              max_shows_per_visitor: 3,
              delay_seconds: 0,
              priority: 50,
              device_types: ['desktop', 'tablet', 'mobile'],
              visitor_types: ['new', 'returning'],
              is_active: true,
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Trigger
        </button>
      </div>

      {/* Triggers List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid gap-4">
          {triggers.map((trigger) => {
            const TriggerIcon = getTriggerIcon(trigger.trigger_type);

            return (
              <motion.div
                key={trigger.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-xl shadow-sm border ${
                  trigger.is_active ? 'border-gray-100' : 'border-gray-200 opacity-60'
                } overflow-hidden`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          trigger.is_active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <TriggerIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{trigger.name}</h3>
                          {!trigger.is_active && (
                            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">
                              Paused
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{trigger.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {trigger.trigger_type.replace('_', ' ')}
                          </span>
                          <span>Priority: {trigger.priority}</span>
                          <span>Cooldown: {trigger.cooldown_minutes}m</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTrigger(trigger)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={trigger.is_active ? 'Pause trigger' : 'Activate trigger'}
                      >
                        {trigger.is_active ? (
                          <ToggleRight className="w-6 h-6 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingTrigger(trigger)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit trigger"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => deleteTrigger(trigger.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete trigger"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600 italic">
                      &quot;{trigger.message_template}&quot;
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Impressions</p>
                      <p className="text-lg font-semibold text-gray-900">{trigger.impressions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Engagements</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {trigger.engagements}{' '}
                        <span className="text-sm font-normal text-gray-500">
                          ({getEngagementRate(trigger)})
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversions</p>
                      <p className="text-lg font-semibold text-green-600">
                        {trigger.conversions}{' '}
                        <span className="text-sm font-normal text-gray-500">
                          ({getConversionRate(trigger)})
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Target Pages</p>
                      <p className="text-sm text-gray-700 truncate">
                        {trigger.target_pages.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {triggers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <Zap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No triggers configured</p>
              <p className="text-sm text-gray-400 mt-1">
                Create your first trigger to start engaging visitors proactively
              </p>
            </div>
          )}
        </div>
      )}

      {/* Edit/Create Modal */}
      <AnimatePresence>
        {(editingTrigger || isCreating) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isCreating ? 'Create Trigger' : 'Edit Trigger'}
                  </h2>
                  <button
                    onClick={() => {
                      setEditingTrigger(null);
                      setIsCreating(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trigger Name
                  </label>
                  <input
                    type="text"
                    value={editingTrigger?.name || ''}
                    onChange={(e) =>
                      setEditingTrigger((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Exit Intent - Services"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={editingTrigger?.description || ''}
                    onChange={(e) =>
                      setEditingTrigger((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of this trigger"
                  />
                </div>

                {/* Trigger Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trigger Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {TRIGGER_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = editingTrigger?.trigger_type === type.value;

                      return (
                        <button
                          key={type.value}
                          onClick={() =>
                            setEditingTrigger((prev) => ({ ...prev, trigger_type: type.value }))
                          }
                          className={`p-3 rounded-lg border-2 text-left transition-colors ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                            <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                              {type.label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={editingTrigger?.message_template || ''}
                    onChange={(e) =>
                      setEditingTrigger((prev) => ({ ...prev, message_template: e.target.value }))
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="The message to show visitors when triggered"
                  />
                </div>

                {/* Target Pages */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Pages (comma separated, use * for all)
                  </label>
                  <input
                    type="text"
                    value={editingTrigger?.target_pages?.join(', ') || '*'}
                    onChange={(e) =>
                      setEditingTrigger((prev) => ({
                        ...prev,
                        target_pages: e.target.value.split(',').map((p) => p.trim()),
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="*, /services/*, /case-studies/*"
                  />
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cooldown (min)
                    </label>
                    <input
                      type="number"
                      value={editingTrigger?.cooldown_minutes || 30}
                      onChange={(e) =>
                        setEditingTrigger((prev) => ({
                          ...prev,
                          cooldown_minutes: parseInt(e.target.value) || 30,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max/Session
                    </label>
                    <input
                      type="number"
                      value={editingTrigger?.max_shows_per_session || 1}
                      onChange={(e) =>
                        setEditingTrigger((prev) => ({
                          ...prev,
                          max_shows_per_session: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <input
                      type="number"
                      value={editingTrigger?.priority || 50}
                      onChange={(e) =>
                        setEditingTrigger((prev) => ({
                          ...prev,
                          priority: parseInt(e.target.value) || 50,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setEditingTrigger(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editingTrigger && saveTrigger(editingTrigger)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Trigger
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

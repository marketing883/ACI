'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  ArrowUpRight,
  Activity,
  Building,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActiveVisitor {
  session_id: string;
  visitor_id: string;
  started_at: string;
  last_activity_at: string;
  entry_page_path: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  country: string;
  city: string;
  company_name: string | null;
  page_count: number;
  engagement_score: number;
  is_active: boolean;
}

interface PageView {
  page_path: string;
  page_title: string;
  visitor_id: string;
  entered_at: string;
}

interface RealtimeStats {
  activeVisitors: number;
  pageViewsLastHour: number;
  avgEngagementScore: number;
  topPages: { path: string; views: number }[];
  deviceBreakdown: { device: string; count: number }[];
  countries: { country: string; count: number }[];
}

export default function AnalyticsDashboard() {
  const supabase = createSupabaseBrowserClient();
  const [activeVisitors, setActiveVisitors] = useState<ActiveVisitor[]>([]);
  const [recentPageViews, setRecentPageViews] = useState<PageView[]>([]);
  const [stats, setStats] = useState<RealtimeStats>({
    activeVisitors: 0,
    pageViewsLastHour: 0,
    avgEngagementScore: 0,
    topPages: [],
    deviceBreakdown: [],
    countries: [],
  });
  const [selectedVisitor, setSelectedVisitor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch initial data
  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions
    const sessionsChannel = supabase
      .channel('realtime-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'visitor_sessions',
          filter: 'is_active=eq.true',
        },
        (payload) => {
          console.log('Session change:', payload);
          if (payload.eventType === 'INSERT') {
            setActiveVisitors((prev) => [payload.new as ActiveVisitor, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setActiveVisitors((prev) =>
              prev.map((v) =>
                v.session_id === (payload.new as ActiveVisitor).session_id
                  ? (payload.new as ActiveVisitor)
                  : v
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setActiveVisitors((prev) =>
              prev.filter((v) => v.session_id !== (payload.old as ActiveVisitor).session_id)
            );
          }
          setLastUpdated(new Date());
        }
      )
      .subscribe();

    const pageViewsChannel = supabase
      .channel('realtime-pageviews')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'page_views',
        },
        (payload) => {
          setRecentPageViews((prev) => [payload.new as PageView, ...prev.slice(0, 19)]);
          setLastUpdated(new Date());
        }
      )
      .subscribe();

    // Refresh data every 30 seconds
    const refreshInterval = setInterval(fetchData, 30000);

    return () => {
      supabase.removeChannel(sessionsChannel);
      supabase.removeChannel(pageViewsChannel);
      clearInterval(refreshInterval);
    };
  }, [supabase]);

  async function fetchData() {
    setIsLoading(true);

    try {
      // Fetch active sessions
      const { data: sessions } = await supabase
        .from('visitor_sessions')
        .select('*')
        .eq('is_active', true)
        .order('last_activity_at', { ascending: false })
        .limit(50);

      if (sessions) {
        setActiveVisitors(sessions);
      }

      // Fetch recent page views
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const { data: pageViews } = await supabase
        .from('page_views')
        .select('page_path, page_title, visitor_id, entered_at')
        .gte('entered_at', oneHourAgo)
        .order('entered_at', { ascending: false })
        .limit(20);

      if (pageViews) {
        setRecentPageViews(pageViews);
      }

      // Calculate stats
      const activeCount = sessions?.length || 0;
      const pageViewCount = pageViews?.length || 0;
      const avgScore =
        sessions && sessions.length > 0
          ? Math.round(
              sessions.reduce((sum, s) => sum + (s.engagement_score || 0), 0) /
                sessions.length
            )
          : 0;

      // Top pages
      const pageCounts: Record<string, number> = {};
      pageViews?.forEach((pv) => {
        pageCounts[pv.page_path] = (pageCounts[pv.page_path] || 0) + 1;
      });
      const topPages = Object.entries(pageCounts)
        .map(([path, views]) => ({ path, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Device breakdown
      const deviceCounts: Record<string, number> = {};
      sessions?.forEach((s) => {
        const device = s.device_type || 'unknown';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });
      const deviceBreakdown = Object.entries(deviceCounts).map(([device, count]) => ({
        device,
        count,
      }));

      // Countries
      const countryCounts: Record<string, number> = {};
      sessions?.forEach((s) => {
        if (s.country) {
          countryCounts[s.country] = (countryCounts[s.country] || 0) + 1;
        }
      });
      const countries = Object.entries(countryCounts)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        activeVisitors: activeCount,
        pageViewsLastHour: pageViewCount,
        avgEngagementScore: avgScore,
        topPages,
        deviceBreakdown,
        countries,
      });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setIsLoading(false);
      setLastUpdated(new Date());
    }
  }

  function getDeviceIcon(device: string) {
    switch (device) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  }

  function formatTimeAgo(timestamp: string): string {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  }

  function getEngagementColor(score: number): string {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Real-Time Analytics</h1>
          <p className="text-sm text-gray-500">
            Live visitor tracking and engagement insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">
            Updated {formatTimeAgo(lastUpdated.toISOString())}
          </span>
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Visitors</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.activeVisitors}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-green-600">
            <Activity className="w-4 h-4" />
            <span>Live now</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Page Views (1h)</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.pageViewsLastHour}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-blue-600">
            <TrendingUp className="w-4 h-4" />
            <span>Last hour</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg. Engagement</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.avgEngagementScore}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-purple-600">
            <Clock className="w-4 h-4" />
            <span>Score out of 100</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Countries</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.countries.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-sm text-orange-600">
            <MapPin className="w-4 h-4" />
            <span>Active locations</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Visitors List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Active Visitors
              <span className="ml-auto text-xs font-normal text-gray-500">
                {activeVisitors.length} online
              </span>
            </h2>
          </div>
          <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
            <AnimatePresence>
              {activeVisitors.map((visitor) => (
                <motion.div
                  key={visitor.session_id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedVisitor === visitor.session_id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() =>
                    setSelectedVisitor(
                      selectedVisitor === visitor.session_id ? null : visitor.session_id
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getDeviceIcon(visitor.device_type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 text-sm">
                            {visitor.entry_page_path || '/'}
                          </span>
                          {visitor.company_name && (
                            <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                              <Building className="w-3 h-3" />
                              {visitor.company_name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          {visitor.city && visitor.country && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {visitor.city}, {visitor.country}
                            </span>
                          )}
                          <span>{visitor.browser}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEngagementColor(
                          visitor.engagement_score
                        )}`}
                      >
                        {visitor.engagement_score}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimeAgo(visitor.last_activity_at)}
                      </p>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {selectedVisitor === visitor.session_id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-gray-100"
                      >
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs">Pages Viewed</p>
                            <p className="font-medium">{visitor.page_count}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Session Start</p>
                            <p className="font-medium">
                              {formatTimeAgo(visitor.started_at)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs">Device</p>
                            <p className="font-medium capitalize">{visitor.device_type}</p>
                          </div>
                        </div>
                        <a
                          href={`/admin/analytics/sessions/${visitor.session_id}`}
                          className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:underline"
                        >
                          View full session
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>

            {activeVisitors.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No active visitors right now</p>
                <p className="text-sm text-gray-400 mt-1">
                  Visitors will appear here in real-time
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Top Pages & Live Feed */}
        <div className="space-y-6">
          {/* Top Pages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                Top Pages (1h)
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {stats.topPages.map((page, index) => (
                <div key={page.path} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-400 w-5">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {page.path}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {page.views}
                  </span>
                </div>
              ))}
              {stats.topPages.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No page views yet
                </p>
              )}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Monitor className="w-5 h-5 text-purple-500" />
                Devices
              </h2>
            </div>
            <div className="p-4 space-y-3">
              {stats.deviceBreakdown.map((item) => (
                <div key={item.device} className="flex items-center gap-3">
                  {getDeviceIcon(item.device)}
                  <span className="flex-1 text-sm capitalize">{item.device}</span>
                  <span className="text-sm font-medium text-gray-600">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Feed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500 animate-pulse" />
                Live Feed
              </h2>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
              {recentPageViews.slice(0, 10).map((pv, index) => (
                <div key={`${pv.visitor_id}-${index}`} className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {pv.page_path}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatTimeAgo(pv.entered_at)}
                  </p>
                </div>
              ))}
              {recentPageViews.length === 0 && (
                <p className="p-4 text-sm text-gray-500 text-center">
                  Waiting for activity...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

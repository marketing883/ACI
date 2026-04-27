'use client';

import { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, Tablet, Download, Calendar, Eye, MousePointer, ArrowDown } from 'lucide-react';

interface ClickPoint {
  x: number;
  y: number;
  count: number;
}

interface ScrollData {
  depth: number;
  visitors: number;
  avgTimeMs: number;
}

interface HeatmapData {
  pagePath: string;
  clickPoints: ClickPoint[];
  scrollData: ScrollData[];
  stats: {
    totalViews: number;
    totalClicks: number;
    avgScrollDepth: number;
    daysOfData: number;
  };
}

interface HeatmapViewerProps {
  pagePath: string;
  pageUrl?: string;
}

export default function HeatmapViewer({ pagePath, pageUrl }: HeatmapViewerProps) {
  const [data, setData] = useState<HeatmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [viewMode, setViewMode] = useState<'clicks' | 'scroll'>('clicks');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHeatmapData();
  }, [pagePath, deviceType, dateRange]);

  useEffect(() => {
    if (data && canvasRef.current) {
      if (viewMode === 'clicks') {
        renderClickHeatmap();
      } else {
        renderScrollHeatmap();
      }
    }
  }, [data, viewMode]);

  async function fetchHeatmapData() {
    setIsLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const params = new URLSearchParams({
        page: pagePath,
        start: startDate.toISOString().split('T')[0],
        device: deviceType,
      });

      const response = await fetch(`/api/analytics/heatmap?${params}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function renderClickHeatmap() {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (data.clickPoints.length === 0) return;

    // Find max count for normalization
    const maxCount = Math.max(...data.clickPoints.map((p) => p.count));

    // Draw heatmap points
    data.clickPoints.forEach((point) => {
      const x = (point.x / 100) * canvas.width;
      const y = (point.y / 100) * canvas.height;
      const intensity = point.count / maxCount;
      const radius = 20 + intensity * 30;

      // Create gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

      // Color based on intensity (green -> yellow -> red)
      const hue = (1 - intensity) * 120; // 120 = green, 0 = red
      gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, ${0.6 + intensity * 0.4})`);
      gradient.addColorStop(0.5, `hsla(${hue}, 100%, 50%, ${0.3 + intensity * 0.3})`);
      gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function renderScrollHeatmap() {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const container = containerRef.current;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (data.scrollData.length === 0) return;

    // Find max visitors for normalization
    const maxVisitors = Math.max(...data.scrollData.map((d) => d.visitors));

    // Draw scroll depth bands
    data.scrollData.forEach((band) => {
      const y = (band.depth / 100) * canvas.height;
      const height = (10 / 100) * canvas.height; // Each band is 10%
      const intensity = band.visitors / maxVisitors;

      // Color based on intensity (green = high engagement, red = low)
      const hue = intensity * 120;
      ctx.fillStyle = `hsla(${hue}, 70%, 50%, ${0.3 + intensity * 0.4})`;
      ctx.fillRect(0, y, canvas.width, height);

      // Add label
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.font = '12px system-ui';
      ctx.fillText(`${band.depth}% - ${band.visitors} visitors`, 10, y + height / 2 + 4);
    });
  }

  function exportHeatmap() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `heatmap-${pagePath.replace(/\//g, '-')}-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Heatmap</h2>
            <p className="text-sm text-gray-500 mt-0.5">{pagePath}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('clicks')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'clicks'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MousePointer className="w-3 h-3 inline mr-1" />
                Clicks
              </button>
              <button
                onClick={() => setViewMode('scroll')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'scroll'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ArrowDown className="w-3 h-3 inline mr-1" />
                Scroll
              </button>
            </div>

            {/* Device Type */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setDeviceType('desktop')}
                className={`p-1.5 rounded-md transition-colors ${
                  deviceType === 'desktop'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceType('tablet')}
                className={`p-1.5 rounded-md transition-colors ${
                  deviceType === 'tablet'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceType('mobile')}
                className={`p-1.5 rounded-md transition-colors ${
                  deviceType === 'mobile'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d')}
              className="px-3 py-1.5 text-xs bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            {/* Export */}
            <button
              onClick={exportHeatmap}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export as image"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Total Views</p>
            <p className="text-lg font-semibold text-gray-900">{data.stats.totalViews}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Clicks</p>
            <p className="text-lg font-semibold text-gray-900">{data.stats.totalClicks}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Avg Scroll Depth</p>
            <p className="text-lg font-semibold text-gray-900">{data.stats.avgScrollDepth}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Days of Data</p>
            <p className="text-lg font-semibold text-gray-900">{data.stats.daysOfData}</p>
          </div>
        </div>
      )}

      {/* Heatmap Canvas */}
      <div ref={containerRef} className="relative bg-gray-100" style={{ height: '500px' }}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Page preview iframe (optional) */}
            {pageUrl && (
              <iframe
                src={pageUrl}
                className="absolute inset-0 w-full h-full border-0 pointer-events-none opacity-30"
                title="Page preview"
              />
            )}

            {/* Heatmap overlay */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ mixBlendMode: 'multiply' }}
            />

            {/* No data message */}
            {data && data.clickPoints.length === 0 && data.scrollData.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No heatmap data available</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Data will appear as visitors interact with this page
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500" />
          <span className="text-xs text-gray-600">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500" />
          <span className="text-xs text-gray-600">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500" />
          <span className="text-xs text-gray-600">High</span>
        </div>
      </div>
    </div>
  );
}

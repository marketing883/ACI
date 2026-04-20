import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

// GET - Fetch heatmap data for a page
export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const { searchParams } = new URL(request.url);
    const pagePath = searchParams.get('page');
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    const deviceType = searchParams.get('device');

    if (!pagePath) {
      return NextResponse.json(
        { error: 'page parameter required' },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase
      .from('heatmap_data')
      .select('*')
      .eq('page_path', pagePath);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }
    if (deviceType) {
      query = query.eq('device_type', deviceType);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) {
      console.error('[Heatmap] Fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch heatmap data' },
        { status: 500 }
      );
    }

    // Aggregate click points from multiple days
    const aggregatedClicks: Record<string, { x: number; y: number; count: number }> = {};
    const scrollDepths: Record<number, { count: number; totalTime: number }> = {};

    data?.forEach((day) => {
      // Aggregate clicks
      (day.click_points || []).forEach((point: { x_percent: number; y_percent: number; count: number }) => {
        const key = `${Math.round(point.x_percent)}_${Math.round(point.y_percent)}`;
        if (aggregatedClicks[key]) {
          aggregatedClicks[key].count += point.count || 1;
        } else {
          aggregatedClicks[key] = {
            x: point.x_percent,
            y: point.y_percent,
            count: point.count || 1,
          };
        }
      });

      // Aggregate scroll depths
      (day.scroll_depths || []).forEach((depth: { depth_percent: number; visitor_count: number; avg_time_at_depth_ms: number }) => {
        const depthKey = Math.round(depth.depth_percent / 10) * 10; // Round to nearest 10
        if (scrollDepths[depthKey]) {
          scrollDepths[depthKey].count += depth.visitor_count || 1;
          scrollDepths[depthKey].totalTime += (depth.avg_time_at_depth_ms || 0) * (depth.visitor_count || 1);
        } else {
          scrollDepths[depthKey] = {
            count: depth.visitor_count || 1,
            totalTime: (depth.avg_time_at_depth_ms || 0) * (depth.visitor_count || 1),
          };
        }
      });
    });

    // Format output
    const clickPoints = Object.values(aggregatedClicks);
    const scrollData = Object.entries(scrollDepths)
      .map(([depth, data]) => ({
        depth: parseInt(depth),
        visitors: data.count,
        avgTimeMs: data.count > 0 ? Math.round(data.totalTime / data.count) : 0,
      }))
      .sort((a, b) => a.depth - b.depth);

    // Calculate totals
    const totalViews = data?.reduce((sum, d) => sum + (d.total_views || 0), 0) || 0;
    const totalClicks = data?.reduce((sum, d) => sum + (d.total_clicks || 0), 0) || 0;
    const avgScrollDepth =
      data && data.length > 0
        ? Math.round(
            data.reduce((sum, d) => sum + (d.avg_scroll_depth || 0), 0) / data.length
          )
        : 0;

    return NextResponse.json({
      pagePath,
      clickPoints,
      scrollData,
      stats: {
        totalViews,
        totalClicks,
        avgScrollDepth,
        daysOfData: data?.length || 0,
      },
    });
  } catch (error) {
    console.error('[Heatmap] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch heatmap data' },
      { status: 500 }
    );
  }
}

// POST - Record click for heatmap (called from tracker)
export async function POST(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    const { page_path, clicks, device_type } = await request.json();

    if (!page_path || !clicks) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Upsert heatmap data
    const { data: existing } = await supabase
      .from('heatmap_data')
      .select('id, click_points, total_clicks')
      .eq('page_path', page_path)
      .eq('date', today)
      .eq('device_type', device_type || 'desktop')
      .single();

    if (existing) {
      // Merge clicks
      const existingClicks = existing.click_points || [];
      const mergedClicks = [...existingClicks];

      clicks.forEach((click: { x_percent: number; y_percent: number }) => {
        const existingIndex = mergedClicks.findIndex(
          (c: { x_percent: number; y_percent: number }) =>
            Math.abs(c.x_percent - click.x_percent) < 2 &&
            Math.abs(c.y_percent - click.y_percent) < 2
        );

        if (existingIndex >= 0) {
          mergedClicks[existingIndex].count = (mergedClicks[existingIndex].count || 1) + 1;
        } else {
          mergedClicks.push({ ...click, count: 1 });
        }
      });

      await supabase
        .from('heatmap_data')
        .update({
          click_points: mergedClicks,
          total_clicks: (existing.total_clicks || 0) + clicks.length,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      // Create new record
      await supabase.from('heatmap_data').insert({
        page_path,
        date: today,
        device_type: device_type || 'desktop',
        click_points: clicks.map((c: { x_percent: number; y_percent: number }) => ({ ...c, count: 1 })),
        total_clicks: clicks.length,
        total_views: 1,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Heatmap] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to record heatmap data' },
      { status: 500 }
    );
  }
}

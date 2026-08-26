import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/services/supabase';
import { RSS_FEEDS } from '@/lib/services/rss-fetcher';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: true,
      data: {
        status: 'Offline / Unconfigured',
        last_sync_at: null,
        active_feeds: `${RSS_FEEDS.length}/${RSS_FEEDS.length}`,
        total_articles: 0,
        total_issues: 0,
      },
      error: null,
    });
  }

  try {
    const { count: issueCount } = await supabase.from('issues').select('*', { count: 'exact', head: true });
    const { count: rawCount } = await supabase.from('raw_sources').select('*', { count: 'exact', head: true });
    const { data: latestIssue } = await supabase.from('issues').select('last_activity_at, updated_at').order('updated_at', { ascending: false }).limit(1).maybeSingle();

    return NextResponse.json({
      success: true,
      data: {
        status: 'Connected',
        last_sync_at: latestIssue?.last_activity_at || latestIssue?.updated_at || new Date().toISOString(),
        active_feeds: `${RSS_FEEDS.length}/${RSS_FEEDS.length}`,
        total_articles: rawCount || 0,
        total_issues: issueCount || 0,
      },
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (e: any) {
    return NextResponse.json({
      success: false,
      data: null,
      error: e?.message || 'Error fetching sync status',
    }, { status: 500 });
  }
}

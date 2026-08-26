import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/services/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const configured = isSupabaseConfigured();

  if (!configured) {
    return NextResponse.json({
      success: false,
      status: 'error',
      message: 'Supabase credentials not configured in environment',
      services: {
        database: 'disconnected',
        issues: 'unavailable',
        raw_sources: 'unavailable',
        articles: 'unavailable',
        issue_sources: 'unavailable',
        issue_events: 'unavailable',
      },
      durationMs: Date.now() - startTime,
    }, { status: 503 });
  }

  const tableStatus: Record<string, string> = {};
  const tables = ['issues', 'raw_sources', 'articles', 'issue_sources', 'issue_events'];

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        tableStatus[table] = `unavailable (${error.code || 'error'})`;
      } else {
        tableStatus[table] = 'available';
      }
    } catch {
      tableStatus[table] = 'unavailable';
    }
  }

  const isDbConnected = tableStatus.issues === 'available' || tableStatus.raw_sources === 'available';

  return NextResponse.json({
    success: isDbConnected,
    status: isDbConnected ? 'ok' : 'degraded',
    environment: {
      supabase_url: 'configured',
      supabase_anon_key: 'configured',
      openai_api_key: process.env.OPENAI_API_KEY ? 'configured' : 'missing',
      cron_secret: process.env.CRON_SECRET ? 'configured' : 'missing',
    },
    services: {
      database: isDbConnected ? 'connected' : 'disconnected',
      ...tableStatus,
    },
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - startTime,
  }, {
    status: isDbConnected ? 200 : 503,
  });
}

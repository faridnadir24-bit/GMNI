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
  const hasSchemaV2 = tableStatus.articles === 'available' && tableStatus.issue_sources === 'available' && tableStatus.issue_events === 'available';

  return NextResponse.json({
    success: isDbConnected,
    status: isDbConnected ? 'ok' : 'degraded',
    database: isDbConnected ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'production',
    schema_v2_status: hasSchemaV2 ? 'active' : 'schema_v2_missing',
    issues_table: tableStatus.issues === 'available',
    raw_sources_table: tableStatus.raw_sources === 'available',
    articles_table: tableStatus.articles === 'available',
    issue_sources_table: tableStatus.issue_sources === 'available',
    issue_events_table: tableStatus.issue_events === 'available',
    config: {
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

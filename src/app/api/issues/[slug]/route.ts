import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/services/supabase';
import { mapSupabaseRowToIssue, SupabaseIssueRow } from '@/lib/services/issue-adapter';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, data: null, error: 'Supabase unconfigured' },
      { status: 500 }
    );
  }

  try {
    // 1. Fetch issue by slug or ID
    const { data: issueRow, error: issueErr } = await supabase
      .from('issues')
      .select('*')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .maybeSingle();

    if (issueErr || !issueRow) {
      return NextResponse.json(
        { success: false, data: null, error: 'Isu tidak ditemukan.' },
        { status: 404 }
      );
    }

    // 2. Fetch associated issue events
    const { data: eventsData } = await supabase
      .from('issue_events')
      .select('*')
      .eq('issue_id', issueRow.id)
      .order('event_at', { ascending: false });

    // 3. Fetch associated issue sources
    const { data: sourcesData } = await supabase
      .from('issue_sources')
      .select('*')
      .eq('issue_id', issueRow.id)
      .order('added_at', { ascending: false });

    const enrichedRow: SupabaseIssueRow = {
      ...issueRow,
      events: eventsData || [],
      issue_sources: sourcesData || [],
    };

    const mappedIssue = mapSupabaseRowToIssue(enrichedRow);

    return NextResponse.json({
      success: true,
      data: mappedIssue,
      error: null,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, data: null, error: err?.message || 'Error fetching issue detail' },
      { status: 500 }
    );
  }
}

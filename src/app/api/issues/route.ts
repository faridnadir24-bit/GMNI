import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/services/supabase';
import { mapSupabaseRowToIssue, SupabaseIssueRow } from '@/lib/services/issue-adapter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      success: true,
      data: [],
      error: null,
      meta: { count: 0, status: 'unconfigured' },
    });
  }

  const searchParams = request.nextUrl ? request.nextUrl.searchParams : new URL(request.url).searchParams;
  const location = searchParams.get('location');
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  try {
    let query = supabase
      .from('issues')
      .select('*')
      .order('detected_at', { ascending: false })
      .limit(limit);

    if (location && location !== 'all') {
      query = query.ilike('location', `%${location}%`);
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({
        success: false,
        data: [],
        error: error.message,
        meta: { count: 0 },
      }, { status: 500 });
    }

    const mapped = (data as SupabaseIssueRow[] || []).map(mapSupabaseRowToIssue);

    return NextResponse.json({
      success: true,
      data: mapped,
      error: null,
      meta: { count: mapped.length, timestamp: new Date().toISOString() },
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      data: [],
      error: err?.message || 'Gagal memuat isu dari basis data',
      meta: { count: 0 },
    }, { status: 500 });
  }
}

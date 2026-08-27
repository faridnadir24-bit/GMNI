import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/services/supabase';
import { mapSupabaseRowToIssue, extractClaimsFromRow, extractSourcesFromRow, SupabaseIssueRow } from '@/lib/services/issue-adapter';
import { generateResearchDossier, generateDiscussionBrief, isDossierStale } from '@/lib/services/dossier-engine';
import { hasPermission } from '@/lib/services/permissions';
import { UserRole } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const issueId = searchParams.get('issueId') || searchParams.get('slug');
  const type = searchParams.get('type') || 'dossier'; // 'dossier' | 'brief'
  const userRole = (request.headers.get('x-user-role') as UserRole) || 'public';

  if (!issueId) {
    return NextResponse.json(
      { success: false, data: null, error: 'Parameter issueId atau slug diperlukan.' },
      { status: 400 }
    );
  }

  // Permission Check for Dossier reading
  if (type === 'dossier' && !hasPermission(userRole, 'view_research_dossier')) {
    return NextResponse.json(
      { 
        success: false, 
        data: null, 
        error: 'Akses ditolak. Dossier Riset 18 Bab hanya dapat diakses oleh Peneliti dan Administrator.' 
      },
      { status: 403 }
    );
  }

  if (type === 'brief' && !hasPermission(userRole, 'view_discussion_brief')) {
    return NextResponse.json(
      { 
        success: false, 
        data: null, 
        error: 'Akses ditolak. Bahan Diskusi hanya dapat diakses oleh Kader, Peneliti, dan Administrator.' 
      },
      { status: 403 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, data: null, error: 'Supabase unconfigured' },
      { status: 500 }
    );
  }

  try {
    // 1. Fetch Issue from Database
    let { data: issueRow } = await supabase
      .from('issues')
      .select('*')
      .eq('slug', decodeURIComponent(issueId))
      .maybeSingle();

    if (!issueRow) {
      const resById = await supabase
        .from('issues')
        .select('*')
        .eq('id', issueId)
        .maybeSingle();
      issueRow = resById.data;
    }

    if (!issueRow) {
      return NextResponse.json(
        { success: false, data: null, error: 'Isu tidak ditemukan dalam basis data.' },
        { status: 404 }
      );
    }

    // 2. Fetch associated events and sources
    const { data: eventsData } = await supabase
      .from('issue_events')
      .select('*')
      .eq('issue_id', issueRow.id)
      .order('event_at', { ascending: false });

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
    const mappedSources = extractSourcesFromRow(enrichedRow);
    const mappedClaims = extractClaimsFromRow(enrichedRow);

    if (type === 'brief') {
      const brief = generateDiscussionBrief(mappedIssue, mappedSources, mappedClaims);
      return NextResponse.json({
        success: true,
        data: brief,
        meta: { timestamp: new Date().toISOString(), type: 'brief', role: userRole }
      });
    } else {
      const dossier = generateResearchDossier(
        mappedIssue, 
        mappedSources, 
        mappedClaims, 
        `Tim Peneliti Sospol GMNI (${userRole.toUpperCase()})`
      );
      const staleness = isDossierStale(dossier, mappedIssue);
      dossier.is_stale = staleness.isStale;
      dossier.staleness_reason = staleness.reason;

      return NextResponse.json({
        success: true,
        data: dossier,
        meta: { timestamp: new Date().toISOString(), type: 'dossier', role: userRole }
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, data: null, error: err?.message || 'Error generating dossier' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { issueId, type = 'dossier', role = 'public' } = body;
    const userRole = (role as UserRole) || 'public';

    // Server-side Role Check
    if (type === 'dossier' && !hasPermission(userRole, 'generate_dossier')) {
      return NextResponse.json(
        { 
          success: false, 
          data: null, 
          error: `Akses ditolak. Role '${userRole}' tidak memiliki izin untuk menghasilkan Dossier Riset.` 
        },
        { status: 403 }
      );
    }

    if (type === 'brief' && !hasPermission(userRole, 'view_discussion_brief')) {
      return NextResponse.json(
        { 
          success: false, 
          data: null, 
          error: `Akses ditolak. Role '${userRole}' tidak memiliki izin untuk menghasilkan Bahan Diskusi.` 
        },
        { status: 403 }
      );
    }

    if (!issueId) {
      return NextResponse.json(
        { success: false, data: null, error: 'Parameter issueId wajib disertakan.' },
        { status: 400 }
      );
    }

    // Fetch Issue
    let { data: issueRow } = await supabase
      .from('issues')
      .select('*')
      .eq('slug', decodeURIComponent(issueId))
      .maybeSingle();

    if (!issueRow) {
      const resById = await supabase
        .from('issues')
        .select('*')
        .eq('id', issueId)
        .maybeSingle();
      issueRow = resById.data;
    }

    if (!issueRow) {
      return NextResponse.json(
        { success: false, data: null, error: 'Isu tidak ditemukan dalam basis data.' },
        { status: 404 }
      );
    }

    const { data: eventsData } = await supabase
      .from('issue_events')
      .select('*')
      .eq('issue_id', issueRow.id)
      .order('event_at', { ascending: false });

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
    const mappedSources = extractSourcesFromRow(enrichedRow);
    const mappedClaims = extractClaimsFromRow(enrichedRow);

    if (type === 'brief') {
      const brief = generateDiscussionBrief(mappedIssue, mappedSources, mappedClaims);
      return NextResponse.json({
        success: true,
        data: brief,
        message: 'Bahan Diskusi Kader berhasil disusun.',
        meta: { timestamp: new Date().toISOString(), role: userRole }
      });
    } else {
      const dossier = generateResearchDossier(
        mappedIssue, 
        mappedSources, 
        mappedClaims, 
        `Pusat Kajian Kebijakan GMNI (${userRole.toUpperCase()})`
      );
      return NextResponse.json({
        success: true,
        data: dossier,
        message: 'AI Research Dossier (18 Bab) berhasil disusun dan diverifikasi.',
        meta: { timestamp: new Date().toISOString(), role: userRole }
      });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, data: null, error: err?.message || 'Error processing dossier request' },
      { status: 500 }
    );
  }
}

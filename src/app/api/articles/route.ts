import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/services/supabase';
import { Article } from '@/types';

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
  const limit = parseInt(searchParams.get('limit') || '30', 10);
  const location = searchParams.get('location');
  const category = searchParams.get('category');
  const issueId = searchParams.get('issue_id');

  try {
    // 1. Try querying `articles` table
    let query = supabase
      .from('articles')
      .select('*, issues(id, title, slug)')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (location && location !== 'all') {
      query = query.ilike('location', `%${location}%`);
    }
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    if (issueId) {
      query = query.eq('issue_id', issueId);
    }

    const { data: articlesData, error: artError } = await query;

    if (!artError && articlesData && articlesData.length > 0) {
      const formatted: Article[] = articlesData.map((a: any) => ({
        id: a.id,
        url: a.url,
        canonical_url: a.canonical_url,
        title: a.title,
        summary: a.summary,
        content: a.content,
        source_name: a.source_name,
        source_type: a.source_type,
        published_at: a.published_at || a.fetched_at,
        fetched_at: a.fetched_at,
        category: a.category,
        location: a.location,
        sub_location: a.sub_location,
        relevance_score: a.relevance_score,
        processed: a.processed,
        issue_id: a.issue_id,
        issue_title: a.issues?.title || null,
        issue_slug: a.issues?.slug || null,
      }));

      return NextResponse.json({
        success: true,
        data: formatted,
        error: null,
        meta: { count: formatted.length },
      });
    }

    // 2. Fallback: query from `issues` and `raw_sources`
    const { data: issuesData } = await supabase
      .from('issues')
      .select('id, title, slug, category, location, sub_location, source_urls, source_names, published_at, detected_at');

    const fallbackArticles: Article[] = [];
    (issuesData || []).forEach(issue => {
      const urls = issue.source_urls || [];
      const names = issue.source_names || [];
      urls.forEach((url: string, idx: number) => {
        fallbackArticles.push({
          id: `art-${issue.id}-${idx}`,
          url,
          title: `${issue.title} - Rujukan Media`,
          summary: `Liputan berita terdaftar mengenai ${issue.title}`,
          content: '',
          source_name: names[idx] || 'Media Massa',
          source_type: 'national_media',
          published_at: issue.published_at || issue.detected_at || new Date().toISOString(),
          fetched_at: issue.detected_at || new Date().toISOString(),
          category: issue.category,
          location: issue.location,
          sub_location: issue.sub_location,
          relevance_score: 85,
          processed: true,
          issue_id: issue.id,
          issue_title: issue.title,
          issue_slug: issue.slug,
        });
      });
    });

    return NextResponse.json({
      success: true,
      data: fallbackArticles.slice(0, limit),
      error: null,
      meta: { count: fallbackArticles.length },
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      data: [],
      error: err?.message || 'Gagal memuat artikel berita',
      meta: { count: 0 },
    }, { status: 500 });
  }
}

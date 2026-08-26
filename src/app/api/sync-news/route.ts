import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/services/supabase';
import { fetchRawRSSFeeds, storeRawSourcesInDatabase } from '@/lib/services/rss-fetcher';
import { classifyArticleWithAI } from '@/lib/services/ai-classifier';
import { dedupeAndSaveIssue } from '@/lib/services/dedupe';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  return handleSync(request);
}

export async function GET(request: NextRequest) {
  return handleSync(request);
}

async function handleSync(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        success: false,
        message: 'Supabase belum dikonfigurasi. Periksa kredensial di .env.local atau Vercel Settings.',
      },
      { status: 500 }
    );
  }

  try {
    const startTime = Date.now();

    // 1. Ambil seluruh berita terkini dari daftar RSS
    const rawItems = await fetchRawRSSFeeds();
    const storeResult = await storeRawSourcesInDatabase(rawItems);

    // 2. Ambil artikel mentah yang belum diproses (batch 12 item)
    const { data: pendingSources, error: fetchPendingError } = await supabase
      .from('raw_sources')
      .select('id, url, title, content')
      .eq('processed', false)
      .limit(12);

    if (fetchPendingError) {
      return NextResponse.json(
        { success: false, message: 'Gagal mengambil data raw_sources pending', error: fetchPendingError.message },
        { status: 500 }
      );
    }

    const processedList = [];
    let newlyCreatedIssues = 0;

    // 3. Proses klasifikasi dan deduplikasi
    for (const raw of pendingSources || []) {
      try {
        const classification = await classifyArticleWithAI(raw.title, raw.content);
        if (!classification) continue;

        let savedIssueId: string | null = null;

        if (classification.relevant) {
          savedIssueId = await dedupeAndSaveIssue({
            url: raw.url,
            sourceName: 'Media Nasional / Daerah',
            classification,
          });

          if (savedIssueId) {
            newlyCreatedIssues++;
          }
        }

        // Tandai raw_source sebagai processed
        await supabase
          .from('raw_sources')
          .update({
            processed: true,
            issue_id: savedIssueId,
          })
          .eq('id', raw.id);

        processedList.push({
          rawId: raw.id,
          title: raw.title,
          relevant: classification.relevant,
          issueId: savedIssueId,
          category: classification.category,
          location: classification.location,
        });
      } catch (itemErr: any) {
        console.error(`[Sync News] Error processing raw item ${raw.id}:`, itemErr);
      }
    }

    // Ambil total isu terkini dari Supabase
    const { count: totalIssuesCount } = await supabase
      .from('issues')
      .select('*', { count: 'exact', head: true });

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

    return NextResponse.json({
      success: true,
      message: `Sinkronisasi berita real-time selesai dalam ${durationSec} detik.`,
      duration: `${durationSec}s`,
      summary: {
        totalRssFetched: rawItems.length,
        newRawArticles: storeResult.inserted,
        processedByAI: processedList.length,
        newOrUpdatedIssues: newlyCreatedIssues,
        totalIssuesInDatabase: totalIssuesCount || 0,
      },
      items: processedList,
    });
  } catch (error: any) {
    console.error('[Sync News Route] Fatal error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal menjalankan sinkronisasi berita', error: error?.message },
      { status: 500 }
    );
  }
}

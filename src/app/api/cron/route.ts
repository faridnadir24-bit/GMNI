import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/services/supabase';
import { fetchRawRSSFeeds, storeRawSourcesInDatabase } from '@/lib/services/rss-fetcher';
import { classifyArticleWithAI } from '@/lib/services/ai-classifier';
import { dedupeAndSaveIssue } from '@/lib/services/dedupe';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow sufficient time for RSS fetch + OpenAI calls

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const customHeader = request.headers.get('x-cron-secret');
  const querySecret = request.nextUrl.searchParams.get('secret');

  // Verify authentication if CRON_SECRET is defined
  if (cronSecret) {
    const isBearerValid = authHeader === `Bearer ${cronSecret}`;
    const isCustomValid = customHeader === cronSecret;
    const isQueryValid = querySecret === cronSecret;

    if (!isBearerValid && !isCustomValid && !isQueryValid) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak: CRON_SECRET tidak valid.' },
        { status: 401 }
      );
    }
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        success: false,
        message: 'Supabase belum dikonfigurasi. Harap isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.',
      },
      { status: 500 }
    );
  }

  try {
    const startTime = Date.now();

    // 1. Ambil berita mentah dari seluruh daftar RSS
    const rawItems = await fetchRawRSSFeeds();
    const storeResult = await storeRawSourcesInDatabase(rawItems);

    // 2. Ambil artikel mentah yang belum diproses (batch 10 item per eksekusi cron)
    const { data: pendingSources, error: fetchPendingError } = await supabase
      .from('raw_sources')
      .select('id, url, title, content')
      .eq('processed', false)
      .limit(10);

    if (fetchPendingError) {
      return NextResponse.json(
        { success: false, message: 'Gagal mengambil raw_sources pending', error: fetchPendingError },
        { status: 500 }
      );
    }

    const processedList = [];

    // 3. Loop untuk klasifikasi AI & deduplikasi isu
    for (const raw of pendingSources || []) {
      try {
        const classification = await classifyArticleWithAI(raw.title, raw.content);

        if (!classification) {
          // Jika OpenAI gagal atau limit habis, lewati dulu tanpa tandai processed
          continue;
        }

        let savedIssueId: string | null = null;

        if (classification.relevant) {
          savedIssueId = await dedupeAndSaveIssue({
            url: raw.url,
            sourceName: 'Media Nasional / Daerah',
            classification,
          });
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
        });
      } catch (itemError) {
        console.error(`[Cron Ingestion] Error processing raw item ${raw.id}:`, itemError);
      }
    }

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);

    return NextResponse.json({
      success: true,
      message: 'Pipeline ingestion berita berhasil dieksekusi.',
      duration: `${durationSec}s`,
      rss: {
        totalFetched: rawItems.length,
        insertedToRawSources: storeResult.inserted,
        skippedExisting: storeResult.skipped,
      },
      aiProcessing: {
        processedCount: processedList.length,
        items: processedList,
      },
    });
  } catch (error: any) {
    console.error('[Cron Route] Fatal error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error pada cron pipeline', error: error?.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { runNewsSyncEngine } from '@/lib/services/news-sync';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const result = await runNewsSyncEngine({ batchLimit: 15 });
    return NextResponse.json({
      success: result.success,
      data: {
        summary: result.summary,
        details: result.details,
      },
      message: result.message,
      error: result.success ? null : result.message,
      meta: {
        duration: result.duration,
        timestamp: new Date().toISOString(),
      },
    }, { status: result.success ? 200 : 500 });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      data: null,
      error: err?.message || 'Internal Server Error pada sinkronisasi berita',
      meta: { timestamp: new Date().toISOString() },
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}

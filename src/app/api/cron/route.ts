import { NextRequest, NextResponse } from 'next/server';
import { runNewsSyncEngine } from '@/lib/services/news-sync';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const customHeader = request.headers.get('x-cron-secret');
  const querySecret = request.nextUrl.searchParams.get('secret');

  if (cronSecret) {
    const isBearerValid = authHeader === `Bearer ${cronSecret}`;
    const isCustomValid = customHeader === cronSecret;
    const isQueryValid = querySecret === cronSecret;

    if (!isBearerValid && !isCustomValid && !isQueryValid) {
      return NextResponse.json(
        { success: false, data: null, error: 'Akses ditolak: CRON_SECRET tidak valid.' },
        { status: 401 }
      );
    }
  }

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
      error: err?.message || 'Internal Server Error pada cron intelligence engine',
      meta: { timestamp: new Date().toISOString() },
    }, { status: 500 });
  }
}

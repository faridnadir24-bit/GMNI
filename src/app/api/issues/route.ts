import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/services/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, data: [] }, { status: 200 });
  }

  try {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .order('detected_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data?.length || 0, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

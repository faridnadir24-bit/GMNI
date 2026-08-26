import Parser from 'rss-parser';
import { supabase, isSupabaseConfigured } from './supabase';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 RuangIsuGMNI/1.0',
    'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
  },
  timeout: 10000,
});

export interface RawRSSItem {
  url: string;
  title: string;
  content: string;
  source_name?: string;
  published_at?: string;
}

export const RSS_FEEDS = [
  { name: 'Antara Terkini', url: 'https://www.antaranews.com/rss/terkini' },
  { name: 'Antara Politik', url: 'https://www.antaranews.com/rss/politik' },
  { name: 'Antara Hukum', url: 'https://www.antaranews.com/rss/hukum' },
  { name: 'Antara Ekonomi', url: 'https://www.antaranews.com/rss/ekonomi' },
  { name: 'CNN Indonesia Nasional', url: 'https://www.cnnindonesia.com/nasional/rss' },
  { name: 'CNN Indonesia Ekonomi', url: 'https://www.cnnindonesia.com/ekonomi/rss' },
  { name: 'Tempo Nasional', url: 'https://rss.tempo.co/nasional' },
  { name: 'Tempo Metro & Daerah', url: 'https://rss.tempo.co/metro' },
  { name: 'Republika Terkini', url: 'https://www.republika.co.id/rss' },
];

export async function fetchRawRSSFeeds(): Promise<RawRSSItem[]> {
  const allItems: RawRSSItem[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const feedData = await parser.parseURL(feed.url);
      if (feedData && feedData.items) {
        for (const item of feedData.items) {
          const itemUrl = item.link || item.guid || '';
          if (!itemUrl) continue;

          const content = item.contentSnippet || item.content || item.summary || item.title || '';
          allItems.push({
            url: itemUrl.trim(),
            title: (item.title || '').trim(),
            content: content.trim(),
            source_name: feed.name,
            published_at: item.pubDate || item.isoDate || new Date().toISOString(),
          });
        }
      }
    } catch (err: any) {
      console.warn(`[RSS Fetcher] Gagal mengambil feed dari ${feed.name} (${feed.url}):`, err?.message || err);
    }
  }

  return allItems;
}

export async function storeRawSourcesInDatabase(items: RawRSSItem[]): Promise<{ inserted: number; skipped: number }> {
  if (!isSupabaseConfigured()) {
    console.warn('[RSS Fetcher] Supabase belum dikonfigurasi. Melewati penyimpanan ke database.');
    return { inserted: 0, skipped: items.length };
  }

  let insertedCount = 0;
  let skippedCount = 0;

  for (const item of items) {
    try {
      // Check if URL already exists in raw_sources
      const { data: existing, error: checkError } = await supabase
        .from('raw_sources')
        .select('id')
        .eq('url', item.url)
        .maybeSingle();

      if (checkError) {
        console.error('[RSS Fetcher] Error checking raw_sources:', checkError);
        continue;
      }

      if (existing) {
        skippedCount++;
        continue;
      }

      // Insert new raw source
      const { error: insertError } = await supabase
        .from('raw_sources')
        .insert({
          url: item.url,
          title: item.title,
          content: item.content,
          processed: false,
          fetched_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('[RSS Fetcher] Error inserting into raw_sources:', insertError);
      } else {
        insertedCount++;
      }
    } catch (e) {
      console.error('[RSS Fetcher] Unexpected error saving raw source:', e);
    }
  }

  return { inserted: insertedCount, skipped: skippedCount };
}

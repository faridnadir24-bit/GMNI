import Parser from 'rss-parser';
import { supabase, isSupabaseConfigured } from './supabase';

const parser = new Parser({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 RuangIsuGMNI/1.0',
    'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8'
  },
  timeout: 4500,
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
  const fetchPromises = RSS_FEEDS.map(async (feed) => {
    try {
      const feedData = await parser.parseURL(feed.url);
      const items: RawRSSItem[] = [];
      if (feedData && feedData.items) {
        for (const item of feedData.items) {
          const itemUrl = item.link || item.guid || '';
          if (!itemUrl) continue;

          const content = item.contentSnippet || item.content || item.summary || item.title || '';
          items.push({
            url: itemUrl.trim(),
            title: (item.title || '').trim(),
            content: content.trim(),
            source_name: feed.name,
            published_at: item.pubDate || item.isoDate || new Date().toISOString(),
          });
        }
      }
      return items;
    } catch (err: any) {
      console.warn(`[RSS Fetcher] Gagal mengambil feed dari ${feed.name}:`, err?.message || err);
      return [];
    }
  });

  const results = await Promise.allSettled(fetchPromises);
  const allItems: RawRSSItem[] = [];

  for (const res of results) {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      allItems.push(...res.value);
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

  // Batch insert up to 40 items at once with ignoreDuplicates
  const insertPayload = items.slice(0, 40).map(item => ({
    url: item.url,
    title: item.title,
    content: item.content,
    processed: false,
    fetched_at: new Date().toISOString(),
  }));

  if (insertPayload.length > 0) {
    try {
      const { data, error } = await supabase
        .from('raw_sources')
        .upsert(insertPayload, { onConflict: 'url', ignoreDuplicates: true })
        .select('id');

      if (!error && data) {
        insertedCount = data.length;
      }
    } catch (e) {
      // Fallback
    }
  }

  return { inserted: insertedCount, skipped: skippedCount };
}

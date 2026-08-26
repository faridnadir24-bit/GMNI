import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) {
    env[k.trim()] = v.join('=').trim();
    process.env[k.trim()] = v.join('=').trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function runProductionAudit() {
  console.log('================================================================');
  console.log('      RUANG ISU GMNI — PRODUCTION PIPELINE & DATABASE AUDIT      ');
  console.log('================================================================\n');

  // 1. Environment Status
  console.log('1. ENVIRONMENT STATUS:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL:', env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'MISSING');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY:', env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'MISSING');
  console.log('   - OPENAI_API_KEY:', env.OPENAI_API_KEY ? 'configured' : 'MISSING');
  console.log('   - CRON_SECRET:', env.CRON_SECRET ? 'configured' : 'MISSING');

  // 2. Feed Endpoints Verification
  console.log('\n2. RSS FEEDS CONNECTIVITY:');
  const { RSS_FEEDS, fetchRawRSSFeeds } = await import('../src/lib/services/rss-fetcher.ts');
  console.log(`   Total Active Endpoints Configured: ${RSS_FEEDS.length}`);
  
  const rawItems = await fetchRawRSSFeeds();
  console.log(`   Fetched Raw RSS Items: ${rawItems.length} items`);

  // 3. Run News Sync Engine
  console.log('\n3. RUNNING UNIFIED NEWS SYNC ENGINE (Batch of 5 candidate items):');
  const { runNewsSyncEngine } = await import('../src/lib/services/news-sync.ts');
  const syncResult = await runNewsSyncEngine({ batchLimit: 5 });

  console.log('   Sync Status:', syncResult.success ? 'SUCCESS' : 'FAILED');
  console.log('   Duration:', syncResult.duration);
  console.log('   Message:', syncResult.message);
  console.log('   Summary Metrics:', JSON.stringify(syncResult.summary, null, 2));

  // 4. Inspect Supabase Production Database Records
  console.log('\n4. ACTUAL SUPABASE DATABASE STATE:');
  
  const { count: issueCount, data: latestIssues } = await supabase
    .from('issues')
    .select('id, title, category, location, sub_location, status, impact_score, evidence_score, momentum_score, source_count, last_activity_at, updated_at', { count: 'exact' })
    .order('updated_at', { ascending: false })
    .limit(5);

  const { count: rawCount } = await supabase
    .from('raw_sources')
    .select('*', { count: 'exact', head: true });

  console.log(`   - Total Issues in Database: ${issueCount || 0}`);
  console.log(`   - Total Ingested Raw Sources: ${rawCount || 0}`);

  if (latestIssues && latestIssues.length > 0) {
    console.log('\n   Latest 5 Issues in Database:');
    latestIssues.forEach((iss, idx) => {
      console.log(`   [${idx + 1}] [${iss.location || 'Nasional'}] "${iss.title}"`);
      console.log(`       Category: ${iss.category} | Status: ${iss.status} | Sources: ${iss.source_count}`);
      console.log(`       Impact: ${iss.impact_score} | Evidence: ${iss.evidence_score} | Momentum: ${iss.momentum_score}`);
    });
  }

  // 5. Radar Purwakarta Computation
  console.log('\n5. RADAR PURWAKARTA 17-KECAMATAN DYNAMIC AGGREGATION:');
  const { computeRadarPurwakarta } = await import('../src/lib/services/issue-priority.ts');
  const { data: allIssues } = await supabase.from('issues').select('*');
  const radar = computeRadarPurwakarta(allIssues || []);
  console.log(`   Total Districts Aggregated: ${radar.length}/17`);
  const activeDistricts = radar.filter(r => r.issuesCount > 0);
  console.log(`   Districts with Active Issues: ${activeDistricts.length}`);
  activeDistricts.forEach(d => {
    console.log(`   - Kec. ${d.name}: ${d.issuesCount} isu (Prioritas: ${d.priorityCount}, Kategori Dominan: ${d.dominantCategory})`);
  });

  console.log('\n================================================================');
  console.log('                    AUDIT COMPLETED SUCCESSFULLY                ');
  console.log('================================================================');
}

runProductionAudit();

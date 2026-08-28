import { WEST_JAVA_REGENCIES, computeWestJavaRegencyBreakdown, calculateHonestCoverageMetrics, matchIssueToRegency, filterIssuesByTerritory } from '../src/lib/services/territory-service.ts';
import { mapSupabaseRowToIssue } from '../src/lib/services/issue-adapter.ts';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
  }
}

const supabase = createClient(env['NEXT_PUBLIC_SUPABASE_URL'], env['NEXT_PUBLIC_SUPABASE_ANON_KEY']);

async function audit27Regencies() {
  console.log('====================================================');
  console.log('AUDIT 27 KABUPATEN/KOTA JAWA BARAT (LIVE DATABASE)');
  console.log('====================================================\n');

  const { data: rows, error } = await supabase.from('issues').select('*');
  if (error) {
    console.error('Database query error:', error);
    process.exit(1);
  }

  const issues = (rows || []).map(mapSupabaseRowToIssue);
  console.log(`Total Database Issues: ${issues.length}\n`);

  const breakdown = WEST_JAVA_REGENCIES.map(reg => {
    const matched = issues.filter(i => matchIssueToRegency(i, reg));
    return {
      name: reg.name,
      type: reg.type,
      totalIssues: matched.length,
      status: matched.length > 0 ? 'ACTIVE' : 'EMPTY'
    };
  });

  console.log('| Wilayah | Total Isu | Status |');
  console.log('| --- | --- | --- |');
  for (const b of breakdown) {
    console.log(`| ${b.name} | ${b.totalIssues} | ${b.status} |`);
  }

  const metrics = calculateHonestCoverageMetrics(issues);
  console.log('\n--- COVERAGE SUMMARY ---');
  console.log(metrics.honestSummary);
  console.log(`Cakupan Jawa Barat: ${metrics.jabarActiveRegenciesCount} / 27 (${metrics.jabarCoveragePercentage}%)`);
  console.log(`Total Isu Jawa Barat: ${metrics.jabarTotalIssues}`);
  console.log(`Total Isu Nasional: ${metrics.nationalTotalIssues}`);
  console.log(`Total Isu Purwakarta: ${metrics.pwkTotalIssues} (${metrics.pwkActiveDistrictsCount} / 17 Kecamatan aktif)`);
}

audit27Regencies().catch(console.error);

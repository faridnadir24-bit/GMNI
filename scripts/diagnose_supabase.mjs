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

console.log('--- Checking Environment Variables ---');
console.log('SUPABASE_URL:', env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'MISSING');
console.log('SUPABASE_ANON_KEY:', env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'MISSING');
console.log('OPENAI_API_KEY:', env.OPENAI_API_KEY ? 'configured' : 'MISSING');
console.log('CRON_SECRET:', env.CRON_SECRET ? 'configured' : 'MISSING');

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function diagnose() {
  console.log('\n--- Checking Supabase Tables ---');
  const tables = ['issues', 'raw_sources', 'articles', 'issue_sources', 'issue_events'];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ Table [${table}]: ERROR - ${error.message} (code: ${error.code})`);
      } else {
        console.log(`✅ Table [${table}]: EXISTS, Count = ${count} rows`);
      }
    } catch (err) {
      console.log(`❌ Table [${table}]: Exception - ${err.message}`);
    }
  }

  console.log('\n--- Inspecting Sample Issue Schema & Columns ---');
  const { data: sampleIssues, error: issueErr } = await supabase
    .from('issues')
    .select('*')
    .limit(1);

  if (issueErr) {
    console.log('Error querying sample issue:', issueErr.message);
  } else if (sampleIssues && sampleIssues.length > 0) {
    console.log('Available columns in `issues`:', Object.keys(sampleIssues[0]).join(', '));
  } else {
    console.log('`issues` table is currently empty.');
  }
}

diagnose();

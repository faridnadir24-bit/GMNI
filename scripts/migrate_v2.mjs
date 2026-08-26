import * as fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) {
    env[k.trim()] = v.join('=').trim();
  }
});

console.log('Testing Supabase V2 schema tables...');

async function checkTables() {
  const tables = ['issues', 'articles', 'issue_sources', 'issue_events', 'raw_sources'];
  for (const t of tables) {
    try {
      const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${t}?select=*&limit=1`, {
        headers: {
          'apikey': env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        }
      });
      console.log(`Table '${t}': HTTP ${res.status} (${res.status === 200 ? 'EXISTS & ACTIVE' : 'MISSING / NEEDS CREATION'})`);
    } catch (e) {
      console.log(`Table '${t}' check failed:`, e.message);
    }
  }
}

checkTables();

import * as fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) {
    process.env[k.trim()] = v.join('=').trim();
  }
});

async function run() {
  const { runNewsSyncEngine } = await import('../src/lib/services/news-sync.ts');
  console.log('Running Live News Sync Pipeline Test with active Supabase connection...');
  const result = await runNewsSyncEngine({ batchLimit: 4 });
  console.log('\n--- Sync Pipeline Result ---');
  console.log('Success:', result.success);
  console.log('Message:', result.message);
  console.log('Duration:', result.duration);
  console.log('Summary:', JSON.stringify(result.summary, null, 2));
  console.log('\nProcessed Items:');
  result.details.forEach((d, i) => {
    console.log(`[${i + 1}] (${d.action}) "${d.title}" -> Target Issue: "${d.issueTitle || 'N/A'}"`);
  });
}

run();

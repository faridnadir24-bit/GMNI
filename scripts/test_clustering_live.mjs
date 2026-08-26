import * as fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length > 0) {
    process.env[k.trim()] = v.join('=').trim();
  }
});

async function runClusteringTest() {
  const { runNewsSyncEngine } = await import('../src/lib/services/news-sync.ts');
  console.log('Testing subsequent sync run (Idempotency & Clustering)...');
  const result = await runNewsSyncEngine({ batchLimit: 4 });
  console.log('\n--- Sync Result 2 ---');
  console.log('Summary:', JSON.stringify(result.summary, null, 2));
  console.log('Details:');
  result.details.forEach(d => {
    console.log(`- [${d.action}] "${d.title}" -> "${d.issueTitle}"`);
  });
}

runClusteringTest();

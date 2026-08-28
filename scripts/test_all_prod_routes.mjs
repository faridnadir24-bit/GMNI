import assert from 'assert';

const routes = [
  '/',
  '/api/health',
  '/api/issues',
  '/api/articles',
  '/api/sync-status',
  '/isu',
  '/dashboard',
  '/pantauan',
  '/peta'
];

async function testAllRoutes() {
  console.log('====================================================');
  console.log('TESTING ALL PRODUCTION ROUTES — https://gmni.vercel.app');
  console.log('====================================================\n');

  for (const r of routes) {
    const url = `https://gmni.vercel.app${r}`;
    const start = Date.now();
    const res = await fetch(url);
    const duration = Date.now() - start;
    console.log(`[HTTP ${res.status}] ${url} (${duration}ms)`);
    assert.strictEqual(res.status, 200, `Route ${r} must return 200`);
  }

  console.log('\n✓ All 9 core production routes returned HTTP 200 OK!');
}

testAllRoutes().catch(console.error);

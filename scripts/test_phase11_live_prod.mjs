import assert from 'assert';

console.log('====================================================');
console.log('TEST SUITE 6 (FASE 11): LIVE PRODUCTION VERIFICATION');
console.log('====================================================\n');

async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      return res;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

async function testLiveProduction() {
  const routes = [
    { path: '/api/health', check: json => json.status === 'ok' || json.database === 'connected' },
    { path: '/api/issues', check: json => json.success && Array.isArray(json.data) && json.data.length > 0 },
    { path: '/api/articles', check: json => json.success && Array.isArray(json.data) && json.data.length > 0 },
    { path: '/api/sync-status', check: json => json.success && json.data.status === 'Connected' },
    { path: '/pantauan', checkStatus: true },
    { path: '/isu', checkStatus: true },
    { path: '/dashboard', checkStatus: true }
  ];

  for (const route of routes) {
    const url = `https://gmni.vercel.app${route.path}`;
    const start = Date.now();
    const res = await fetchWithRetry(url);
    const duration = Date.now() - start;

    console.log(`[HTTP ${res.status}] ${url} (${duration}ms)`);
    assert.strictEqual(res.status, 200, `Route ${route.path} must return 200`);

    if (route.check) {
      const json = await res.json();
      assert.ok(route.check(json), `Check failed on ${route.path}`);
      console.log(`  ✓ Data payload valid on ${route.path}`);
    }
  }

  console.log('\n====================================================');
  console.log('SUITE 6 (LIVE PROD): ALL TESTS PASSED (100%)');
  console.log('====================================================\n');
}

testLiveProduction().catch(console.error);
